import dummyData from "@/data/dummy.json";
import Leaderboard from "@/components/Leaderboard";
import { Player, Match, Record } from "@/lib/types";
import Link from "next/link";
import { Crown, Medal, Trophy, ArrowRight } from "lucide-react";

export default function Home() {
  const players = dummyData.players as Player[];
  const matches = dummyData.matches as Match[];
  const records = dummyData.records as Record[]; // Get records for preview

  // Helper to get player details
  const getPlayer = (id: string) => players.find(p => p.id === id);

  return (
    <div className="pb-24 pt-8 px-4 space-y-8 max-w-md mx-auto">
       {/* Hero / Header */}
       <header className="mb-8 flex flex-col justify-end min-h-[10vh]">
          <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none">
             SCORE <span className="text-primary">CARD</span>
          </h1>
       </header>

       {/* Leaderboard Preview */}
       <section>
          <Leaderboard players={players} matches={matches} limit={3} showViewAll={true} />
       </section>

       {/* Records Preview */}
       <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-xl font-bold flex items-center gap-2">
                <Crown className="text-purple-500" /> Hall of Fame
             </h2>
          </div>

          <div className="space-y-3">
             {records.slice(0, 3).map((record, index) => {
                const holder = getPlayer(record.holderId);
                if (!holder) return null;

                return (
                   <div key={record.id} className="bg-card border border-white/5 p-4 rounded-xl flex items-center gap-3">
                      <div className="bg-secondary/50 p-2 rounded-full border border-white/10 shrink-0">
                           {index === 0 ? <Crown className="text-yellow-500 w-5 h-5" /> : 
                            <Trophy className="text-orange-500 w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-sm">{record.title}</h3>
                           <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                               <div className="w-4 h-4 rounded-full overflow-hidden bg-secondary">
                                   {holder.avatar === "default" ? (
                                       <div className="w-full h-full bg-gray-600" />
                                   ) : (
                                       // eslint-disable-next-line @next/next/no-img-element
                                       <img src={holder.avatar} alt={holder.name} className="w-full h-full object-cover" />
                                   )}
                               </div>
                               <span>{holder.name}</span>
                           </div>
                      </div>

                      <div className="text-right">
                          <span className="font-bold text-primary text-sm">{record.value}</span>
                      </div>
                   </div>
                );
             })}

             <Link href="/records" className="flex items-center justify-center gap-2 text-primary text-sm font-medium py-3 hover:underline">
                View All Records <ArrowRight size={16} />
             </Link>
          </div>
       </section>
    </div>
  );
}
