-- Migration Script: User Sign Up & Data Isolation
-- Copy and run this script in the Supabase SQL Editor.

-- 1. Create a trigger to automatically create a profile in public.users when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.created_at, now()),
    COALESCE(new.updated_at, now())
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Add user_id column to existing tables with DEFAULT auth.uid() and add is_verified flag to users
-- If there's already data, it will default to the current active user calling the query, or you may manually update them.

-- Users Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Accounts Table
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.accounts DROP CONSTRAINT IF EXISTS accounts_name_key;
ALTER TABLE public.accounts DROP CONSTRAINT IF EXISTS accounts_user_id_name_key;
ALTER TABLE public.accounts ADD CONSTRAINT accounts_user_id_name_key UNIQUE (user_id, name);

-- Categories Table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_name_type_key;
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_user_id_name_type_key;
ALTER TABLE public.categories ADD CONSTRAINT categories_user_id_name_type_key UNIQUE (user_id, name, type);

-- Transactions Table
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- Saving Goals Table
ALTER TABLE public.saving_goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- Budgets Table
ALTER TABLE public.budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS budgets_category_id_year_month_key;
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS budgets_user_id_category_id_year_month_key;
ALTER TABLE public.budgets ADD CONSTRAINT budgets_user_id_category_id_year_month_key UNIQUE (user_id, category_id, year, month);

-- 3. Re-configure Row Level Security (RLS) policies for user data isolation
-- Enable RLS (already enabled, but good to ensure)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop old shared policies if they exist
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.accounts;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.categories;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.transactions;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.saving_goals;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.budgets;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.users;

-- Drop new policies if they already exist (avoids re-run errors)
DROP POLICY IF EXISTS "Allow users access to their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Allow users access to their own categories" ON public.categories;
DROP POLICY IF EXISTS "Allow users access to their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow users access to their own saving goals" ON public.saving_goals;
DROP POLICY IF EXISTS "Allow users access to their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Allow users access to their own profile" ON public.users;

-- Create new user isolation policies
CREATE POLICY "Allow users access to their own accounts" ON public.accounts
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users access to their own categories" ON public.categories
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users access to their own transactions" ON public.transactions
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users access to their own saving goals" ON public.saving_goals
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users access to their own budgets" ON public.budgets
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users access to their own profile" ON public.users
  FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
