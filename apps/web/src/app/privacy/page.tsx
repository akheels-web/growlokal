import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy — GrowLokal',
  description: 'How GrowLokal collects, uses, protects, and lets you control your personal and business data, in line with the Digital Personal Data Protection Act, 2023.',
};

export default function PrivacyPage() {
  return (
    <div className="page-wrapper" style={{ background: '#ffffff', color: '#111827' }}>
      {/* ─── UNIFIED NAVIGATION HEADER ─── */}
      <Navbar isSticky />

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Legal & Trust', href: '/#footer' },
            { label: 'Privacy Policy' },
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
            Data Trust &amp; Protection
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Last Updated: July 30, 2026 • Prepared in line with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.98rem', lineHeight: '1.75', color: '#0B1020' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>1. Commitment to Privacy</h2>
            <p>
              At <strong>GrowLokal Technologies</strong> (&ldquo;GrowLokal&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), we take your privacy and data security seriously. This Privacy Policy explains what personal and business information we collect, why, how we protect it, who we share it with, and the rights you have over it — as a &ldquo;Data Fiduciary&rdquo; under the DPDP Act, and you as our &ldquo;Data Principal.&rdquo;
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>2. Information We Collect</h2>
            <p>We collect only what's necessary to deliver our AI marketing services:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Business Details:</strong> Business name, area, city, services/products offered, pricing ranges, and operating hours.</li>
              <li><strong>Owner Contact Data:</strong> Your Indian mobile number (verified via OTP) and, if provided, your email address.</li>
              <li><strong>Google Profile Permissions:</strong> Account metadata authorized by you via Google OAuth to enable automated Google Business Profile posting and review replies.</li>
              <li><strong>WhatsApp Conversation Content:</strong> Messages exchanged between your customers and your automated WhatsApp assistant, so it can answer questions using your business's own information.</li>
              <li><strong>Customer Enquiry Lead Data:</strong> Names, WhatsApp phone numbers, and enquiry details submitted by prospective customers through your free audit, website, or WhatsApp chat.</li>
              <li><strong>Payment &amp; Billing Data:</strong> Subscription plan, payment status, and invoice records (processed by our payment partner — we do not store your card/UPI details ourselves).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>3. How We Use Your Information</h2>
            <p>We use your information only for the following purposes:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Generating your free Google Business Profile audit report and score.</li>
              <li>Using AI (including third-party AI models — see Section 6) to draft Google posts, social media captions, review replies, and WhatsApp responses in your business's language.</li>
              <li>Operating your automated WhatsApp customer-response agent and marketing campaigns.</li>
              <li>Processing subscription payments, generating invoices, and sending you payment confirmations, renewal reminders, and billing communications.</li>
              <li>Improving our services and complying with applicable law.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We do <strong>not</strong> use your business or customer data to train AI models, and we do <strong>not</strong> sell or rent it to advertisers or other businesses.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>4. Your Consent</h2>
            <p>
              By creating an account, verifying your mobile number, or subscribing to a paid plan, you consent to the collection and use of your information as described in this Policy. Where we rely on your consent (for example, to send you WhatsApp marketing messages or connect your Google account), you may <strong>withdraw that consent at any time</strong> — as easily as you gave it — by contacting us (Section 12) or, where available, through your dashboard settings. Withdrawing consent may limit or disable the specific feature that depended on it (for example, disconnecting your Google account will stop automated Google posting), but will not affect the lawfulness of anything already processed before withdrawal.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>5. Data Protection &amp; Security Standards</h2>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Encryption:</strong> Data transmitted between your browser, WhatsApp, and our servers is encrypted using industry-standard SSL/TLS protocols.</li>
              <li><strong>Tenant Isolation:</strong> Your customer list and enquiry data are isolated from other businesses on the platform and never shared with them.</li>
              <li><strong>No Data Monetization:</strong> We never sell or rent customer phone numbers, enquiry data, or business information.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>6. Third-Party Service Providers</h2>
            <p>
              To operate GrowLokal, we share the minimum necessary data with these providers, each processing it only for the specific purpose below:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Google (Places API &amp; Business Profile API):</strong> to look up and manage your public Google Business Profile.</li>
              <li><strong>Meta (WhatsApp Cloud API):</strong> to send and receive WhatsApp messages on your behalf.</li>
              <li><strong>AI providers (Google Gemini, Anthropic Claude, and/or OpenRouter):</strong> to generate audit summaries, post captions, and chat responses. Your business context and the relevant message content are sent to these providers solely to generate that response — never used to train their models on our arrangement.</li>
              <li><strong>MSG91 (SMS):</strong> to deliver your one-time login codes.</li>
              <li><strong>Amazon Web Services (SES — email):</strong> to send account, billing, and renewal-related emails.</li>
              <li><strong>Razorpay:</strong> to process subscription payments and generate GST-compliant invoices. We do not store your card, UPI, or bank details — Razorpay handles this directly.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We only work with providers who maintain appropriate data-security standards, and we only share what each provider needs to perform its specific function.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>7. Cross-Border Data Transfers</h2>
            <p>
              Some of the providers listed in Section 6 (including our AI and cloud infrastructure providers) may process data on servers located outside India. Under the DPDP Act, such transfers are permitted unless the Government of India specifically restricts transfer to that country. We only transfer the minimum data necessary for each provider's function, and each is contractually required to protect it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>8. Data Retention</h2>
            <p>
              We keep your personal data only as long as necessary for the purposes described in this Policy, or as required by applicable law. In particular:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Profile, enquiry, and conversation data</strong> is deleted upon a verified deletion request (see Section 9), or after your account has been inactive for an extended period.</li>
              <li>
                <strong>Invoices and payment/financial records are the one exception and cannot be deleted on request</strong> — Indian tax and financial-record-keeping law requires us to retain these for a legally mandated period regardless of an erasure request. We retain them only as required by applicable law, and delete them once that period has passed.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>9. Your Rights Under the DPDP Act</h2>
            <p>As a Data Principal, you have the right to:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Access:</strong> request a summary of the personal data we hold about you and the third parties we've shared it with (Section 6).</li>
              <li><strong>Correction:</strong> ask us to correct inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> ask us to delete your personal data — subject to the financial-records exception in Section 8.</li>
              <li><strong>Grievance Redressal:</strong> raise a complaint with us first (Section 12); if unresolved, you may escalate to the Data Protection Board of India.</li>
              <li><strong>Nomination:</strong> nominate another individual to exercise these rights on your behalf in the event of your death or incapacity.</li>
              <li><strong>Withdraw Consent:</strong> as described in Section 4.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>To exercise any of these rights, contact us using the details in Section 12.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>10. Children's Privacy</h2>
            <p>
              GrowLokal is intended for use by business owners aged 18 and above. We do not knowingly collect personal data from, or direct any advertising or behavioral tracking at, individuals under 18. If we become aware that we have inadvertently collected such data, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>11. Data Breach Notification</h2>
            <p>
              In the unlikely event of a personal data breach, we will notify the Data Protection Board of India and affected users as required under the DPDP Act, and take prompt steps to contain and remediate the breach.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>12. Grievance Officer &amp; Contact Information</h2>
            <p>
              For any privacy questions, consent withdrawal, data access/correction/erasure requests, or grievances, contact our Grievance Officer:
            </p>
            <div style={{ marginTop: '12px', padding: '16px', background: '#F2F2F2', borderRadius: '12px', fontSize: '0.9rem' }}>
              <strong>GrowLokal Technologies — Grievance Officer</strong><br />
              Email: privacy@growlokal.com<br />
              WhatsApp: +91 98765 43210<br />
              Location: Hyderabad, Telangana, India
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.88rem', color: '#64748B' }}>
              We aim to acknowledge and resolve requests within a reasonable time and in line with applicable law.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '12px' }}>13. Policy Updates</h2>
            <p>
              We may update this Policy periodically to reflect platform changes or regulatory updates. Material changes will be notified via your dashboard, email, or registered WhatsApp number before they take effect.
            </p>
          </section>
        </div>
      </main>

      {/* ─── RICH DARK FOOTER ─── */}
      <Footer />
    </div>
  );
}
