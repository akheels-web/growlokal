// QuickChart (open source, self-hostable — see config.ts) renders a Chart.js
// config into a PNG. Best-effort: returns null on any failure, matching
// clients/image.ts's pattern — a chart outage should never crash a WhatsApp
// reply, just fall back to a text message.
import { request } from 'undici';
import { config } from '../config.js';
import { log } from '../logger.js';

export async function renderChart(chartConfig: object, width = 600, height = 400): Promise<Buffer | null> {
  try {
    const res = await request(`${config.QUICKCHART_BASE_URL}/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart: chartConfig, width, height, backgroundColor: 'white', format: 'png' }),
    });
    if (res.statusCode >= 400) {
      log.error({ status: res.statusCode }, 'QuickChart render failed');
      return null;
    }
    const buf = Buffer.from(await res.body.arrayBuffer());
    return buf.length ? buf : null;
  } catch (err) {
    log.error({ err }, 'QuickChart exception');
    return null;
  }
}
