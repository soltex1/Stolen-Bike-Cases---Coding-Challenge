import { Bike as BikeType } from "./Bike";
import { Officer as OfficerType } from "./Officer";

export interface Case {
  id?: string;
  bike?: BikeType;
  bike_id: string | null;
  officer?: OfficerType;
  officer_id: string | null;
  state: "RESOLVED" | "PROCESSING";
  created_at?: string;
  updated_at?: string;
}
