"use client";

import { Player } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/players/${player.id}`}>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="min-w-[140px] bg-card border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 snap-start cursor-pointer hover:border-primary/50 transition-colors group"
      >
        <div className="relative">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
            </div>
            {player.stats.goals > 20 && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    MVP
                </div>
            )}
        </div>
        
        <div className="text-center">
            <h3 className="font-bold text-sm truncate w-full">{player.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted">
                <span>{player.stats.goals} ⚽</span>
                <span>{player.stats.wins} 🏆</span>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}
