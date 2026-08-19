import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Terms of Service — GrowLokal',
  description: 'Terms and conditions governing the use of GrowLokal AI Marketing Platform for South Indian Local Businesses.',
};

export default function TermsPage() {
  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827' }}>
      {/* ─── UNIFIED NAVIGATION HEADER ─── */}
      <Navbar isSticky />

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Legal & Trust', href: '/#footer' },
            { label: 'Terms of Service' },
          ]}
        />
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#175fab',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Legal Agreement
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Last Updated: July 30, 2026 • Effective Immediately
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.98rem', lineHeight: '1.75', color: '#0B1020' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>1. Introduction &amp; Platform Overview</h2>
            <p>
              Welcome to <strong>GrowLokal Technologies</strong> (&ldquo;GrowLokal&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). GrowLokal provides an AI-powered local marketing and enquiry generation platform built for clinics, salons, restaurants, retail stores, and local businesses in South India.
            </p>
            <p style={{ marginTop: '12px' }}>
              By accessing our website, creating an account, using our free Google Business Profile audit, or subscribing to a paid plan, you agree to be bound by these Terms of Service and our <Link href="/privacy" style={{ color: '#175fab', fontWeight: 600 }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>2. Services Provided</h2>
            <p>GrowLokal offers the following core marketing automation services, made available according to your subscribed plan (see Section 5):</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Free Google Business Audit:</strong> automated scoring of your Google Maps presence, review activity, and profile completeness.</li>
              <li><strong>Google Business Profile Agent:</strong> AI-generated posts, keyword suggestions, and review-reply drafts.</li>
              <li><strong>WhatsApp Chat Agent:</strong> automated customer enquiry responses in your business's language.</li>
              <li><strong>Social Media Scheduler:</strong> AI-generated post scheduling for Instagram and Facebook.</li>
              <li><strong>WhatsApp Marketing Campaigns:</strong> opt-in broadcast messaging for offers, launches, and promotions.</li>
              <li><strong>Booking Microsite:</strong> a public page showcasing your services with a direct WhatsApp enquiry and UPI payment link.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>3. User Account &amp; Responsibilities</h2>
            <p>
              You create an account by verifying a valid Indian mobile number via a one-time password (OTP) — we do not use passwords. You are responsible for keeping access to that mobile number secure, since it is how you sign in. You agree to provide accurate information about your registered business name, location, and contact details, and to subscribe to a paid plan from your dashboard to access plan-specific features.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>4. Acceptable Use &amp; Anti-Spam Compliance</h2>
            <p>
              GrowLokal strictly enforces compliance with WhatsApp Business Messaging Policies, TRAI guidelines, and Meta API terms. You agree NOT to:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Use GrowLokal to broadcast unsolicited commercial messages or spam to contacts who have not opted in or requested information.</li>
              <li>Publish false, misleading, defamatory, or fraudulent content regarding services, pricing structures, or business offers.</li>
              <li>Upload malicious code, scrape customer data, or reverse engineer any portion of the GrowLokal AI Engine.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>5. Subscription Plans &amp; Feature Access</h2>
            <p>
              GrowLokal offers a <strong>Free Plan</strong> (instant Google audit, no payment required) and two paid plans — <strong>Starter (₹999/month) and Growth (₹2,499/month)</strong> — each also available at a discounted annual rate. Fees are processed securely via Razorpay, supporting UPI, Credit/Debit Cards, and Net Banking, and are exclusive of applicable GST. An invoice is generated for every payment and can be accessed through your billing history.
            </p>
            <p style={{ marginTop: '12px' }}>
              <strong>Feature access is strictly tied to your subscribed plan.</strong> Google Business Profile posting and the WhatsApp chat agent require Starter or above; review-reply drafting, the social media scheduler, WhatsApp campaigns, and the booking microsite require Growth or above. Your dashboard shows only the features included in your current plan.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>6. Auto-Renewal &amp; Billing</h2>
            <p>
              Paid subscriptions renew automatically at the end of each billing period using your saved payment method, unless cancelled beforehand. We will send you a reminder via WhatsApp and/or email approximately <strong>7 days before your renewal date</strong>. You can cancel auto-renewal at any time through your dashboard or by contacting support (see our <Link href="/refund" style={{ color: '#175fab', fontWeight: 600 }}>Refund &amp; Cancellation Policy</Link> for details).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>7. What Happens If a Payment Lapses</h2>
            <p>
              If a renewal payment fails or your subscription is not renewed, your account is automatically restricted to the same limited view available to unsubscribed accounts — paid features (Google posts, WhatsApp automation, campaigns, and the booking microsite) stop working until you renew. Your account, business profile, and historical data are preserved; nothing is deleted. Full access resumes automatically as soon as a successful payment is recorded — no separate reactivation step is required.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>8. AI-Generated Content</h2>
            <p>
              GrowLokal uses artificial intelligence to draft posts, captions, review replies, and chat responses on your behalf. While we aim for accuracy and relevance, AI-generated content may occasionally contain errors or inaccuracies. You are responsible for reviewing AI-generated content before it is published where our tools provide a review step, and for the accuracy of any information (pricing, offers, claims) you configure the AI to use. GrowLokal is not liable for consequences arising from AI-generated content that you chose to publish or that was published on your behalf per your account settings.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>9. Intellectual Property</h2>
            <p>
              All copyrights, trademarks, software code, AI model prompts, design systems, and brand assets of GrowLokal remain the exclusive property of GrowLokal Technologies. You retain full ownership of your original business photos, product data, and customer list information.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>10. Limitation of Liability</h2>
            <p>
              GrowLokal provides tools to optimize your online visibility and automate enquiry management. We do not control third-party search engine algorithm updates by Google or Meta policy changes. Under no circumstances shall GrowLokal be liable for indirect, incidental, or consequential damages arising from service downtime, third-party platform suspension, or AI-generated content (see Section 8).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>11. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any legal proceedings or disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana, India.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>12. Contact &amp; Support</h2>
            <p>
              If you have any questions regarding these Terms of Service, please contact our support team at:
            </p>
            <div style={{ marginTop: '12px', padding: '16px', background: '#F2F2F2', borderRadius: '12px', fontSize: '0.9rem' }}>
              <strong>GrowLokal Technologies</strong><br />
              Email: support@growlokal.com<br />
              WhatsApp Support: +91 98765 43210<br />
              Location: Hyderabad, Telangana, India
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/privacy">Privacy Policy</Link> • <Link href="/refund">Refund Policy</Link>
        </div>
      </footer>
    </div>
  );
}
