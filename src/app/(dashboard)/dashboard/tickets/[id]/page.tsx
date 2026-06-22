'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  ArrowLeft,
  Bot,
  User,
  Wrench,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import type { Ticket, TicketMessage, Trade, TicketStatus } from '@/lib/types';
import {
  URGENCY_COLORS,
  URGENCY_LABELS,
  CATEGORY_LABELS,
} from '@/lib/types';
import { formatDateTime, timeAgo } from '@/lib/utils';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTicketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadTicketData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) return;

    const [ticketResult, messagesResult, tradesResult] = await Promise.all([
      supabase
        .from('tickets')
        .select('*, home:homes(*), trade:trades(*)')
        .eq('id', params.id)
        .single(),
      supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', params.id as string)
        .order('created_at', { ascending: true }),
      supabase
        .from('trades')
        .select('*')
        .eq('company_id', profile.company_id),
    ]);

    setTicket(ticketResult.data as Ticket | null);
    setMessages((messagesResult.data as TicketMessage[]) ?? []);
    setTrades((tradesResult.data as Trade[]) ?? []);
    setLoading(false);
  }

  async function handleStatusChange(newStatus: TicketStatus) {
    if (!ticket) return;
    setUpdating(true);
    const supabase = createClient();
    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    await supabase.from('tickets').update(updates).eq('id', ticket.id);
    setTicket({ ...ticket, status: newStatus });
    setUpdating(false);
  }

  async function handleAssignTrade(tradeId: string) {
    if (!ticket) return;
    setUpdating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('tickets')
      .update({
        trade_id: tradeId,
        status: 'assigned_to_trade',
        assigned_by: user?.id,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticket.id);

    const { data: trade } = await supabase.from('trades').select('*').eq('id', tradeId).single();
    setTicket({
      ...ticket,
      trade_id: tradeId,
      status: 'assigned_to_trade',
      trade: trade as Trade,
    });
    setUpdating(false);
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !ticket) return;
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user!.id)
      .single();

    const { data: msg } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        sender_type: 'builder',
        sender_name: profile?.full_name ?? 'Builder',
        message: newMessage.trim(),
        is_internal: false,
      })
      .select()
      .single();

    if (msg) setMessages([...messages, msg as TicketMessage]);
    setNewMessage('');
    setSending(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ticket not found</p>
        <Link href="/dashboard/tickets">
          <Button variant="outline" className="mt-4">Back to Tickets</Button>
        </Link>
      </div>
    );
  }

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'needs_review', label: 'Needs Review' },
    { value: 'assigned_to_trade', label: 'Assigned to Trade' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_on_homeowner', label: 'Waiting on Homeowner' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' },
    { value: 'not_warranty', label: 'Not Warranty' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
          <p className="text-sm text-gray-500">
            {ticket.home?.address} &middot; Created {timeAgo(ticket.created_at)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          {ticket.ai_summary && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-500" />
                  <h2 className="text-sm font-semibold text-gray-900">AI Summary</h2>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{ticket.ai_summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.ai_warranty_likelihood && (
                    <Badge variant={ticket.ai_warranty_likelihood === 'likely_warranty' ? 'info' : 'warning'}>
                      {ticket.ai_warranty_likelihood.replace(/_/g, ' ')}
                    </Badge>
                  )}
                  {ticket.ai_trade_recommendation && (
                    <Badge variant="default">Suggested: {ticket.ai_trade_recommendation}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Homeowner's original message */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <h2 className="text-sm font-semibold text-gray-900">Homeowner&apos;s Report</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{ticket.homeowner_message}</p>
              {ticket.location && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {ticket.location}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages / Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">Activity</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">No messages yet</p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender_type === 'builder' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                      msg.sender_type === 'ai'
                        ? 'bg-purple-100'
                        : msg.sender_type === 'builder'
                        ? 'bg-blue-100'
                        : msg.sender_type === 'trade'
                        ? 'bg-orange-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {msg.sender_type === 'ai' ? (
                      <Bot className="h-4 w-4 text-purple-600" />
                    ) : msg.sender_type === 'trade' ? (
                      <Wrench className="h-4 w-4 text-orange-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sender_type === 'builder'
                        ? 'bg-blue-50'
                        : msg.sender_type === 'ai'
                        ? 'bg-purple-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">{msg.sender_name}</span>
                      <span className="text-xs text-gray-400">{timeAgo(msg.created_at)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}

              {/* Reply box */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  loading={sending}
                  size="sm"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Status</label>
                <Select
                  options={statusOptions}
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Urgency</label>
                <p className="mt-1">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${URGENCY_COLORS[ticket.urgency]}`}>
                    {URGENCY_LABELS[ticket.urgency]}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Category</label>
                <p className="mt-1 text-sm text-gray-900">{CATEGORY_LABELS[ticket.category]}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Assign Trade</label>
                <Select
                  options={trades.map((t) => ({ value: t.id, label: `${t.name} (${t.company_name})` }))}
                  value={ticket.trade_id ?? ''}
                  onChange={(e) => handleAssignTrade(e.target.value)}
                  placeholder="Select a trade..."
                  className="mt-1"
                />
              </div>

              {ticket.trade && (
                <div className="rounded-lg bg-orange-50 p-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-900">{ticket.trade.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{ticket.trade.company_name}</p>
                  <p className="text-xs text-gray-500">{ticket.trade.email}</p>
                  {ticket.trade.phone && <p className="text-xs text-gray-500">{ticket.trade.phone}</p>}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500">Created</label>
                <p className="mt-1 text-sm text-gray-900">{formatDateTime(ticket.created_at)}</p>
              </div>

              {ticket.completed_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Completed</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(ticket.completed_at)}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                {ticket.homeowner_signoff ? (
                  <Badge variant="success">Homeowner signed off</Badge>
                ) : (
                  <Badge variant="warning">Pending sign-off</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              {ticket.status !== 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('completed')}
                  loading={updating}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Mark Complete
                </Button>
              )}
              {ticket.status !== 'not_warranty' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('not_warranty')}
                  loading={updating}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  Not Warranty
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
