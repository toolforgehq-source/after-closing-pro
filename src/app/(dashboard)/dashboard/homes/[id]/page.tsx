'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import type { Home, Ticket, Company } from '@/lib/types';
import { TICKET_STATUS_LABELS, TICKET_STATUS_COLORS } from '@/lib/types';
import { formatDate, timeAgo, isWarrantyActive } from '@/lib/utils';

export default function HomeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [home, setHome] = useState<Home | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

      if (!profile?.company_id) return;

      const [homeResult, ticketsResult, companyResult] = await Promise.all([
        supabase.from('homes').select('*').eq('id', params.id).single(),
        supabase
          .from('tickets')
          .select('*')
          .eq('home_id', params.id as string)
          .order('created_at', { ascending: false }),
        supabase.from('companies').select('*').eq('id', profile.company_id).single(),
      ]);

      setHome(homeResult.data as Home | null);
      setTickets((ticketsResult.data as Ticket[]) ?? []);
      setCompany(companyResult.data as Company | null);
      setLoading(false);
    }

    loadData();
  }, [params.id]);

  function copyIntakeUrl() {
    if (!home || !company) return;
    const url = `${window.location.origin}/submit/${company.slug}?home=${home.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!home) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Home not found</p>
        <Link href="/dashboard/homes">
          <Button variant="outline" className="mt-4">Back to Homes</Button>
        </Link>
      </div>
    );
  }

  const active = isWarrantyActive(home.warranty_end_date);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{home.address}</h1>
          <p className="text-sm text-gray-500">
            {home.city}, {home.state} {home.zip}
          </p>
        </div>
        <Badge variant={active ? 'success' : 'default'}>
          {active ? 'Warranty Active' : 'Warranty Expired'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Intake URL */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">Homeowner Intake Link</h2>
              <p className="text-xs text-gray-500">Share this link with the homeowner to submit warranty requests</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {company
                    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/submit/${company.slug}?home=${home.id}`
                    : '...'}
                </code>
                <Button variant="outline" size="sm" onClick={copyIntakeUrl}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                {company && (
                  <Link href={`/submit/${company.slug}?home=${home.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tickets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Tickets ({tickets.length})
                </h2>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {tickets.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No warranty tickets yet
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {tickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                        <p className="text-xs text-gray-500">{timeAgo(ticket.created_at)}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          TICKET_STATUS_COLORS[ticket.status]
                        }`}
                      >
                        {TICKET_STATUS_LABELS[ticket.status]}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">Homeowner</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{home.homeowner_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${home.homeowner_email}`} className="text-sm text-blue-600 hover:underline">
                  {home.homeowner_email}
                </a>
              </div>
              {home.homeowner_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${home.homeowner_phone}`} className="text-sm text-blue-600 hover:underline">
                    {home.homeowner_phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">Warranty</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Closing Date</p>
                  <p className="text-sm text-gray-900">{formatDate(home.closing_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Warranty Period</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(home.warranty_start_date)} &ndash; {formatDate(home.warranty_end_date)}
                  </p>
                </div>
              </div>
              {home.model_name && (
                <div>
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="text-sm text-gray-900">{home.model_name}</p>
                </div>
              )}
              {home.notes && (
                <div>
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-sm text-gray-700">{home.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
