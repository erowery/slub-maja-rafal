/*
# Create photos table and storage bucket for wedding guest app

## Purpose
Stores metadata for photos uploaded by wedding guests: author name, image URL,
optional bingo task tag, and timestamp. Photos are stored in Supabase Storage.

## New Tables
- `photos`
  - `id` (uuid, primary key)
  - `author` (text, not null) — guest's name/signature
  - `image_url` (text, not null) — public URL of the photo in storage
  - `bingo_task_id` (integer, nullable) — links to a bingo challenge if photo was taken via bingo
  - `created_at` (timestamptz, default now)

## Storage
- Creates a public bucket `wedding-photos` for guest photo uploads.

## Security
- RLS enabled on `photos`.
- Public read/write (no auth) since this is a shared wedding guest app with no sign-in.
- Storage bucket is public for reads; writes use the anon key.
*/

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  image_url text NOT NULL,
  bingo_task_id integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_photos" ON photos;
CREATE POLICY "anon_select_photos" ON photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_photos" ON photos;
CREATE POLICY "anon_insert_photos" ON photos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_photos" ON photos;
CREATE POLICY "anon_delete_photos" ON photos FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_upload_wedding_photos" ON storage.objects;
CREATE POLICY "anon_upload_wedding_photos" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "anon_read_wedding_photos" ON storage.objects;
CREATE POLICY "anon_read_wedding_photos" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "anon_delete_wedding_photos" ON storage.objects;
CREATE POLICY "anon_delete_wedding_photos" ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'wedding-photos');
