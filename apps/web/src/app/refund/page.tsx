import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Refund & Cancellation Policy — GrowLokal',
  description: '7-day money-back guarantee, refund process, and subscription cancellation terms for GrowLokal.',
};

export default function RefundPage() {
  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#033540' }}>
      {/* ─── UNIFIED NAVIGATION HEADER ─── */}
      <Navbar isSticky />

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Legal & Trust', href: '/#footer' },
            { label: 'Refund & Cancellation Policy' },
          ]}
        />
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#70BF63',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            100% Risk-Free First Payment
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
            Refund &amp; Cancellation Policy
          </h1>
          <p style={{ color: '#5e7984', fontSize: '0.95rem' }}>
            Last Updated: July 30, 2026 • Transparent &amp; Customer-First
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.98rem', lineHeight: '1.75', color: '#0E4459' }}>
          <section style={{
            padding: '24px',
            background: 'rgba(112, 191, 99, 0.1)',
            border: '1.5px solid rgba(112, 191, 99, 0.4)',
            borderRadius: '16px'
          }}>
            <h2 style={{ fontSize: '1.25rem', color: '#033540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡️ 7-Day Money-Back Guarantee — First Payment Only
            </h2>
            <p style={{ color: '#033540' }}>
              We want you to feel 100% confident trying GrowLokal. If you subscribe to any paid plan (<strong>Starter, Growth, or Pro</strong>) for the <strong>first time</strong> and are not completely satisfied within <strong>7 days</strong> of that first payment, we will refund <strong>100% of your money — no questions asked</strong>.
            </p>
            <p style={{ marginTop: '10px', color: '#033540' }}>
              This guarantee applies to your <strong>first subscription payment only</strong>. Subsequent renewal charges are covered by our standard cancellation terms below (Section 2), not this guarantee — you can always cancel auto-renewal before your next billing date to avoid being charged again.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>1. Free Instant Audit (No Risk)</h2>
            <p>
              The GrowLokal Google Business Audit is <strong>100% free forever</strong>. You do not need to enter a credit card, debit card, or payment details to receive your instant report and baseline score.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>2. Subscription Cancellation Terms</h2>
            <p>
              You can cancel auto-renewal at any time, with no long-term contracts, lock-in periods, or cancellation penalties:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Self-Service Dashboard:</strong> cancel directly from your owner dashboard under Account Settings.</li>
              <li><strong>WhatsApp Cancellation:</strong> message our support team requesting cancellation.</li>
              <li><strong>Access Until Cycle End:</strong> once cancelled, your paid features remain active until the end of your current billing period — you're only charged for time you can still use.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>3. How Refund Requests Are Processed</h2>
            <p>To request a refund under the 7-Day Money-Back Guarantee (first payment only):</p>
            <ol style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Email <strong>support@growlokal.com</strong> or message us on WhatsApp (+91 98765 43210) within 7 days of your first payment.</li>
              <li>Include your registered mobile number and business name.</li>
              <li>Once verified, your refund is initiated immediately.</li>
            </ol>
            <p style={{ marginTop: '12px' }}>
              Refunds are credited to your original payment method (UPI, Credit/Debit Card, or Net Banking) within <strong>5 to 7 business days</strong>, depending on your bank.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>4. What Happens to Your Account After a Refund</h2>
            <p>
              Once a refund is processed, your subscription is cancelled and your account is restricted to the same limited view available to unsubscribed accounts — paid features stop working immediately. Your business profile, leads, and historical data are preserved (not deleted), so you can resubscribe later without losing anything.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>5. WhatsApp Broadcast Campaign Credits</h2>
            <p>
              Prepaid WhatsApp campaign credits remain valid and roll over month-to-month. If you close your account, any unspent credit balance can be refunded to your original payment source.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>6. Contact Us for Billing Help</h2>
            <div style={{ marginTop: '12px', padding: '16px', background: '#F2F2F2', borderRadius: '12px', fontSize: '0.9rem' }}>
              <strong>GrowLokal Billing &amp; Refunds Support</strong><br />
              Email: support@growlokal.com<br />
              WhatsApp Billing Support: +91 98765 43210<br />
              Hours: Mon - Sat, 9:00 AM - 7:00 PM IST
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#5e7984' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/terms">Terms of Service</Link> • <Link href="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
