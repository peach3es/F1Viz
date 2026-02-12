"use client";

import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Driver } from "@/types/driver";
import Image from "next/image";
import Link from "next/link";

type DriverCardProps = {
  driver: Driver;
};

export default function DriverCard({ driver }: DriverCardProps) {
  const teamColor = `#${driver.team_colour}`;
  const driverImg = driver.headshot_url;

  const [bgCol, setBgCol] = useState<string>("#F8F5F4");

  return (
    // TODO onclick open modal for the driver
    <Dialog>
      <DialogTrigger className="w-full">
        <div
          className="flex w-full flex-col items-start justify-center rounded-lg p-2"
          style={{ backgroundColor: bgCol }}
          onMouseEnter={() => setBgCol(`${teamColor}`)}
          onMouseLeave={() => setBgCol("#F8F5F4")}
        >
          <div className="flex flex-row items-center gap-2 pb-2">
            <div
              className="flex max-w-12 flex-col overflow-hidden rounded-lg"
              style={{ backgroundColor: teamColor }}
            >
              <Image
                src={driverImg}
                alt={driver.last_name}
                width={1080}
                height={1080}
                className="object-cover"
              />
            </div>
            <div className="font-nums text-darkRed ml-2 text-3xl font-bold">
              {driver.driver_number}
            </div>
          </div>
          <div className="text-darkRed ml-1 text-xl">{driver.first_name}</div>
          <div className="text-darkRed ml-1 text-xl font-semibold">
            {driver.last_name}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 pb-4">
            <div
              className={`h-4 w-4 rounded-full`}
              style={{ backgroundColor: teamColor }}
            >
              {" "}
            </div>
            {driver.full_name}
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="flex items-center gap-8">
              <Image
                src={driverImg}
                alt={driver.last_name}
                width={1080}
                height={1080}
                className="max-w-36 object-cover"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Broadcast Name</p>
                  <div className="text-darkRed indent-2 text-lg">
                    {driver.broadcast_name}
                  </div>
                </div>
                <div>
                  <p>Country Code</p>
                  <div className="text-darkRed indent-2 text-lg">
                    {driver.country_code}
                  </div>
                </div>
                <div>
                  <p>Team</p>
                  <div className="text-darkRed indent-2 text-lg">
                    {driver.team_name}
                  </div>
                </div>
                <div>
                  <p className="">Driver Number</p>
                  <div className="text-darkRed indent-2 text-2xl font-bold">
                    {driver.driver_number}
                  </div>
                </div>
              </div>
            </div>
            <Link
              href={`/racers/${driver.driver_number}`}
              className="text-darkRed inline-block hover:underline"
            >
              Open full driver page
            </Link>
          </DialogDescription>
        </DialogHeader>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
