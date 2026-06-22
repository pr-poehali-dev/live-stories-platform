const API = 'https://functions.poehali.dev/6fe0ed7f-236f-4e73-babc-9d20d7863341';

export interface Work {
  id: number;
  type: 'story' | 'book';
  title: string;
  cover_emoji: string;
  content: string;
  status: 'draft' | 'published';
  access: 'free' | 'paid';
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export async function listWorks(publishedOnly = false): Promise<Work[]> {
  const r = await fetch(`${API}?published=${publishedOnly ? '1' : '0'}`);
  const d = await r.json();
  return d.works || [];
}

export async function createWork(data: Partial<Work>): Promise<Work> {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create_work', ...data }),
  });
  const d = await r.json();
  return d.work;
}

export async function updateWork(id: number, data: Partial<Work>): Promise<Work> {
  const r = await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  const d = await r.json();
  return d.work;
}

export async function deleteWork(id: number): Promise<void> {
  await fetch(`${API}?id=${id}`, { method: 'DELETE' });
}

export async function subscribe(email: string, plan: string): Promise<boolean> {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'subscribe', email, plan }),
  });
  const d = await r.json();
  return !!d.subscribed;
}
