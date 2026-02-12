import { getDriverByNumber } from "@/actions";
import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type DriverPageProps = {
  params: {
    driverNumber: string;
  };
};

export default async function DriverPage({ params }: DriverPageProps) {
  const driverNumber = Number(params.driverNumber);

  if (!Number.isInteger(driverNumber) || driverNumber <= 0) {
    notFound();
  }

  try {
    const driver = await getDriverByNumber(driverNumber);

    if (!driver) {
      notFound();
    }

    const teamColor = `#${driver.team_colour}`;

    return (
      <div className="min-h-screen">
        <Container className="py-32">
          <div className="pb-6">
            <Link className="text-darkRed hover:underline" href="/racers">
              Back to drivers
            </Link>
          </div>
          <div
            className="mx-auto grid max-w-3xl grid-cols-1 gap-6 rounded-xl border-2 p-6 md:grid-cols-[220px_1fr]"
            style={{ borderColor: teamColor }}
          >
            <div className="overflow-hidden rounded-lg">
              <Image
                src={driver.headshot_url}
                alt={driver.last_name}
                width={1080}
                height={1080}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-darkRed text-sm">Driver</p>
                <h1 className="text-3xl font-semibold">{driver.full_name}</h1>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Number</p>
                  <p className="text-2xl font-bold text-darkRed">
                    {driver.driver_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm">Team</p>
                  <p className="text-darkRed text-lg">{driver.team_name}</p>
                </div>
                <div>
                  <p className="text-sm">Broadcast Name</p>
                  <p className="text-darkRed text-lg">{driver.broadcast_name}</p>
                </div>
                <div>
                  <p className="text-sm">Country</p>
                  <p className="text-darkRed text-lg">{driver.country_code}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Failed to load driver page:", error);
    notFound();
  }
}
