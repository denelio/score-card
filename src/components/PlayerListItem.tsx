"use client";

import { useState } from "react";
import { Player } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerListItemProps {
  player: Player & {
    rank: number;
    periodGoals: number;
    periodMatches: number;
    maxStreak: number;
  };
}

export default function PlayerListItem({ player }: PlayerListItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden mb-3">
      {/* Main Row (Always Visible) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors active:scale-[0.99]"
      >
        {/* Rank Badge (replaces Avatar) */}
        <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 font-black text-xl italic",
            player.rank === 1 ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" :
            player.rank === 2 ? "bg-gray-400/20 border-gray-400 text-gray-300" :
            player.rank === 3 ? "bg-orange-600/20 border-orange-600 text-orange-500" :
            "bg-secondary border-white/10 text-muted"
        )}>
            {player.rank}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{player.name}</h3>
        </div>

        {/* Highlighted Stats (Like Leaderboard) */}
        <div className="text-right shrink-0">
            <span className="text-xl font-bold text-primary block leading-none">{player.periodGoals}</span>
            <span className="text-[10px] text-muted uppercase tracking-wider">Goals</span>
        </div>
        <div className="text-right shrink-0 min-w-[3rem]">
            <span className="text-xl font-bold text-white block leading-none">{player.periodMatches}</span>
            <span className="text-[10px] text-muted uppercase tracking-wider">Matches</span>
        </div>

        {/* Action Icon */}
        <div className="text-muted pl-2">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-secondary/30"
            >
                <div className="p-4 pt-0 grid grid-cols-2 gap-3 text-sm">
                     <div className="bg-card/50 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-muted">Hat Tricks</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-blue-400 font-bold px-1.5 py-0.5 bg-blue-400/10 rounded text-xs">HAT</span>
                            <span className="font-bold text-lg">{player.stats.hatTricks || 0}</span>
                        </div>
                     </div>
                     <div className="bg-card/50 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-muted">Best Streak</span>
                        <div className="flex items-center gap-1.5">
                            <Flame size={16} className="text-orange-500" />
                            <span className="font-bold text-lg">{player.maxStreak}</span>
                        </div>
                     </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
