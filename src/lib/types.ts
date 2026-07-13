export type UserRole = 'builder_admin' | 'builder_member' | 'warranty_manager' | 'trade' | 'homeowner';

export type TicketStatus =
  | 'new'
  | 'ai_triage'
  | 'needs_review'
  | 'ai_resolved'
  | 'assigned_to_trade'
  | 'scheduled'
  | 'in_progress'
  | 'waiting_on_homeowner'
  | 'completed'
  | 'closed'
  | 'not_warranty'
  | 'emergency';

export type TicketUrgency = 'low' | 'normal' | 'high' | 'emergency';

export type TicketCategory =
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'framing'
  | 'concrete'
  | 'foundation'
  | 'drywall'
  | 'insulation'
  | 'doors_windows'
  | 'flooring'
  | 'tile'
  | 'roofing'
  | 'siding'
  | 'stucco'
  | 'gutters'
  | 'exterior'
  | 'trim_carpentry'
  | 'countertops'
  | 'cabinetry'
  | 'appliances'
  | 'painting'
  | 'masonry'
  | 'grading'
  | 'landscaping'
  | 'garage'
  | 'structural'
  | 'general'
  | 'other';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  warranty_period_months: number;
  emergency_instructions: string | null;
  warranty_workmanship_months: number;
  warranty_systems_months: number;
  warranty_structural_months: number;
  warranty_excluded_items: string | null;
  warranty_coverage_notes: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  company_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Home {
  id: string;
  company_id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  homeowner_name: string;
  homeowner_email: string;
  homeowner_phone: string | null;
  closing_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  model_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface Trade {
  id: string;
  company_id: string;
  name: string;
  company_name: string;
  email: string;
  phone: string | null;
  category: TicketCategory;
  notes: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  company_id: string;
  home_id: string;
  trade_id: string | null;
  status: TicketStatus;
  urgency: TicketUrgency;
  category: TicketCategory;
  title: string;
  description: string;
  homeowner_message: string;
  ai_summary: string | null;
  ai_category: TicketCategory | null;
  ai_urgency: TicketUrgency | null;
  ai_trade_recommendation: string | null;
  ai_warranty_likelihood: string | null;
  ai_coverage_reason: string | null;
  coverage_override: 'covered' | 'not_covered' | null;
  coverage_override_at: string | null;
  ai_resolved: boolean;
  location: string | null;
  schedule_token: string | null;
  schedule_status: 'awaiting_trade' | 'proposed' | 'confirmed' | 'cancelled' | null;
  proposed_slots: string[] | null;
  scheduled_slot: string | null;
  scheduled_at: string | null;
  reminder_sent_at: string | null;
  assigned_by: string | null;
  assigned_at: string | null;
  completed_at: string | null;
  homeowner_signoff: boolean;
  homeowner_signoff_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  home?: Home;
  trade?: Trade;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'homeowner' | 'builder' | 'trade' | 'ai' | 'system';
  sender_name: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface TicketFile {
  id: string;
  ticket_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface TriageSession {
  id: string;
  company_id: string;
  home_id: string;
  homeowner_name: string;
  homeowner_email: string;
  status: 'active' | 'completed' | 'ticket_created';
  ticket_id: string | null;
  created_at: string;
}

export interface TriageMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: TriageMetadata | null;
  created_at: string;
}

export interface TriageMetadata {
  category?: TicketCategory;
  trade?: string;
  urgency?: TicketUrgency;
  warranty_likelihood?: 'likely_warranty' | 'likely_maintenance' | 'unclear' | 'likely_not_warranty';
  coverage_reason?: string;
  safety_escalation?: boolean;
  homeowner_response?: string;
  builder_summary?: string;
  recommended_action?: 'resolve' | 'create_ticket' | 'escalate' | 'ask_more';
  confidence?: number;
  needs_photos?: boolean;
  needs_trade_visit?: boolean;
}

export interface Subscription {
  id: string;
  company_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: 'starter' | 'growth' | 'pro';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_end: string;
  created_at: string;
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  new: 'New',
  ai_triage: 'AI Triage',
  needs_review: 'Needs Review',
  ai_resolved: 'AI Resolved',
  assigned_to_trade: 'Assigned to Trade',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  waiting_on_homeowner: 'Waiting on Homeowner',
  completed: 'Completed',
  closed: 'Closed',
  not_warranty: 'Not Warranty',
  emergency: 'Emergency',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  ai_triage: 'bg-purple-100 text-purple-800',
  needs_review: 'bg-yellow-100 text-yellow-800',
  ai_resolved: 'bg-green-100 text-green-800',
  assigned_to_trade: 'bg-orange-100 text-orange-800',
  scheduled: 'bg-cyan-100 text-cyan-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  waiting_on_homeowner: 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-gray-100 text-gray-800',
  not_warranty: 'bg-red-100 text-red-800',
  emergency: 'bg-red-200 text-red-900',
};

export const URGENCY_LABELS: Record<TicketUrgency, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  emergency: 'Emergency',
};

export const URGENCY_COLORS: Record<TicketUrgency, string> = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  emergency: 'bg-red-100 text-red-700',
};

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  framing: 'Framing',
  concrete: 'Concrete',
  foundation: 'Foundation',
  drywall: 'Drywall',
  insulation: 'Insulation',
  doors_windows: 'Doors & Windows',
  flooring: 'Flooring',
  tile: 'Tile',
  roofing: 'Roofing',
  siding: 'Siding',
  stucco: 'Stucco',
  gutters: 'Gutters',
  exterior: 'Exterior',
  trim_carpentry: 'Trim / Finish Carpentry',
  countertops: 'Countertops',
  cabinetry: 'Cabinetry',
  appliances: 'Appliances',
  painting: 'Painting',
  masonry: 'Masonry',
  grading: 'Grading / Excavation',
  landscaping: 'Landscaping',
  garage: 'Garage',
  structural: 'Structural',
  general: 'General',
  other: 'Other',
};

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 199,
    maxHomes: 15,
    maxTeamMembers: 2,
    features: [
      'Up to 15 active warranty homes',
      'AI-powered issue triage',
      'Homeowner intake portal',
      'Ticket management',
      'Trade assignment & email notifications',
      '2 team members',
    ],
  },
  growth: {
    name: 'Growth',
    price: 399,
    maxHomes: 50,
    maxTeamMembers: 5,
    features: [
      'Up to 50 active warranty homes',
      'Everything in Starter',
      '5 team members',
      'Priority email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 799,
    maxHomes: -1,
    maxTeamMembers: -1,
    features: [
      'Unlimited warranty homes',
      'Everything in Growth',
      'Unlimited team members',
      'Priority email support',
    ],
  },
} as const;
