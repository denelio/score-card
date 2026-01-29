import dummyData from "@/data/dummy.json";
import { Record, Player, Match } from "@/lib/types";
import { Trophy, Medal, Crown, Flame } from "lucide-react";

export default function RecordsPage() {
  const records = dummyData.records as Record[];
  const players = dummyData.players as Player[];
  const matches = dummyData.matches as Match[];

  // Helper to get player details
  const getPlayer = (id: string) => players.find(p => p.id === id);

  // Calculate Streaks and convert to Record format for unified list
  const streaks = players.map(player => {
    let currentStreak = 0;
    let maxStreak = 0;
    
    // Sort matches by date
    const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedMatches.forEach(match => {
        if (match.scorers.includes(player.id)) {
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
            currentStreak = 0;
        }
    })
    return { ...player, maxStreak };
  })
  .sort((a, b) => b.maxStreak - a.maxStreak)
  .filter(p => p.maxStreak > 1)
  .slice(0, 1) // Only take the absolute top streak for the record list to be unique? Or top 3? User said "Longest Scoring Streak along with others".
               // Usually records are singular. Let's take the top one.
  .map(player => ({
      id: "streak-1",
      title: "Longest Scoring Streak",
      holderId: player.id,
      value: `${player.maxStreak} Games`,
      date: "2024" // In real app would be dynamic
  }));

  // Merge static records with dynamic streak record
  const allRecords = [...records, ...streaks];

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
       <header>
          <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">HALL OF <span className="text-primary">FAME</span></h1>
       </header>

       {/* Unified Records List */}
       <div className="grid gap-4">
          {allRecords.map((record, index) => {
             const holder = getPlayer(record.holderId);
             if (!holder) return null;

             return (
                <div key={record.id} className="bg-card border border-white/5 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />

                   <div className="bg-secondary/50 p-3 rounded-full border border-white/10 z-10 shrink-0">
                      {index === 0 ? <Crown className="text-yellow-500 w-6 h-6" /> : 
                       record.title.includes("Streak") ? <Flame className="text-orange-500 w-6 h-6" /> :
                       <Trophy className="text-gray-300 w-6 h-6" />}
                   </div>

                   <div className="flex-1 z-10 min-w-0">
                      <h3 className="font-bold text-lg leading-tight pr-2">{record.title}</h3>
                      <p className="text-xs text-muted mb-1">{record.date}</p>
                      
                      <div className="flex items-center gap-2 mt-2 bg-black/20 p-1.5 rounded-lg w-fit pr-3">
                         <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary flex items-center justify-center border border-white/10">
                            {holder.avatar === "default" ? (
                                <span className="text-[10px] font-bold text-muted">{holder.name.substring(0, 2).toUpperCase()}</span>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={holder.avatar} alt={holder.name} className="w-full h-full object-cover" />
                            )}
                         </div>
                         <span className="font-semibold text-sm truncate">{holder.name}</span>
                      </div>
                   </div>

                   <div className="z-10 text-right shrink-0">
                      <span className="text-xl font-black text-primary block">{record.value}</span>
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  );
}
