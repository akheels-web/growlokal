'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  Search,
  Star,
  Share2,
  Building2,
  Gauge,
  Rocket,
  BarChart3,
  FileEdit,
  MapPin,
  Languages,
  MessageCircle,
  Globe,
  UserCheck,
  Send,
  Headphones,
  Camera,
  Calendar,
  Sparkles,
  Clock,
  Target,
  Megaphone,
  Gift,
  CreditCard,
  TrendingUp,
  Zap,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Mail,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/* ─── Official Brand SVG Icons ─── */
function GoogleBusinessOfficialIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.5 20H24V28.5H35.8C34.7 34.3 29.8 38 24 38C16.3 38 10 31.7 10 24C10 16.3 16.3 10 24 10C27.5 10 30.6 11.3 33 13.4L39.4 7C35.3 3.2 29.9 1 24 1C11.3 1 1 11.3 1 24C1 36.7 11.3 47 24 47C36.7 47 45.2 38.1 45.2 24C45.2 22.6 44.9 21.3 44.5 20Z" fill="#4285F4"/>
      <path d="M3.9 14.7L11.3 20.2C13.2 14.2 18.1 10 24 10C27.5 10 30.6 11.3 33 13.4L39.4 7C35.3 3.2 29.9 1 24 1C15.2 1 7.7 6.6 3.9 14.7Z" fill="#EA4335"/>
      <path d="M24 47C29.8 47 35.1 45 38.9 41.6L31.8 36C29.7 37.4 27 38.2 24 38.2C18.2 38.2 13.3 34.5 11.3 28.5L3.9 34.2C7.7 42.1 15.2 47 24 47Z" fill="#34A853"/>
      <path d="M44.5 20H24V28.5H35.8C35.2 31.5 33.8 34.1 31.8 36L38.9 41.6C43.1 37.7 45.5 31.7 45.5 24C45.5 22.6 45.1 21.3 44.5 20Z" fill="#4285F4"/>
      <path d="M11.3 20.2C10.8 21.4 10.5 22.7 10.5 24C10.5 25.3 10.8 26.6 11.3 27.8L3.9 33.5C2.4 30.7 1.5 27.5 1.5 24C1.5 20.5 2.4 17.3 3.9 14.5L11.3 20.2Z" fill="#FBBC05"/>
    </svg>
  );
}

function WhatsAppOfficialIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#F97316" />
      <path d="M23.5 19.8C23.1 19.6 21.1 18.6 20.7 18.5C20.3 18.3 20 18.2 19.7 18.7C19.4 19.1 18.6 20.1 18.3 20.4C18.1 20.7 17.8 20.8 17.4 20.6C17 20.4 15.6 19.9 13.9 18.4C12.6 17.2 11.7 15.8 11.5 15.4C11.3 15 11.5 14.8 11.7 14.6C11.9 14.4 12.1 14.1 12.3 13.9C12.5 13.7 12.6 13.5 12.7 13.3C12.8 13.1 12.8 12.9 12.7 12.7C12.6 12.5 11.7 10.3 11.3 9.4C10.9 8.5 10.5 8.6 10.3 8.6C10.1 8.6 9.8 8.6 9.5 8.6C9.2 8.6 8.7 8.7 8.3 9.1C7.9 9.6 6.8 10.6 6.8 12.7C6.8 14.8 8.3 16.8 8.5 17.1C8.7 17.4 11.5 21.7 15.8 23.5C16.8 23.9 17.6 24.2 18.2 24.4C19.2 24.7 20.1 24.7 20.9 24.6C21.7 24.5 23.4 23.6 23.8 22.5C24.2 21.4 24.2 20.5 24.1 20.3C24 20.1 23.8 20 23.5 19.8Z" fill="#FFFFFF" />
    </svg>
  );
}

function InstagramOfficialIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-grad-agent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#ig-grad-agent)" />
      <path d="M16 9.8C18 9.8 18.2 9.8 19 9.9C19.7 9.9 20.2 10 20.5 10.2C21 10.4 21.3 10.6 21.7 11C22 11.4 22.3 11.8 22.5 12.2C22.6 12.6 22.8 13 22.8 13.7C22.9 14.5 22.9 14.7 22.9 16.7C22.9 18.7 22.9 19 22.8 19.7C22.8 20.4 22.6 20.9 22.5 21.2C22.3 21.7 22 22 21.7 22.4C21.3 22.8 20.9 23 20.5 23.2C20.1 23.4 19.7 23.5 19 23.5C18.2 23.6 18 23.6 16 23.6C14 23.6 13.8 23.6 13 23.5C12.3 23.5 11.8 23.4 11.5 23.2C11 23 10.7 22.8 10.3 22.4C10 22 9.7 21.6 9.5 21.2C9.4 20.8 9.2 20.4 9.2 19.7C9.1 18.9 9.1 18.7 9.1 16.7C9.1 14.7 9.1 14.5 9.2 13.7C9.2 13 9.4 12.5 9.5 12.2C9.7 11.7 10 11.4 10.3 11C10.7 10.6 11.1 10.4 11.5 10.2C11.9 10 12.3 9.9 13 9.9C13.8 9.8 14 9.8 16 9.8ZM16 8.3C13.9 8.3 13.7 8.3 12.8 8.4C12 8.4 11.4 8.6 10.8 8.8C10.2 9 9.7 9.4 9.2 9.9C8.7 10.4 8.3 10.9 8.1 11.5C7.9 12.1 7.7 12.7 7.7 13.5C7.6 14.4 7.6 14.6 7.6 16.7C7.6 18.8 7.6 19 7.7 19.9C7.7 20.7 7.9 21.3 8.1 21.9C8.3 22.5 8.7 23 9.2 23.5C9.7 24 10.2 24.4 10.8 24.6C11.4 24.8 12 25 12.8 25C13.7 25.1 13.9 25.1 16 25.1C18.1 25.1 18.3 25.1 19.2 25C20 25 20.6 24.8 21.2 24.6C21.8 24.4 22.3 24 22.8 23.5C23.3 23 23.7 22.5 23.9 21.9C24.1 21.3 24.3 20.7 24.3 19.9C24.4 19 24.4 18.8 24.4 16.7C24.4 14.6 24.4 14.4 24.3 13.5C24.3 12.7 24.1 12.1 23.9 11.5C23.7 10.9 23.3 10.4 22.8 9.9C22.3 9.4 21.8 9 21.2 8.8C20.6 8.6 20 8.4 19.2 8.4C18.3 8.3 18.1 8.3 16 8.3ZM16 12.4C13.6 12.4 11.7 14.3 11.7 16.7C11.7 19.1 13.6 21 16 21C18.4 21 20.3 19.1 20.3 16.7C20.3 14.3 18.4 12.4 16 12.4ZM16 19.5C14.5 19.5 13.2 18.2 13.2 16.7C13.2 15.2 14.5 13.9 16 13.9C17.5 13.9 18.8 15.2 18.8 16.7C18.8 18.2 17.5 19.5 16 19.5ZM21.5 11.5C21.5 12.1 21 12.6 20.4 12.6C19.8 12.6 19.3 12.1 19.3 11.5C19.3 10.9 19.8 10.4 20.4 10.4C21 10.4 21.5 10.9 21.5 11.5Z" fill="#FFFFFF"/>
    </svg>
  );
}

function WhatsAppCampaignOfficialIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wa-camp-official-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1020" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#wa-camp-official-grad)" />
      <path d="M21.5 11.8C21.2 11.4 20.6 11.1 20 11.1H10C9.4 11.1 8.8 11.4 8.5 11.8C8.2 12.3 8.1 12.9 8.3 13.5L9.7 17.4C9.9 18 10.4 18.4 11 18.6H12V21.6C12 22.2 12.4 22.6 13 22.6H15C15.6 22.6 16 22.2 16 21.6V18.6H17C17.6 18.6 18.1 18.2 18.3 17.6L19.7 13.7C20 13.1 20.6 12.7 21.3 12.7H22.5C23.3 12.7 24 13.4 24 14.2V17C24 17.8 23.3 18.5 22.5 18.5H21.5V20H22.5C24.2 20 25.5 18.7 25.5 17V14.2C25.5 12.5 24.2 11.2 22.5 11.2H21.3C21.4 11.4 21.5 11.6 21.5 11.8Z" fill="#FFFFFF"/>
    </svg>
  );
}

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

/* ─── FAQ Accordion Card ─── */
function FaqCard({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-card ${open ? 'faq-card--open' : ''}`}>
      <h3 className="faq-heading">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          onClick={() => setOpen(!open)}
          className="faq-toggle-btn"
        >
          <span className="faq-question-text">{q}</span>
          <svg
            className={`faq-icon ${open ? 'faq-icon--open' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" className="faq-icon-vert" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </h3>
      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-hidden={!open}
        className="faq-panel"
      >
        <div className="faq-panel-inner">
          <p className="faq-answer-text">{a}</p>
        </div>
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
    badge: '⚡ Built for All South Indian Local Businesses',
    heroTitle1: 'Your All-in-One ',
    heroAccent: 'AI Marketing & Growth Team',
    heroTitle2: ' that Delivers Real Customer Sales',
    heroSub: 'Most local clinics, salons, restaurants & stores lose 60%+ of potential customers on Google Maps. Get a free instant visibility report.',
    auditBadge: '⚡ Instant 30-Sec Scan',
    auditTitle: 'Get your free Google visibility report',
    auditSub: 'Search or select your business details — we will check your Google presence instantly.',
    namePlaceholder: 'Search business name + area (e.g. Green Trends, Ameerpet)',
    phonePlaceholder: 'Enter 10-digit WhatsApp number (e.g. 9876543210)',
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
    painTitle: 'Why local businesses struggle to get new customers',
    painSubtitle: 'If this sounds familiar, you are not alone — and there is an AI fix.',
    stepsEyebrow: 'Simple process',
    stepsTitle: 'How GrowLokal turns Google searches into paying customers',
    stepsSubtitle: 'Three simple steps to automate your local marketing in Telugu, Tamil, Kannada & English.',
    agentsEyebrow: 'Meet your team',
    agentsTitle: '4 Autonomous AI Agents working for your local business 24/7',
    agentsSubtitle: 'No marketing agency needed. Our specialized AI agents handle Google Maps, WhatsApp, Social Media, and Customer Conversion.',
    pricingEyebrow: 'Simple pricing',
    pricingTitle: 'Start free, grow when ready',
    pricingSubtitle: 'The audit is always free. Upgrade for full AI marketing automation.',
    faqEyebrow: 'Questions & Answers',
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Everything you need to know about GrowLokal AI.',
  },
  te: {
    badge: '⚡ దక్షిణాది స్థానిక వ్యాపారాల కోసం ప్రత్యేకంగా తయారుచేయబడింది',
    heroTitle1: 'మీ స్థానిక వ్యాపారానికి ',
    heroAccent: 'రియల్ కస్టమర్లు & ఆదాయం',
    heroTitle2: ' అందించే AI మార్కెటింగ్ టీమ్',
    heroSub: 'హైదరాబాద్ మరియు AP/తెలంగాణలోని 60%+ క్లినిక్‌లు, సెలూన్లు, రెస్టారెంట్లు Google Mapsలో సరైన ప్రెజెన్స్ లేకపోవడం వల్ల కస్టమర్లను కోల్పోతున్నాయి.',
    auditBadge: '⚡ 10-సెకన్ల స్కాన్',
    auditTitle: 'మీ ఉచిత Google రిపోర్ట్ పొందండి',
    auditSub: 'మీ వ్యాపారం పేరు ఎంటర్ చేయండి లేదా శోధించండి — మేము ఇన్స్టంట్‌గా చెక్ చేస్తాము.',
    namePlaceholder: 'మీ వ్యాపారం పేరు శోధించండి (ఉదా. గ్రీన్ ట్రెండ్స్, అమీర్‌పేట్)',
    phonePlaceholder: '10-అంకెల వాట్సాప్ నంబర్ ఎంటర్ చేయండి (ఉదా. 9876543210)',
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
    painTitle: 'స్థానిక వ్యాపారాలు కొత్త కస్టమర్లను పొందడంలో ఎదుర్కొంటున్న సమస్యలు',
    painSubtitle: 'ఇది మీకు తెలిసినట్లు అనిపిస్తే, దీనికి సులభమైన AI పరిష్కారం ఉంది.',
    stepsEyebrow: 'సులభమైన ప్రక్రియ',
    stepsTitle: 'GrowLokal Google శోధనలను చెల్లించే కస్టమర్లుగా ఎలా మారుస్తుంది',
    stepsSubtitle: 'తెలుగు, ఇంగ్లీషులో మీ లోకల్ మార్కెటింగ్‌ను ఆటోమేట్ చేయడానికి 3 సులభమైన దశలు.',
    agentsEyebrow: 'మీ AI టీమ్',
    agentsTitle: 'మీ స్థానిక వ్యాపారం కోసం 24/7 పనిచేసే 4 AI ఏజెంట్లు',
    agentsSubtitle: 'మార్కెటింగ్ ఏజెన్సీ అవసరం లేదు. మన AI ఏజెంట్లు Google Maps, WhatsApp మరియు సోషల్ మీడియాను చూసుకుంటాయి.',
    pricingEyebrow: 'సరళమైన ధరలు',
    pricingTitle: 'ఉచితంగా ప్రారంభించండి, సిద్ధంగా ఉన్నప్పుడు అప్‌గ్రేడ్ చేయండి',
    pricingSubtitle: 'Google ఆడిట్ ఎల్లప్పుడూ ఉచితం. పూర్తి AI మార్కెటింగ్ కోసం అప్‌గ్రేడ్ అవ్వండి.',
    faqEyebrow: 'ప్రశ్నలు & సమాధానాలు',
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    faqSubtitle: 'GrowLokal AI గురించి మీరు తెలుసుకోవలసిన వివరాలు.',
  },
  ta: {
    badge: '⚡ தென்னிந்திய உள்ளூர் வணிகங்களுக்காக உருவாக்கப்பட்டது',
    heroTitle1: 'உங்கள் உள்ளூர் வணிகத்திற்கு ',
    heroAccent: 'உண்மையான வாடிக்கையாளர்கள்',
    heroTitle2: ' வழங்கும் AI சந்தைப்படுத்தல் குழு',
    heroSub: 'கூகிள் மேப்ஸில் தகவல் இல்லாததால் 60%+ கிளினிக்குகள், சலூன்கள், உணவகங்கள் வாடிக்கையாளர்களை இழக்கின்றன.',
    auditBadge: '⚡ 10 வினாடி சோதனை',
    auditTitle: 'இலவச கூகிள் அறிக்கையைப் பெறுங்கள்',
    auditSub: 'உங்கள் வணிகத்தின் பெயரைத் தேடவும் — உடனடி அறிக்கை பெறுங்கள்.',
    namePlaceholder: 'வணிகத்தின் பெயரைத் தேடவும் (எ.கா. கிரீன் ட்ரெண்ட்ஸ், அண்ணா நகர்)',
    phonePlaceholder: '10-இலக்க வாட்ஸ்அப் எண் (எ.கா. 9876543210)',
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
    painTitle: 'உள்ளூர் வணிகங்கள் புதிய வாடிக்கையாளர்களைப் பெற போராடுவது ஏன்',
    painSubtitle: 'இதற்கான AI தீர்வு எங்களிடம் உள்ளது.',
    stepsEyebrow: 'எளிய முறை',
    stepsTitle: 'கூகிள் தேடல்களை வாடிக்கையாளர்களாக மாற்றுவது எப்படி',
    stepsSubtitle: 'உங்கள் உள்ளூர் சந்தைப்படுத்துதலை தானியங்குபடுத்த 3 எளிய படிகள்.',
    agentsEyebrow: 'உங்கள் AI குழு',
    agentsTitle: 'உங்கள் வணிகத்திற்காக 24/7 இயங்கும் 4 AI முகவர்கள்',
    agentsSubtitle: 'கூகிள் மேப்ஸ், வாட்ஸ்அப் மற்றும் சமூக ஊடகங்களை எங்களது AI கையாள்கிறது.',
    pricingEyebrow: 'எளிய விலை',
    pricingTitle: 'இலவசமாக தொடங்குங்கள்',
    pricingSubtitle: 'கூகிள் ஆய்வு எப்போதும் இலவசம்.',
    faqEyebrow: 'கேள்விகள் & பதில்கள்',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    faqSubtitle: 'GrowLokal AI பற்றிய தகவல்கள்.',
  },
  kn: {
    badge: '⚡ ದಕ್ಷಿಣ ಭಾರತದ ಸ್ಥಳೀಯ ಉದ್ಯಮಗಳಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ',
    heroTitle1: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಉದ್ಯಮಕ್ಕೆ ',
    heroAccent: 'ನೈಜ ಗ್ರಾಹಕರು ಮತ್ತು ಆದಾಯ',
    heroTitle2: ' ನೀಡುವ AI ಮಾರ್ಕೆಟಿಂಗ್ ತಂಡ',
    heroSub: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಸರಿಯಾದ ಮಾಹಿತಿಯಿಲ್ಲದೆ 60%+ ಕ್ಲಿನಿಕ್‌ಗಳು, ಸಲೂನ್‌ಗಳು, ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು ಗ್ರಾಹಕರನ್ನು ಕಳೆದುಕೊಳ್ಳುತ್ತವೆ.',
    auditBadge: '⚡ 10 ಸೆಕೆಂಡ್ ಸ್ಕ್ಯಾನ್',
    auditTitle: 'ನಿಮ್ಮ ಉಚಿತ ಗೂಗಲ್ ವರದಿ ಪಡೆಯಿರಿ',
    auditSub: 'ನಿಮ್ಮ ಉದ್ಯಮದ ಹೆಸರು ಹುಡುಕಿ — ತಕ್ಷಣದ ವರದಿ ಪಡೆಯಿರಿ.',
    namePlaceholder: 'ನಿಮ್ಮ ಉದ್ಯಮದ ಹೆಸರು ಹುಡುಕಿ (ಉದಾ. ಗ್ರೀನ್ ಟ್ರೆಂಡ್ಸ್, ಜಯನಗರ)',
    phonePlaceholder: '10-ಅಂಕಿಯ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ (ಉದಾ. 9876543210)',
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
    painTitle: 'ಸ್ಥಳೀಯ ಉದ್ಯಮಗಳು ಹೊಸ ಗ್ರಾಹಕರನ್ನು ಪಡೆಯಲು ಹೆಣಗಾಡುವುದು ಏಕೆ',
    painSubtitle: 'ಇದಕ್ಕೆ ನಮ್ಮಲ್ಲಿ ಸೂಕ್ತ AI ಪರಿಹಾರವಿದೆ.',
    stepsEyebrow: 'ಸುಲಭ ಪ್ರಕ್ರಿಯೆ',
    stepsTitle: 'ಗೂಗಲ್ ಹುಡುಕಾಟಗಳನ್ನು ಗ್ರಾಹಕರನ್ನಾಗಿ ಮಾಡುವುದು ಹೇಗೆ',
    stepsSubtitle: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಾರ್ಕೆಟಿಂಗ್ ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಲು 3 ಸುಲಭ ಹಂತಗಳು.',
    agentsEyebrow: 'ನಿಮ್ಮ AI ತಂಡ',
    agentsTitle: 'ನಿಮ್ಮ ಉದ್ಯಮಕ್ಕಾಗಿ 24/7 ಕೆಲಸ ಮಾಡುವ 4 AI ಏಜೆಂಟ್‌ಗಳು',
    agentsSubtitle: 'ಮಾರ್ಕೆಟಿಂಗ್ ಏಜೆನ್ಸಿ ಅಗತ್ಯವಿಲ್ಲ. ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್, ವಾಟ್ಸಾಪ್ ಮತ್ತು ಸೋಷಿಯಲ್ ಮೀಡಿಯಾವನ್ನು ನಮ್ಮ AI ನಿರ್ವಹಿಸುತ್ತದೆ.',
    pricingEyebrow: 'ಸರಳ ಬೆಲೆಗಳು',
    pricingTitle: 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ',
    pricingSubtitle: 'ಗೂಗಲ್ ಪರಿಶೀಲನೆ ಯಾವಾಗಲೂ ಉಚಿತ.',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  // Live Autocomplete State & Sample Fallback Database
  const [suggestions, setSuggestions] = useState<Array<{ placeId: string; name: string; address: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const SAMPLE_PLACES = [
    { placeId: 'p1', name: 'Digitalvint', address: 'Banjara Hills, Hyderabad, Telangana' },
    { placeId: 'p2', name: 'Green Trends Unisex Hair & Beauty Salon', address: 'Ameerpet, Hyderabad, Telangana' },
    { placeId: 'p3', name: 'Apollo Dental Clinic', address: 'Jubilee Hills, Hyderabad, Telangana' },
    { placeId: 'p4', name: 'Almond House Sweet Shop & Bakery', address: 'Himayatnagar, Hyderabad, Telangana' },
    { placeId: 'p5', name: 'Bawarchi Biryani Restaurant', address: 'RTC X Roads, Musheerabad, Hyderabad' },
    { placeId: 'p6', name: "Dr. Batra's Positive Health Clinic", address: 'Secunderabad, Telangana' },
    { placeId: 'p7', name: 'Gold Gym Fitness Center', address: 'Madhapur, Hitech City, Hyderabad' },
    { placeId: 'p8', name: 'Pista House Haleem & Bakery', address: 'Charminar, Old City, Hyderabad' },
    { placeId: 'p9', name: 'Narayana Dental & Maxillofacial Care', address: 'Kukatpally, Hyderabad, Telangana' },
    { placeId: 'p10', name: 'Naturals Beauty Salon & Spa', address: 'Anna Nagar, Chennai, Tamil Nadu' },
    { placeId: 'p11', name: 'Apollo Pharmacy & Diagnostic Center', address: 'Jayanagar, Bengaluru, Karnataka' },
  ];

  const handleNameChange = async (val: string) => {
    setBusinessName(val);
    const queryStr = val.trim().toLowerCase();
    if (queryStr.length >= 2) {
      const localMatches = SAMPLE_PLACES.filter(
        p => p.name.toLowerCase().includes(queryStr) || p.address.toLowerCase().includes(queryStr)
      );

      try {
        const res = await fetch(`${API}/api/audit/autocomplete?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          const apiSuggestions = data.suggestions || [];
          const combined = [...apiSuggestions];
          localMatches.forEach(lm => {
            if (!combined.some(c => c.name.toLowerCase() === lm.name.toLowerCase())) {
              combined.push(lm);
            }
          });
          setSuggestions(combined.length > 0 ? combined : [{ placeId: 'custom', name: val, address: 'Google Maps Business' }]);
          setShowDropdown(true);
        } else {
          setSuggestions(localMatches.length > 0 ? localMatches : [{ placeId: 'custom', name: val, address: 'Google Business Profile' }]);
          setShowDropdown(true);
        }
      } catch {
        setSuggestions(localMatches.length > 0 ? localMatches : [{ placeId: 'custom', name: val, address: 'Google Business Profile' }]);
        setShowDropdown(true);
      }
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const runAudit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanName = businessName.trim();
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (cleanName.length < 2) {
      setError('Please enter your business name.');
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
      {/* ─── MODERN UNIFIED HEADER & NAVIGATION ─── */}
      <Navbar currentLang={lang} onLangChange={setLang} />

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
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <span className="input-icon">🔍</span>
                <input
                  id="audit-business-name"
                  required
                  placeholder="Search your Google Business Name (e.g. Digitalvint, Green Trends)"
                  value={businessName}
                  onChange={e => handleNameChange(e.target.value)}
                  onFocus={() => businessName.trim().length >= 2 && setShowDropdown(true)}
                  className="form-input"
                  autoComplete="off"
                />
                {showDropdown && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                    background: '#ffffff', border: '1.5px solid #4F46E5', borderRadius: '14px',
                    boxShadow: '0 12px 32px rgba(3, 53, 64, 0.2)', maxHeight: '240px', overflowY: 'auto'
                  }}>
                    {suggestions.map((item, idx) => (
                      <div key={idx}
                        onClick={() => {
                          setBusinessName(item.name);
                          setShowDropdown(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid #f1f5f9',
                          fontSize: '14px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(252, 163, 17, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                      >
                        <strong style={{ color: '#111827', display: 'block', fontSize: '14px' }}>📍 {item.name}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{item.address}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="phone-input-group">
                  <div className="phone-prefix">
                    <svg width="22" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2.5px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', flexShrink: 0 }}>
                      <rect width="20" height="4.67" fill="#FF9933"/>
                      <rect y="4.67" width="20" height="4.67" fill="#FFFFFF"/>
                      <rect y="9.33" width="20" height="4.67" fill="#138808"/>
                      <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.6" fill="none"/>
                    </svg>
                    <span className="phone-code">+91</span>
                    <span className="phone-divider" />
                  </div>
                  <input
                    id="audit-phone"
                    required
                    placeholder="Enter 10-digit WhatsApp number"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="phone-input-field"
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '6px', textAlign: 'left', paddingLeft: '4px', fontWeight: 600 }}>
                  🔒 100% Private • Instant WhatsApp Audit Report Delivery
                </div>
              </div>

              <button id="audit-submit" type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '8px' }}>
                {loading ? <><span className="spinner" />{t.btnLoading}</> : t.btnAudit}
              </button>
            </form>
            <div className="audit-trust-strip">
              <span>🔒 100% Free</span> • <span>Instant WhatsApp Delivery</span> • <span>⚡ 500+ Audited</span>
            </div>
            {loading && (
              <div className="radar-scan-box">
                <div className="radar-sweep-line" />
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-orange)', marginBottom: '4px' }}>
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
              <div className="stat-card-icon">🏬</div>
              <AnimatedNumber target={500} suffix="+" />
              <span className="stat-label">Local Businesses Audited</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">📈</div>
              <AnimatedNumber target={3} suffix="x" />
              <span className="stat-label">More Customer Enquiries</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">⚡</div>
              <AnimatedNumber target={30} suffix="s" />
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

      {/* ─── FREE GROWTH TOOLS SHOWCASE ─── */}
      <Section id="tools">
        <div className="section-header">
          <p className="section-eyebrow">Interactive Growth Tools</p>
          <h2 className="section-title">Free Self-Service Growth Tools</h2>
          <p className="section-subtitle">Audit your local Google presence and calculate your annual business profit growth instantly.</p>
        </div>
        <div className="growth-tools-grid">
          {/* Card 1: Google Score Tool */}
          <div className="growth-tool-card">
            <div>
              <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(252, 163, 17, 0.12)', borderRadius: '14px', color: 'var(--color-orange)', marginBottom: '14px' }}>
                <BarChart3 size={28} strokeWidth={2.2} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#4F46E5', background: 'rgba(79, 70, 229, 0.12)', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Instant Competitor Spy Tool
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#111827', margin: '12px 0 10px', lineHeight: 1.3 }}>
                See Why Competitors Get 3x More Customer Calls
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.96rem', lineHeight: '1.65', marginBottom: '24px' }}>
                Find out why competing local businesses in Ameerpet, Kukatpally, Vizag, or Bengaluru rank higher on Google Maps. Get a side-by-side comparative scorecard in 10 seconds.
              </p>
            </div>
            <div>
              <a href="/tools/google-score-calculator" className="btn-growth-tool-teal">
                Spy On Competitor Score ⚡ →
              </a>
            </div>
          </div>

          {/* Card 2: Revenue Growth Calculator */}
          <div className="growth-tool-card">
            <div>
              <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(20, 33, 61, 0.1)', borderRadius: '14px', color: '#0B1020', marginBottom: '14px' }}>
                <TrendingUp size={28} strokeWidth={2.2} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#F97316', background: 'rgba(249, 115, 22, 0.15)', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📈 Revenue Growth Calculator
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#111827', margin: '12px 0 10px', lineHeight: 1.3 }}>
                Calculate Your 12-Month Revenue Growth
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.96rem', lineHeight: '1.65', marginBottom: '24px' }}>
                See how capturing just 5 to 15 additional local customers per month through GrowLokal AI translates into massive annual profit.
              </p>
            </div>
            <div>
              <a href="/tools/revenue-roi-calculator" className="btn-growth-tool-green">
                Calculate My Business Profit 💰 →
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── PAIN POINTS ─── */}
      <Section id="problems" className="section--alt">
        <div className="section-header">
          <p className="section-eyebrow">{t.painEyebrow}</p>
          <h2 className="section-title">{t.painTitle}</h2>
          <p className="section-subtitle">{t.painSubtitle}</p>
        </div>
        <div ref={painView.ref} className="pain-grid stagger-children">
          {PAIN_POINTS.map((p, i) => {
            const PainIcon = p.icon;
            return (
              <div key={p.title} className={`pain-card fade-up ${painView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="pain-icon" style={{ color: p.color, background: `${p.color}15` }}>
                  <PainIcon size={26} strokeWidth={2.2} />
                </div>
                <div className="pain-stat">{p.stat}</div>
                <h3 className="pain-title">{p.title}</h3>
                <p className="pain-desc">{p.desc}</p>
                <div className="pain-solution">✨ {p.solution}</div>
              </div>
            );
          })}
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
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            return (
              <div key={s.title} className={`step fade-up ${stepsView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="step-icon" style={{ color: s.color }}>
                  <StepIcon size={34} strokeWidth={2} />
                </div>
                <span className="step-number">{i + 1}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-description">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ─── MEET YOUR AI AGENTS ─── */}
      <Section id="agents" className="section--alt">
        <div className="section-header">
          <p className="section-eyebrow">{t.agentsEyebrow}</p>
          <h2 className="section-title">{t.agentsTitle}</h2>
          <p className="section-subtitle">{t.agentsSubtitle}</p>
        </div>

        {/* Shared Brain AI Agents Component */}
        <div className="shared-brain-showcase">
          {/* Left Column: Stack of 4 AI Agent cards with real avatars */}
          <div className="agent-cards-stack">
            <div className="growlokal-agent-card growlokal-agent-card--google">
              <div className="growlokal-agent-avatar-wrap">
                <img src="/images/agent_google.png" alt="Google Business Profile AI Agent" className="growlokal-agent-avatar-img" />
                <span className="agent-avatar-status-pulse" />
              </div>
              <div className="growlokal-agent-info">
                <div className="growlokal-agent-header-row">
                  <span className="growlokal-agent-title">Google Business Profile</span>
                  <span className="growlokal-agent-sparkle">✨ AI Agent</span>
                </div>
                <div className="growlokal-agent-footer-row">
                  <span className="growlokal-agent-subtitle">Bring New Potential Customers</span>
                  <span className="agent-live-tag agent-live-tag--google">
                    <span className="agent-live-dot" /> Live Autopilot
                  </span>
                </div>
              </div>
            </div>

            <div className="growlokal-agent-card growlokal-agent-card--whatsapp">
              <div className="growlokal-agent-avatar-wrap">
                <img src="/images/agent_whatsapp.png" alt="WhatsApp Chat AI Agent" className="growlokal-agent-avatar-img" />
                <span className="agent-avatar-status-pulse" />
              </div>
              <div className="growlokal-agent-info">
                <div className="growlokal-agent-header-row">
                  <span className="growlokal-agent-title">WhatsApp Chat</span>
                  <span className="growlokal-agent-sparkle">✨ AI Agent</span>
                </div>
                <div className="growlokal-agent-footer-row">
                  <span className="growlokal-agent-subtitle">Realtime Customer Interaction</span>
                  <span className="agent-live-tag agent-live-tag--whatsapp">
                    <span className="agent-live-dot" /> Instant 24/7
                  </span>
                </div>
              </div>
            </div>

            <div className="growlokal-agent-card growlokal-agent-card--social">
              <div className="growlokal-agent-avatar-wrap">
                <img src="/images/agent_social.png" alt="Social Media Content AI Agent" className="growlokal-agent-avatar-img" />
                <span className="agent-avatar-status-pulse" />
              </div>
              <div className="growlokal-agent-info">
                <div className="growlokal-agent-header-row">
                  <span className="growlokal-agent-title">Social Media Content</span>
                  <span className="growlokal-agent-sparkle">✨ AI Agent</span>
                </div>
                <div className="growlokal-agent-footer-row">
                  <span className="growlokal-agent-subtitle">Autopilot Posts for Instagram &amp; Facebook</span>
                  <span className="agent-live-tag agent-live-tag--social">
                    <span className="agent-live-dot" /> Auto-Scheduler
                  </span>
                </div>
              </div>
            </div>

            <div className="growlokal-agent-card growlokal-agent-card--campaign">
              <div className="growlokal-agent-avatar-wrap">
                <img src="/images/agent_campaign.png" alt="WhatsApp Marketing AI Agent" className="growlokal-agent-avatar-img" />
                <span className="agent-avatar-status-pulse" />
              </div>
              <div className="growlokal-agent-info">
                <div className="growlokal-agent-header-row">
                  <span className="growlokal-agent-title">WhatsApp Marketing</span>
                  <span className="growlokal-agent-sparkle">✨ AI Agent</span>
                </div>
                <div className="growlokal-agent-footer-row">
                  <span className="growlokal-agent-subtitle">Promotional Marketing to Existing Customers</span>
                  <span className="agent-live-tag agent-live-tag--campaign">
                    <span className="agent-live-dot" /> Vernacular AI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: High-Performance GPU Animated Circuit Connection SVG */}
          <div className="circuit-svg-container" aria-hidden="true">
            <svg className="circuit-connector-svg" viewBox="0 0 160 290" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad-circuit-google" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <linearGradient id="grad-circuit-whatsapp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient id="grad-circuit-social" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0B1020" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
                <linearGradient id="grad-circuit-campaign" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#facc15" />
                </linearGradient>
                <linearGradient id="grad-circuit-merged" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="50%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#0B1020" />
                </linearGradient>
                <filter id="circuit-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Base Static Track Lines */}
              <path d="M0 35 H60 C92 35 92 145 160 145" stroke="#ea580c" strokeWidth="2" opacity="0.18" />
              <path d="M0 108 H60 C92 108 92 145 160 145" stroke="#F97316" strokeWidth="2" opacity="0.18" />
              <path d="M0 182 H60 C92 182 92 145 160 145" stroke="#0B1020" strokeWidth="2" opacity="0.18" />
              <path d="M0 255 H60 C92 255 92 145 160 145" stroke="#ca8a04" strokeWidth="2" opacity="0.18" />

              {/* 2. Flowing Animated Dash Streams */}
              <path id="path-google" d="M0 35 H60 C92 35 92 145 160 145" stroke="url(#grad-circuit-google)" strokeWidth="2.5" strokeDasharray="6 8" className="circuit-stream circuit-stream--google" />
              <path id="path-whatsapp" d="M0 108 H60 C92 108 92 145 160 145" stroke="url(#grad-circuit-whatsapp)" strokeWidth="2.5" strokeDasharray="6 8" className="circuit-stream circuit-stream--whatsapp" />
              <path id="path-social" d="M0 182 H60 C92 182 92 145 160 145" stroke="url(#grad-circuit-social)" strokeWidth="2.5" strokeDasharray="6 8" className="circuit-stream circuit-stream--social" />
              <path id="path-campaign" d="M0 255 H60 C92 255 92 145 160 145" stroke="url(#grad-circuit-campaign)" strokeWidth="2.5" strokeDasharray="6 8" className="circuit-stream circuit-stream--campaign" />

              {/* 3. Merged High-Speed Highway to Brain */}
              <path d="M72 145 H160" stroke="url(#grad-circuit-merged)" strokeWidth="3" strokeDasharray="4 6" className="circuit-stream circuit-stream--merged" />

              {/* 4. Central Convergence Radar Node */}
              <circle cx="72" cy="145" r="12" fill="#F97316" opacity="0.2" className="circuit-radar-wave" />
              <circle cx="72" cy="145" r="7" fill="#F97316" opacity="0.4" className="circuit-radar-core" />
              <circle cx="72" cy="145" r="4.5" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Right Column: Shared Brain Data Intelligence Engine */}
          <div className="brain-engine-box">
            <div className="brain-ambient-glow" />
            <div className="brain-icon-wrap">
              <div className="brain-orbit-ring" />
              <div className="brain-orbit-ring brain-orbit-ring--rev" />
              <span className="brain-icon-emoji">🧠</span>
              <span className="brain-chip-badge">AI</span>
            </div>
            <div className="brain-engine-title">Data Intelligence Engine</div>
            <p className="brain-engine-desc">
              All AI Agents share central memory, customer history, and local business data to convert leads faster.
            </p>
            <div className="brain-live-sync-strip">
              <span className="brain-live-dot" />
              <span>Realtime Memory Syncing</span>
            </div>
          </div>
        </div>



        <div ref={agentsView.ref} className="agents-grid stagger-children">
          {AGENTS.map((a, i) => (
            <div key={a.title} className={`agent-card agent-card--${a.variant} fade-up ${agentsView.visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="agent-header">
                <div className="agent-icon-wrap">
                  {a.iconType === 'google' && <GoogleBusinessOfficialIcon size={34} />}
                  {a.iconType === 'whatsapp' && <WhatsAppOfficialIcon size={34} />}
                  {a.iconType === 'social' && <InstagramOfficialIcon size={34} />}
                  {a.iconType === 'campaign' && <WhatsAppCampaignOfficialIcon size={34} />}
                </div>
                <div>
                  <div className="agent-title">{a.title}</div>
                  <div className="agent-subtitle">{a.subtitle}</div>
                </div>
              </div>
              <span className="agent-tag">{a.tag}</span>
              <ul className="agent-features">
                {a.features.map((f, idx) => {
                  const FeatureIcon = f.icon;
                  return (
                    <li key={idx}>
                      <span className="agent-feature-icon">
                        <FeatureIcon size={15} strokeWidth={2.2} />
                      </span>
                      <span>{f.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── BUILT FOR SMALL BUSINESS OWNERS ─── */}
      <Section id="industries">
        <div className="section-header">
          <p className="section-eyebrow">Tailored for Every Local Niche</p>
          <h2 className="section-title">Built for Small Business Owners</h2>
          <p className="section-subtitle">You focus on your craft and leave the hassle of growth marketing to GrowLokal AI</p>
        </div>
        <div ref={industryView.ref} className="biz-showcase-grid stagger-children">
          {BUSINESS_TYPES.map((biz, i) => (
            <Link
              key={biz.name}
              href={`/industry/${biz.slug}`}
              className={`biz-showcase-card fade-up ${industryView.visible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 60}ms`, textDecoration: 'none' }}
            >
              <div>
                <div className="biz-showcase-title">{biz.name}</div>
                <span className="biz-showcase-badge">Explore AI Plan →</span>
              </div>
              <div className="biz-showcase-img-wrap">
                <img src={biz.image} alt={biz.name} className="biz-showcase-img" />
              </div>
            </Link>
          ))}

          {/* Feature CTA Card matching GrowLokal style */}
          <div
            className={`biz-showcase-cta-card fade-up ${industryView.visible ? 'visible' : ''}`}
            style={{ transitionDelay: `${BUSINESS_TYPES.length * 60}ms` }}
          >
            <div>
              <div style={{ fontSize: '1.28rem', fontWeight: '800', marginBottom: '6px', fontFamily: 'var(--font-body), sans-serif', letterSpacing: '-0.01em' }}>
                And many more businesses like yours
              </div>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.96rem', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-body), sans-serif' }}>
                Get more leads &amp; customers from Google Maps &amp; WhatsApp on autopilot.
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%2C%20I%20want%20to%20know%20more%20about%20GrowLokal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#F97316',
                color: '#ffffff',
                fontWeight: '700',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: '14.5px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'transform 0.2s ease'
              }}
            >
              <span>💬 Try on WhatsApp</span>
            </a>
          </div>
        </div>
      </Section>

      {/* ─── REAL RESULTS: 30-DAY TRANSFORMATION SHOWCASE ─── */}
      <Section id="results" className="section--alt results-showcase-section">
        <div className="section-header">
          <p className="section-eyebrow">⚡ Proven ROI &amp; Local Dominance</p>
          <h2 className="section-title">What Happens in 30 Days with GrowLokal AI</h2>
          <p className="section-subtitle">
            From hidden on Google Search &amp; Maps to the #1 choice in your area — fully automated on WhatsApp.
          </p>
        </div>

        {/* Before / After Visual Interactive Showcase */}
        <div className="results-compare-wrapper">
          {/* Card 1: BEFORE GrowLokal */}
          <div className="results-card results-card--before">
            <div className="results-card-badge results-card-badge--before">
              <span>⚠️ Day 1 — Before GrowLokal</span>
            </div>

            <div className="results-img-frame">
              <img
                src="/images/results_day1_before.jpg"
                alt="Business buried at position 18 on Google Maps with low visibility score"
                className="results-img"
              />
              <div className="results-img-overlay results-img-overlay--before">
                <div className="results-score-pill results-score-pill--low">
                  <span className="results-score-num">23</span>
                  <span className="results-score-denom">/100</span>
                </div>
              </div>
            </div>

            <div className="results-card-content">
              <h3 className="results-card-title results-card-title--before">Invisible to Nearby Customers</h3>
              <p className="results-card-desc">
                Low Google ranking, missing reviews, no vernacular posts, and zero automated response system.
              </p>
              <ul className="results-metrics-list">
                <li className="results-metric-item metric--negative">
                  <span className="metric-icon">❌</span>
                  <span>Google Maps Rank: <strong>#18 in local area</strong></span>
                </li>
                <li className="results-metric-item metric--negative">
                  <span className="metric-icon">❌</span>
                  <span>Review Response Rate: <strong>0% (Ignored)</strong></span>
                </li>
                <li className="results-metric-item metric--negative">
                  <span className="metric-icon">❌</span>
                  <span>Monthly Inquiries: <strong>Only 4-5 phone calls</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Center Badge / Arrow */}
          <div className="results-compare-arrow-wrap">
            <div className="results-arrow-circle">
              <span style={{ fontSize: '18px' }}>⚡</span>
              <span className="results-arrow-label">30 DAYS</span>
            </div>
          </div>

          {/* Card 2: AFTER 30 Days */}
          <div className="results-card results-card--after">
            <div className="results-card-badge results-card-badge--after">
              <span>🚀 Day 30 — With GrowLokal</span>
            </div>

            <div className="results-img-frame">
              <img
                src="/images/results_day30_after.jpg"
                alt="Business ranking #1 on Google Maps Local Pack with top rating"
                className="results-img"
              />
              <div className="results-img-overlay results-img-overlay--after">
                <div className="results-score-pill results-score-pill--high">
                  <span className="results-score-num">87</span>
                  <span className="results-score-denom">/100</span>
                </div>
              </div>
            </div>

            <div className="results-card-content">
              <h3 className="results-card-title results-card-title--after">#1 Local Pack &amp; 3x Enquiries</h3>
              <p className="results-card-desc">
                Fully optimized profile, weekly vernacular AI posts, warm 1-click review replies &amp; automated WhatsApp lead captures.
              </p>
              <ul className="results-metrics-list">
                <li className="results-metric-item metric--positive">
                  <span className="metric-icon" style={{ color: "#F97316", fontWeight: "900" }}>✓</span>
                  <span>Google Maps Rank: <strong>#1 Top Local Pack</strong></span>
                </li>
                <li className="results-metric-item metric--positive">
                  <span className="metric-icon" style={{ color: "#F97316", fontWeight: "900" }}>✓</span>
                  <span>Review Response Rate: <strong>100% (Instant AI)</strong></span>
                </li>
                <li className="results-metric-item metric--positive">
                  <span className="metric-icon" style={{ color: "#F97316", fontWeight: "900" }}>✓</span>
                  <span>Monthly Inquiries: <strong>48+ WhatsApp Leads</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Transformation Grid */}
        <div className="results-pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-wrap icon-wrap--emerald">📍</div>
            <h4 className="pillar-title">Google Maps Pack #1</h4>
            <p className="pillar-desc">
              Dominates local &ldquo;near me&rdquo; customer searches on Google Maps &amp; Search with optimized keywords.
            </p>
            <div className="pillar-stat-tag stat-tag--emerald">+278% Map Views</div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrap icon-wrap--blue">🗣️</div>
            <h4 className="pillar-title">Vernacular AI Posts</h4>
            <p className="pillar-desc">
              Weekly festive offers and updates written automatically in Telugu, Tamil, Kannada, and English.
            </p>
            <div className="pillar-stat-tag stat-tag--blue">4 Languages Native</div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrap icon-wrap--purple">⭐</div>
            <h4 className="pillar-title">100% Review Replies</h4>
            <p className="pillar-desc">
              AI drafts warm, professional review replies in seconds. You just click approve on WhatsApp.
            </p>
            <div className="pillar-stat-tag stat-tag--purple">&lt; 2-Min Response</div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrap icon-wrap--amber">💬</div>
            <h4 className="pillar-title">WhatsApp Lead Funnel</h4>
            <p className="pillar-desc">
              Captures customer leads 24/7 with instant booking links and automated answer bots.
            </p>
            <div className="pillar-stat-tag stat-tag--amber">3x Enquiry Growth</div>
          </div>
        </div>

        {/* Bottom CTA Banner inside Results */}
        <div className="results-bottom-cta">
          <div>
            <h4 className="results-cta-heading">Ready to see your business score jump from 23 to 87?</h4>
            <p className="results-cta-sub">Run your free 30-second Google Business Audit now. No credit card required.</p>
          </div>
          <a href="#audit-form" className="results-cta-btn">
            <span>⚡ Audit My Business Free</span>
          </a>
        </div>
      </Section>

      {/* ─── PLATFORM PROMISE (HONEST STARTUP PROMISE) ─── */}
      <Section id="guarantee">
        <div className="section-header">
          <p className="section-eyebrow">Our Early Access Guarantee</p>
          <h2 className="section-title">Built specifically for your local business</h2>
          <p className="section-subtitle">We are committed to delivering real customer sales growth from day one.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="pain-icon">🇮🇳</div>
            <h3 className="pain-title">100% Vernacular Accuracy</h3>
            <p className="testimonial-text">&ldquo;All AI posts and customer replies are generated natively in Telugu, Tamil, Kannada, and English — tuned specifically for South Indian local business terminology.&rdquo;</p>
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
          <p className="section-eyebrow">Transparent Pricing</p>
          <h2 className="section-title">Transparent pricing plans, find the perfect fit for your needs</h2>
          <p className="section-subtitle">No hidden fees, no long-term contracts. Upgrade or cancel anytime.</p>

          {/* Monthly / Annually Toggle Bar matching GoSaaS */}
          <div className="pricing-toggle-bar">
            <span
              className={`pricing-toggle-label ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </span>
            <button
              className={`pricing-switch-btn ${billingCycle === 'annually' ? 'active' : ''}`}
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annually' : 'monthly')}
              aria-label="Toggle Monthly or Annual Billing"
              type="button"
            >
              <div className="pricing-switch-thumb" />
            </button>
            <span
              className={`pricing-toggle-label ${billingCycle === 'annually' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annually')}
            >
              Annually
            </span>
            <span className="pricing-save-badge">
              <span style={{ fontSize: '14px' }}>↵</span> Save 20%
            </span>
          </div>
        </div>

        <div className="pricing-gosaas-wrapper">
          <div className="pricing-gosaas-grid">
            {/* Card 1: Free Plan */}
            <div className="pricing-card-free">
              <div>
                <div className="pricing-plan-title" style={{ color: '#0F172A' }}>Free</div>
                <p className="pricing-plan-subtitle" style={{ color: '#64748B' }}>Free for your local business</p>
                <div className="pricing-divider" />
                <div className="pricing-price-val" style={{ color: '#0F172A' }}>
                  ₹0 <span className="pricing-price-period" style={{ color: '#64748B' }}>/ month</span>
                </div>

                <ul className="pricing-feature-list">
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Instant Google Business Profile audit score</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Competitor benchmark scorecard</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Telugu, Tamil, Kannada &amp; English support</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Direct WhatsApp audit report delivery</span>
                  </li>
                  <li className="pricing-feature-item" style={{ color: '#94A3B8' }}>
                    <span className="pricing-icon-cross">✕</span>
                    <span>Weekly AI-written Google Business posts</span>
                  </li>
                  <li className="pricing-feature-item" style={{ color: '#94A3B8' }}>
                    <span className="pricing-icon-cross">✕</span>
                    <span>24/7 Automated WhatsApp Chatbot responder</span>
                  </li>
                  <li className="pricing-feature-item" style={{ color: '#94A3B8' }}>
                    <span className="pricing-icon-cross">✕</span>
                    <span>Instagram &amp; Facebook post scheduler</span>
                  </li>
                  <li className="pricing-feature-item" style={{ color: '#94A3B8' }}>
                    <span className="pricing-icon-cross">✕</span>
                    <span>WhatsApp Broadcast Campaign manager</span>
                  </li>
                </ul>
              </div>
              <a href="#audit-form" className="pricing-btn-free">
                Choose Plan
              </a>
            </div>

            {/* Card 2: Starter Plan */}
            <div className="pricing-card-free">
              <div>
                <div className="pricing-plan-title" style={{ color: '#0F172A' }}>Starter</div>
                <p className="pricing-plan-subtitle" style={{ color: '#64748B' }}>For small businesses just getting started</p>
                <div className="pricing-divider" />
                <div className="pricing-price-val" style={{ color: '#0F172A' }}>
                  ₹{billingCycle === 'annually' ? '799' : '999'}{' '}
                  <span className="pricing-price-period" style={{ color: '#64748B' }}>/ month</span>
                </div>
                {billingCycle === 'annually' && (
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#F97316', marginTop: '-18px', marginBottom: '22px' }}>
                    ⚡ Billed annually (₹9,588/yr — Save ₹2,400)
                  </div>
                )}

                <ul className="pricing-feature-list">
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Everything in Free</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Weekly AI Google Business Profile posts</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>24/7 automated WhatsApp customer responder</span>
                  </li>
                  <li className="pricing-feature-item" style={{ color: '#94A3B8' }}>
                    <span className="pricing-icon-cross">✕</span>
                    <span>Instagram &amp; Facebook post scheduler</span>
                  </li>
                  <li className="pricing-feature-item" style={{ color: '#94A3B8' }}>
                    <span className="pricing-icon-cross">✕</span>
                    <span>WhatsApp broadcast campaigns</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%2C%20I%20want%20to%20subscribe%20to%20the%20Starter%20Plan"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn-free"
              >
                Choose Plan
              </a>
            </div>

            {/* Card 3: Growth Plan (Featured) */}
            <div className="pricing-card-standard">
              <div className="pricing-ribbon-badge">Most Popular</div>
              <div>
                <div className="pricing-plan-title">Growth</div>
                <p className="pricing-plan-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Most popular — full automation for growing businesses</p>
                <div className="pricing-divider" />
                <div className="pricing-price-val">
                  ₹{billingCycle === 'annually' ? '1,999' : '2,499'}{' '}
                  <span className="pricing-price-period">/ month</span>
                </div>
                {billingCycle === 'annually' && (
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#ffd166', marginTop: '-18px', marginBottom: '22px', letterSpacing: '0.02em' }}>
                    ⚡ Billed annually (₹23,988/yr — Save ₹6,000)
                  </div>
                )}

                <ul className="pricing-feature-list">
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Everything in Starter</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Auto-drafted review replies (1-click approve)</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Instagram &amp; Facebook post scheduler</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Instant customer booking microsite page</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>WhatsApp broadcast campaign manager</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%2C%20I%20want%20to%20subscribe%20to%20the%20Growth%20Plan"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn-standard"
              >
                Choose Plan
              </a>
            </div>

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
              <span style={{ padding: '3px 10px', background: 'rgba(249, 115, 22, 0.15)', color: '#F97316', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>OPTIONAL ADD-ON</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: 0 }}>🌐 Custom Local Business Website Creation</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '4px 0 0' }}>
              Don&apos;t have a dedicated website? We build a fast, mobile-ready 5-page website with your services, photos &amp; direct WhatsApp enquiry forms.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0B1020' }}>+₹4,999 <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>one-time</span></div>
              <div style={{ fontSize: '11px', color: '#F97316', fontWeight: '700' }}>70% cheaper than agencies</div>
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
                background: '#0B1020',
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

      {/* ─── FAQ (2-COLUMN ACCORDION) ─── */}
      <Section id="faq">
        <div className="section-header">
          <p className="section-eyebrow">{t.faqEyebrow}</p>
          <h2 className="section-title">{t.faqTitle}</h2>
          <p className="section-subtitle">{t.faqSubtitle}</p>
        </div>

        <div className="faq-2col-grid">
          <div className="faq-col">
            {FAQ_DATA.slice(0, Math.ceil(FAQ_DATA.length / 2)).map((f, idx) => (
              <FaqCard key={f.q} id={`left-${idx}`} q={f.q} a={f.a} />
            ))}
          </div>
          <div className="faq-col">
            {FAQ_DATA.slice(Math.ceil(FAQ_DATA.length / 2)).map((f, idx) => (
              <FaqCard key={f.q} id={`right-${idx}`} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CONTACT US SECTION & FORM ─── */}
      <ContactSection />

      {/* ─── CRAZY MODERN FINAL CTA SECTION ─── */}
      <section className="crazy-cta-section" id="final-cta">
        <div className="crazy-cta-container">
          {/* Ambient Lighting Orbs */}
          <div className="crazy-cta-glow crazy-cta-glow--teal" />
          <div className="crazy-cta-glow crazy-cta-glow--green" />
          <div className="crazy-cta-glow crazy-cta-glow--gold" />

          <div className="crazy-cta-card">
            {/* Left Column: Visual Specialist & Live Interaction Showcase */}
            <div className="crazy-cta-visual-col">
              <div className="crazy-specialist-wrapper">
                <img
                  src="/images/specialist_chat.jpg"
                  alt="GrowLokal Local Growth Specialist"
                  className="crazy-specialist-img"
                />
                
                {/* Live Online Badge */}
                <div className="crazy-live-badge">
                  <span className="crazy-live-pulse-dot" />
                  <div className="crazy-live-text">
                    <span className="crazy-live-title">Growth Specialist Online</span>
                    <span className="crazy-live-sub">Telugu • Tamil • Kannada • English</span>
                  </div>
                </div>

                {/* Verified Rating Floating Pill */}
                <div className="crazy-rating-pill">
                  <Star size={14} className="crazy-star-icon" fill="#f59e0b" color="#f59e0b" />
                  <span><strong>4.9/5</strong> (1,200+ Audits Done)</span>
                </div>

                {/* Floating Interactive Micro Chat Bubble */}
                <div className="crazy-chat-bubble">
                  <div className="crazy-chat-avatar">
                    <WhatsAppOfficialIcon size={24} />
                  </div>
                  <div className="crazy-chat-content">
                    <p className="crazy-chat-msg">
                      "Namaste! Ready to get <strong>3x more customer calls</strong> from Google Maps in your area?"
                    </p>
                    <span className="crazy-chat-time">⚡ Instant 30s Report • Zero Setup Fee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High Impact Content & Buttons */}
            <div className="crazy-cta-content-col">
              <div className="crazy-super-badge">
                <Sparkles size={14} className="crazy-sparkle-icon" />
                <span>Instant Self-Service Google Audit</span>
              </div>

              <h2 className="crazy-cta-title">
                Ready to Stop Losing Local Customers to Competitors?
              </h2>

              <p className="crazy-cta-subtitle">
                Get your business audited on Google Search & Maps in 30 seconds. We’ll show you exactly why competing stores rank above you and how to overtake them on autopilot.
              </p>

              {/* 3 Fast Advantage Badges */}
              <div className="crazy-benefits-grid">
                <div className="crazy-benefit-item">
                  <div className="crazy-benefit-icon crazy-benefit-icon--teal">
                    <BarChart3 size={16} strokeWidth={2.5} />
                  </div>
                  <div className="crazy-benefit-text">
                    <span className="crazy-benefit-title">30-Sec Google Score</span>
                    <span className="crazy-benefit-desc">Side-by-side competitor benchmark</span>
                  </div>
                </div>

                <div className="crazy-benefit-item">
                  <div className="crazy-benefit-icon crazy-benefit-icon--green">
                    <Languages size={16} strokeWidth={2.5} />
                  </div>
                  <div className="crazy-benefit-text">
                    <span className="crazy-benefit-title">Vernacular AI Autopilot</span>
                    <span className="crazy-benefit-desc">Posts & replies in Te / Ta / Kn / En</span>
                  </div>
                </div>

                <div className="crazy-benefit-item">
                  <div className="crazy-benefit-icon crazy-benefit-icon--gold">
                    <ShieldCheck size={16} strokeWidth={2.5} />
                  </div>
                  <div className="crazy-benefit-text">
                    <span className="crazy-benefit-title">7-Day Money-Back</span>
                    <span className="crazy-benefit-desc">100% risk-free local growth</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="crazy-cta-buttons-group">
                <a href="#audit-form" className="btn-crazy-cta-primary">
                  <span>Get Free Google Report</span>
                  <ArrowRight size={18} strokeWidth={2.5} className="crazy-btn-arrow" />
                </a>

                <a
                  href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%2C%20I%20want%20a%20free%20demo%20of%20GrowLokal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-crazy-cta-whatsapp"
                >
                  <WhatsAppOfficialIcon size={20} />
                  <span>Book Free Demo on WhatsApp</span>
                </a>
              </div>

              {/* Micro Trust Strip */}
              <div className="crazy-trust-strip">
                <span className="crazy-trust-item">
                  <CheckCircle2 size={14} className="crazy-trust-icon" />
                  <span>No credit card required</span>
                </span>
                <span className="crazy-trust-item">
                  <CheckCircle2 size={14} className="crazy-trust-icon" />
                  <span>Instant WhatsApp report</span>
                </span>
                <span className="crazy-trust-item">
                  <CheckCircle2 size={14} className="crazy-trust-icon" />
                  <span>100% private & secure</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RICH SEO FOOTER ─── */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Col 1: Brand & Tagline */}
            <div className="footer-brand-col">
              <a href="/" className="footer-brand">Grow<span>Lokal</span></a>
              <p className="footer-tagline">
                The #1 AI Marketing Platform built for South Indian Local Businesses. Grow your sales on Google, WhatsApp, and social media on autopilot.
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
                <li className="footer-link-item"><a href="/tools/revenue-roi-calculator">Revenue Growth Calculator</a></li>
                <li className="footer-link-item"><a href="/resources/whatsapp-kit">WhatsApp Growth Kit</a></li>
                <li className="footer-link-item"><a href="/blog">Local SEO Playbooks</a></li>
                <li className="footer-link-item"><a href="#audit-form">Free Google Audit</a></li>
              </ul>
            </div>

            {/* Col 3: Industry Solutions */}
            <div>
              <h4 className="footer-col-title">Solutions</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><Link href="/industry/doctors-clinics">Clinics &amp; Healthcare</Link></li>
                <li className="footer-link-item"><Link href="/industry/salons-spas">Salons &amp; Spas</Link></li>
                <li className="footer-link-item"><Link href="/industry/restaurants-cafes">Restaurants &amp; Cafes</Link></li>
                <li className="footer-link-item"><Link href="/industry/gyms-fitness">Gyms &amp; Fitness</Link></li>
                <li className="footer-link-item"><Link href="/industry/bakers-cake-shops">Bakeries &amp; Cake Shops</Link></li>
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
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>Google Pay</title>
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" />
                <text x="22" y="18" fontSize="10" fontWeight="800" textAnchor="middle" fill="#4285F4" fontFamily="sans-serif">GPay</text>
              </svg>
              {/* PhonePe */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>PhonePe</title>
                <rect width="44" height="28" rx="5" fill="#5f259f" />
                <text x="22" y="19" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">पे</text>
              </svg>
              {/* Paytm */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>Paytm</title>
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" />
                <text x="22" y="18" fontSize="9" fontWeight="900" textAnchor="middle" fill="#002E6E" fontFamily="sans-serif">Pay<tspan fill="#00BAF2">tm</tspan></text>
              </svg>
              {/* BHIM UPI */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>BHIM UPI</title>
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" />
                <text x="22" y="17" fontSize="10" fontWeight="900" textAnchor="middle" fill="#EA580C" fontFamily="sans-serif">UPI</text>
              </svg>
              {/* VISA */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>Visa</title>
                <rect width="44" height="28" rx="5" fill="#1A1F71" />
                <text x="22" y="18" fontSize="11" fontWeight="900" fontStyle="italic" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">VISA</text>
              </svg>
              {/* Mastercard */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>Mastercard</title>
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" />
                <circle cx="17" cy="14" r="8" fill="#EB001B" />
                <circle cx="27" cy="14" r="8" fill="#F79E1B" opacity="0.88" />
              </svg>
              {/* RuPay */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>RuPay</title>
                <rect width="44" height="28" rx="5" fill="#ffffff" stroke="#cbd5e1" />
                <text x="22" y="17" fontSize="9" fontWeight="900" textAnchor="middle" fill="#0076BF" fontFamily="sans-serif">RuPay</text>
              </svg>
              {/* NetBanking */}
              <svg className="payment-svg-logo" viewBox="0 0 44 28">
                <title>Net Banking</title>
                <rect width="44" height="28" rx="5" fill="#0B1020" />
                <text x="22" y="17" fontSize="8" fontWeight="800" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">BANK</text>
              </svg>
            </div>          </div>
        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP BUTTON ─── */}
      <div className="floating_btn">
        <a
          href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20know%20more%20about%20GrowLokal"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with GrowLokal"
        >
          <div className="contact_icon">
            <svg
              viewBox="0 0 32 32"
              width="34"
              height="34"
              fill="#ffffff"
              aria-hidden="true"
            >
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.68.75 5.18 2.06 7.32L2 30l6.89-1.99C11 29.21 13.43 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.55c-2.3 0-4.47-.67-6.3-1.83l-.45-.29-4.68 1.35 1.36-4.54-.3-.47C4.41 19.92 3.73 17.99 3.73 16c0-6.77 5.5-12.27 12.27-12.27 6.77 0 12.27 5.5 12.27 12.27 0 6.77-5.5 12.28-12.27 12.28zm6.73-9.19c-.37-.18-2.18-1.08-2.52-1.2-.34-.12-.59-.18-.84.18-.25.37-.96 1.2-1.18 1.45-.22.25-.43.28-.8.09-.37-.18-1.56-.58-2.98-1.84-1.1-0.98-1.85-2.19-2.07-2.56-.22-.37-.02-.57.16-.75.17-.16.37-.43.55-.65.18-.22.25-.37.37-.62.12-.25.06-.46-.03-.65-.09-.18-.84-2.02-1.15-2.77-.3-.72-.61-.63-.84-.64l-.71-.01c-.25 0-.65.09-.99.46-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.33 3.6 1.52 3.85.18.25 2.62 4 6.35 5.61.89.38 1.58.61 2.12.78.89.28 1.7.24 2.34.15.72-.11 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.1-.15-.34-.24-.71-.43z" />
            </svg>
          </div>
        </a>
        <p className="text_icon">Talk to us?</p>
      </div>

      {/* ─── LIVE AI ACTIVITY TOAST (FOMO FEED) ─── */}
      <LiveToastFeed />
    </div>
  );
}

function ContactSection() {
  const [contactName, setContactName] = useState('');
  const [contactBiz, setContactBiz] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    setContactSubmitted(true);
    const msg = `Hi GrowLokal Team, my name is ${contactName} from ${contactBiz || 'my local business'}. Phone: +91 ${contactPhone}. Query: ${contactMsg || 'I want to know more about GrowLokal AI.'}`;
    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <Section id="contact" className="section--alt contact-section">
      <div className="section-header">
        <p className="section-eyebrow">Get In Touch</p>
        <h2 className="section-title">Talk to Our Local Growth Specialists</h2>
        <p className="section-subtitle">
          Have questions about onboarding, vernacular AI setup, or pricing? We&apos;re here to help your business grow.
        </p>
      </div>

      <div className="contact-grid">
        {/* Left: Interactive Enquiry Form */}
        <div className="contact-form-card">
          <h3 className="contact-card-title">Send us a direct message</h3>
          <p className="contact-card-subtitle">
            Fill in your details below and our Hyderabad support team will reply on WhatsApp within 15 minutes.
          </p>

          {contactSubmitted ? (
            <div className="contact-success-box">
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
              <h4 style={{ color: '#0B1020', fontWeight: 800, fontSize: '18px', margin: '0 0 6px' }}>
                Thank you! Message forwarded to WhatsApp.
              </h4>
              <p style={{ color: '#334155', fontSize: '14px', margin: 0 }}>
                Our team is connecting with you right now on WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="contact-input"
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-label">Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Dental / Royal Salon"
                    value={contactBiz}
                    onChange={(e) => setContactBiz(e.target.value)}
                    className="contact-input"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">WhatsApp Number *</label>
                <div className="phone-input-group">
                  <div className="phone-prefix">
                    <svg width="22" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2.5px', flexShrink: 0 }}>
                      <rect width="20" height="4.67" fill="#FF9933"/>
                      <rect y="4.67" width="20" height="4.67" fill="#FFFFFF"/>
                      <rect y="9.33" width="20" height="4.67" fill="#138808"/>
                      <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.6" fill="none"/>
                    </svg>
                    <span className="phone-code">+91</span>
                    <span className="phone-divider" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="phone-input-field"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">How can we help your business?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your business goals (e.g. Need more patient bookings, Google Maps ranking, Telugu WhatsApp campaigns...)"
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="contact-textarea"
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                <span>💬 Send via WhatsApp Support →</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Helpline & Office Cards */}
        <div className="contact-info-stack">
          {/* Card 1: WhatsApp Support */}
          <a
            href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-info-card contact-info-card--wa"
          >
            <div className="contact-info-icon">💬</div>
            <div>
              <div className="contact-info-badge">Fastest Response (2 Mins)</div>
              <h4 className="contact-info-title">WhatsApp Support Desk</h4>
              <p className="contact-info-desc">Chat directly with our South Indian business advisors in Telugu, Tamil, Kannada, or English.</p>
              <div className="contact-info-action">+91 98765 43210 →</div>
            </div>
          </a>

          {/* Card 2: Phone Helpline */}
          <div className="contact-info-card">
            <div className="contact-info-icon">📞</div>
            <div>
              <div className="contact-info-badge">Mon - Sat (9 AM - 8 PM IST)</div>
              <h4 className="contact-info-title">Direct Helpline</h4>
              <p className="contact-info-desc">Speak to our customer onboarding team for account setup and custom integrations.</p>
              <div className="contact-info-phone">+91 (040) 4892-3100</div>
            </div>
          </div>

          {/* Card 3: Office Address */}
          <div className="contact-info-card">
            <div className="contact-info-icon">📍</div>
            <div>
              <div className="contact-info-badge">Headquarters</div>
              <h4 className="contact-info-title">Hyderabad Office</h4>
              <p className="contact-info-desc">Plot 42, Hitech City Main Road, Madhapur, Hyderabad, Telangana 500081</p>
              <div className="contact-info-email">support@growlokal.com</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function LiveToastFeed() {
  const toasts = [
    '⚡ Apollo Dental Clinic, Ameerpet generated +14 WhatsApp inquiries (2m ago)',
    '📍 Green Trends Salon, Kukatpally Google Score upgraded 23 → 89 (5m ago)',
    '💇 Almond House Bakery, Himayatnagar scheduled 5 IG posts (12m ago)',
    '🚀 Gold Gym Fitness, Vijayawada booked 8 appointments today (18m ago)',
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
    icon: Search,
    color: '#ea580c',
    stat: '60%',
    title: "Customers can't find you on Google",
    desc: 'When a customer searches "best clinic / salon / store near me", your competitors show up — but you don\'t. You\'re invisible where it matters most.',
    solution: 'Google Leads Agent fixes your profile + posts weekly',
  },
  {
    icon: Star,
    color: '#eab308',
    stat: '73%',
    title: 'Your reviews go unanswered',
    desc: '73% of consumers expect a response to reviews. Every ignored review costs you trust — and new customer bookings.',
    solution: 'AI drafts warm replies in seconds, you just approve',
  },
  {
    icon: Share2,
    color: '#0B1020',
    stat: '1x/mo',
    title: 'Social media is an afterthought',
    desc: "You know you should post on Instagram and Facebook, but who has the time? So it happens once a month — maybe.",
    solution: 'Social Agent posts to IG + FB automatically every week',
  },
];

const STEPS = [
  {
    icon: Building2,
    color: '#4F46E5',
    title: 'Enter your business name',
    desc: "Tell us your business's name and area — we do the rest."
  },
  {
    icon: Gauge,
    color: '#F97316',
    title: 'Get your Google score',
    desc: 'Our AI scans your Google Business Profile and scores it instantly out of 100.'
  },
  {
    icon: Rocket,
    color: '#0B1020',
    title: 'Fix gaps with AI',
    desc: 'Get AI-generated posts, review replies, and campaigns — all automated.'
  },
];

const AGENTS = [
  {
    variant: 'google',
    iconType: 'google',
    tag: 'Brings new customers',
    title: 'Google Leads Agent',
    subtitle: 'Get found on Google Search & Maps',
    features: [
      { icon: BarChart3, text: 'Audits your Google Business Profile and scores it' },
      { icon: FileEdit, text: 'Publishes weekly AI-written posts on your GBP' },
      { icon: Star, text: 'Drafts professional replies to every review' },
      { icon: MapPin, text: 'Optimizes your profile for "near me" searches' },
      { icon: Languages, text: 'Generates vernacular content in Telugu/Tamil/English' },
    ],
  },
  {
    variant: 'whatsapp',
    iconType: 'whatsapp',
    tag: 'Real-time interaction',
    title: 'WhatsApp Chat Agent',
    subtitle: 'Answer customer enquiries 24/7',
    features: [
      { icon: MessageCircle, text: 'Answers pricing, service, and appointment questions instantly' },
      { icon: Globe, text: 'Works in Telugu, Tamil, Kannada, and English' },
      { icon: UserCheck, text: 'Captures lead info automatically' },
      { icon: Send, text: 'Sends audit reports directly on WhatsApp' },
      { icon: Headphones, text: 'Hands off to you when it needs a human touch' },
    ],
  },
  {
    variant: 'social',
    iconType: 'social',
    tag: 'Builds your brand',
    title: 'Social Media Agent',
    subtitle: 'Instagram & Facebook on autopilot',
    features: [
      { icon: Camera, text: 'AI drafts posts for Instagram and Facebook' },
      { icon: Calendar, text: 'Schedule a full week of content in minutes' },
      { icon: Sparkles, text: 'Designs service announcements and customer success stories' },
      { icon: Clock, text: 'Maintains a consistent posting schedule' },
      { icon: Target, text: 'Tailored to local business audiences' },
    ],
  },
  {
    variant: 'campaign',
    iconType: 'campaign',
    tag: 'Promotional marketing',
    title: 'Campaign Agent',
    subtitle: 'WhatsApp broadcast campaigns',
    features: [
      { icon: Megaphone, text: 'Send festive & offer announcements to customer lists' },
      { icon: Gift, text: 'Festival offers, new service launches, reward celebrations' },
      { icon: CreditCard, text: 'Prepaid credit system — no surprise bills' },
      { icon: TrendingUp, text: 'Delivery tracking and analytics' },
      { icon: Zap, text: 'Template management for quick sends' },
    ],
  },
];

const BUSINESS_TYPES = [
  { name: 'Gym & Fitness Centres', image: '/images/biz_gym.png', slug: 'gyms-fitness' },
  { name: 'Doctors & Health Clinics', image: '/images/biz_doctor.png', slug: 'doctors-clinics' },
  { name: 'Bakers & Cake Shops', image: '/images/biz_baker.png', slug: 'bakers-cake-shops' },
  { name: 'Salon Owners & Spas', image: '/images/biz_salon.png', slug: 'salons-spas' },
  { name: 'Restaurants & Cafes', image: '/images/biz_chef.png', slug: 'restaurants-cafes' },
  { name: 'Car Garages & Mechanics', image: '/images/biz_mechanic.png', slug: 'garages-mechanics' },
  { name: 'Tours & Travel Agencies', image: '/images/biz_travel.png', slug: 'travel-agencies' },
  { name: 'Handyman & Repair Services', image: '/images/biz_handyman.png', slug: 'handyman-repair' },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Rajesh Rao', initials: 'RR', image: '/images/owner.png', role: 'Founder, Apex Dental Care (Ameerpet)',
    text: 'We were completely invisible on Google. After GrowLokal, customers started finding us directly. Appointments jumped 3x in the first month.',
  },
  {
    name: 'Priya Sharma', initials: 'PS', image: '/images/priya.png', role: 'Owner, Glow Unisex Salon (Kukatpally)',
    text: 'The WhatsApp campaigns are incredible. We sent one festive offer announcement and got 40+ customer bookings the same day in Telugu!',
  },
  {
    name: 'Mohammed Irfan', initials: 'MI', image: '/images/classroom.png', role: 'Director, Urban Spice Cafe (Dilsukhnagar)',
    text: "I used to spend hours writing Google posts and replying to reviews. Now AI does it all — I just approve on WhatsApp. Saved me 10 hours a week.",
  },
];

const FAQ_DATA = [
  {
    q: 'Is this too technical for me?',
    a: 'Not at all! If you know how to use WhatsApp, you can use GrowLokal. Our 4 AI agents handle all the complex Google SEO, local ranking optimizations, and social media posting. You simply review and approve drafts with a single tap on WhatsApp.'
  },
  {
    q: 'How soon will I see results in my Google rankings?',
    a: 'Most local clinics, salons, and stores see noticeable visibility improvements on Google Maps within 14 to 21 days. Your instant audit provides a baseline score in 30 seconds, and our AI starts fixing NAP consistency, keywords, and review workflows from Day 1.'
  },
  {
    q: 'Does it support regional languages like Telugu, Tamil, and Kannada?',
    a: 'Yes! GrowLokal natively generates marketing copy, festive offers, and customer chat replies in Telugu, Tamil, Kannada, and English. Our vernacular models understand local slang, festivals, and cultural context across South India.'
  },
  {
    q: "What if I don't have a Google Business Profile yet?",
    a: "No problem! We help you set up and verify your Google Business Profile as part of your onboarding. Having a verified profile is 100% free on Google and is essential for capturing nearby customers."
  },
  {
    q: 'How do review replies and WhatsApp follow-ups work?',
    a: 'Whenever a customer leaves a Google review, GrowLokal AI automatically drafts a warm, personalized reply and pings you on WhatsApp for 1-click approval. It also answers customer enquiries on WhatsApp 24/7 with instant booking links.'
  },
  {
    q: 'Are my business data and customer phone numbers secure?',
    a: '100% private and secure. We never sell or share your business data or customer phone numbers with third parties. All communications, audit reports, and analytics are encrypted with enterprise-grade security standards.'
  },
  {
    q: 'Can I cancel or upgrade my plan anytime?',
    a: 'Yes, absolutely. There are no lock-in contracts or hidden cancellation fees. You can upgrade, downgrade, or cancel your plan anytime directly from your dashboard or via WhatsApp support.'
  },
  {
    q: 'How is GrowLokal different from generic marketing agencies?',
    a: 'Traditional digital agencies charge ₹15,000–₹25,000/month for slow manual work. GrowLokal gives you 4 specialized AI agents working 24/7 for a fraction of the cost (starting at ₹999/mo) with native South Indian language support.'
  },
];

