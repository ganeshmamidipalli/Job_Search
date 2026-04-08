import { kv } from '@vercel/kv';

export interface AppEntry {
  id: string;
  date: string;
  company: string;
  role: string;
  score: number;
  archetype: string;
  status: 'evaluated' | 'applied' | 'not-applied';
  reason?: string;
  resumeContent?: string;
  resumeFilename?: string;
  reportContent?: string;
  createdAt: number;
}

// GET: list all applications
export async function GET() {
  try {
    const apps = await kv.lrange<AppEntry>('applications', 0, -1);
    return Response.json({ apps: apps || [] });
  } catch {
    return Response.json({ apps: [], kvError: true });
  }
}

// POST: add new application
export async function POST(req: Request) {
  try {
    const entry: AppEntry = await req.json();
    entry.id = `app-${Date.now()}`;
    entry.createdAt = Date.now();

    // Check for duplicate company+role
    const existing = await kv.lrange<AppEntry>('applications', 0, -1);
    const dup = (existing || []).find(
      (a) => a.company === entry.company && a.role === entry.role
    );
    if (dup) {
      return Response.json({ app: dup, duplicate: true });
    }

    await kv.lpush('applications', entry);
    return Response.json({ app: entry });
  } catch (err) {
    return Response.json({ error: String(err), kvError: true }, { status: 500 });
  }
}

// PATCH: update status (applied / not-applied with reason)
export async function PATCH(req: Request) {
  try {
    const { id, status, reason } = await req.json();
    const apps = await kv.lrange<AppEntry>('applications', 0, -1);
    if (!apps) return Response.json({ error: 'No applications' }, { status: 404 });

    const idx = apps.findIndex((a) => a.id === id);
    if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });

    apps[idx].status = status;
    if (reason) apps[idx].reason = reason;

    // Rebuild the list (KV doesn't support index update)
    await kv.del('applications');
    for (const app of apps.reverse()) {
      await kv.lpush('applications', app);
    }

    return Response.json({ app: apps[idx] });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
