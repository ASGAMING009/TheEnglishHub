/*
  # Add title and description to club_activities, create comments table

  1. Modified Tables
    - `club_activities`
      - Add `title` (text) for post title
      - Add full `description` (text) for post description

  2. New Tables
    - `activity_comments`
      - `id` (uuid, primary key)
      - `activity_id` (uuid, foreign key to club_activities)
      - `comment_text` (text)
      - `created_at` (timestamp)

  3. Security
    - Enable RLS on `activity_comments` table
    - Add policies for public read access to comments
    - Add policies for authenticated users to insert comments
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'club_activities' AND column_name = 'title'
  ) THEN
    ALTER TABLE club_activities ADD COLUMN title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'club_activities' AND column_name = 'description'
  ) THEN
    ALTER TABLE club_activities ADD COLUMN description text;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS activity_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES club_activities(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON activity_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON activity_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
