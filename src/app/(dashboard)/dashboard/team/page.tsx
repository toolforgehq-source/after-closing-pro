'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Users, UserPlus, Mail, Trash2 } from 'lucide-react';
import { PLANS } from '@/lib/types';
import type { Profile, Subscription } from '@/lib/types';
import { isAdminEmail, getAdminSubscription } from '@/lib/admin';

interface TeamInvite {
  id: string;
  email: string;
  status: 'pending' | 'accepted';
  created_at: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      setLoading(false);
      return;
    }

    setCompanyId(profile.company_id);

    const [membersResult, invitesResult, subResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: true }),
      supabase
        .from('team_invites')
        .select('*')
        .eq('company_id', profile.company_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', profile.company_id)
        .eq('status', 'active')
        .single(),
    ]);

    setMembers((membersResult.data as Profile[]) ?? []);
    setInvites((invitesResult.data as TeamInvite[]) ?? []);
    const sub = isAdminEmail(user.email)
      ? getAdminSubscription(profile.company_id)
      : (subResult.data as Subscription | null);
    setSubscription(sub);
    setLoading(false);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError('');
    setSuccess('');

    if (!companyId) return;

    // Check team member limit
    const plan = subscription?.plan as keyof typeof PLANS | undefined;
    const maxMembers = plan ? PLANS[plan].maxTeamMembers : 0;
    const currentCount = members.length + invites.length;

    if (!subscription) {
      setError('You need an active subscription to invite team members.');
      setInviting(false);
      return;
    }

    if (maxMembers > 0 && currentCount >= maxMembers) {
      setError(`Your ${PLANS[plan!].name} plan allows up to ${maxMembers} team members. Upgrade to add more.`);
      setInviting(false);
      return;
    }

    // Check if already a member or invited
    const alreadyMember = members.some(m => m.email === inviteEmail);
    const alreadyInvited = invites.some(i => i.email === inviteEmail);

    if (alreadyMember) {
      setError('This person is already on your team.');
      setInviting(false);
      return;
    }

    if (alreadyInvited) {
      setError('An invite has already been sent to this email.');
      setInviting(false);
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from('team_invites')
      .insert({
        company_id: companyId,
        email: inviteEmail,
        status: 'pending',
      });

    if (insertError) {
      setError(insertError.message);
      setInviting(false);
      return;
    }

    // Send invite email
    await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, companyId }),
    });

    setSuccess(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviting(false);
    loadTeam();
  }

  async function cancelInvite(inviteId: string) {
    const supabase = createClient();
    await supabase.from('team_invites').delete().eq('id', inviteId);
    loadTeam();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const plan = subscription?.plan as keyof typeof PLANS | undefined;
  const maxMembers = plan ? PLANS[plan].maxTeamMembers : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage who has access to your account
          {subscription && maxMembers > 0 && (
            <span className="ml-2 text-gray-400">
              ({members.length + invites.length}/{maxMembers} seats used)
            </span>
          )}
          {subscription && maxMembers < 0 && (
            <span className="ml-2 text-gray-400">
              ({members.length} members)
            </span>
          )}
        </p>
      </div>

      {/* Invite form */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">Invite Team Member</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="flex-1">
              <Input
                id="invite_email"
                type="email"
                placeholder="teammate@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" loading={inviting}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite
            </Button>
          </form>
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>
          )}
        </CardContent>
      </Card>

      {/* Current members */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">Members</h2>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No team members"
              description="Invite your first team member to give them access."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {member.role === 'builder_admin' ? 'Admin' : 'Member'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Pending Invites</h2>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{invite.email}</p>
                  </div>
                  <button
                    onClick={() => cancelInvite(invite.id)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
