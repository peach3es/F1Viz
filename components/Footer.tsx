import Image from "next/image";

import { Container } from "./Container";

export default function Footer() {
  return (
    <Container className="">
      <div className="flex min-h-24 flex-row items-center justify-between gap-6 rounded-t-lg bg-darkRed p-4">
        <Image
          aria-hidden
          src="/F1VIZ_logo.png"
          alt="F1 Viz logo"
          width={128}
          height={128}
        />
        <div className="text-sm text-eggshell">
          F1Viz is an unofficial project and is not associated in any way with
          the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE
          WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of
          Formula One Licensing B.V.
        </div>
      </div>
    </Container>
  );
}
