import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — GrowLokal',
  description: 'How GrowLokal collects, uses, and protects coaching center owner and parent lead data.',
};

export default function PrivacyPage() {
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
            Data Trust &amp; Protection
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#5e7984', fontSize: '0.95rem' }}>
            Last Updated: July 30, 2026 • Compliant with Indian IT Act &amp; DPDP Guidelines
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.98rem', lineHeight: '1.75', color: '#0E4459' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>1. Commitment to Privacy</h2>
            <p>
              At <strong>GrowLokal Technologies</strong> (&ldquo;GrowLokal&rdquo;), we take your privacy and data security seriously. This Privacy Policy explains how we collect, use, process, and safeguard personal and business information when you use our platform, website, and WhatsApp AI automation services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>2. Information We Collect</h2>
            <p>We collect only the minimum necessary information required to deliver our local AI marketing services:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Institute Business Details:</strong> Coaching center name, area, city, course offerings, fee ranges, and operating hours.</li>
              <li><strong>Owner Contact Data:</strong> Registered Indian mobile number verified via OTP authentication, and optional email address.</li>
              <li><strong>Google Profile Permissions:</strong> Account metadata authorized by you via Google OAuth to enable automated GBP posting and review replies.</li>
              <li><strong>Parent Enquiry Lead Data:</strong> Names, WhatsApp phone numbers, and course enquiry preferences submitted by prospective parents through your audit widgets or WhatsApp chat bot.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>3. How We Use Your Information</h2>
            <p>Information collected is used strictly for the following business purposes:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Generating instant Google Business Profile audit reports and local SEO scorecards.</li>
              <li>Crafting vernacular AI content in Telugu, Tamil, Kannada, and English tailored for your center.</li>
              <li>Routing automated parent WhatsApp enquiry notifications directly to your phone.</li>
              <li>Processing subscription payments and providing billing invoices.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>4. Data Protection &amp; Security Standards</h2>
            <p>
              GrowLokal employs industry-standard administrative, technical, and physical security measures:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Encryption:</strong> All data transmitted between your browser, WhatsApp APIs, and our servers is encrypted using 256-bit SSL/TLS protocols.</li>
              <li><strong>Strict Isolation:</strong> Your student list and parent lead data are isolated and never shared with other institutes or third-party advertisers.</li>
              <li><strong>No Data Monetization:</strong> GrowLokal NEVER sells, rents, or monetizes customer phone numbers or parent enquiry data.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>5. Third-Party API Service Integrations</h2>
            <p>
              GrowLokal integrates with trusted global infrastructure providers:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Google Maps &amp; GBP APIs:</strong> Used solely to fetch listing scores, publish approved posts, and reply to Google reviews.</li>
              <li><strong>Meta WhatsApp Business API:</strong> Used to deliver automated chat replies and broadcast campaigns in compliance with Meta privacy terms.</li>
              <li><strong>PCI-DSS Compliant Payment Gateways:</strong> Payment details are processed directly by certified payment partners. GrowLokal never stores your full card or bank credentials.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>6. Data Control &amp; Account Deletion Rights</h2>
            <p>
              You maintain full ownership of your data. You may request a export of your parent lead records or request permanent deletion of your account and associated data by emailing <strong>support@growlokal.com</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>7. Privacy Policy Updates</h2>
            <p>
              We may update this policy periodically to reflect platform enhancements or regulatory updates. Any material changes will be notified via your dashboard or registered WhatsApp number.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#033540', marginBottom: '12px' }}>8. Privacy Contact Information</h2>
            <div style={{ marginTop: '12px', padding: '16px', background: '#F2F2F2', borderRadius: '12px', fontSize: '0.9rem' }}>
              <strong>GrowLokal Data Protection Officer</strong><br />
              Email: privacy@growlokal.com<br />
              WhatsApp: +91 98765 43210<br />
              Location: Hyderabad, Telangana, India
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-container" style={{ textAlign: 'center', fontSize: '13px', color: '#5e7984' }}>
          © {new Date().getFullYear()} GrowLokal Technologies. All rights reserved. • <Link href="/terms">Terms of Service</Link> • <Link href="/refund">Refund Policy</Link>
        </div>
      </footer>
    </div>
  );
}
