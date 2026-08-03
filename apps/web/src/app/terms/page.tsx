import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — GrowLokal',
  description: 'Terms and conditions governing the use of GrowLokal AI Marketing Platform for Coaching & Tuition Centers.',
};

export default function TermsPage() {
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
            color: '#2E9AA6',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Legal Agreement
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: '#5e7984', fontSize: '0.95rem' }}>
            Last Updated: July 30, 2026 • Effective Immediately
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.98rem', lineHeight: '1.75', color: '#0E4459' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>1. Introduction &amp; Platform Overview</h2>
            <p>
              Welcome to <strong>GrowLokal Technologies</strong> (&ldquo;GrowLokal&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). GrowLokal provides an autonomous AI-powered local marketing and enquiry generation platform built for clinics, salons, restaurants, retail stores, tuition centers, and local businesses in South India.
            </p>
            <p style={{ marginTop: '12px' }}>
              By accessing our website, signing up for an account, using our Google Business Profile audit tool, or subscribing to our Growth Plan, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>2. Services Provided</h2>
            <p>GrowLokal offers the following core marketing automation services:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Free Google Business Audit:</strong> Automated scanning and scoring of your Google Maps presence, NAP consistency, and review response rate.</li>
              <li><strong>Google Leads AI Agent:</strong> Automated generation of weekly posts, keywords optimization, and professional review replies.</li>
              <li><strong>WhatsApp Chat Agent:</strong> 24/7 automated customer enquiry responder operating natively in Telugu, Tamil, Kannada, and English.</li>
              <li><strong>Social Media Scheduler:</strong> AI-assisted post generation and scheduling for Instagram Business and Facebook Pages.</li>
              <li><strong>WhatsApp Broadcast Campaigns:</strong> Opt-in promotional campaign broadcasting for new launches, festival offers, and customer promotions.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>3. User Account &amp; Responsibilities</h2>
            <p>
              To access GrowLokal tools, you must register using a valid Indian mobile number and verify via OTP. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information regarding your registered business name, location, and contact details.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>4. Acceptable Use &amp; Anti-Spam Compliance</h2>
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
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>5. Subscriptions, Fees &amp; Billing</h2>
            <p>
              GrowLokal offers a <strong>Free Plan</strong> (Instant Google Audit) and a paid <strong>Growth Plan</strong> billed at ₹2,999/month (or ₹7,999 quarterly). Fees are processed securely via encrypted Indian payment gateways supporting UPI, Credit/Debit Cards, and Net Banking. All charges are exclusive of applicable GST.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>6. Intellectual Property</h2>
            <p>
              All copyrights, trademarks, software code, AI model prompts, design systems, and brand assets of GrowLokal remain the exclusive property of GrowLokal Technologies. You retain full ownership of your original institute photos, course data, and customer list information.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>7. Limitation of Liability</h2>
            <p>
              GrowLokal provides tools to optimize your online visibility and automate enquiry management. We do not control third-party search engine algorithm updates by Google or Meta policy changes. Under no circumstances shall GrowLokal be liable for indirect, incidental, or consequential damages arising from service downtime or third-party platform suspension.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>8. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any legal proceedings or disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana, India.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>9. Contact &amp; Support</h2>
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
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#5e7984' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/privacy">Privacy Policy</Link> • <Link href="/refund">Refund Policy</Link>
        </div>
      </footer>
    </div>
  );
}
