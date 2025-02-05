"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import TyreChart from "@/components/Tyre";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Data types for stints.
interface Stint {
  driver_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
}

// Define tire compound colors.
const compoundColors: Record<string, string> = {
  SOFT: "#ff2d55",
  MEDIUM: "#ffcc00",
  HARD: "#ffffff",
  INTERMEDIATE: "#4cd964",
  WET: "#0091ea",
};

// Map Grand Prix names to session keys.
const grandPrixMap: Record<string, number> = {
  Bahrain: 9472,
  "Saudi Arabia": 9480,
  Australia: 9488,
  Japan: 9496,
  China: 9673,
  Miami: 9507,
  Imola: 9515,
  Monaco: 9523,
  Canada: 9531,
  Spain: 9539,
  Austria: 9550,
  Britain: 9558,
  Hungary: 9566,
  Belgium: 9574,
  Netherlands: 9582,
  Monza: 9590,
  Azerbaijan: 9598,
  Singapore: 9606,
  Austin: 9617,
  Mexico: 9625,
  Brazil: 9636,
  "Las Vegas": 9644,
  Qatar: 9655,
  "Abu Dhabi": 9662,
};

interface Segment {
  // Number of laps for this segment.
  value: number;
  // Color for the segment (or "transparent" for gaps).
  color: string;
}

/**
 * Converts raw stint data into a format that Recharts can work with.
 * Each driver becomes an object with a "driver" key and keys "seg0", "seg1", etc.
 * We also prepare a mapping of segment keys to an array of colors (one per driver).
 */
const prepareRechartData = (
  drivers: number[],
  stints: Stint[],
  totalLaps: number
): {
  data: Record<string, number | string>[];
  segmentColors: Record<string, string[]>;
} => {
  // Sort drivers for consistent ordering.
  const sortedDrivers = [...drivers].sort((a, b) => a - b);
  // Build a mapping of driver => segments.
  const driverSegments: Record<number, Segment[]> = {};

  sortedDrivers.forEach((driver) => {
    const stintsForDriver = stints
      .filter((s) => s.driver_number === driver)
      .sort((a, b) => a.lap_start - b.lap_start);

    const segments: Segment[] = [];

    if (stintsForDriver.length > 0 && stintsForDriver[0].lap_start > 1) {
      segments.push({
        value: stintsForDriver[0].lap_start - 1,
        color: "transparent",
      });
    }

    if (stintsForDriver.length === 0) {
      segments.push({ value: totalLaps, color: "transparent" });
    } else {
      stintsForDriver.forEach((stint) => {
        segments.push({
          value: stint.lap_end - stint.lap_start,
          color: compoundColors[stint.compound] || "#888",
        });
      });

      const lastStint = stintsForDriver[stintsForDriver.length - 1];
      if (lastStint.lap_end < totalLaps) {
        segments.push({
          value: totalLaps - lastStint.lap_end,
          color: "transparent",
        });
      }
    }

    driverSegments[driver] = segments;
  });

  const maxSegments = Math.max(
    ...sortedDrivers.map((driver) => driverSegments[driver].length)
  );

  const data = sortedDrivers.map((driver) => {
    const segments = driverSegments[driver];
    const obj: Record<string, number | string> = { driver: `#${driver}` };

    for (let i = 0; i < maxSegments; i++) {
      obj[`seg${i}`] = segments[i]?.value || 0;
    }
    return obj;
  });

  const segmentColors: Record<string, string[]> = {};
  for (let i = 0; i < maxSegments; i++) {
    const key = `seg${i}`;
    segmentColors[key] = sortedDrivers.map(
      (driver) => driverSegments[driver][i]?.color || "transparent"
    );
  }

  return { data, segmentColors };
};

export default function Tyre() {
  const [grandPrix, setGrandPrix] = useState("");
  const [stints, setStints] = useState<Stint[]>([]);
  const [drivers, setDrivers] = useState<number[]>([]);
  const [totalLaps, setTotalLaps] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchStints = async () => {
    if (!grandPrix) return;
    const lowerCaseGrandPrix = grandPrix.trim().toLowerCase();
    const sessionKey =
      grandPrixMap[
        Object.keys(grandPrixMap).find(
          (key) => key.toLowerCase() === lowerCaseGrandPrix
        ) || ""
      ];

    if (!sessionKey) {
      console.error("Invalid Grand Prix name");
      return;
    }

    const res = await fetch(
      `https://api.openf1.org/v1/stints?session_key=${sessionKey}`
    );
    const data = await res.json();

    setStints(data);
    const uniqueDrivers = [
      ...new Set<number>(data.map((stint: Stint) => stint.driver_number)),
    ];
    setDrivers(uniqueDrivers);

    const calculatedTotalLaps = Math.max(
      ...data.map((stint: Stint) => stint.lap_end),
      0
    );
    setTotalLaps(calculatedTotalLaps);
  };

  const { data, segmentColors } =
    totalLaps > 0
      ? prepareRechartData(drivers, stints, totalLaps)
      : { data: [], segmentColors: {} };

  if (!isClient) return null;

  return (
    <Container className="min-h-screen py-16">
      <Card className="mt-10 w-full p-4 shadow-lg">
        <CardContent className="w-full">
          <h2 className="mb-4 text-center text-xl font-bold">
            F1 Tire Stint Visualization - 2024 Season
          </h2>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="Enter Grand Prix Name"
              value={grandPrix}
              onChange={(e) => setGrandPrix(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchStints}>Fetch Data</Button>
          </div>
          {data.length > 0 ? (
            <TyreChart
              data={data}
              segmentColors={segmentColors}
              totalLaps={totalLaps}
            />
          ) : (
            <p className="text-center">
              Enter a valid Grand Prix name and click &quot;Fetch Data&quot; to
              see the chart.
            </p>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
