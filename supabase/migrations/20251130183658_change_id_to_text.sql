/*
  # Change vehicles ID column from UUID to TEXT

  ## Overview
  This migration changes the `id` column in the `vehicles` table from UUID to TEXT
  to support custom ID formats from CSV imports.

  ## Changes
  1. Drop the existing UUID default constraint
  2. Alter the `id` column type from UUID to TEXT
  3. Maintain the primary key constraint

  ## Notes
  - Existing UUID data will be converted to text automatically
  - This allows importing vehicles with custom ID formats from CSV files
*/

-- Drop the default UUID generation constraint
ALTER TABLE vehicles ALTER COLUMN id DROP DEFAULT;

-- Change the id column type from UUID to TEXT
ALTER TABLE vehicles ALTER COLUMN id TYPE text USING id::text;

-- The primary key constraint remains intact
-- No need to recreate it as it persists through the type change