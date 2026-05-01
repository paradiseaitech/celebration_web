-- ============================================
-- CELEBRATION.COM - SUPABASE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create enum types
do $$ begin
  create type user_role as enum ('super_admin', 'menu_manager');
  create type lead_status as enum ('new', 'contacted', 'converted', 'lost');
exception
  when duplicate_object then null;
end $$;

-- 3. Create tables

-- Users table (extends Supabase auth.users)
create table if not exists users (
  id uuid references auth.users(id) on delete cascade primary key,
  role user_role default 'menu_manager',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Categories
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Menu Items
create table if not exists menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(10,2) not null default 0,
  image_url text,
  dietary_tags text[] default '{}',
  is_popular boolean default false,
  is_seasonal boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Packages
create table if not exists packages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  base_price decimal(10,2) not null default 0,
  min_guests integer not null default 50,
  max_guests integer,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Package Items (junction table)
create table if not exists package_items (
  id uuid default uuid_generate_v4() primary key,
  package_id uuid references packages(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete cascade,
  quantity integer default 1,
  created_at timestamp with time zone default now()
);

-- Leads
create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  email text,
  event_type text,
  guest_count integer,
  message text,
  plate_data jsonb,
  estimated_total decimal(10,2),
  status lead_status default 'new',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Banners
create table if not exists banners (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subtitle text,
  image_url text,
  cta_text text,
  cta_link text,
  is_active boolean default true,
  display_order integer default 0,
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

-- Newsletter Subscribers
create table if not exists newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamp with time zone default now(),
  is_active boolean default true
);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table users enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table packages enable row level security;
alter table package_items enable row level security;
alter table leads enable row level security;
alter table banners enable row level security;
alter table newsletter_subscribers enable row level security;

-- Categories: Public read, admin write
create policy "Categories public read" on categories for select using (true);
create policy "Categories admin write" on categories for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Menu Items: Public read, admin write
create policy "Menu items public read" on menu_items for select using (true);
create policy "Menu items admin write" on menu_items for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Packages: Public read, admin write
create policy "Packages public read" on packages for select using (true);
create policy "Packages admin write" on packages for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Package Items: Public read, admin write
create policy "Package items public read" on package_items for select using (true);
create policy "Package items admin write" on package_items for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Leads: Anyone can insert (public form), admin read/write
create policy "Leads public insert" on leads for insert with check (true);
create policy "Leads admin read" on leads for select using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);
create policy "Leads admin write" on leads for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Banners: Public read, admin write
create policy "Banners public read" on banners for select using (true);
create policy "Banners admin write" on banners for all using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Newsletter: Anyone can insert, admin read
create policy "Newsletter public insert" on newsletter_subscribers for insert with check (true);
create policy "Newsletter admin read" on newsletter_subscribers for select using (
  exists (select 1 from users where users.id = auth.uid() and users.role in ('super_admin', 'menu_manager'))
);

-- Users: Only admins can read
create policy "Users admin read" on users for select using (
  exists (select 1 from users u where u.id = auth.uid() and u.role = 'super_admin')
);

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, role)
  values (new.id, 'menu_manager');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_menu_items_updated_at before update on menu_items
  for each row execute procedure update_updated_at_column();

create trigger update_packages_updated_at before update on packages
  for each row execute procedure update_updated_at_column();

create trigger update_leads_updated_at before update on leads
  for each row execute procedure update_updated_at_column();

-- ============================================
-- 6. SEED DATA
-- ============================================

-- Categories
insert into categories (name, slug, display_order, is_active) values
  ('Starters', 'starters', 1, true),
  ('Main Course', 'main-course', 2, true),
  ('Desserts', 'desserts', 3, true),
  ('Beverages', 'beverages', 4, true),
  ('Salads', 'salads', 5, true),
  ('Breads', 'breads', 6, true)
on conflict (slug) do nothing;

-- Menu Items
insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Chicken Tikka',
  'Tender chicken pieces marinated in yogurt and spices, grilled to perfection in tandoor',
  180,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80',
  array['spicy'],
  true,
  false,
  id
from categories where slug = 'starters'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Paneer Butter Masala',
  'Rich and creamy tomato-based curry with soft paneer cubes',
  160,
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
  array['veg'],
  true,
  false,
  id
from categories where slug = 'main-course'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Dal Makhani',
  'Slow-cooked black lentils in butter and cream, a classic North Indian delicacy',
  140,
  'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80',
  array['veg'],
  false,
  false,
  id
from categories where slug = 'main-course'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Gulab Jamun',
  'Soft, golden fried milk dumplings soaked in rose-flavored sugar syrup',
  60,
  'https://images.unsplash.com/photo-1666190077589-09d077939460?w=400&q=80',
  array['veg'],
  true,
  false,
  id
from categories where slug = 'desserts'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Mango Lassi',
  'Refreshing yogurt-based drink blended with sweet mango pulp',
  45,
  'https://images.unsplash.com/photo-1627663059429-4be5a5e189b5?w=400&q=80',
  array['veg'],
  false,
  true,
  id
from categories where slug = 'beverages'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Veg Seekh Kebab',
  'Spiced vegetable and lentil kebabs, grilled and served with mint chutney',
  120,
  null,
  array['veg', 'vegan'],
  false,
  false,
  id
from categories where slug = 'starters'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Butter Chicken',
  'Succulent chicken in rich, creamy tomato-butter gravy',
  200,
  null,
  array['spicy'],
  true,
  false,
  id
from categories where slug = 'main-course'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Rasmalai',
  'Soft cottage cheese patties immersed in sweet, thickened milk with cardamom',
  70,
  null,
  array['veg'],
  false,
  false,
  id
from categories where slug = 'desserts'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Fresh Lime Soda',
  'Classic lime soda, available sweet or salt',
  35,
  null,
  array['veg'],
  false,
  false,
  id
from categories where slug = 'beverages'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Fresh Garden Salad',
  'Crisp lettuce, cucumbers, tomatoes, and onions with lemon dressing',
  50,
  null,
  array['veg', 'vegan', 'gluten-free'],
  false,
  false,
  id
from categories where slug = 'salads'
on conflict do nothing;

insert into menu_items (name, description, price, image_url, dietary_tags, is_popular, is_seasonal, category_id)
select
  'Butter Naan',
  'Soft leavened bread brushed with butter, baked in tandoor',
  40,
  null,
  array['veg'],
  true,
  false,
  id
from categories where slug = 'breads'
on conflict do nothing;

-- Packages
insert into packages (name, description, base_price, min_guests, max_guests, is_active) values
  ('Silver', 'Perfect for intimate celebrations with essential items', 350, 50, 200, true),
  ('Gold', 'Our most popular package with a complete dining experience', 550, 50, 500, true),
  ('Platinum', 'The ultimate luxury experience with premium selections', 850, 100, null, true)
on conflict do nothing;

-- ============================================
-- 7. CREATE ADMIN USER
-- Run this after creating the user via Supabase Auth UI or API
-- ============================================
-- First, create the user in Supabase Auth (Dashboard → Authentication → Users → Add User)
-- Email: admin@celebration.com
-- Password: Choose a strong password
--
-- Then run this to set the role to super_admin:
-- update public.users 
-- set role = 'super_admin' 
-- where id = (select id from auth.users where email = 'admin@celebration.com');

-- ============================================
-- DONE! Verify by checking tables in Supabase Dashboard
-- ============================================
