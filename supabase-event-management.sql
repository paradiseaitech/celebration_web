-- ============================================
-- CELEBRATION.COM - EVENT MANAGEMENT ADDITIONS
-- Run this in Supabase SQL Editor
-- ============================================

-- Vendors table
create table if not exists vendors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null, -- 'decorator', 'photographer', 'dj', 'makeup', 'venue'
  description text,
  image_url text,
  price_from decimal(10,2),
  rating decimal(2,1) default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Themes table
create table if not exists themes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  color_scheme text, -- hex color
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Event bookings
create table if not exists event_bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  event_type text not null,
  event_date date,
  location text,
  guest_count integer,
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  theme_id uuid references themes(id),
  total_estimate decimal(10,2),
  status text default 'planning', -- planning, confirmed, in_progress, completed
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Booking sub-events
create table if not exists booking_sub_events (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references event_bookings(id) on delete cascade,
  name text not null, -- 'Haldi', 'Mehendi', 'Reception'
  event_date date,
  guest_count integer,
  menu_items jsonb,
  budget decimal(10,2),
  status text default 'planning',
  created_at timestamp with time zone default now()
);

-- Booking vendors (junction)
create table if not exists booking_vendors (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references event_bookings(id) on delete cascade,
  vendor_id uuid references vendors(id),
  status text default 'pending', -- pending, confirmed, completed
  notes text,
  created_at timestamp with time zone default now()
);

-- Payments
create table if not exists payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references event_bookings(id),
  amount decimal(10,2) not null,
  type text default 'partial', -- partial, full
  status text default 'pending', -- pending, completed, refunded
  payment_method text,
  transaction_id text,
  created_at timestamp with time zone default now()
);

-- Event timeline
create table if not exists event_timeline (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references event_bookings(id) on delete cascade,
  status text not null, -- 'planning', 'vendor_confirmed', 'preparation', 'ready'
  notes text,
  updated_at timestamp with time zone default now()
);

-- Reviews
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references vendors(id) on delete cascade,
  user_id uuid references auth.users(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- RLS Policies
-- ============================================

alter table vendors enable row level security;
alter table themes enable row level security;
alter table event_bookings enable row level security;
alter table booking_sub_events enable row level security;
alter table booking_vendors enable row level security;
alter table payments enable row level security;
alter table event_timeline enable row level security;
alter table reviews enable row level security;

-- Vendors: Public read, admin write
create policy "Vendors public read" on vendors for select using (true);
create policy "Vendors admin write" on vendors for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Themes: Public read, admin write
create policy "Themes public read" on themes for select using (true);
create policy "Themes admin write" on themes for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Event bookings: Users see own, admin sees all
create policy "Bookings user read" on event_bookings for select using (
  user_id = auth.uid() or
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);
create policy "Bookings user insert" on event_bookings for insert with check (true);
create policy "Bookings admin write" on event_bookings for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Booking sub-events: Same as bookings
create policy "Sub-events user read" on booking_sub_events for select using (
  exists (select 1 from event_bookings eb where eb.id = booking_sub_events.booking_id and (eb.user_id = auth.uid() or exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))))
);
create policy "Sub-events admin write" on booking_sub_events for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Booking vendors
create policy "Booking vendors user read" on booking_vendors for select using (
  exists (select 1 from event_bookings eb where eb.id = booking_vendors.booking_id and (eb.user_id = auth.uid() or exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))))
);
create policy "Booking vendors admin write" on booking_vendors for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Payments
create policy "Payments user read" on payments for select using (
  exists (select 1 from event_bookings eb where eb.id = payments.booking_id and (eb.user_id = auth.uid() or exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))))
);
create policy "Payments admin write" on payments for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Event timeline
create policy "Timeline user read" on event_timeline for select using (
  exists (select 1 from event_bookings eb where eb.id = event_timeline.booking_id and (eb.user_id = auth.uid() or exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))))
);
create policy "Timeline admin write" on event_timeline for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Reviews: Public read, authenticated write
create policy "Reviews public read" on reviews for select using (true);
create policy "Reviews user write" on reviews for insert with check (auth.uid() is not null);
create policy "Reviews admin write" on reviews for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- ============================================
-- Seed Data
-- ============================================

-- Vendors
insert into vendors (name, category, description, image_url, price_from, rating, is_featured) values
  ('Royal Decor Studio', 'decorator', 'Luxury wedding and event decorations with custom floral arrangements and lighting', 'https://images.unsplash.com/photo-1478146059778-26028b47d32d?w=400&q=80', 25000, 4.8, true),
  ('LensCraft Photography', 'photographer', 'Professional event photography and videography with cinematic editing', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80', 15000, 4.9, true),
  ('DJ Nitin Beats', 'dj', 'High-energy DJ services with premium sound systems for all events', 'https://images.unsplash.com/photo-1571266028243-e4734b1a4940?w=400&q=80', 12000, 4.6, false),
  ('Glam by Priya', 'makeup', 'Bridal and party makeup with premium products and personalized looks', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80', 8000, 4.7, true),
  ('Grand Palace Venue', 'venue', 'Elegant banquet hall with capacity for 500+ guests, catering available', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80', 50000, 4.5, true),
  ('Floral Dreams', 'decorator', 'Custom floral arrangements, mandap decorations, and stage setups', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80', 18000, 4.4, false),
  ('ClickPerfect Studios', 'photographer', 'Candid and traditional event photography with drone coverage', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80', 20000, 4.8, false),
  ('Makeover by Anjali', 'makeup', 'Professional bridal makeup, hair styling, and mehendi artist', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80', 10000, 4.6, false);

-- Themes
insert into themes (name, slug, description, image_url, color_scheme) values
  ('Royal Traditional', 'royal-traditional', 'Classic Indian wedding theme with rich colors, gold accents, and traditional motifs', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', '#8B0000'),
  ('Modern Minimalist', 'modern-minimalist', 'Clean lines, neutral tones, and elegant simplicity for contemporary celebrations', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80', '#D4A853'),
  ('Garden Romance', 'garden-romance', 'Outdoor theme with lush greenery, fairy lights, and floral canopies', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80', '#228B22'),
  ('Luxury Glamour', 'luxury-glamour', 'Opulent decor with crystal chandeliers, velvet drapes, and gold detailing', 'https://images.unsplash.com/photo-1478146059778-26028b47d32d?w=400&q=80', '#1a1a2e'),
  ('Rustic Charm', 'rustic-charm', 'Earthy tones, wooden accents, and natural textures for a warm celebration', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', '#8B4513'),
  ('Beach Vibes', 'beach-vibes', 'Coastal theme with blues, whites, and tropical elements', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', '#006994');
