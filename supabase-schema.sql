-- MANAIO Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'agent', 'admin')),
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  company TEXT,
  company_url TEXT,
  notification_new_properties BOOLEAN DEFAULT true,
  notification_price_changes BOOLEAN DEFAULT true,
  notification_lead_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup (never allows 'admin' role from signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'buyer');
  -- Only allow 'buyer' or 'agent' - admin must be set manually in DB
  IF requested_role NOT IN ('buyer', 'agent') THEN
    requested_role := 'buyer';
  END IF;
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, requested_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_he TEXT,
  description_he TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  price INTEGER NOT NULL,
  expected_roi DECIMAL(5,2) NOT NULL,
  bedrooms INTEGER NOT NULL,
  property_type TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  agent_name TEXT NOT NULL,
  agent_email TEXT NOT NULL,
  agent_id UUID REFERENCES profiles(id),
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  investment_budget TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'in_progress', 'answered', 'closed')),
  buyer_id UUID REFERENCES profiles(id),
  agent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table (DB-backed for logged-in users)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'MANAIO',
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table (chat threads between buyers and agents on a property)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, buyer_id, agent_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorite agents table (buyers follow agents)
CREATE TABLE IF NOT EXISTS favorite_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, agent_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_property', 'chat_message', 'lead_update')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
-- Users can update own profile but NOT their role (role changes require admin)
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update any profile" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Properties policies
CREATE POLICY "Properties are publicly readable" ON properties FOR SELECT USING (true);
CREATE POLICY "Agents can insert own properties" ON properties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
);
CREATE POLICY "Agents can update own properties" ON properties FOR UPDATE USING (
  agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Agents can delete own properties" ON properties FOR DELETE USING (
  agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads policies
CREATE POLICY "Anyone can submit a lead" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Buyers can read own leads" ON leads FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Agents can read leads for their properties" ON leads FOR SELECT USING (agent_id = auth.uid());
CREATE POLICY "Admin can read all leads" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Agents can update lead status" ON leads FOR UPDATE USING (
  agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (user_id = auth.uid());

-- Blog policies
CREATE POLICY "Published posts are publicly readable" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage blog posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Conversations policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  buyer_id = auth.uid() OR agent_id = auth.uid()
);
CREATE POLICY "Authenticated users can create conversations" ON conversations FOR INSERT WITH CHECK (
  buyer_id = auth.uid()
);
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND (conversations.buyer_id = auth.uid() OR conversations.agent_id = auth.uid()))
);
CREATE POLICY "Users can send messages in own conversations" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND (conversations.buyer_id = auth.uid() OR conversations.agent_id = auth.uid()))
);
CREATE POLICY "Recipients can mark messages as read" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND (conversations.buyer_id = auth.uid() OR conversations.agent_id = auth.uid()))
);

-- Favorite agents policies
ALTER TABLE favorite_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorite agents" ON favorite_agents FOR ALL USING (buyer_id = auth.uid());
CREATE POLICY "Agents can see their followers" ON favorite_agents FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_country ON properties(country);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_buyer_id ON leads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_favorite_agents_buyer_id ON favorite_agents(buyer_id);
CREATE INDEX IF NOT EXISTS idx_favorite_agents_agent_id ON favorite_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
