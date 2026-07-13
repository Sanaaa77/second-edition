-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  birth_date date,
  nationality text default 'Iranian',
  current_city text,
  gpa numeric(4,2),
  budget numeric,
  preferred_language text check (preferred_language in ('English', 'Turkish', 'Mixed')),
  preferred_major text,
  target_degree text,
  avatar_url text,
  onboarding_completed boolean default false,
  current_step integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Cities Table
create table if not exists public.cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text unique not null,
  living_cost_index text check (living_cost_index in ('Low', 'Medium', 'High')),
  population text,
  climate text,
  description text,
  image_url text,
  coords jsonb, -- {x, y} for map
  rent text,
  dorm text,
  transport text,
  food text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Universities Table
create table if not exists public.universities (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references public.cities(id) on delete set null,
  name text not null,
  slug text unique not null,
  type text check (type in ('Public', 'Private')),
  ranking_global integer,
  ranking_local integer,
  logo_url text,
  hero_image_url text,
  description text,
  dormitory_available boolean default true,
  verified boolean default false,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Programs Table
create table if not exists public.programs (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  name text not null,
  faculty text,
  degree_level text, -- Associate, Bachelor, Master, PhD, etc.
  language text check (language in ('Turkish', 'English', 'Mixed')),
  duration_years integer,
  tuition_fee numeric,
  currency text default 'USD',
  requirements text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Scholarships Table
create table if not exists public.scholarships (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  name text not null,
  coverage_percentage numeric check (coverage_percentage >= 0 and coverage_percentage <= 100),
  description text,
  requirements text[],
  deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create Applications Table
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  university_id uuid references public.universities(id) on delete set null,
  program_id uuid references public.programs(id) on delete set null,
  status text default 'Draft' check (status in ('Draft', 'Submitted', 'Reviewing', 'Accepted', 'Rejected', 'Visa_Processing', 'Completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Create Application Status History
create table if not exists public.application_status_history (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.applications(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Create Documents Table
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null,
  file_url text not null,
  status text default 'Pending' check (status in ('Pending', 'Verified', 'Rejected')),
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Create Favorites Table
create table if not exists public.favorites (
  profile_id uuid references public.profiles(id) on delete cascade,
  university_id uuid references public.universities(id) on delete cascade,
  primary key (profile_id, university_id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Create Tasks Table
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  label text not null,
  status text default 'pending' check (status in ('completed', 'pending', 'locked')),
  category text,
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Create Notifications Table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  read boolean default false,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. RLS POLICIES

-- Profiles: Users can only see and update their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Public Data: Everyone can read cities, universities, programs, scholarships
alter table public.cities enable row level security;
create policy "Public can view cities" on public.cities for select using (true);

alter table public.universities enable row level security;
create policy "Public can view universities" on public.universities for select using (true);

alter table public.programs enable row level security;
create policy "Public can view programs" on public.programs for select using (true);

alter table public.scholarships enable row level security;
create policy "Public can view scholarships" on public.scholarships for select using (true);

-- User Data: Users can only view/manage their own applications, documents, tasks, etc.
alter table public.applications enable row level security;
create policy "Users can manage own applications" on public.applications for all using (auth.uid() = profile_id);

alter table public.documents enable row level security;
create policy "Users can manage own documents" on public.documents for all using (auth.uid() = profile_id);

alter table public.favorites enable row level security;
create policy "Users can manage own favorites" on public.favorites for all using (auth.uid() = profile_id);

alter table public.tasks enable row level security;
create policy "Users can manage own tasks" on public.tasks for all using (auth.uid() = profile_id);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = profile_id);

-- 14. Functions & Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', '', 'student');
  return new;
end;
$$ language plpgsql security definer;

-- Note: Trigger creation should be done manually or via a separate script to avoid conflicts with existing logic
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
