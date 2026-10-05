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
  created_at: string;
}
