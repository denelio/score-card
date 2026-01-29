export interface PlayerStats {
  goals: number;
  matches: number;
  wins: number;
  assists: number;
  hatTricks?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  stats: PlayerStats;
}

export interface Match {
  id: string;
  date: string;
  scorers: string[]; // Array of Player IDs
}

export interface Record {
  id: string;
  title: string;
  holderId: string;
  value: string;
  date: string;
}

export interface Data {
  players: Player[];
  matches: Match[];
  records: Record[];
}
