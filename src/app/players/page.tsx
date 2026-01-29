"use client";

import { useState } from "react";
import dummyData from "@/data/dummy.json";
import PlayerListItem from "@/components/PlayerListItem";
import { Player, Match } from "@/lib/types";
import { cn } from "@/lib/utils";

type Period = "all" | "year" | "month";

export default function PlayersPage() {
  const players = dummyData.players as Player[];
  const matches = dummyData.matches as Match[];
  const [period, setPeriod] = useState<Period>("all");

  // Filter and Calculate Stats
  const getProcessedPlayers = () => {
    const now = new Date();
    
    // 1. Calculate stats per player for the selected period
    const processed = players.map(player => {
        let periodGoals = 0;
        let periodMatches = 0;
        let currentStreak = 0;
        let maxStreak = 0;

        // Sort matches for streak calc
        const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sortedMatches.forEach(match => {
            const matchDate = new Date(match.date);
            let include = false;

            if (period === "all") include = true;
            if (period === "year" && matchDate.getFullYear() === now.getFullYear()) include = true;
            if (
                period === "month" &&
                matchDate.getMonth() === now.getMonth() &&
                matchDate.getFullYear() === now.getFullYear()
            ) include = true;

            if (include) {
                // Check if they played? Assuming simple model where if they are in dummy matches, they played?
                // Our dummy data only links scorers. This is a limitation.
                // For now, we count specific scorers. We don't have a reliable 'played' count without roster data.
                // We'll assume for this prototype that if they scored, they played, or we use total matches if they are in the 'scorers' list at all?
                // Actually, let's just stick to the dummy data strictness:
                // Scorer count is straightforward.
                // Match count: If they aren't in the scorer list, did they play? 
                // Let's assume for this specific view, we are counting "Matches Scored In" or stick to total dummy matches logic?
                // Given the limitation, let's just count goals from the matches. 
                // For 'matches played', we'll assume they play every match for now to keep it simple, OR check if their ID is in match "scorers" (which is wrong, that's matches scored in).
                // Let's just blindly increment goals here.
                
                const goalsInMatch = match.scorers.filter(id => id === player.id).length;
                if (goalsInMatch > 0) {
                    periodGoals += goalsInMatch;
                    
                    // Streak Logic
                    currentStreak++;
                    if (currentStreak > maxStreak) maxStreak = currentStreak;
                } else {
                    currentStreak = 0;
                }
                
                // Matches count: In a real app we'd check a 'roster'. 
                // Here we will use the global matches count if period matches, 
                // but that's wrong for individual players. 
                // Let's rely on the player.stats (static) for "all time" and approximate for filters?
                // Actually, let's just show "Matches Scored In" for filtered views to be accurate to data we have.
                // OR, let's count a match if they scored (since we don't have lineups). This is a safe fallback.
                if (goalsInMatch > 0) periodMatches++;
            }
        });

        // Fallback for "All Time" to use the static correct data if available, 
        // essentially overriding the calculated logic above which is limited by missing lineup data.
        if (period === "all") {
             // Use static stats for accuracy on "All"
             return {
                 ...player,
                 periodGoals: player.stats.goals,
                 periodMatches: player.stats.matches, // Matches played
                 rank: 0, // Assigned later
                 maxStreak
             };
        }

        return {
            ...player,
            periodGoals,
            periodMatches, // Matches scored in (limitation of dummy data)
            rank: 0,
            maxStreak
        };
    });

    // 2. Sort by Goals
    processed.sort((a, b) => b.periodGoals - a.periodGoals);

    // 3. Assign Rank
    return processed.map((p, index) => ({ ...p, rank: index + 1 }));
  };

  const rankedPlayers = getProcessedPlayers();

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
      <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black italic tracking-tighter text-white">PLAYER <span className="text-primary">STATS</span></h1>
          
          {/* Filter Toggles */}
          <div className="flex bg-secondary p-1 rounded-xl w-fit self-start">
            {(["all", "year", "month"] as Period[]).map((p) => (
                <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                    "px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all",
                    period === p
                    ? "bg-primary text-black shadow-lg"
                    : "text-muted hover:text-white"
                )}
                >
                {p}
                </button>
            ))}
          </div>
      </div>
      
      <div className="flex flex-col">
        {rankedPlayers.map((player) => (
            <PlayerListItem key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
