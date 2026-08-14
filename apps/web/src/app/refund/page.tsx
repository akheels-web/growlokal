import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy — GrowLokal',
  description: '7-day money-back guarantee, refund process, and subscription cancellation terms for GrowLokal.',
};

export default function RefundPage() {
  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#033540' }}>
      {/* ─── NAVIGATION HEADER ─── */}
      <header className="nav nav--scrolled" style={{ position: 'sticky' }}>
        <div className="nav-content">
          <Link href="/" className="nav-brand">
            Grow<span>Lokal</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/#pricing" className="nav-link">Pricing</Link>
            <Link href="/login" className="btn-nav">Owner Sign In →</Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 90px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#70BF63',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            100% Risk-Free Guarantee
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
              🛡️ 7-Day Money-Back Guarantee
            </h2>
            <p style={{ color: '#033540' }}>
              We want you to feel 100% confident in GrowLokal. If you subscribe to any paid plan (<strong>Starter, Growth, or Pro</strong>) and are not completely satisfied with your Google visibility improvements or AI features within the first <strong>7 days</strong> of payment, we will refund <strong>100% of your money — no questions asked</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>1. Free Instant Audit (No Risk)</h2>
            <p>
              The GrowLokal Google Business Audit is <strong>100% Free forever</strong>. You do not need to enter a credit card, debit card, or payment details to receive your instant report and baseline score.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>2. Subscription Cancellation Terms</h2>
            <p>
              You can cancel your Growth Plan subscription at any time without long-term contracts, lock-in periods, or cancellation penalties:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Self-Service Dashboard:</strong> Cancel directly from your owner dashboard under Account Settings.</li>
              <li><strong>1-Click WhatsApp Cancellation:</strong> Message our support team on WhatsApp requesting cancellation, and it will be processed instantly.</li>
              <li><strong>Access Until Cycle End:</strong> Upon cancellation, your AI automation features will remain fully active until the end of your current paid billing period.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>3. How Refund Requests are Processed</h2>
            <p>To request a refund under our 7-Day Money-Back Guarantee:</p>
            <ol style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Send a brief email to <strong>support@growlokal.com</strong> or message us on WhatsApp (+91 98765 43210) within 7 days of payment.</li>
              <li>Include your registered mobile number and business name.</li>
              <li>Once verified, your refund will be initiated immediately.</li>
            </ol>
            <p style={{ marginTop: '12px' }}>
              Refunds are credited directly back to your original payment method (UPI account, Credit/Debit Card, or Net Banking) within <strong>5 to 7 business days</strong> depending on your bank.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>4. WhatsApp Broadcast Campaign Credits</h2>
            <p>
              For prepaid WhatsApp campaign broadcast credits, unused message credits remain valid indefinitely and roll over month-to-month. If you decide to close your account, any unspent broadcast credit balance can be refunded to your original payment source.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>5. Contact Us for Billing Help</h2>
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
