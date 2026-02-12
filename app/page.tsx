import WorldMap from "@/components/ui/world-map";
import axios from "axios";

interface Circuit {
  circuitId: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

interface Dot {
  start: { lat: number; lng: number; label?: string; id?: string };
  end: { lat: number; lng: number; label?: string; id?: string };
}

async function getCircuits(): Promise<Dot[]> {
  // Fetch circuits for F1 2024
  const response = await axios.get(
    "https://api.jolpi.ca/ergast/f1/2024/circuits/"
  );
  const circuits: Circuit[] = response.data.MRData.CircuitTable.Circuits;

  const raceOrder = [
    "bahrain", // Bahrain Grand Prix
    "jeddah", // Saudi Arabian Grand Prix
    "albert_park", // Australian Grand Prix
    "suzuka", // Japanese Grand Prix
    "shanghai", // Chinese Grand Prix
    "miami", // Miami Grand Prix
    "imola", // Emilia Romagna Grand Prix
    "monaco", // Monaco Grand Prix
    "villeneuve", // Canadian Grand Prix
    "catalunya", // Spanish Grand Prix
    "red_bull_ring", // Austrian Grand Prix (Red Bull Ring)
    "silverstone", // British Grand Prix
    "hungaroring", // Hungarian Grand Prix
    "spa", // Belgian Grand Prix (Spa-Francorchamps)
    "zandvoort", // Dutch Grand Prix
    "monza", // Italian Grand Prix
    "baku", // Azerbaijan Grand Prix
    "marina_bay", // Singapore Grand Prix
    "americas", // United States Grand Prix (Circuit of the Americas)
    "rodriguez", // Mexico City Grand Prix
    "interlagos", // São Paulo Grand Prix
    "vegas", // Las Vegas Grand Prix
    "losail", // Qatar Grand Prix (Lusail International Circuit)
    "yas_marina", // Abu Dhabi Grand Prix (Yas Marina Circuit)
  ];

  // Filter out only the circuits in our desired race order
  const filteredCircuits = circuits.filter((circuit) =>
    raceOrder.includes(circuit.circuitId)
  );

  // Sort the circuits according to our defined raceOrder.
  filteredCircuits.sort(
    (a, b) => raceOrder.indexOf(a.circuitId) - raceOrder.indexOf(b.circuitId)
  );

  // Build segments (dot connections) from each consecutive circuit.
  const segments: Dot[] = [];
  for (let i = 0; i < filteredCircuits.length - 1; i++) {
    const currentCircuit = filteredCircuits[i];
    const nextCircuit = filteredCircuits[i + 1];

    segments.push({
      start: {
        lat: Number(currentCircuit.Location.lat),
        lng: Number(currentCircuit.Location.long),
        label: currentCircuit.circuitName,
        id: currentCircuit.circuitId,
      },
      end: {
        lat: Number(nextCircuit.Location.lat),
        lng: Number(nextCircuit.Location.long),
        label: nextCircuit.circuitName,
        id: nextCircuit.circuitId,
      },
    });
  }
  return segments;
}

export default async function Home() {
  const dots = await getCircuits();
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center px-8 pb-10 pt-16">
      <WorldMap dots={dots} />
    </div>
  );
}
