// "My Stats" over WhatsApp — reuses the exact same data as the web
// dashboard's ROI table (v_monthly_enquiries), renders it as a chart, and
// sends it as an image. No new data, no new query — just a different
// delivery channel for what /api/businesses/:id/roi already returns.
import { query } from '../../db.js';
import { getEntitlement, hasMinPlan } from '../../auth/entitlement.js';
import { renderChart } from '../../clients/quickchart.js';
import { uploadImage } from '../../clients/storage.js';
import { sendText, sendImage } from '../../clients/whatsapp.js';
import { log } from '../../logger.js';

interface MonthlyRow {
  month: string;
  enquiries: number;
  demos_booked: number;
  leads_captured: number;
}

export async function sendStatsSnapshot(businessId: string, to: string): Promise<void> {
  const entitlement = await getEntitlement(businessId);
  if (!entitlement || !hasMinPlan(entitlement, 'starter')) {
    await sendText(to, 'This needs an active GrowLokal plan. Please renew to see your stats. 🙏');
    return;
  }

  const res = await query<MonthlyRow>(
    `SELECT month, enquiries, demos_booked, leads_captured
     FROM v_monthly_enquiries WHERE business_id = $1 ORDER BY month ASC LIMIT 6`,
    [businessId]
  );
  if (res.rows.length === 0) {
    await sendText(to, 'No enquiry data recorded yet — check back once your posts and profile start getting activity.');
    return;
  }

  const labels = res.rows.map((r) => new Date(r.month).toLocaleDateString('en-IN', { month: 'short' }));
  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Enquiries', data: res.rows.map((r) => r.enquiries), backgroundColor: '#2E9AA6' },
        { label: 'Demos Booked', data: res.rows.map((r) => r.demos_booked), backgroundColor: '#F97316' },
      ],
    },
    options: { title: { display: true, text: 'Your GrowLokal Performance' } },
  };

  const png = await renderChart(chartConfig);
  const imageUrl = png ? await uploadImage(png, `stats/${businessId}/${crypto.randomUUID()}.png`) : null;

  if (!imageUrl) {
    log.warn({ businessId }, 'stats chart render/upload failed — falling back to text summary');
    const latest = res.rows[res.rows.length - 1];
    await sendText(
      to,
      `📊 Your latest month: ${latest.enquiries} enquiries, ${latest.demos_booked} demos booked, ${latest.leads_captured} leads captured.`
    );
    return;
  }

  await sendImage(to, imageUrl, '📊 Here are your latest stats!');
}
