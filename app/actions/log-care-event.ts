'use server';

export type CareEventType = 'feed' | 'diaper' | 'sleep' | 'nudge';

export interface LogCareEventInput {
  caregiverId: string;
  type: CareEventType;
  note?: string;
  occurredAt?: Date;
}

export interface LoggedCareEvent {
  id: string;
  caregiverId: string;
  type: CareEventType;
  note?: string;
  occurredAt: Date;
  status: 'queued' | 'synced';
}

export async function logCareEvent(input: LogCareEventInput): Promise<LoggedCareEvent> {
  if (!input.caregiverId.trim()) {
    throw new Error('caregiverId is required to log an event');
  }

  const occurredAt = input.occurredAt ?? new Date();

  return {
    id: `${input.caregiverId}-${occurredAt.getTime()}`,
    caregiverId: input.caregiverId,
    type: input.type,
    note: input.note,
    occurredAt,
    status: 'queued',
  };
}
