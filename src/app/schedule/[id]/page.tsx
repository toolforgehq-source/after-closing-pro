import { createAdminClient } from '@/lib/supabase/admin';
import { Logo } from '@/components/ui/logo';
import { formatSlot } from '@/lib/schedule';
import ProposeForm from './propose-form';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
  searchParams: { token?: string };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-4">
          <Logo size="sm" variant="icon" />
          <p className="text-sm font-bold text-gray-900">After Closing Pro</p>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-8">{children}</div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Shell>
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Link not available</h1>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
      </div>
    </Shell>
  );
}

export default async function SchedulePage({ params, searchParams }: PageProps) {
  const token = searchParams.token;
  if (!token) return <ErrorState message="This scheduling link is missing its access token." />;

  const supabase = createAdminClient();
  const { data: ticket } = await supabase
    .from('tickets')
    .select('id, schedule_token, schedule_status, scheduled_slot, title, home:homes(address, homeowner_name), trade:trades(name)')
    .eq('id', params.id)
    .single();

  if (!ticket || ticket.schedule_token !== token) {
    return <ErrorState message="This scheduling link is invalid or has expired." />;
  }

  const home = Array.isArray(ticket.home) ? ticket.home[0] : ticket.home;

  if (ticket.schedule_status === 'confirmed' && ticket.scheduled_slot) {
    return (
      <Shell>
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Appointment already confirmed</h1>
          <p className="mt-2 text-sm text-gray-600">
            This visit is scheduled for <strong>{formatSlot(ticket.scheduled_slot)}</strong>.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Propose Appointment Times</h1>
        <p className="mt-2 text-gray-600">Pick 1&ndash;3 times that work for you. The homeowner will confirm one.</p>
      </div>
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{ticket.title}</h2>
        {home?.address && <p className="mt-0.5 text-sm text-gray-500">{home.address}</p>}
        {home?.homeowner_name && <p className="text-sm text-gray-500">Homeowner: {home.homeowner_name}</p>}
        <div className="mt-5">
          <ProposeForm ticketId={params.id} token={token} />
        </div>
      </div>
    </Shell>
  );
}
