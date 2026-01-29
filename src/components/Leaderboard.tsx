"use client";

import { useState } from "react";
import { Player, Match } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Calendar, Flame, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LeaderboardProps {
  players: Player[];
  matches: Match[];
  limit?: number; // Optional limit for preview mode
  showViewAll?: boolean;
}

type Period = "all" | "year" | "month";

export default function Leaderboard({ players, matches, limit, showViewAll }: LeaderboardProps) {
  const [period, setPeriod] = useState<Period>("all");

  // Helper to calculate goals based on period
  const getScorers = () => {
    const scorerCounts: Record<string, number> = {};
    const now = new Date();

    matches.forEach((match) => {
      const matchDate = new Date(match.date);
      let include = false;

      if (period === "all") include = true;
      if (period === "year" && matchDate.getFullYear() === now.getFullYear()) include = true;
      if (
        period === "month" &&
        matchDate.getMonth() === now.getMonth() &&
        matchDate.getFullYear() === now.getFullYear()
      )
        include = true;

      if (include) {
        match.scorers.forEach((playerId) => {
          scorerCounts[playerId] = (scorerCounts[playerId] || 0) + 1;
        });
      }
    });

    return players
      .map((p) => ({ ...p, periodGoals: scorerCounts[p.id] || 0 }))
      .sort((a, b) => b.periodGoals - a.periodGoals)
      .filter((p) => p.periodGoals > 0)
      .slice(0, limit || 100); // Apply limit if exists
  };

  const topScorers = getScorers();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Leaderboard
        </h2>
        
        <div className="flex bg-secondary rounded-lg p-1">
          {(["all", "year", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-2 py-1 text-[10px] font-medium rounded-md capitalize transition-all",
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

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {topScorers.length > 0 ? (
            topScorers.map((player, index) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-white/5 rounded-xl p-3 flex items-center gap-4 relative overflow-hidden"
              >
                {/* Rank Badge */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  index === 0 ? "bg-yellow-500" :
                  index === 1 ? "bg-gray-400" :
                  index === 2 ? "bg-orange-600" : "bg-transparent"
                )} />
                
                <div className="text-lg font-bold w-6 text-center text-muted">
                  {index + 1}
                </div>

                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                   {player.avatar === "default" ? (
                      <span className="text-xs font-bold text-muted">{player.name.substring(0, 2).toUpperCase()}</span>
                   ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                   )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{player.name}</h3>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Flame size={10} className="text-orange-500" />
                    {player.stats.matches} Matches
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-bold text-primary">{player.periodGoals}</span>
                  <p className="text-[10px] text-muted uppercase">Goals</p>
                </div>
              </motion.div>
            ))
          ) : (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="text-center py-8 text-muted"
            >
              No goals scored in this period yet.
            </motion.div>
          )}
        </AnimatePresence>

        {showViewAll && (
            <Link href="/players" className="flex items-center justify-center gap-2 text-primary text-sm font-medium py-3 hover:underline">
                See All Players <ArrowRight size={16} />
            </Link>
        )}
      </div>
    </div>
  );
}
