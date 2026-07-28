-- Migration: Add account_id to saving_goals
-- Run this in your Supabase SQL Editor

ALTER TABLE public.saving_goals 
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL;
