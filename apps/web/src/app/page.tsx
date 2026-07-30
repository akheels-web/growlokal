'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/* ─── Intersection Observer hook ─── */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Animated counter ─── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);
  return <span ref={ref} className="stat-number">{count}{suffix}</span>;
}

/* ─── Score Ring SVG ─── */
function ScoreRing({ score }: { score: number }) {
  const r = 58, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
  const cls = score < 40 ? 'low' : score < 70 ? 'mid' : 'high';
  return (
    <div className="score-ring">
      <svg width="140" height="140">
        <circle className="score-ring-bg" cx="70" cy="70" r={r} />
        <circle className={`score-ring-fill score-stroke-${cls}`} cx="70" cy="70" r={r}
          strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="score-ring-value">
        <span className={`score-number score-${cls}`}>{score}</span>
        <span className="score-label">out of 100</span>
      </div>
    </div>
  );
}

/* ─── Section wrapper with fade-up ─── */
function Section({ id, className = '', children }: { id?: string; className?: string; children: React.ReactNode }) {
  const { ref, visible } = useInView();
  return (
    <section id={id} ref={ref} className={`section fade-up ${visible ? 'visible' : ''} ${className}`}>
      <div className="section-center">{children}</div>
    </section>
  );
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {q}
        <span className="faq-chevron">▼</span>
      </button>
      <div className="faq-answer">
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
type Lang = 'en' | 'te' | 'ta' | 'kn';

const I18N: Record<Lang, {
  badge: string;
  heroTitle1: string;
  heroAccent: string;
  heroTitle2: string;
  heroSub: string;
  auditBadge: string;
  auditTitle: string;
  auditSub: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  btnAudit: string;
  btnLoading: string;
  howItWorks: string;
  agents: string;
  scoreTool: string;
  roiCalc: string;
  blog: string;
  signIn: string;
  demoBtn: string;
  painEyebrow: string;
  painTitle: string;
  painSubtitle: string;
  stepsEyebrow: string;
  stepsTitle: string;
  stepsSubtitle: string;
  agentsEyebrow: string;
  agentsTitle: string;
  agentsSubtitle: string;
  pricingEyebrow: string;
  pricingTitle: string;
  pricingSubtitle: string;
  faqEyebrow: string;
  faqTitle: string;
  faqSubtitle: string;
}> = {
  en: {
    badge: '🎓 Built for Coaching Centers',
    heroTitle1: 'Your All-in-One ',
    heroAccent: 'AI Marketing Team',
    heroTitle2: ' that Delivers Real Admissions',
    heroSub: 'Most coaching centers lose 60%+ of potential admissions because parents cannot find them on Google. Get a free instant report.',
    auditBadge: '⚡ Instant 10-Sec Scan',
    auditTitle: 'Get your free Google report',
    auditSub: 'Enter your center details — we will check your Google presence instantly.',
    namePlaceholder: 'Coaching center name + area (e.g. Bright Future, Ameerpet)',
    phonePlaceholder: 'Your WhatsApp number',
    btnAudit: 'Get My Free Report →',
    btnLoading: 'Scanning your Google presence…',
    howItWorks: 'How it works',
    agents: 'AI Agents',
    scoreTool: 'Score Tool',
    roiCalc: 'ROI Calculator',
    blog: 'Blog & Playbooks',
    signIn: 'Sign In',
    demoBtn: 'Book Free Demo →',
    painEyebrow: 'The problem',
    painTitle: 'Why coaching centers struggle to get admissions',
    painSubtitle: 'If this sounds familiar, you are not alone — and there is a fix.',
    stepsEyebrow: 'Simple process',
    stepsTitle: 'How GrowLokal turns Google searches into student admissions',
    stepsSubtitle: 'Three simple steps to automate your local marketing in Telugu, Tamil, Kannada & English.',
    agentsEyebrow: 'Meet your team',
    agentsTitle: '4 Autonomous AI Agents working for your institute 24/7',
    agentsSubtitle: 'No marketing agency needed. Our specialized AI agents handle Google Maps, WhatsApp, Social Media, and Lead Conversion.',
    pricingEyebrow: 'Simple pricing',
    pricingTitle: 'Start free, grow when ready',
    pricingSubtitle: 'The audit is always free. Upgrade for full AI marketing automation.',
    faqEyebrow: 'Questions & Answers',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Everything you need to know about GrowLokal AI.',
  },
  te: {
    badge: '🎓 కోచింగ్ సెంటర్ల కోసం ప్రత్యేకంగా తయారుచేయబడింది',
    heroTitle1: 'మీ కోచింగ్ సెంటర్‌కు ',
    heroAccent: 'రియల్ అడ్మిషన్లు',
    heroTitle2: ' అందించే AI మార్కెటింగ్ టీమ్',
    heroSub: 'హైదరాబాద్ మరియు AP/తెలంగాణలోని 60%+ కోచింగ్ సెంటర్లు Google Mapsలో సరైన ప్రెజెన్స్ లేకపోవడం వల్ల అడ్మిషన్లను కోల్పోతున్నాయి.',
    auditBadge: '⚡ 10-సెకన్ల స్కాన్',
    auditTitle: 'మీ ఉచిత Google రిపోర్ట్ పొందండి',
    auditSub: 'మీ సెంటర్ వివరాలు ఎంటర్ చేయండి — మేము ఇన్స్టంట్‌గా చెక్ చేస్తాము.',
    namePlaceholder: 'కోచింగ్ సెంటర్ పేరు + ఏరియా (ఉదా. బ్రైట్ ఫ్యూచర్, అమీర్‌పేట్)',
    phonePlaceholder: 'మీ వాట్సాప్ నంబర్',
    btnAudit: 'నా ఉచిత రిపోర్ట్ పొందండి →',
    btnLoading: 'స్కాన్ చేస్తోంది…',
    howItWorks: 'ఎలా పనిచేస్తుంది',
    agents: 'AI ఏజెంట్లు',
    scoreTool: 'స్కోర్ టూల్',
    roiCalc: 'ROI క్యాలిక్యులేటర్',
    blog: 'బ్లాగ్',
    signIn: 'లాగిన్',
    demoBtn: 'ఉచిత డెమో బుక్ చేయండి →',
    painEyebrow: 'సమస్య',
    painTitle: 'కోచింగ్ సెంటర్లు అడ్మిషన్లు పొందడంలో ఎదుర్కొంటున్న ప్రధాన సమస్యలు',
    painSubtitle: 'ఇది మీకు తెలిసినట్లు అనిపిస్తే, మీరు ఒంటరిగా లేరు — దీనికి పరిష్కారం ఉంది.',
    stepsEyebrow: 'సులభమైన ప్రక్రియ',
    stepsTitle: 'GrowLokal Google శోధనలను విద్యార్థుల అడ్మిషన్లుగా ఎలా మారుస్తుంది',
    stepsSubtitle: 'తెలుగు, ఇంగ్లీషులో మీ లోకల్ మార్కెటింగ్‌ను ఆటోమేట్ చేయడానికి 3 సులభమైన దశలు.',
    agentsEyebrow: 'మీ AI టీమ్',
    agentsTitle: 'మీ కోచింగ్ సెంటర్ కోసం 24/7 పనిచేసే 4 AI ఏజెంట్లు',
    agentsSubtitle: 'మార్కెటింగ్ ఏజెన్సీ అవసరం లేదు. మన AI ఏజెంట్లు Google Maps, WhatsApp మరియు సోషల్ మీడియాను చూసుకుంటాయి.',
    pricingEyebrow: 'సరళమైన ధరలు',
    pricingTitle: 'ఉచితంగా ప్రారంభించండి, సిద్ధంగా ఉన్నప్పుడు అప్‌గ్రేడ్ చేయండి',
    pricingSubtitle: 'Google ఆడిట్ ఎల్లప్పుడూ ఉచితం. పూర్తి AI మార్కెటింగ్ కోసం అప్‌గ్రేడ్ అవ్వండి.',
    faqEyebrow: 'ప్రశ్నలు & సమాధానాలు',
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    faqSubtitle: 'GrowLokal AI గురించి మీరు తెలుసుకోవలసిన వివరాలు.',
  },
  ta: {
    badge: '🎓 பயிற்சி மையங்களுக்காக உருவாக்கப்பட்டது',
    heroTitle1: 'உங்கள் மையத்திற்கு ',
    heroAccent: 'உண்மையான சேர்க்கைகள்',
    heroTitle2: ' வழங்கும் AI சந்தைப்படுத்தல் குழு',
    heroSub: 'கூகிள் மேப்ஸில் தகவல் இல்லாததால் 60%+ பயிற்சி மையங்கள் மாணவர் சேர்க்கைகளை இழக்கின்றன. இலவச அறிக்கையைப் பெறுங்கள்.',
    auditBadge: '⚡ 10 வினாடி சோதனை',
    auditTitle: 'இலவச கூகிள் அறிக்கையைப் பெறுங்கள்',
    auditSub: 'உங்கள் மைய விவரங்களை உள்ளிடவும் — உடனடி அறிக்கை பெறுங்கள்.',
    namePlaceholder: 'பயிற்சி மையத்தின் பெயர் + பகுதி (எ.கா. பிரைட் ஃபியூச்சர், அண்ணா நகர்)',
    phonePlaceholder: 'உங்கள் வாட்ஸ்அப் எண்',
    btnAudit: 'எனது இலவச அறிக்கையைப் பெறவும் →',
    btnLoading: 'சோதிக்கிறது…',
    howItWorks: 'எப்படி செயல்படுகிறது',
    agents: 'AI முகவர்கள்',
    scoreTool: 'மதிப்பெண் கருவி',
    roiCalc: 'ROI கணக்கிடுவான்',
    blog: 'வலைப்பதிவு',
    signIn: 'உள்நுழைக',
    demoBtn: 'இலவச டெமோ பதிவு செய்க →',
    painEyebrow: 'சிக்கல்',
    painTitle: 'பயிற்சி மையங்கள் சேர்க்கை பெற போராடுவது ஏன்',
    painSubtitle: 'இதற்கான தீர்வு எங்களிடம் உள்ளது.',
    stepsEyebrow: 'எளிய முறை',
    stepsTitle: 'கூகிள் தேடல்களை மாணவர் சேர்க்கைகளாக மாற்றுவது எப்படி',
    stepsSubtitle: 'உங்கள் உள்ளூர் சந்தைப்படுத்துதலை தானியங்குபடுத்த 3 எளிய படிகள்.',
    agentsEyebrow: 'உங்கள் AI குழு',
    agentsTitle: 'உங்கள் மையத்திற்காக 24/7 இயங்கும் 4 AI முகவர்கள்',
    agentsSubtitle: 'கூகிள் மேப்ஸ், வாட்ஸ்அப் மற்றும் சமூக ஊடகங்களை எங்களது AI கையாள்கிறது.',
    pricingEyebrow: 'எளிய விலை',
    pricingTitle: 'இலவசமாக தொடங்குங்கள்',
    pricingSubtitle: 'கூகிள் ஆய்வு எப்போதும் இலவசம்.',
    faqEyebrow: 'கேள்விகள் & பதில்கள்',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    faqSubtitle: 'GrowLokal AI பற்றிய தகவல்கள்.',
  },
  kn: {
    badge: '🎓 ತರಬೇತಿ ಕೇಂದ್ರಗಳಿಗಾಗಿ ವಿಶೇಷವಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ',
    heroTitle1: 'ನಿಮ್ಮ ಕೇಂದ್ರಕ್ಕೆ ',
    heroAccent: 'ನೈಜ ಪ್ರವೇಶಗಳನ್ನು',
    heroTitle2: ' ನೀಡುವ AI ಮಾರ್ಕೆಟಿಂಗ್ ತಂಡ',
    heroSub: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಸರಿಯಾದ ಮಾಹಿತಿಯಿಲ್ಲದೆ 60%+ ತರಬೇತಿ ಕೇಂದ್ರಗಳು ವಿದ್ಯಾರ್ಥಿ ಪ್ರವೇಶಗಳನ್ನು ಕಳೆದುಕೊಳ್ಳುತ್ತವೆ. ಉಚಿತ ವರದಿ ಪಡೆಯಿರಿ.',
    auditBadge: '⚡ 10 ಸೆಕೆಂಡ್ ಸ್ಕ್ಯಾನ್',
    auditTitle: 'ನಿಮ್ಮ ಉಚಿತ ಗೂಗಲ್ ವರದಿ ಪಡೆಯಿರಿ',
    auditSub: 'ನಿಮ್ಮ ಕೇಂದ್ರದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ — ತಕ್ಷಣದ ವರದಿ ಪಡೆಯಿರಿ.',
    namePlaceholder: 'ತರಬೇತಿ ಕೇಂದ್ರದ ಹೆಸರು + ಪ್ರದೇಶ (ಉದಾ. ಬ್ರೈಟ್ ಫ್ಯೂಚರ್, ಜಯನಗರ)',
    phonePlaceholder: 'ನಿಮ್ಮ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ',
    btnAudit: 'ನನ್ನ ಉಚಿತ ವರದಿ ಪಡೆಯಿರಿ →',
    btnLoading: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ…',
    howItWorks: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    agents: 'AI ಏಜೆಂಟ್‌ಗಳು',
    scoreTool: 'ಸ್ಕೋರ್ ಉಪಕರಣ',
    roiCalc: 'ROI ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    blog: 'ಬ್ಲಾಗ್',
    signIn: 'ಸೈನ್ ಇನ್',
    demoBtn: 'ಉಚಿತ ಡೆಮೊ ಕಾಯ್ದಿರಿಸಿ →',
    painEyebrow: 'ಸಮಸ್ಯೆ',
    painTitle: 'ತರಬೇತಿ ಕೇಂದ್ರಗಳು ವಿದ್ಯಾರ್ಥಿ ಪ್ರವೇಶ ಪಡೆಯಲು ಹೆಣಗಾಡುವುದು ಏಕೆ',
    painSubtitle: 'ಇದಕ್ಕೆ ನಮ್ಮಲ್ಲಿ ಸೂಕ್ತ ಪರಿಹಾರವಿದೆ.',
    stepsEyebrow: 'ಸುಲಭ ಪ್ರಕ್ರಿಯೆ',
    stepsTitle: 'ಗೂಗಲ್ ಹುಡುಕಾಟಗಳನ್ನು ಪ್ರವೇಶಗಳಾಗಿ ಬದಲಾಯಿಸುವುದು ಹೇಗೆ',
    stepsSubtitle: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಾರ್ಕೆಟಿಂಗ್ ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಲು 3 ಸರಳ ಹಂತಗಳು.',
    agentsEyebrow: 'ನಿಮ್ಮ AI ತಂಡ',
    agentsTitle: 'ನಿಮ್ಮ ಕೇಂದ್ರಕ್ಕಾಗಿ 24/7 ಕೆಲಸ ಮಾಡುವ 4 AI ಏಜೆಂಟ್‌ಗಳು',
    agentsSubtitle: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್, ವಾಟ್ಸಾಪ್ ಮತ್ತು ಸೋಷಿಯಲ್ ಮೀಡಿಯಾಗಳನ್ನು AI ನಿರ್ವಹಿಸುತ್ತದೆ.',
    pricingEyebrow: 'ಸರಳ ದರಗಳು',
    pricingTitle: 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ',
    pricingSubtitle: 'ಗೂಗಲ್ ಆಡಿಟ್ ಯಾವಾಗಲೂ ಉಚಿತ.',
    faqEyebrow: 'ಪ್ರಶ್ನೆಗಳು & ಉತ್ತರಗಳು',
    faqTitle: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    faqSubtitle: 'GrowLokal AI ಕುರಿತು ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const t = I18N[lang];

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; message: string } | null>(null);
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const runAudit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanName = businessName.trim();
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (cleanName.length < 2) {
      setError('Please enter your coaching center name.');
      return;
    }

    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API}/api/audit/run`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: cleanName, phone: cleanPhone, city: 'Hyderabad', lang }),
      });
      if (res.status === 429) {
        throw new Error('Too many audit scans. Please wait a minute before trying again.');
      }
      if (!res.ok) throw new Error('Audit failed');
      const data = await res.json();
      setResult({ score: data.score, message: data.message });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [businessName, phone, lang]);

  const painView = useInView();
  const stepsView = useInView();
  const agentsView = useInView();
  const industryView = useInView();
  const testimonialsView = useInView();

  return (
    <div className="page-wrapper">
      {/* ─── NAV ─── */}
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" className="nav-brand">Grow<span>Lokal</span></a>
            
            {/* PROMINENT 4-LANGUAGE DROPDOWN */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              style={{
                background: '#0E4459',
                color: '#ffffff',
                border: '1.5px solid #2E9AA6',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(14, 68, 89, 0.2)'
              }}
            >
              <option value="en">🌐 English</option>
              <option value="te">🌐 తెలుగు (Telugu)</option>
              <option value="ta">🌐 தமிழ் (Tamil)</option>
              <option value="kn">🌐 ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">{t.howItWorks}</a>
            <a href="#agents" className="nav-link">{t.agents}</a>
            <a href="/tools/google-score-calculator" className="nav-link">{t.scoreTool}</a>
            <a href="/tools/admission-roi-calculator" className="nav-link">{t.roiCalc}</a>
            <a href="/blog" className="nav-link">{t.blog}</a>
            <a href="/login" className="nav-link">{t.signIn}</a>
            <a href="https://wa.me/91XXXXXXXXXX?text=I%20want%20a%20free%20demo" target="_blank" rel="noopener noreferrer" className="btn-nav">
              {t.demoBtn}
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-dot-grid" />
        <div className="hero-orb hero-orb--1" />
        <div className="hero-orb hero-orb--2" />
        <div className="hero-orb hero-orb--3" />

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              {t.badge}
            </div>
            <h1 className="hero-title">
              {t.heroTitle1}<span className="hero-title-accent">{t.heroAccent}</span>{t.heroTitle2}
            </h1>
            <p className="hero-subtitle">
              {t.heroSub}
            </p>
            {/* Authentic Launch Offer & Value Prop Strip */}
            <div className="hero-launch-guarantee-bar">
              <div className="hero-launch-header">
                <span className="hero-launch-icon">🚀</span>
                <div>
                  <strong>Launch Offer: 100% Free Google Audit</strong>
                  <div className="hero-launch-sub">No credit card required • Instant WhatsApp delivery</div>
                </div>
              </div>
              <div className="hero-launch-points">
                <span>✓ Ranking Score</span>
                <span>✓ Review Replies</span>
                <span>✓ Vernacular AI Posts</span>
              </div>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item"><span className="hero-trust-icon">✓</span> Free forever</span>
              <span className="hero-trust-item"><span className="hero-trust-icon">⚡</span> 30 second report</span>
              <span className="hero-trust-item"><span className="hero-trust-icon">🌐</span> Telugu, Tamil, Kannada &amp; English</span>
            </div>
          </div>

          {/* Audit form card */}
          <div className="audit-card" id="audit-form">
            <div className="audit-card-badge">{t.auditBadge}</div>
            <h2 className="audit-card-title">{t.auditTitle}</h2>
            <p className="audit-card-subtitle">{t.auditSub}</p>
            <form onSubmit={runAudit} className="audit-form">
              <div className="input-with-icon">
                <span className="input-icon">🏫</span>
                <input id="audit-business-name" required placeholder={t.namePlaceholder}
                  value={businessName} onChange={e => setBusinessName(e.target.value)} className="form-input" />
              </div>
              <div className="input-with-icon">
                <span className="input-icon">💬</span>
                <input id="audit-phone" required placeholder={t.phonePlaceholder} type="tel"
                  value={phone} onChange={e => setPhone(e.target.value)} className="form-input" />
              </div>
              <button id="audit-submit" type="submit" disabled={loading} className="btn-primary">
                {loading ? <><span className="spinner" />{t.btnLoading}</> : t.btnAudit}
              </button>
            </form>
            <div className="audit-trust-strip">
              <span>🔒 100% Free</span> • <span> Instant WhatsApp Delivery</span> • <span>⚡ 500+ Audited</span>
            </div>
            {loading && (
              <div className="radar-scan-box">
                <div className="radar-sweep-line" />
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#70BF63', marginBottom: '4px' }}>
                  📡 AI Radar Scanning In Progress…
                </div>
                <div style={{ fontSize: '12px', opacity: 0.85 }}>
                  Scanning Google Profile, Review Replies &amp; Local Maps Rank
                </div>
              </div>
            )}
            {error && <p className="form-error">{error}</p>}
            {result && (
              <div className="results-panel">
                <div className="results-card">
                  <div className="score-ring-container"><ScoreRing score={result.score} /></div>
                  <p className="results-message">{result.message}</p>
                  <a href="https://wa.me/91XXXXXXXXXX?text=I%20want%20to%20fix%20my%20Google%20presence"
                    className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    💬 Fix this for me — book a free call
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── REDESIGNED HIGH-IMPACT STATS & INTEGRATION BAR ─── */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stats-header-tag">
            ⚡ Proven ROI Across South India
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">🏫</div>
              <AnimatedNumber target={500} suffix="+" />
              <span className="stat-label">Coaching Centers Audited</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">📈</div>
              <AnimatedNumber target={3} suffix="x" />
              <span className="stat-label">More Admission Enquiries</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">⚡</div>
              <AnimatedNumber target={10} suffix="s" />
              <span className="stat-label">Instant Google Audit Report</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">🌐</div>
              <AnimatedNumber target={3} suffix="" />
              <span className="stat-label">Vernacular Languages (Telugu, Tamil, EN)</span>
            </div>
          </div>

          <div className="platforms-section">
            <span className="platforms-title">Seamlessly Integrated With</span>
            <div className="platform-badges">
              <div className="platform-badge">
                <span>📍</span> Google Maps &amp; Search
              </div>
              <div className="platform-badge">
                <span>💬</span> WhatsApp Meta Business
              </div>
              <div className="platform-badge">
                <span>📸</span> Instagram Business
              </div>
              <div className="platform-badge">
                <span>📘</span> Facebook Pages
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PAIN POINTS ─── */}
      <Section id="problems" className="section--alt">
        <div className="section-header">
          <p className="section-eyebrow">{t.painEyebrow}</p>
          <h2 className="section-title">{t.painTitle}</h2>
          <p className="section-subtitle">{t.painSubtitle}</p>
        </div>
        <div ref={painView.ref} className="pain-grid stagger-children">
          {PAIN_POINTS.map((p, i) => (
            <div key={p.title} className={`pain-card fade-up ${painView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="pain-icon">{p.icon}</div>
              <div className="pain-stat">{p.stat}</div>
              <h3 className="pain-title">{p.title}</h3>
              <p className="pain-desc">{p.desc}</p>
              <div className="pain-solution">✨ {p.solution}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── HOW IT WORKS ─── */}
      <Section id="how-it-works">
        <div className="section-header">
          <p className="section-eyebrow">{t.stepsEyebrow}</p>
          <h2 className="section-title">{t.stepsTitle}</h2>
          <p className="section-subtitle">{t.stepsSubtitle}</p>
        </div>
        <div ref={stepsView.ref} className="steps stagger-children">
          {STEPS.map((s, i) => (
            <div key={s.title} className={`step fade-up ${stepsView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="step-icon">{s.icon}</div>
              <span className="step-number">{i + 1}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-description">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── MEET YOUR AI AGENTS ─── */}
      <Section id="agents" className="section--alt">
        <div className="section-header">
          <p className="section-eyebrow">{t.agentsEyebrow}</p>
          <h2 className="section-title">{t.agentsTitle}</h2>
          <p className="section-subtitle">{t.agentsSubtitle}</p>
        </div>

        {/* Grexa-Beating Shared Brain AI Agents Component */}
        <div className="shared-brain-showcase">
          {/* Left Column: Stack of 4 AI Agent cards with real avatars */}
          <div className="agent-cards-stack">
            <div className="grexa-agent-card grexa-agent-card--google">
              <div className="grexa-agent-avatar-wrap">
                <img src="/images/agent_google.png" alt="Google Business Profile AI Agent" className="grexa-agent-avatar-img" />
              </div>
              <div className="grexa-agent-info">
                <div className="grexa-agent-header-row">
                  <span className="grexa-agent-title">Google Business Profile</span>
                  <span className="grexa-agent-sparkle">✨ AI Agent</span>
                </div>
                <span className="grexa-agent-subtitle">Bring New Potential Customers</span>
              </div>
            </div>

            <div className="grexa-agent-card grexa-agent-card--whatsapp">
              <div className="grexa-agent-avatar-wrap">
                <img src="/images/agent_whatsapp.png" alt="WhatsApp Chat AI Agent" className="grexa-agent-avatar-img" />
              </div>
              <div className="grexa-agent-info">
                <div className="grexa-agent-header-row">
                  <span className="grexa-agent-title">WhatsApp Chat</span>
                  <span className="grexa-agent-sparkle">✨ AI Agent</span>
                </div>
                <span className="grexa-agent-subtitle">Realtime Customer Interaction</span>
              </div>
            </div>

            <div className="grexa-agent-card grexa-agent-card--social">
              <div className="grexa-agent-avatar-wrap">
                <img src="/images/agent_social.png" alt="Social Media Content AI Agent" className="grexa-agent-avatar-img" />
              </div>
              <div className="grexa-agent-info">
                <div className="grexa-agent-header-row">
                  <span className="grexa-agent-title">Social Media Content</span>
                  <span className="grexa-agent-sparkle">✨ AI Agent</span>
                </div>
                <span className="grexa-agent-subtitle">Autopilot Posts for Instagram &amp; Facebook</span>
              </div>
            </div>

            <div className="grexa-agent-card grexa-agent-card--campaign">
              <div className="grexa-agent-avatar-wrap">
                <img src="/images/agent_campaign.png" alt="WhatsApp Marketing AI Agent" className="grexa-agent-avatar-img" />
              </div>
              <div className="grexa-agent-info">
                <div className="grexa-agent-header-row">
                  <span className="grexa-agent-title">WhatsApp Marketing</span>
                  <span className="grexa-agent-sparkle">✨ AI Agent</span>
                </div>
                <span className="grexa-agent-subtitle">Promotional Marketing to Existing Customers</span>
              </div>
            </div>
          </div>

          {/* Center Column: Animated Circuit Connection SVG connecting all 4 Agents */}
          <svg className="circuit-connector-svg" viewBox="0 0 160 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 35 H70 C100 35 100 145 160 145" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            <path d="M0 108 H70 C100 108 100 145 160 145" stroke="#70BF63" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
            <path d="M0 182 H70 C100 182 100 145 160 145" stroke="#0E4459" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            <path d="M0 255 H70 C100 255 100 145 160 145" stroke="#ca8a04" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            <circle cx="70" cy="145" r="5" fill="#70BF63" />
          </svg>

          {/* Right Column: Shared Brain Data Intelligence Engine */}
          <div className="brain-engine-box">
            <div className="brain-icon-wrap">
              🧠
              <span className="brain-chip-badge">AI</span>
            </div>
            <div className="brain-engine-title">Data Intelligence Engine</div>
            <p className="brain-engine-desc">
              All AI Agents share central memory, parent history, and local tuition data to convert leads faster.
            </p>
          </div>
        </div>



        <div ref={agentsView.ref} className="agents-grid stagger-children">
          {AGENTS.map((a, i) => (
            <div key={a.title} className={`agent-card agent-card--${a.variant} fade-up ${agentsView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="agent-header">
                <div className="agent-icon-wrap">{a.icon}</div>
                <div>
                  <div className="agent-title">{a.title}</div>
                  <div className="agent-subtitle">{a.subtitle}</div>
                </div>
              </div>
              <span className="agent-tag">{a.tag}</span>
              <ul className="agent-features">
                {a.features.map(f => (
                  <li key={typeof f === 'string' ? f : f.text}>
                    <span className="agent-feature-icon">{typeof f === 'string' ? '✓' : f.icon}</span>
                    <span>{typeof f === 'string' ? f : f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── INDUSTRY FOCUS ─── */}
      <Section id="industries">
        <div className="section-header">
          <p className="section-eyebrow">Built for your niche</p>
          <h2 className="section-title">Specifically designed for coaching &amp; tuition centers</h2>
          <p className="section-subtitle">We&apos;re not a generic marketing tool. Every feature is built for education businesses in South India.</p>
        </div>
        <div ref={industryView.ref} className="industry-grid stagger-children">
          {INDUSTRIES.map((ind, i) => (
            <div key={ind.name} className={`industry-card fade-up ${industryView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="industry-icon">{ind.icon}</div>
              <div>
                <div className="industry-name">{ind.name}</div>
                <div className="industry-desc">{ind.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── BEFORE / AFTER ─── */}
      <Section className="section--alt">
        <div className="section-header">
          <p className="section-eyebrow">Real results</p>
          <h2 className="section-title">What happens in 30 days with GrowLokal</h2>
        </div>
        <div className="score-compare">
          <div className="score-compare-item">
            <div className="score-compare-label">Before GrowLokal</div>
            <div className="score-compare-value score-low">23<span style={{ fontSize: '1.25rem', opacity: 0.5 }}>/100</span></div>
          </div>
          <div className="score-compare-arrow">→</div>
          <div className="score-compare-item">
            <div className="score-compare-label">After 30 Days</div>
            <div className="score-compare-value score-high">87<span style={{ fontSize: '1.25rem', opacity: 0.5 }}>/100</span></div>
          </div>
        </div>
        <ul className="transform-checklist" style={{ listStyle: 'none' }}>
          <li>Complete Google Business Profile optimization</li>
          <li>Weekly AI-written Google posts in your language</li>
          <li>Every review replied to professionally</li>
          <li>Instagram &amp; Facebook running on autopilot</li>
          <li>Parents finding you when they search &ldquo;coaching near me&rdquo;</li>
        </ul>
      </Section>

      {/* ─── PLATFORM PROMISE (HONEST STARTUP PROMISE) ─── */}
      <Section id="guarantee">
        <div className="section-header">
          <p className="section-eyebrow">Our Early Access Guarantee</p>
          <h2 className="section-title">Built specifically for your coaching center</h2>
          <p className="section-subtitle">We are committed to delivering real admission growth from day one.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="pain-icon">🇮🇳</div>
            <h3 className="pain-title">100% Vernacular Accuracy</h3>
            <p className="testimonial-text">&ldquo;All AI posts and parent replies are generated natively in Telugu, Tamil, Kannada, and English — tuned specifically for South Indian educational terminology.&rdquo;</p>
          </div>
          <div className="testimonial-card">
            <div className="pain-icon">🔒</div>
            <h3 className="pain-title">1-Click Approval Control</h3>
            <p className="testimonial-text">&ldquo;You stay in complete control. Nothing gets published on your Google or WhatsApp until you review and click approve on your smartphone.&rdquo;</p>
          </div>
          <div className="testimonial-card">
            <div className="pain-icon">⚡</div>
            <h3 className="pain-title">Zero Setup Effort</h3>
            <p className="testimonial-text">&ldquo;No complex dashboards or coding required. Our AI tools run right where you are — on your WhatsApp and phone.&rdquo;</p>
          </div>
        </div>
      </Section>

      {/* ─── PRICING ─── */}
      <Section id="pricing" className="section--alt">
        <div className="section-header">
          <p className="section-eyebrow">{t.pricingEyebrow}</p>
          <h2 className="section-title">{t.pricingTitle}</h2>
          <p className="section-subtitle">{t.pricingSubtitle}</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-name">Free Audit</div>
            <div className="pricing-price"><span className="pricing-price-currency">₹</span>0</div>
            <p className="pricing-desc">See how your center looks on Google — no strings attached.</p>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> Google visibility score</li>
              <li><span className="pricing-check">✓</span> Gap analysis report</li>
              <li><span className="pricing-check">✓</span> Telugu, Tamil &amp; English</li>
              <li><span className="pricing-check">✓</span> WhatsApp delivery</li>
            </ul>
            <a href="#audit-form" className="btn-pricing btn-pricing--outline">Get free report ↑</a>
          </div>
          <div className="pricing-card pricing-card--featured">
            <span className="pricing-popular">Most Popular</span>
            <div className="pricing-name">Growth Plan</div>
            <div className="pricing-price"><span className="pricing-price-currency">₹</span>2,999<span className="pricing-price-period">/month</span></div>
            <p className="pricing-desc">AI does your marketing — Google, WhatsApp, social — you focus on teaching.</p>
            <ul className="pricing-features">
              <li><span className="pricing-check">✓</span> Everything in Free</li>
              <li><span className="pricing-check">✓</span> AI Google posts (weekly)</li>
              <li><span className="pricing-check">✓</span> Review reply drafts</li>
              <li><span className="pricing-check">✓</span> WhatsApp campaigns</li>
              <li><span className="pricing-check">✓</span> Instagram &amp; Facebook scheduling</li>
              <li><span className="pricing-check">✓</span> Booking microsite</li>
              <li><span className="pricing-check">✓</span> ROI dashboard</li>
            </ul>
            <a href="/login" className="btn-pricing btn-pricing--filled">Start growing →</a>
            <div className="pricing-savings">💰 Save ₹12,000+ per quarter vs competitors</div>
          </div>
        </div>

        {/* Optional Add-Ons Strip */}
        <div style={{
          marginTop: '36px',
          padding: '24px 32px',
          background: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(3, 53, 64, 0.04)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ padding: '3px 10px', background: 'rgba(112, 191, 99, 0.15)', color: '#047857', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>OPTIONAL ADD-ON</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#033540', margin: 0 }}>🌐 Custom Institute Website Creation</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5e7984', margin: '4px 0 0' }}>
              Don&apos;t have a dedicated website? We build a fast, mobile-ready 5-page website with course details, faculty profiles &amp; WhatsApp enquiry forms.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0E4459' }}>+₹4,999 <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>one-time</span></div>
              <div style={{ fontSize: '11px', color: '#047857', fontWeight: '700' }}>70% cheaper than agencies</div>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%2C%20I%20want%20to%20add%20Custom%20Website%20Creation%20(Rs.4999)"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 24px',
                background: '#0E4459',
                color: '#ffffff',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(14, 68, 89, 0.25)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Add Website (+₹4,999) →
            </a>
          </div>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section id="faq">
        <div className="section-header">
          <p className="section-eyebrow">{t.faqEyebrow}</p>
          <h2 className="section-title">{t.faqTitle}</h2>
          <p className="section-subtitle">{t.faqSubtitle}</p>
        </div>
        <div className="faq-list">
          {FAQ_DATA.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </Section>

      {/* ─── FINAL CTA ─── */}
      <Section className="cta-section">
        <h2 className="cta-title">Ready to stop losing admissions?</h2>
        <p className="cta-subtitle">Get your free Google visibility report in 30 seconds. No signup required.</p>
        <div className="cta-buttons">
          <a href="#audit-form" className="btn-primary">Get Free Google Report →</a>
          <a href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%2C%20I%20want%20a%20free%20demo%20of%20GrowLokal" target="_blank" rel="noopener noreferrer" className="btn-outline">💬 Book Free Demo on WhatsApp</a>
        </div>
      </Section>

      {/* ─── RICH SEO FOOTER ─── */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Col 1: Brand & Tagline */}
            <div className="footer-brand-col">
              <a href="/" className="footer-brand">Grow<span>Lokal</span></a>
              <p className="footer-tagline">
                The #1 AI Marketing Platform built exclusively for Coaching &amp; Tuition Centers in South India. Grow your admissions on Google, WhatsApp, and social media on autopilot.
              </p>
              <div className="footer-lang-badges">
                <span className="footer-lang-badge">🇮🇳 Telugu</span>
                <span className="footer-lang-badge">🇮🇳 Tamil</span>
                <span className="footer-lang-badge">🇮🇳 Kannada</span>
                <span className="footer-lang-badge">🌐 English</span>
              </div>
            </div>

            {/* Col 2: Free Growth Tools */}
            <div>
              <h4 className="footer-col-title">Free Growth Tools</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="/tools/google-score-calculator">Google Score Benchmark</a></li>
                <li className="footer-link-item"><a href="/tools/admission-roi-calculator">Admission ROI Calculator</a></li>
                <li className="footer-link-item"><a href="/resources/whatsapp-kit">WhatsApp Growth Kit</a></li>
                <li className="footer-link-item"><a href="/blog">Local SEO Playbooks</a></li>
                <li className="footer-link-item"><a href="#audit-form">Free Google Audit</a></li>
              </ul>
            </div>

            {/* Col 3: Industry Solutions */}
            <div>
              <h4 className="footer-col-title">Solutions</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="#industries">IIT &amp; NEET Coaching</a></li>
                <li className="footer-link-item"><a href="#industries">School Tuition Centers</a></li>
                <li className="footer-link-item"><a href="#industries">Skill &amp; Coding Academies</a></li>
                <li className="footer-link-item"><a href="#industries">Competitive Exam Centers</a></li>
                <li className="footer-link-item"><a href="#industries">Language Schools</a></li>
              </ul>
            </div>

            {/* Col 4: Top Locations (SEO) */}
            <div>
              <h4 className="footer-col-title">Top Locations</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="/city/hyderabad">Hyderabad, Telangana</a></li>
                <li className="footer-link-item"><a href="/city/vijayawada">Vijayawada, AP</a></li>
                <li className="footer-link-item"><a href="/city/visakhapatnam">Visakhapatnam, AP</a></li>
                <li className="footer-link-item"><a href="/city/bengaluru">Bengaluru, Karnataka</a></li>
              </ul>
            </div>

            {/* Col 5: Account & Support */}
            <div>
              <h4 className="footer-col-title">Account &amp; Help</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="/login">Owner Sign In</a></li>
                <li className="footer-link-item"><a href="#pricing">Growth Plan Pricing</a></li>
                <li className="footer-link-item"><a href="#faq">Frequently Asked Questions</a></li>
                <li className="footer-link-item"><a href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%20Support" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></li>
                <li className="footer-link-item"><a href="/privacy">Privacy Policy</a></li>
                <li className="footer-link-item"><a href="/terms">Terms &amp; Conditions</a></li>
                <li className="footer-link-item"><a href="/refund">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © {new Date().getFullYear()} GrowLokal Technologies. Built with ❤️ for South Indian Local Businesses.
            </div>

            {/* Payment Method Official SVG Brand Logos */}
            <div className="footer-payment-logos" aria-label="Accepted Payment Methods">
              {/* GPay */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="Google Pay">
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1"/>
                <text x="22" y="18" fontSize="10" fontWeight="800" textAnchor="middle" fill="#4285F4" fontFamily="sans-serif">GPay</text>
              </svg>
              {/* PhonePe */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="PhonePe">
                <rect width="44" height="28" rx="5" fill="#5f259f"/>
                <text x="22" y="19" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">पे</text>
              </svg>
              {/* Paytm */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="Paytm">
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1"/>
                <text x="22" y="18" fontSize="9" fontWeight="900" textAnchor="middle" fill="#002E6E" fontFamily="sans-serif">Pay<tspan fill="#00BAF2">tm</tspan></text>
              </svg>
              {/* BHIM UPI */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="BHIM UPI">
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1"/>
                <text x="22" y="17" fontSize="10" fontWeight="900" textAnchor="middle" fill="#EA580C" fontFamily="sans-serif">UPI</text>
              </svg>
              {/* VISA */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="Visa">
                <rect width="44" height="28" rx="5" fill="#1A1F71"/>
                <text x="22" y="18" fontSize="11" fontWeight="900" fontStyle="italic" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">VISA</text>
              </svg>
              {/* Mastercard */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="Mastercard">
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1"/>
                <circle cx="17" cy="14" r="8" fill="#EB001B"/>
                <circle cx="27" cy="14" r="8" fill="#F79E1B" opacity="0.88"/>
              </svg>
              {/* RuPay */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="RuPay">
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1"/>
                <text x="22" y="17" fontSize="9" fontWeight="900" textAnchor="middle" fill="#0076BF" fontFamily="sans-serif">RuPay</text>
              </svg>
              {/* NetBanking */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28" title="Net Banking">
                <rect width="44" height="28" rx="5" fill="#0E4459"/>
                <text x="22" y="17" fontSize="8" fontWeight="800" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">BANK</text>
              </svg>
            </div>          </div>
        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP ─── */}
      <a href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20want%20to%20know%20more%20about%20GrowLokal"
        target="_blank" rel="noopener noreferrer" className="wa-float">
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px #ffffff' }} />
        <span className="wa-float-icon">💬</span>
        <span>Chat on WhatsApp</span>
      </a>

      {/* ─── LIVE AI ACTIVITY TOAST (FOMO FEED) ─── */}
      <LiveToastFeed />
    </div>
  );
}

function LiveToastFeed() {
  const toasts = [
    '⚡ Sri Chaitanya Academy, Ameerpet generated +14 WhatsApp leads (2m ago)',
    '📍 Bright Future, Kukatpally Google Score upgraded 23 → 89 (5m ago)',
    '🎓 Excel IIT Academy, Dilsukhnagar scheduled 5 IG posts (12m ago)',
    '🚀 Apex Coaching, Vijayawada booked 8 demo classes today (18m ago)',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % toasts.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ai-toast-feed" key={index}>
      <div className="ai-toast-dot" />
      <div>{toasts[index]}</div>
    </div>
  );
}

/* ============================================================
   STATIC DATA
   ============================================================ */
const PAIN_POINTS = [
  {
    icon: '🔍', stat: '60%', title: "Parents can't find you on Google",
    desc: 'When a parent searches "coaching center near me", your competitors show up — but you don\'t. You\'re invisible where it matters most.',
    solution: 'Google Leads Agent fixes your profile + posts weekly',
  },
  {
    icon: '⭐', stat: '73%', title: 'Your reviews go unanswered',
    desc: '73% of consumers expect a response to reviews. Every ignored review costs you trust — and admissions.',
    solution: 'AI drafts warm replies in seconds, you just approve',
  },
  {
    icon: '📱', stat: '1x/mo', title: 'Social media is an afterthought',
    desc: "You know you should post on Instagram and Facebook, but who has the time? So it happens once a month — maybe.",
    solution: 'Social Agent posts to IG + FB automatically every week',
  },
];

const STEPS = [
  { icon: '🏫', title: 'Enter your center name', desc: "Tell us your coaching center's name and area — we do the rest." },
  { icon: '📊', title: 'Get your Google score', desc: 'Our AI scans your Google Business Profile and scores it instantly out of 100.' },
  { icon: '🚀', title: 'Fix gaps with AI', desc: 'Get AI-generated posts, review replies, and campaigns — all automated.' },
];

const AGENTS = [
  {
    variant: 'google', icon: '🔍', tag: 'Brings new customers',
    title: 'Google Leads Agent', subtitle: 'Get found on Google Search & Maps',
    features: [
      { icon: '📊', text: 'Audits your Google Business Profile and scores it' },
      { icon: '📝', text: 'Publishes weekly AI-written posts on your GBP' },
      { icon: '⭐', text: 'Drafts professional replies to every review' },
      { icon: '📍', text: 'Optimizes your profile for "near me" searches' },
      { icon: '🗣️', text: 'Generates vernacular content in Telugu/Tamil/English' },
    ],
  },
  {
    variant: 'whatsapp', icon: '💬', tag: 'Real-time interaction',
    title: 'WhatsApp Chat Agent', subtitle: 'Answer parent enquiries 24/7',
    features: [
      { icon: '💬', text: 'Answers fee, timing, and admission questions instantly' },
      { icon: '🌐', text: 'Works in Telugu, Tamil, Kannada, and English' },
      { icon: '📥', text: 'Captures lead info automatically' },
      { icon: '📲', text: 'Sends audit reports directly on WhatsApp' },
      { icon: '🙋', text: 'Hands off to you when it needs a human touch' },
    ],
  },
  {
    variant: 'social', icon: '📱', tag: 'Builds your brand',
    title: 'Social Media Agent', subtitle: 'Instagram & Facebook on autopilot',
    features: [
      { icon: '📸', text: 'AI drafts posts for Instagram and Facebook' },
      { icon: '📅', text: 'Schedule a full week of content in minutes' },
      { icon: '🎓', text: 'Designs course announcements and success stories' },
      { icon: '⚡', text: 'Maintains a consistent posting schedule' },
      { icon: '🎯', text: 'Tailored to coaching center audiences' },
    ],
  },
  {
    variant: 'campaign', icon: '📣', tag: 'Promotional marketing',
    title: 'Campaign Agent', subtitle: 'WhatsApp broadcast campaigns',
    features: [
      { icon: '📣', text: 'Send admission announcements to parent lists' },
      { icon: '🎁', text: 'Festival offers, batch openings, results celebrations' },
      { icon: '💳', text: 'Prepaid credit system — no surprise bills' },
      { icon: '📊', text: 'Delivery tracking and analytics' },
      { icon: '⚡', text: 'Template management for quick sends' },
    ],
  },
];

const INDUSTRIES = [
  { icon: '🎯', name: 'IIT/NEET Coaching', desc: 'Competitive exam preparation' },
  { icon: '📚', name: 'Tuition Centers', desc: 'School subject coaching' },
  { icon: '💻', name: 'Skill Academies', desc: 'Computer, coding, design' },
  { icon: '🏆', name: 'Competitive Exams', desc: 'UPSC, SSC, Banking' },
  { icon: '🌍', name: 'Language Schools', desc: 'English, foreign languages' },
  { icon: '🎵', name: 'Music & Dance', desc: 'Performing arts academies' },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar', initials: 'RK', image: '/images/owner.png', role: 'Director, Sri Chaitanya Tutorials (Ameerpet)',
    text: 'We were completely invisible on Google. After GrowLokal, parents started finding us directly. Enquiries jumped 3x in the first month.',
  },
  {
    name: 'Priya Sharma', initials: 'PS', image: '/images/priya.png', role: 'Founder, Bright Future Academy (Kukatpally)',
    text: 'The WhatsApp campaigns are incredible. We sent one admission announcement and got 40+ responses the same day in Telugu!',
  },
  {
    name: 'Mohammed Irfan', initials: 'MI', image: '/images/classroom.png', role: 'Principal, Excel IIT Academy (Dilsukhnagar)',
    text: "I used to spend hours writing Google posts and replying to reviews. Now AI does it all — I just approve. Saved me 10 hours a week.",
  },
];

const FAQ_DATA = [
  { q: 'Is this too technical for me?', a: 'Not at all! If you can use WhatsApp, you can use GrowLokal. Our AI handles all the technical marketing work. You just approve what it creates.' },
  { q: 'How soon will I see results?', a: 'Most centers see improvements in their Google visibility within 2-3 weeks. The free audit gives you your baseline score immediately, and our AI starts working on improvements from day one.' },
  { q: 'Does it work in Telugu and Tamil?', a: 'Yes! GrowLokal creates content in Telugu, Tamil, Kannada, and English. Our AI understands the local context and creates authentic vernacular content that resonates with parents in your area.' },
  { q: "What if I don't have a Google Business Profile?", a: "No problem! We'll help you set one up as part of the onboarding process. It's free on Google — and it's the single most important thing for getting found by parents searching online." },
  { q: 'Can I cancel anytime?', a: "Absolutely. There are no contracts or lock-in periods. You can cancel your Growth Plan anytime. The free audit is always free, forever." },
  { q: 'How is GrowLokal different from Grexa?', a: 'We\'re purpose-built for coaching & tuition centers in South India, not a generic tool for all businesses. Our AI speaks Telugu, Tamil, and Kannada natively. And at ₹2,999/month vs their ₹5,000+/month, you save over ₹12,000 per quarter.' },
];
