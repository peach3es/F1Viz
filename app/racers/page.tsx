import { getTeams } from "@/actions";
import { Container } from "@/components/Container";
import TeamCard from "@/components/TeamCard";

export default async function Racers() {
  let teams: string[] = [];

  try {
    teams = await getTeams();
  } catch (error) {
    console.error("Error fetching teams:", error);
  }

  return (
    <div className="min-h-screen items-center">
      <Container className="py-32">
        <div className="pb-5 text-4xl font-semibold text-darkRed">
          Get to Know the Athletes
        </div>
        <div className="grid grid-cols-1 items-center justify-center gap-3 md:grid-cols-2 lg:grid-cols-3">
          {teams.length ? (
            teams.map((team) => (
              <div key={team}>
                <TeamCard teamName={team} />
              </div>
            ))
          ) : (
            <div className="text-xl font-semibold">
              {"No drivers were found"}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
