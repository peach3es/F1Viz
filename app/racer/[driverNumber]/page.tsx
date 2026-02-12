import { redirect } from "next/navigation";

type RacerDriverRedirectProps = {
  params: Promise<{
    driverNumber: string;
  }>;
};

export default async function RacerDriverRedirect({
  params,
}: RacerDriverRedirectProps) {
  const { driverNumber } = await params;
  redirect(`/racers/${driverNumber}`);
}
