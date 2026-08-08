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
    badge: '⚡ Built for All South Indian Local Businesses',
    heroTitle1: 'Your All-in-One ',
    heroAccent: 'AI Marketing & Growth Team',
    heroTitle2: ' that Delivers Real Customer Sales',
    heroSub: 'Most local clinics, salons, restaurants & stores lose 60%+ of potential customers on Google Maps. Get a free instant visibility report.',
    auditBadge: '⚡ Instant 10-Sec Scan',
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
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="/blog" className="nav-link">Blog</a>
            <a href="#contact" className="nav-link">Contact</a>
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
                    background: '#ffffff', border: '1.5px solid #2E9AA6', borderRadius: '14px',
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
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                      >
                        <strong style={{ color: '#033540', display: 'block', fontSize: '14px' }}>📍 {item.name}</strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{item.address}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="input-with-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="input-icon" style={{ fontSize: '13px', fontWeight: 800, color: '#0E4459', paddingRight: '4px' }}>
                    🇮🇳 +91
                  </span>
                  <input
                    id="audit-phone"
                    required
                    placeholder="Enter 10-digit WhatsApp number"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="form-input"
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#5e7984', marginTop: '6px', textAlign: 'left', paddingLeft: '4px', fontWeight: 600 }}>
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

      {/* ─── FREE GROWTH TOOLS SHOWCASE ─── */}
      <Section id="tools">
        <div className="section-header">
          <p className="section-eyebrow">Interactive Growth Tools</p>
          <h2 className="section-title">Free Self-Service Growth Tools</h2>
          <p className="section-subtitle">Audit your local Google presence and calculate your annual business profit growth instantly.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px', maxWidth: '1020px', margin: '0 auto' }}>
          {/* Card 1: Google Score Tool */}
          <div style={{
            padding: '36px 32px',
            background: 'var(--color-bg-primary)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            boxShadow: '0 8px 24px rgba(3, 53, 64, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📊</div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#2E9AA6', background: 'rgba(46, 154, 166, 0.12)', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚡ Instant Competitor Spy Tool
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#033540', margin: '12px 0 10px', lineHeight: 1.3 }}>
                🔥 See Why Competitors Get 3x More Customer Calls
              </h3>
              <p style={{ color: '#5e7984', fontSize: '0.96rem', lineHeight: '1.65', marginBottom: '24px' }}>
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
          <div style={{
            padding: '36px 32px',
            background: 'var(--color-bg-primary)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            boxShadow: '0 8px 24px rgba(3, 53, 64, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>💰</div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#047857', background: 'rgba(112, 191, 99, 0.15)', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📈 Revenue Growth Calculator
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#033540', margin: '12px 0 10px', lineHeight: 1.3 }}>
                🚀 Calculate Your 12-Month Revenue Growth
              </h3>
              <p style={{ color: '#5e7984', fontSize: '0.96rem', lineHeight: '1.65', marginBottom: '24px' }}>
                See how capturing just 5 to 15 additional local customers per month through GrowLokal AI translates into massive annual profit.
              </p>
            </div>
            <div>
              <a href="/tools/admission-roi-calculator" className="btn-growth-tool-green">
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
              All AI Agents share central memory, customer history, and local business data to convert leads faster.
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

      {/* ─── BUILT FOR SMALL BUSINESS OWNERS ─── */}
      <Section id="industries">
        <div className="section-header">
          <p className="section-eyebrow">Tailored for Every Local Niche</p>
          <h2 className="section-title">Built for Small Business Owners</h2>
          <p className="section-subtitle">You focus on your craft and leave the hassle of growth marketing to GrowLokal AI</p>
        </div>
        <div ref={industryView.ref} className="biz-showcase-grid stagger-children">
          {BUSINESS_TYPES.map((biz, i) => (
            <div
              key={biz.name}
              className={`biz-showcase-card fade-up ${industryView.visible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="biz-showcase-title">{biz.name}</div>
              <div className="biz-showcase-img-wrap">
                <img src={biz.image} alt={biz.name} className="biz-showcase-img" />
              </div>
            </div>
          ))}

          {/* Feature CTA Card matching Grexa style */}
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
                background: '#25D366',
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
                src="/images/result_before.png" 
                alt="Business dashboard before GrowLokal showing low score 23" 
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
              <span>🚀 Day 30 — With GrowLokal AI</span>
            </div>

            <div className="results-img-frame">
              <img 
                src="/images/result_after.png" 
                alt="Business dashboard after GrowLokal showing high score 87" 
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
                  <span className="metric-icon">✅</span>
                  <span>Google Maps Rank: <strong>#1 Top Local Pack</strong></span>
                </li>
                <li className="results-metric-item metric--positive">
                  <span className="metric-icon">✅</span>
                  <span>Review Response Rate: <strong>100% (Instant AI)</strong></span>
                </li>
                <li className="results-metric-item metric--positive">
                  <span className="metric-icon">✅</span>
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
            <p className="results-cta-sub">Run your free 10-second Google Business Audit now. No credit card required.</p>
          </div>
          <a href="#audit-form" className="btn-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
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

            {/* Card 2: Standard Plan (Featured) */}
            <div className="pricing-card-standard">
              <div className="pricing-ribbon-badge">Most Popular</div>
              <div>
                <div className="pricing-plan-title">Standard</div>
                <p className="pricing-plan-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Most popular deal for growth</p>
                <div className="pricing-divider" />
                <div className="pricing-price-val">
                  ₹{billingCycle === 'annually' ? '2,399' : '2,999'}{' '}
                  <span className="pricing-price-period">/ month</span>
                </div>
                {billingCycle === 'annually' && (
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#ffd166', marginTop: '-18px', marginBottom: '22px', letterSpacing: '0.02em' }}>
                    ⚡ Billed annually (₹28,788/yr — Save ₹7,200)
                  </div>
                )}

                <ul className="pricing-feature-list">
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Everything included in Free Plan</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Weekly AI Google Business Profile posts</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Auto-drafted review replies (1-click approve)</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>24/7 Automated WhatsApp lead responder</span>
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
                    <span>WhatsApp Broadcast Campaign manager</span>
                  </li>
                  <li className="pricing-feature-item">
                    <span className="pricing-icon-check">✓</span>
                    <span>Dedicated South Indian support team</span>
                  </li>
                </ul>
              </div>
              <a
                href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%2C%20I%20want%20to%20subscribe%20to%20the%20Standard%20Growth%20Plan"
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
              <span style={{ padding: '3px 10px', background: 'rgba(112, 191, 99, 0.15)', color: '#047857', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>OPTIONAL ADD-ON</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#033540', margin: 0 }}>🌐 Custom Local Business Website Creation</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5e7984', margin: '4px 0 0' }}>
              Don&apos;t have a dedicated website? We build a fast, mobile-ready 5-page website with your services, photos &amp; direct WhatsApp enquiry forms.
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

      {/* ─── CONTACT US SECTION & FORM ─── */}
      <ContactSection />

      {/* ─── FINAL CTA ─── */}
      <Section className="cta-section">
        <h2 className="cta-title">Ready to stop losing local customers?</h2>
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
                <li className="footer-link-item"><a href="/tools/admission-roi-calculator">Revenue Growth Calculator</a></li>
                <li className="footer-link-item"><a href="/resources/whatsapp-kit">WhatsApp Growth Kit</a></li>
                <li className="footer-link-item"><a href="/blog">Local SEO Playbooks</a></li>
                <li className="footer-link-item"><a href="#audit-form">Free Google Audit</a></li>
              </ul>
            </div>

            {/* Col 3: Industry Solutions */}
            <div>
              <h4 className="footer-col-title">Solutions</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="#industries">Clinics &amp; Healthcare</a></li>
                <li className="footer-link-item"><a href="#industries">Salons &amp; Spas</a></li>
                <li className="footer-link-item"><a href="#industries">Restaurants &amp; Cafes</a></li>
                <li className="footer-link-item"><a href="#industries">Retail &amp; Boutiques</a></li>
                <li className="footer-link-item"><a href="#industries">Local Services &amp; Repairs</a></li>
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
                <rect width="44" height="28" rx="5" fill="#0E4459" />
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
    icon: '🔍', stat: '60%', title: "Customers can't find you on Google",
    desc: 'When a customer searches "best clinic / salon / store near me", your competitors show up — but you don\'t. You\'re invisible where it matters most.',
    solution: 'Google Leads Agent fixes your profile + posts weekly',
  },
  {
    icon: '⭐', stat: '73%', title: 'Your reviews go unanswered',
    desc: '73% of consumers expect a response to reviews. Every ignored review costs you trust — and new customer bookings.',
    solution: 'AI drafts warm replies in seconds, you just approve',
  },
  {
    icon: '📱', stat: '1x/mo', title: 'Social media is an afterthought',
    desc: "You know you should post on Instagram and Facebook, but who has the time? So it happens once a month — maybe.",
    solution: 'Social Agent posts to IG + FB automatically every week',
  },
];

const STEPS = [
  { icon: '🏬', title: 'Enter your business name', desc: "Tell us your business's name and area — we do the rest." },
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
    title: 'WhatsApp Chat Agent', subtitle: 'Answer customer enquiries 24/7',
    features: [
      { icon: '💬', text: 'Answers pricing, service, and appointment questions instantly' },
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
      { icon: '🏬', text: 'Designs service announcements and customer success stories' },
      { icon: '⚡', text: 'Maintains a consistent posting schedule' },
      { icon: '🎯', text: 'Tailored to local business audiences' },
    ],
  },
  {
    variant: 'campaign', icon: '📣', tag: 'Promotional marketing',
    title: 'Campaign Agent', subtitle: 'WhatsApp broadcast campaigns',
    features: [
      { icon: '📣', text: 'Send festive & offer announcements to customer lists' },
      { icon: '🎁', text: 'Festival offers, new service launches, reward celebrations' },
      { icon: '💳', text: 'Prepaid credit system — no surprise bills' },
      { icon: '📊', text: 'Delivery tracking and analytics' },
      { icon: '⚡', text: 'Template management for quick sends' },
    ],
  },
];

const BUSINESS_TYPES = [
  { name: 'Gym & Fitness Centres', image: '/images/biz_gym.png' },
  { name: 'Doctors & Health Clinics', image: '/images/biz_doctor.png' },
  { name: 'Bakers & Cake Shops', image: '/images/biz_baker.png' },
  { name: 'Salon Owners & Spas', image: '/images/biz_salon.png' },
  { name: 'Restaurants & Cafes', image: '/images/biz_chef.png' },
  { name: 'Car Garages & Mechanics', image: '/images/biz_mechanic.png' },
  { name: 'Tours & Travel Agencies', image: '/images/biz_travel.png' },
  { name: 'Handyman & Repair Services', image: '/images/biz_handyman.png' },
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
  { q: 'Is this too technical for me?', a: 'Not at all! If you can use WhatsApp, you can use GrowLokal. Our AI handles all the technical marketing work. You just approve what it creates.' },
  { q: 'How soon will I see results?', a: 'Most local businesses see improvements in their Google visibility within 2-3 weeks. The free audit gives you your baseline score immediately, and our AI starts working on improvements from day one.' },
  { q: 'Does it work in Telugu and Tamil?', a: 'Yes! GrowLokal creates content in Telugu, Tamil, Kannada, and English. Our AI understands the local context and creates authentic vernacular content that resonates with customers in your area.' },
  { q: "What if I don't have a Google Business Profile?", a: "No problem! We'll help you set one up as part of the onboarding process. It's free on Google — and it's the single most important thing for getting found by customers searching online." },
  { q: 'Can I cancel anytime?', a: "Absolutely. There are no contracts or lock-in periods. You can cancel your Growth Plan anytime. The free audit is always free, forever." },
  { q: 'How is GrowLokal different from Grexa?', a: 'We\'re purpose-built for South Indian local businesses, not a generic tool for all companies. Our AI speaks Telugu, Tamil, and Kannada natively. And at ₹2,999/month vs their ₹5,000+/month, you save over ₹12,000 per quarter.' },
];

function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  }

  return (
    <Section id="contact" className="section--alt">
      <div className="section-header">
        <p className="section-eyebrow">Get in touch</p>
        <h2 className="section-title">Have Questions? Talk to Our Growth Team</h2>
        <p className="section-subtitle">Send us a message and our team will call or WhatsApp you within 15 minutes.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '40px',
        maxWidth: '1060px',
        margin: '0 auto',
        background: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 12px 36px rgba(3, 53, 64, 0.06)'
      }}>
        {/* Left Col: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#2E9AA6', background: 'rgba(46, 154, 166, 0.1)', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
              📍 South India Headquarters
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#033540', margin: '14px 0 16px' }}>
              GrowLokal Technologies
            </h3>
            <p style={{ color: '#5e7984', fontSize: '0.96rem', lineHeight: '1.65', marginBottom: '24px' }}>
              We assist local businesses, clinics, salons &amp; stores across Hyderabad, Vijayawada, Vizag, Bengaluru, and Chennai.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#0E4459' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>💬</span>
                <div>
                  <strong>WhatsApp &amp; Phone Support:</strong>
                  <div style={{ color: '#5e7984' }}>+91 98765 43210 (Mon–Sat 9:00 AM – 7:00 PM)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>✉️</span>
                <div>
                  <strong>Email Inquiry:</strong>
                  <div style={{ color: '#5e7984' }}>support@growlokal.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>🏬</span>
                <div>
                  <strong>Regional Office:</strong>
                  <div style={{ color: '#5e7984' }}>Commercial Hub, Ameerpet, Hyderabad, Telangana 500016</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(112, 191, 99, 0.12)', borderRadius: '14px', fontSize: '13px', color: '#047857', fontWeight: '700' }}>
            ⚡ Fast Response Guaranteed: Most inquiries are answered within 15 minutes during working hours.
          </div>
        </div>

        {/* Right Col: Contact Form */}
        <div>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#033540', marginBottom: '6px', display: 'block' }}>
                  Your Full Name *
                </label>
                <input
                  required
                  placeholder="e.g. Srikanth Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#033540', marginBottom: '6px', display: 'block' }}>
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#033540', marginBottom: '6px', display: 'block' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. srikanth@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14.5px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#033540', marginBottom: '6px', display: 'block' }}>
                  Your Message or Question
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your business, products, services, or any questions you have..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '14.5px', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: '#0E4459',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 68, 89, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                Send Message →
              </button>
            </form>
          ) : (
            <div style={{
              padding: '32px',
              background: 'rgba(112, 191, 99, 0.15)',
              border: '1.5px solid #70BF63',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#047857', marginBottom: '8px' }}>
                Message Sent Successfully!
              </h4>
              <p style={{ fontSize: '0.95rem', color: '#033540', lineHeight: '1.6' }}>
                Thank you, <strong>{name}</strong>. Our team has received your inquiry and will reach out to you at <strong>{phone}</strong> shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
