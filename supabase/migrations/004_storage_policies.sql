-- Storage policies for issue-photos bucket
-- Allow anyone to upload (homeowners are not authenticated)
CREATE POLICY "Anyone can upload issue photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'issue-photos');

-- Allow anyone to view issue photos
CREATE POLICY "Anyone can view issue photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'issue-photos');
