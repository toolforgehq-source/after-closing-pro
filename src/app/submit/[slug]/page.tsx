'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, CheckCircle, AlertTriangle, Loader2, Camera, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import type { Company, Home, TriageMetadata } from '@/lib/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  metadata?: TriageMetadata | null;
}

type IntakeStep = 'identify' | 'describe' | 'chat' | 'resolved' | 'submitted' | 'error';

export default function HomeownerIntakePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [home, setHome] = useState<Home | null>(null);
  const [step, setStep] = useState<IntakeStep>('identify');
  const [loading, setLoading] = useState(true);
  const [homeownerName, setHomeownerName] = useState('');
  const [homeownerEmail, setHomeownerEmail] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCompany() {
      const supabase = createClient();

      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (!companyData) {
        setLoading(false);
        return;
      }

      setCompany(companyData as Company);

      const homeId = searchParams.get('home');
      if (homeId) {
        const { data: homeData } = await supabase
          .from('homes')
          .select('*')
          .eq('id', homeId)
          .eq('company_id', companyData.id)
          .single();

        if (homeData) {
          setHome(homeData as Home);
          setHomeownerName((homeData as Home).homeowner_name);
          setHomeownerEmail((homeData as Home).homeowner_email);
          setStep('describe');
        }
      }

      setLoading(false);
    }

    loadCompany();
  }, [params.slug, searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    setStep('describe');
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) return; // Max 5 photos

    const newPhotos = [...photos, ...files].slice(0, 5);
    setPhotos(newPhotos);

    const newPreviews = newPhotos.map((f) => URL.createObjectURL(f));
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPhotoPreviews(newPreviews);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removePhoto(index: number) {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  }

  async function uploadPhotos(): Promise<string[]> {
    if (photos.length === 0) return [];

    const formData = new FormData();
    photos.forEach((file) => formData.append('files', file));

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.urls || [];
  }

  async function handleDescribeIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!issueDescription.trim() || !company) return;
    setSending(true);

    const userMessage: ChatMessage = { role: 'user', content: issueDescription };
    setMessages([userMessage]);
    setStep('chat');

    try {
      // Upload photos first
      const urls = await uploadPhotos();

      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company.id,
          home_id: home?.id,
          homeowner_name: homeownerName,
          homeowner_email: homeownerEmail,
          messages: [{ role: 'user', content: issueDescription }],
          photo_urls: urls,
        }),
      });

      const data = await res.json();
      setSessionId(data.session_id);
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        metadata: data.metadata,
      };
      setMessages([userMessage, aiMessage]);

      if (data.metadata?.recommended_action === 'escalate') {
        setStep('submitted');
      } else if (data.metadata?.recommended_action === 'resolve') {
        setStep('resolved');
      }
    } catch {
      setStep('error');
    }

    setSending(false);
  }

  async function handleSendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!currentInput.trim() || !company || sending) return;
    setSending(true);

    const updatedMessages = [...messages, { role: 'user' as const, content: currentInput }];
    setMessages(updatedMessages);
    setCurrentInput('');

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: company.id,
          home_id: home?.id,
          homeowner_name: homeownerName,
          homeowner_email: homeownerEmail,
          session_id: sessionId,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!sessionId) setSessionId(data.session_id);

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        metadata: data.metadata,
      };
      setMessages([...updatedMessages, aiMessage]);

      if (data.metadata?.recommended_action === 'escalate' || data.metadata?.recommended_action === 'create_ticket') {
        setStep('submitted');
      } else if (data.metadata?.recommended_action === 'resolve') {
        setStep('resolved');
      }
    } catch {
      setStep('error');
    }

    setSending(false);
  }

  async function handleConfirmResolved() {
    setStep('resolved');
  }

  async function handleNeedMoreHelp() {
    setCurrentInput("That didn't solve my issue. I still need help.");
    setTimeout(() => handleSendMessage(), 100);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center opacity-30"><Logo size="lg" variant="icon" /></div>
          <h1 className="mt-4 text-lg font-semibold text-gray-900">Page Not Found</h1>
          <p className="mt-1 text-sm text-gray-500">This warranty portal link is not valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" variant="icon" />
            <div>
              <p className="text-sm font-bold text-gray-900">{company.name}</p>
              <p className="text-xs text-gray-500">Warranty Support</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Step: Identify */}
        {step === 'identify' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Warranty Support</h1>
              <p className="mt-2 text-gray-600">
                Submit a warranty or maintenance request for your home.
              </p>
            </div>

            <form onSubmit={handleIdentify} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
              <Input
                id="name"
                label="Your Name"
                placeholder="John Smith"
                value={homeownerName}
                onChange={(e) => setHomeownerName(e.target.value)}
                required
              />
              <Input
                id="email"
                label="Your Email"
                type="email"
                placeholder="john@example.com"
                value={homeownerEmail}
                onChange={(e) => setHomeownerEmail(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          </div>
        )}

        {/* Step: Describe Issue */}
        {step === 'describe' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">What&apos;s Going On?</h1>
              <p className="mt-2 text-gray-600">
                Describe the issue and our AI assistant will help you.
              </p>
              {home && (
                <p className="mt-1 text-sm text-gray-400">{home.address}</p>
              )}
            </div>

            <form onSubmit={handleDescribeIssue} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
              <Textarea
                id="issue"
                label="Describe Your Issue"
                placeholder="e.g., The outlet in my bathroom doesn't work..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={4}
                required
              />

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photos <span className="text-gray-400 font-normal">(optional, up to 5)</span>
                </label>
                {photoPreviews.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {photoPreviews.map((preview, i) => (
                      <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white shadow-sm hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
                  >
                    <Camera className="h-4 w-4" />
                    {photos.length === 0 ? 'Add Photos' : 'Add More Photos'}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={sending}>
                <Send className="mr-2 h-4 w-4" /> Submit Issue
              </Button>
            </form>
          </div>
        )}

        {/* Step: AI Chat */}
        {(step === 'chat' || step === 'submitted' || step === 'resolved') && (
          <div className="space-y-4">
            {/* Chat messages */}
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                      msg.role === 'assistant' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="h-4 w-4 text-purple-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Resolution states */}
            {step === 'resolved' && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
                <h2 className="mt-3 text-lg font-semibold text-gray-900">Issue Resolved!</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Great, it looks like the issue was resolved. If it comes back, feel free to submit a new request.
                </p>
              </div>
            )}

            {step === 'submitted' && (
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-blue-500" />
                <h2 className="mt-3 text-lg font-semibold text-gray-900">Request Submitted</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Your warranty request has been sent to {company.name}. They&apos;ll review it and get back to you.
                </p>
              </div>
            )}

            {/* Chat input (only during active chat) */}
            {step === 'chat' && !sending && (
              <div className="space-y-3">
                {/* Quick action buttons after AI suggests troubleshooting */}
                {messages.length >= 2 && messages[messages.length - 1]?.role === 'assistant' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConfirmResolved}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      That fixed it!
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNeedMoreHelp}
                      className="flex-1"
                    >
                      Still need help
                    </Button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Button
                    type="submit"
                    disabled={!currentInput.trim()}
                    className="rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {step === 'error' && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
            <h2 className="mt-3 text-lg font-semibold text-gray-900">Something Went Wrong</h2>
            <p className="mt-1 text-sm text-gray-600">
              Please try again or contact {company.name} directly.
            </p>
            {company.phone && (
              <p className="mt-2 text-sm font-medium text-gray-900">{company.phone}</p>
            )}
            <Button className="mt-4" onClick={() => setStep('describe')}>
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 text-center">
        <p className="text-xs text-gray-400">Powered by After Closing Pro</p>
      </footer>
    </div>
  );
}
