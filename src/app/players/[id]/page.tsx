import dummyData from "@/data/dummy.json";
import { Player } from "@/lib/types";
import { notFound } from "next/navigation";
import { Trophy, Target, Award, Calendar } from "lucide-react";

// For SSG with dynamic routes (optional but good practice)
export function generateStaticParams() {
  return dummyData.players.map((player) => ({
    id: player.id,
  }));
}

export default async function PlayerProfile(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  if (!params?.id) {
     notFound(); // Should not happen with generateStaticParams
     return null;
  }

  const { id } = params;
  const players = dummyData?.players as Player[] || [];
  const player = players.find((p) => p && p.id === id);

  if (!player) {
    notFound();
  }

  // Calculate some derived stats
  const goalsPerMatch = (player.stats.goals / player.stats.matches).toFixed(1);
  const winRate = ((player.stats.wins / player.stats.matches) * 100).toFixed(0);

  return (
    <div className="pb-24 max-w-md mx-auto relative">
      {/* Header / Banner */}
      <div className="h-48 bg-gradient-to-b from-secondary to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
      </div>

      <div className="px-4 -mt-20 relative">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-full border-4 border-background bg-secondary shadow-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black italic mt-4">{player.name}</h1>
          <p className="text-muted text-sm">Striker / Midfield</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
            <Target className="text-primary w-8 h-8" />
            <span className="text-3xl font-bold">{player.stats.goals}</span>
            <span className="text-xs text-muted uppercase tracking-wider">Goals</span>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
            <Trophy className="text-yellow-500 w-8 h-8" />
            <span className="text-3xl font-bold">{player.stats.wins}</span>
            <span className="text-xs text-muted uppercase tracking-wider">Wins</span>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
            <Calendar className="text-blue-500 w-8 h-8" />
            <span className="text-3xl font-bold">{player.stats.matches}</span>
            <span className="text-xs text-muted uppercase tracking-wider">Matches</span>
          </div>
          <div className="bg-card p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
            <Award className="text-purple-500 w-8 h-8" />
            <span className="text-3xl font-bold">{player.stats.assists}</span>
            <span className="text-xs text-muted uppercase tracking-wider">Assists</span>
          </div>
        </div>

        {/* Advanced Stats */}
        <div className="bg-card rounded-2xl p-6 border border-white/5 space-y-4">
            <h2 className="font-bold text-lg border-b border-white/5 pb-2">Season Stats</h2>
            
            <div className="flex justify-between items-center">
                <span className="text-muted">Goals per Match</span>
                <span className="font-bold">{goalsPerMatch}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted">Win Rate</span>
                <span className="font-bold">{winRate}%</span>
            </div>
        </div>

      </div>
    </div>
  );
}
