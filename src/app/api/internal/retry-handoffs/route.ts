import { NextResponse } from 'next/server';
import { safeEqual } from '@/lib/security';
import { deliverFinanceHandoff, deliverSchoolSupportFinanceHandoff } from '@/server/finance-handoff';
import { releaseExpiredReservations } from '@/server/orders';
import { database } from '@/server/db';
import { PesapalClient, pesapalConfigFromEnv } from '@/lib/pesapal';
import { reconcilePendingPesapalPayments } from '@/server/pesapal-payments';

export const runtime = 'nodejs';

async function run(request: Request) {
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const expected = process.env.CRON_SECRET || process.env.INTERNAL_JOB_SECRET || '';
  if (!expected || !safeEqual(supplied, expected)) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  let pesapal = { checked: 0, updated: 0 };
  try {
    pesapal = await reconcilePendingPesapalPayments(new PesapalClient(pesapalConfigFromEnv()));
  } catch {
    // Payment configuration may intentionally remain disabled before launch.
  }
  const expiredReservations = await releaseExpiredReservations();
  const sql = database();
  const retail = await sql<{ order_id: string }[]>`
    SELECT order_id FROM website_handoffs
    WHERE (status IN ('pending','retry') OR (status = 'in_flight' AND locked_until < now()))
      AND attempts < 10 ORDER BY updated_at ASC LIMIT 20`;
  const support = await sql<{ support_id: string }[]>`
    SELECT support_id FROM website_support_handoffs
    WHERE (status IN ('pending','retry') OR (status = 'in_flight' AND locked_until < now()))
      AND attempts < 10 ORDER BY updated_at ASC LIMIT 20`;
  let deliveredRetail = 0;
  let deliveredSupport = 0;
  for (const row of retail) {
    try {
      const result = await deliverFinanceHandoff(row.order_id);
      if (result.delivered) deliveredRetail += 1;
    } catch { /* durable row remains queued */ }
  }
  for (const row of support) {
    try {
      const result = await deliverSchoolSupportFinanceHandoff(row.support_id);
      if (result.delivered) deliveredSupport += 1;
    } catch { /* durable row remains queued */ }
  }
  return NextResponse.json({
    expiredReservations,
    pesapal,
    attemptedRetail: retail.length,
    deliveredRetail,
    attemptedSupport: support.length,
    deliveredSupport,
  });
}

export const GET = run;
export const POST = run;
