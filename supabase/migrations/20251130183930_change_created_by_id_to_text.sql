/*
  # Change created_by_id column from UUID to TEXT

  ## Overview
  This migration changes the `created_by_id` column in the `vehicles` table from UUID to TEXT
  to support custom user ID formats.

  ## Changes
  1. Drop policies that depend on created_by_id
  2. Alter the `created_by_id` column type from UUID to TEXT
  3. Recreate the policies with the text-based column

  ## Notes
  - Existing UUID data will be converted to text automatically
  - Policies are recreated to maintain security
*/

-- Drop policies that depend on created_by_id
DROP POLICY IF EXISTS "Users can update own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete own vehicles" ON vehicles;

-- Change the created_by_id column type from UUID to TEXT
ALTER TABLE vehicles ALTER COLUMN created_by_id TYPE text USING created_by_id::text;

-- Recreate the policies with text-based column
CREATE POLICY "Users can update own vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by_id)
  WITH CHECK (auth.uid()::text = created_by_id);

CREATE POLICY "Users can delete own vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by_id);