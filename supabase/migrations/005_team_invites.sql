-- Team invites table
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Company members can view invites for their company
CREATE POLICY "Company members can view invites"
  ON team_invites FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Company admins can insert invites
CREATE POLICY "Company admins can insert invites"
  ON team_invites FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'builder_admin'
    )
  );

-- Company admins can delete invites
CREATE POLICY "Company admins can delete invites"
  ON team_invites FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'builder_admin'
    )
  );

-- Company admins can update invites (mark as accepted)
CREATE POLICY "Company admins can update invites"
  ON team_invites FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );
