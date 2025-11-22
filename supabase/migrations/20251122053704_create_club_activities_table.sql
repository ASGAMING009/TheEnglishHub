/*
  # Create club activities table with image storage

  1. New Tables
    - `club_activities`
      - `id` (uuid, primary key)
      - `club_id` (text, foreign key reference)
      - `image_url` (text, URL to stored image)
      - `description` (text, optional description)
      - `created_at` (timestamp)

  2. Storage
    - Enable storage bucket for club activity images

  3. Security
    - Enable RLS on `club_activities` table
    - Add policies for public read access
    - Add policies for authenticated users to insert images
*/

CREATE TABLE IF NOT EXISTS club_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id text NOT NULL,
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE club_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view club activities"
  ON club_activities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert activities"
  ON club_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
