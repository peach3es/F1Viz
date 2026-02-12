import Image from "next/image";
import Link from "next/link";

import { Container } from "./Container";

export default function Header() {
  return (
    <div className="absolute left-0 top-0 z-20 flex min-h-16 w-full flex-row items-center bg-eggshell">
      <Container>
        <div className="flex w-full flex-row items-center justify-between">
          <Link href="/">
            <Image
              width={720}
              height={720}
              src={"/F1VIZ_logo.png"}
              alt="logo"
              className="max-h-24 max-w-24"
            />
          </Link>
          <div className="flex flex-row items-center justify-between gap-6 text-xl font-medium text-darkRed">
            <Link className="hover:underline" href={"/"}>
              Home
            </Link>
            <Link className="hover:underline" href={"/racers"}>
              Drivers
            </Link>
            <Link className="hover:underline" href={"/tyre"}>
              Pit Stops
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
