import { redirect } from "next/navigation";

type RacerDriverRedirectProps = {
  params: {
    driverNumber: string;
  };
};

export default function RacerDriverRedirect({
  params,
}: RacerDriverRedirectProps) {
  redirect(`/racers/${params.driverNumber}`);
}
