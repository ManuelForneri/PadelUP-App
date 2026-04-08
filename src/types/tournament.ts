export type TournamentStatus =
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: TournamentStatus;
  flyer: string | null;
  price: number;
  created_at: string;
  updated_at: string;
}
