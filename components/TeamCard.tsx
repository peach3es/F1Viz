import { getDrivers } from "@/actions";
import { Driver } from "@/types/driver";

import DriverCard from "./DriverCard";

type TeamCardProps = {
  teamName: string;
};

export default async function TeamCard({ teamName }: TeamCardProps) {
  let drivers: Driver[] = [];

  try {
    drivers = await getDrivers(teamName);
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }

  return (
    <div className="border-darkRed flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-3">
      <div className="text-2xl font-semibold">{teamName}</div>
      <div className="border-burgundy flex w-full flex-row justify-between gap-2 border-t pt-2">
        {drivers.length ? (
          drivers.map((driver) => (
            <div
              className="flex w-full items-center align-middle"
              key={driver.full_name}
            >
              <DriverCard driver={driver} />
            </div>
          ))
        ) : (
          <div className="text-xl font-semibold text-white">
            {"No drivers were found"}
          </div>
        )}
      </div>
    </div>
  );
}
