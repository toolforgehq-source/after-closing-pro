'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Ticket as TicketIcon,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import type { Ticket } from '@/lib/types';
import { TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, URGENCY_COLORS, URGENCY_LABELS } from '@/lib/types';
import { timeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [homeCount, setHomeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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

      const [ticketsResult, homesResult] = await Promise.all([
        supabase
          .from('tickets')
          .select('*, home:homes(*), trade:trades(*)')
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('homes')
          .select('id', { count: 'exact' })
          .eq('company_id', profile.company_id),
      ]);

      setTickets((ticketsResult.data as Ticket[]) ?? []);
      setHomeCount(homesResult.count ?? 0);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const openTickets = tickets.filter(
    (t) => !['completed', 'closed', 'not_warranty', 'ai_resolved'].includes(t.status)
  );
  const urgentTickets = tickets.filter((t) => t.urgency === 'emergency' || t.urgency === 'high');
  const aiResolved = tickets.filter((t) => t.status === 'ai_resolved');
  const needsReview = tickets.filter((t) => t.status === 'needs_review');
  const recentTickets = tickets.slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your warranty activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Open Tickets" value={openTickets.length} icon={TicketIcon} />
        <StatsCard title="Active Homes" value={homeCount} icon={Home} />
        <StatsCard title="Urgent Issues" value={urgentTickets.length} icon={AlertTriangle} />
        <StatsCard title="AI Resolved" value={aiResolved.length} icon={Bot} />
      </div>

      {needsReview.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <h2 className="text-base font-semibold text-gray-900">
                  Needs Your Review ({needsReview.length})
                </h2>
              </div>
              <Link href="/dashboard/tickets?status=needs_review">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {needsReview.slice(0, 5).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{ticket.title}</p>
                    <p className="text-xs text-gray-500">
                      {ticket.home?.address} &middot; {timeAgo(ticket.created_at)}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${URGENCY_COLORS[ticket.urgency]}`}>
                      {URGENCY_LABELS[ticket.urgency]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Tickets</h2>
            <Link href="/dashboard/tickets">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentTickets.length === 0 ? (
            <EmptyState
              icon={TicketIcon}
              title="No tickets yet"
              description="When homeowners submit issues, they'll appear here."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{ticket.title}</p>
                    <p className="text-xs text-gray-500">
                      {ticket.home?.address} &middot; {timeAgo(ticket.created_at)}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TICKET_STATUS_COLORS[ticket.status]}`}>
                      {TICKET_STATUS_LABELS[ticket.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">You&apos;re all set!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start by adding your homes and sharing the warranty portal link with homeowners.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/dashboard/homes/new">
                <Button>Add Your First Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
