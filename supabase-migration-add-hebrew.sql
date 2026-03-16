-- Migration: Add Hebrew translation fields to properties table
-- Run this in Supabase SQL Editor for existing databases

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS title_he TEXT,
  ADD COLUMN IF NOT EXISTS description_he TEXT;
