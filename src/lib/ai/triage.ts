import OpenAI from 'openai';
import { TRIAGE_SYSTEM_PROMPT } from './prompts';
import type { TriageMetadata } from '@/lib/types';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
  return openaiClient;
}

export interface TriageChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TriageResponse {
  message: string;
  metadata: TriageMetadata | null;
}

function extractMetadata(content: string): TriageMetadata | null {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[1]) as TriageMetadata;
  } catch {
    return null;
  }
}

function cleanResponseMessage(content: string): string {
  return content.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
}

export async function runTriage(
  messages: TriageChatMessage[],
  companyContext?: {
    name: string;
    warrantyPeriodMonths: number;
    emergencyInstructions?: string;
    coverageContext?: string;
  }
): Promise<TriageResponse> {
  let systemPrompt = TRIAGE_SYSTEM_PROMPT;

  if (companyContext) {
    systemPrompt += `\n\nBUILDER CONTEXT:
- Builder company: ${companyContext.name}
- Standard warranty period: ${companyContext.warrantyPeriodMonths} months
${companyContext.emergencyInstructions ? `- Emergency instructions: ${companyContext.emergencyInstructions}` : ''}
${companyContext.coverageContext ? `\nWARRANTY COVERAGE TERMS:\n${companyContext.coverageContext}` : ''}`;
  }

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = completion.choices[0]?.message?.content ?? '';
  const metadata = extractMetadata(content);
  const message = cleanResponseMessage(content);

  return { message, metadata };
}
