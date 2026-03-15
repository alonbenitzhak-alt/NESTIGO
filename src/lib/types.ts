export type UserRole = "buyer" | "agent" | "admin";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string;
  avatar_url?: string;
  company?: string;
  company_url?: string;
  notification_new_properties: boolean;
  notification_price_changes: boolean;
  notification_lead_updates: boolean;
  approved?: boolean | null;
  license_url?: string | null;
  id_url?: string | null;
  partnership_signed?: boolean | null;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  country: string;
  city: string;
  neighborhood?: string;
  price: number;
  expected_roi: number;
  bedrooms: number;
  bathrooms?: number;
  area_sqm?: number;
  floor?: number | null;
  year_built?: number | null;
  property_type: string;
  description: string;
  images: string[];
  amenities?: string[];
  furnished?: boolean;
  currency?: "EUR" | "USD" | "GBP" | "ILS";
  show_roi?: boolean;
  agent_name: string;
  agent_email: string;
  agent_id?: string;
  featured?: boolean;
  views_count?: number;
  clicks_count?: number;
  status?: "active" | "closed";
  created_at?: string;
}

export type PaymentStatus = "pending" | "paid";
export type PaymentType = "lead_fee" | "commission" | "bonus";

export interface Payment {
  id: string;
  agent_id: string;
  lead_id?: string | null;
  property_id?: string | null;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  notes?: string | null;
  paid_at?: string | null;
  created_at: string;
}

export type LeadStatus = "sent" | "in_progress" | "answered" | "closed";

export interface Lead {
  id?: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  investment_budget: string;
  message: string;
  status?: LeadStatus;
  buyer_id?: string;
  agent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Country {
  slug: string;
  name: string;
  description: string;
  image: string;
  highlights: string[];
  comingSoon?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  property_id: string;
  buyer_id: string;
  agent_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface FavoriteAgent {
  id: string;
  buyer_id: string;
  agent_id: string;
  created_at: string;
}

export type NotificationType = "new_property" | "chat_message" | "lead_update";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  created_at: string;
}
