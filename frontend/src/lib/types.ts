// Hand-written mirrors of the backend Pydantic models — keep in sync in the same edit.

export interface Course {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: string;
  eligibility: string;
  fee_range: string;
  description: string;
  career_outcomes: string[];
  popular: boolean;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  streams: string[];
  rating: number;
  fee_range: string;
  description: string;
  featured: boolean;
}

export interface LeadCreate {
  name: string;
  phone: string;
  email?: string | null;
  course_interest?: string | null;
  state?: string | null;
  message?: string | null;
  source?: string;
}

export interface Lead extends LeadCreate {
  id: string;
  status: string;
  created_at: string;
}

export interface AdminSession {
  authenticated: boolean;
}

export interface LeadStats {
  total: number;
  apply: number;
  counselling: number;
  contact: number;
  last_7_days: number;
  new: number;
  called: number;
  interested: number;
  admitted: number;
}

export interface AdminLeadsResponse {
  stats: LeadStats;
  leads: Lead[];
}
