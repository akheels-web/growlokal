'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { Footer } from '@/components/Footer';

export type Lang = 'en' | 'te' | 'ta' | 'kn';

const TRANSLATIONS: Record<
  Lang,
  {
    trustedBadge: string;
    freeBadge: string;
    heroTitlePrefix: string;
    heroTitleSuffix: string;
    card1Title: string;
    card1Sub: string;
    card2Title: string;
    card2Sub: string;
    card3Title: string;
    card3Sub: string;
    card4Title: string;
    card4Sub: string;
    formHeader: string;
    step1Title: string;
    step1Placeholder: string;
    step1Hint: string;
    step2Title: string;
    btnSubmit: string;
    btnLoading: string;
    successTitle: string;
    successDesc: string;
    successBtn: string;
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
    stat3Val: string;
    stat3Label: string;
    stat4Val: string;
    stat4Label: string;
    industriesHeading: string;
    industries: string[];
    footerText: string;
  }
> = {
  en: {
    trustedBadge: 'Trusted by 25,000+ South Indian businesses',
    freeBadge: '100% FREE REPORT',
    heroTitlePrefix: 'Grow your business from',
    heroTitleSuffix: 'with GrowLokal AI',
    card1Title: 'Rank #1 on Google',
    card1Sub: '→ More calls & walk-ins',
    card2Title: 'More 5-star reviews',
    card2Sub: '→ Win customer trust',
    card3Title: 'Beat local competitors',
    card3Sub: '→ Customers pick you first',
    card4Title: 'Grow without an agency',
    card4Sub: '→ Save ₹40,000/mo & time',
    formHeader: 'GET YOUR FREE GBP REPORT',
    step1Title: 'Find your business on Google',
    step1Placeholder: 'Start typing your business name...',
    step1Hint: 'Type the name, then pick your business from the list.',
    step2Title: 'Your WhatsApp number',
    btnSubmit: 'Get Free Google Report →',
    btnLoading: 'Generating Your Report...',
    successTitle: 'Your Report is on its way!',
    successDesc: "We're sending your custom Google visibility audit report to WhatsApp",
    successBtn: 'Spy On Competitors Now →',
    stat1Val: '25,000+',
    stat1Label: 'South Indian businesses audited',
    stat2Val: '30 sec',
    stat2Label: 'Instant WhatsApp delivery',
    stat3Val: '3.8x',
    stat3Label: 'More customer calls in 90 days',
    stat4Val: '100% Free',
    stat4Label: 'No credit card or setup required',
    industriesHeading: 'Works for all South Indian Local Businesses',
    industries: [
      'Salons & Spas',
      'Clinics & Doctors',
      'Gyms & Fitness',
      'Restaurants & Cafes',
      'Interior Designers',
      'Real Estate Brokers',
      'Bakeries & Cake Shops',
      'Solar Rooftop',
      'Retail Shops & Boutiques',
      'CA, Tax & Legal Advisors',
      'Logistics & Packers',
      'Coaching Institutes',
    ],
    footerText: 'GrowLokal Technologies. Built with ❤️ for South Indian Local Businesses.',
  },
  te: {
    trustedBadge: '25,000+ దక్షిణ భారత వ్యాపారాల నమ్మకం',
    freeBadge: '100% ఉచిత రిపోర్ట్',
    heroTitlePrefix: 'GrowLokal AIతో',
    heroTitleSuffix: 'ద్వారా మీ వ్యాపారాన్ని పెంచుకోండి',
    card1Title: 'Googleలో #1 ర్యాంక్ పొందండి',
    card1Sub: '→ ఎక్కువ కాల్స్ & కస్టమర్లు',
    card2Title: 'ఎక్కువ 5-స్టార్ రివ్యూలు',
    card2Sub: '→ కస్టమర్ నమ్మకాన్ని పొందండి',
    card3Title: 'స్థానిక పోటీదారులను అధిగమించండి',
    card3Sub: '→ కస్టమర్లు మిమ్మల్నే ఎంచుకుంటారు',
    card4Title: 'ఏజెన్సీ లేకుండా ఎదగండి',
    card4Sub: '→ నెలకు ₹40,000 & సమయం ఆదా',
    formHeader: 'మీ ఉచిత GBP రిపోర్ట్ పొందండి',
    step1Title: 'Googleలో మీ వ్యాపారాన్ని కనుగొనండి',
    step1Placeholder: 'మీ వ్యాపారం పేరు టైప్ చేయండి...',
    step1Hint: 'పేరు టైప్ చేసి, జాబితా నుండి మీ వ్యాపారాన్ని ఎంచుకోండి.',
    step2Title: 'మీ WhatsApp నంబర్',
    btnSubmit: 'ఉచిత Google రిపోర్ట్ పొందండి →',
    btnLoading: 'మీ రిపోర్ట్ సిద్ధం అవుతోంది...',
    successTitle: 'మీ రిపోర్ట్ పంపబడుతోంది!',
    successDesc: 'మీ ప్రత్యేక Google ఆడిట్ రిపోర్ట్‌ను మీ WhatsAppకు పంపుతున్నాము',
    successBtn: 'పోటీదారుల వివరాలను చూడండి →',
    stat1Val: '25,000+',
    stat1Label: 'దక్షిణ భారత వ్యాపారాల ఆడిట్ జరిగింది',
    stat2Val: '30 సెకన్లు',
    stat2Label: 'తక్షణ WhatsApp డెలివరీ',
    stat3Val: '3.8x',
    stat3Label: '90 రోజుల్లో ఎక్కువ కస్టమర్ కాల్స్',
    stat4Val: '100% ఉచితం',
    stat4Label: 'క్రెడిట్ కార్డ్ లేదా రుసుము అవసరం లేదు',
    industriesHeading: 'అన్ని దక్షిణ భారత స్థానిక వ్యాపారాలకు సరిపోతుంది',
    industries: [
      'సెలూన్లు & స్పా',
      'క్లినిక్‌లు & డాక్టర్లు',
      'జిమ్‌లు & ఫిట్‌నెస్',
      'రెస్టారెంట్లు & కేఫ్‌లు',
      'ఇంటీరియర్ డిజైనర్లు',
      'రియల్ ఎస్టేట్ బ్రోకర్లు',
      'బేకరీలు & కేక్ షాపులు',
      'సోలార్ రూఫ్‌టాప్',
      'రిటైల్ షాపులు & బోటిక్‌లు',
      'CA & టాక్స్ అడ్వైజర్లు',
      'ప్యాకర్స్ & మూవర్స్',
      'కోచింగ్ ఇన్‌స్టిట్యూట్‌లు',
    ],
    footerText: 'GrowLokal Technologies. దక్షిణ భారత వ్యాపారాల కోసం ప్రేమతో రూపొందించబడింది.',
  },
  ta: {
    trustedBadge: '25,000+ தென்னிந்திய வணிகங்களின் நம்பிக்கை',
    freeBadge: '100% இலவச அறிக்கை',
    heroTitlePrefix: 'GrowLokal AI மூலம்',
    heroTitleSuffix: 'இல் உங்கள் வணிகத்தை வளர்க்கவும்',
    card1Title: 'Google-ல் #1 இடம் பெறுங்கள்',
    card1Sub: '→ அதிக அழைப்புகள் & வாடிக்கையாளர்கள்',
    card2Title: 'அதிக 5-நட்சத்திர மதிப்புரைகள்',
    card2Sub: '→ வாடிக்கையாளர் நம்பிக்கை',
    card3Title: 'உள்ளூர் போட்டியாளர்களை வெல்லுங்கள்',
    card3Sub: '→ வாடிக்கையாளர்கள் உங்களைத் தேர்ந்தெடுப்பார்கள்',
    card4Title: 'ஏஜென்சி இன்றி வளருங்கள்',
    card4Sub: '→ மாதம் ₹40,000 & நேரம் சேமிப்பு',
    formHeader: 'உங்கள் இலவச GBP அறிக்கையைப் பெறுங்கள்',
    step1Title: 'Google-ல் உங்கள் வணிகத்தைக் கண்டறியவும்',
    step1Placeholder: 'உங்கள் வணிகப் பெயரைத் தட்டச்சு செய்யவும்...',
    step1Hint: 'பெயரைத் தட்டச்சு செய்து, பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்.',
    step2Title: 'உங்கள் WhatsApp எண்',
    btnSubmit: 'இலவச Google அறிக்கையைப் பெறுங்கள் →',
    btnLoading: 'உங்கள் அறிக்கை தயாராகிறது...',
    successTitle: 'உங்கள் அறிக்கை அனுப்பப்படுகிறது!',
    successDesc: 'உங்கள் பிரத்யேக Google தணிக்கை அறிக்கை WhatsApp-க்கு அனுப்பப்படுகிறது',
    successBtn: 'போட்டியாளர்களை இப்போது பாருங்கள் →',
    stat1Val: '25,000+',
    stat1Label: 'தென்னிந்திய வணிகங்கள் தணிக்கை செய்யப்பட்டன',
    stat2Val: '30 நொடிகள்',
    stat2Label: 'உடனடி WhatsApp டெலிவரி',
    stat3Val: '3.8x',
    stat3Label: '90 நாட்களில் அதிக அழைப்புகள்',
    stat4Val: '100% இலவசம்',
    stat4Label: 'கிரெடிட் கார்டு தேவையில்லை',
    industriesHeading: 'அனைத்து தென்னிந்திய உள்ளூர் வணிகங்களுக்கும் பொருந்தும்',
    industries: [
      'சலூன்கள் & ஸ்பா',
      'மருத்துவமனைகள் & மருத்துவர்கள்',
      'ஜிம்கள் & ஃபிட்னஸ்',
      'உணவகங்கள் & கஃபேக்கள்',
      'உள்துறை வடிவமைப்பாளர்கள்',
      'ரியல் எஸ்டேட்',
      'பேக்கரிகள் & கேக் கடைகள்',
      'சோலார் ரூஃப்டாப்',
      'சில்லறை விற்பனை கடைகள்',
      'CA & வரி ஆலோசகர்கள்',
      'பேக்கர்ஸ் & மூவர்ஸ்',
      'பயிற்சி நிறுவனங்கள்',
    ],
    footerText: 'GrowLokal Technologies. தென்னிந்திய உள்ளூர் வணிகங்களுக்காக அன்புடன் உருவாக்கப்பட்டது.',
  },
  kn: {
    trustedBadge: '25,000+ ದಕ್ಷಿಣ ಭಾರತದ ವ್ಯಾಪಾರಗಳ ನಂಬಿಕೆ',
    freeBadge: '100% ಉಚಿತ ವರದಿ',
    heroTitlePrefix: 'GrowLokal AI ಮೂಲಕ',
    heroTitleSuffix: 'ನಿಂದ ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಿ',
    card1Title: 'Google ನಲ್ಲಿ #1 ಶ್ರೇಣಿ ಪಡೆಯಿರಿ',
    card1Sub: '→ ಹೆಚ್ಚು ಕರೆಗಳು & ಗ್ರಾಹಕರು',
    card2Title: 'ಹೆಚ್ಚು 5-ಸ್ಟಾರ್ ವಿಮರ್ಶೆಗಳು',
    card2Sub: '→ ಗ್ರಾಹಕರ ನಂಬಿಕೆ ಗಳಿಸಿ',
    card3Title: 'ಸ್ಥಳೀಯ ಪ್ರತಿಸ್ಪರ್ಧಿಗಳನ್ನು ಮೀರಿಸಿ',
    card3Sub: '→ ಗ್ರಾಹಕರು ನಿಮ್ಮನ್ನೇ ಆಯ್ಕೆ ಮಾಡುತ್ತಾರೆ',
    card4Title: 'ಏಜೆನ್ಸಿ ಇಲ್ಲದೆ ಬೆಳೆಯಿರಿ',
    card4Sub: '→ ತಿಂಗಳಿಗೆ ₹40,000 & ಸಮಯ ಉಳಿಸಿ',
    formHeader: 'ನಿಮ್ಮ ಉಚಿತ GBP ವರದಿ ಪಡೆಯಿರಿ',
    step1Title: 'Google ನಲ್ಲಿ ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಹುಡುಕಿ',
    step1Placeholder: 'ನಿಮ್ಮ ವ್ಯಾಪಾರದ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    step1Hint: 'ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ, ಪಟ್ಟಿಯಿಂದ ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    step2Title: 'ನಿಮ್ಮ WhatsApp ಸಂಖ್ಯೆ',
    btnSubmit: 'ಉಚಿತ Google ವರದಿ ಪಡೆಯಿರಿ →',
    btnLoading: 'ನಿಮ್ಮ ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
    successTitle: 'ನಿಮ್ಮ ವರದಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ!',
    successDesc: 'ನಿಮ್ಮ Google ಆಡಿಟ್ ವರದಿಯನ್ನು WhatsApp ಗೆ ಕಳುಹಿಸುತ್ತಿದ್ದೇವೆ',
    successBtn: 'ಪ್ರತಿಸ್ಪರ್ಧಿಗಳನ್ನು ಈಗಲೇ ಪರಿಶೀಲಿಸಿ →',
    stat1Val: '25,000+',
    stat1Label: 'ದಕ್ಷಿಣ ಭಾರತದ ವ್ಯಾಪಾರಗಳ ಪರಿಶೀಲನೆ',
    stat2Val: '30 ಸೆಕೆಂಡು',
    stat2Label: 'ತ್ವರಿತ WhatsApp ಡೆಲಿವರಿ',
    stat3Val: '3.8x',
    stat3Label: '90 ದಿನಗಳಲ್ಲಿ ಹೆಚ್ಚು ಕರೆಗಳು',
    stat4Val: '100% ಉಚಿತ',
    stat4Label: 'ಯಾವುದೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ',
    industriesHeading: 'ಎಲ್ಲಾ ದಕ್ಷಿಣ ಭಾರತೀಯ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಗಳಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆ',
    industries: [
      'ಸಲೂನ್‌ಗಳು & ಸ್ಪಾ',
      'ಕ್ಲಿನಿಕ್‌ಗಳು & ವೈದ್ಯರು',
      'ಜಿಮ್‌ಗಳು & ಫಿಟ್‌ನೆಸ್',
      'ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು & ಕೆಫೆಗಳು',
      'ಇಂಟೀರಿಯರ್ ವಿನ್ಯಾಸಕರು',
      'ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಬ್ರೋಕರ್ಗಳು',
      'ಬೇಕರಿಗಳು & ಕೇಕ್ ಅಂಗಡಿಗಳು',
      'ಸೋಲಾರ್ ರೂಫ್‌ಟಾಪ್',
      'ಚಿಲ್ಲರೆ ಅಂಗಡಿಗಳು',
      'CA & ತೆರಿಗೆ ಸಲಹೆಗಾರರು',
      'ಪ್ಯಾಕರ್ಸ್ & ಮೂವರ್ಸ್',
      'ತರಬೇತಿ ಸಂಸ್ಥೆಗಳು',
    ],
    footerText: 'GrowLokal Technologies. ದಕ್ಷಿಣ ಭಾರತದ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಗಳಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
  },
};

const SUGGESTED_LOCAL_BUSINESSES = [
  { name: 'Apollo Clinic & Diagnostics', city: 'Ameerpet, Hyderabad', category: 'Health Clinic' },
  { name: 'Naturals Salon & Spa', city: 'T. Nagar, Chennai', category: 'Salon & Spa' },
  { name: 'Vistara Luxury Interiors', city: 'Indiranagar, Bengaluru', category: 'Interior Design' },
  { name: 'Cult Fitness Club', city: 'Madhapur, Hyderabad', category: 'Gym & Fitness' },
  { name: 'Karachi Bakery & Cafe', city: 'Banjara Hills, Hyderabad', category: 'Bakery' },
  { name: 'Sri Krishna Sweets', city: 'Mylapore, Chennai', category: 'Retail / Sweets' },
  { name: 'QuickFix Home Solutions', city: 'Kukatpally, Hyderabad', category: 'Handyman Services' },
  { name: 'SunPower Rooftop Solar', city: 'Kakkanad, Kochi', category: 'Solar Energy' },
  { name: 'Royal Care Dental Studio', city: 'RS Puram, Coimbatore', category: 'Dental Clinic' },
  { name: 'Urban Nest Properties', city: 'HSR Layout, Bengaluru', category: 'Real Estate' },
];

export default function FreeGbpReportPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const filtered = SUGGESTED_LOCAL_BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelectBusiness(bizName: string, city: string) {
    setSelectedBusiness(`${bizName} — ${city}`);
    setSearchTerm(`${bizName} (${city})`);
    setShowDropdown(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchTerm || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      const targetBiz = selectedBusiness || searchTerm;
      const waText = encodeURIComponent(
        `Hi GrowLokal Team! Please send my Free Google Business Profile Audit Report for: ${targetBiz} to WhatsApp: +91 ${phone}. (Language: ${lang})`
      );
      window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${waText}`, '_blank');
    }, 600);
  }

  return (
    <div style={{ background: '#FAF8FF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#111827' }}>
      {/* ─── MINIMAL HEADER: LOGO + LANGUAGE SELECTOR ONLY ─── */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <BrandLogo variant="header" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              style={{
                padding: '7px 16px',
                borderRadius: '50px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#0B1020',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              aria-label="Choose Language"
            >
              <option value="en">🌐 English</option>
              <option value="te">🌐 తెలుగు (Telugu)</option>
              <option value="ta">🌐 தமிழ் (Tamil)</option>
              <option value="kn">🌐 ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div>
      </header>

      {/* ─── MAIN HERO ONBOARDING SECTION ─── */}
      <main style={{ flex: 1, padding: '40px 20px 60px', maxWidth: '1180px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Side: Value Props */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(59, 224, 109, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#15803D',
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={16} color="#059669" />
              <span>{t.trustedBadge}</span>
              <span
                style={{
                  background: '#15803D',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.02em',
                }}
              >
                {t.freeBadge}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: '900',
                lineHeight: 1.18,
                color: '#0B1020',
                letterSpacing: '-0.02em',
                marginBottom: '20px',
              }}
            >
              {lang === 'en' ? (
                <>
                  {t.heroTitlePrefix}{' '}
                  <span style={{ display: 'inline-block', letterSpacing: '0' }}>
                    <span style={{ color: '#4285F4' }}>G</span>
                    <span style={{ color: '#EA4335' }}>o</span>
                    <span style={{ color: '#FBBC05' }}>o</span>
                    <span style={{ color: '#4285F4' }}>g</span>
                    <span style={{ color: '#34A853' }}>l</span>
                    <span style={{ color: '#EA4335' }}>e</span>
                  </span>{' '}
                  {t.heroTitleSuffix}
                </>
              ) : (
                <>
                  {t.heroTitlePrefix}{' '}
                  <span style={{ display: 'inline-block', letterSpacing: '0' }}>
                    <span style={{ color: '#4285F4' }}>G</span>
                    <span style={{ color: '#EA4335' }}>o</span>
                    <span style={{ color: '#FBBC05' }}>o</span>
                    <span style={{ color: '#4285F4' }}>g</span>
                    <span style={{ color: '#34A853' }}>l</span>
                    <span style={{ color: '#EA4335' }}>e</span>
                  </span>{' '}
                  {t.heroTitleSuffix}
                </>
              )}
            </h1>

            {/* 4 Benefit Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginTop: '28px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>🏆</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>{t.card1Title}</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{t.card1Sub}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>⭐</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>{t.card2Title}</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{t.card2Sub}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>📸</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>{t.card3Title}</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{t.card3Sub}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>📈</span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0B1020', display: 'block' }}>{t.card4Title}</strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{t.card4Sub}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Grexa V8 Style 2-Step Card */}
          <div>
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#175fab' }}>
                  {t.formHeader}
                </span>
                <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Step 1: Find Business */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#175fab',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '900',
                        }}
                      >
                        1
                      </span>
                      <span>{t.step1Title}</span>
                    </label>

                    <div style={{ position: 'relative' }}>
                      <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        required
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setSelectedBusiness(null);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder={t.step1Placeholder}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '14px',
                          color: '#0B1020',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', marginLeft: '4px' }}>
                      {t.step1Hint}
                    </p>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && searchTerm.length > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 40,
                          background: '#FFFFFF',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: '12px',
                          marginTop: '4px',
                          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                          maxHeight: '220px',
                          overflowY: 'auto',
                        }}
                      >
                        {filtered.length > 0 ? (
                          filtered.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectBusiness(item.name, item.city)}
                              style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #F1F5F9',
                                fontSize: '13px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                            >
                              <div>
                                <strong style={{ color: '#0B1020' }}>{item.name}</strong>
                                <div style={{ fontSize: '11.5px', color: '#64748B' }}>📍 {item.city}</div>
                              </div>
                              <span style={{ fontSize: '11px', background: 'rgba(23, 95, 171, 0.1)', color: '#175fab', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                                {item.category}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div
                            onClick={() => {
                              setSelectedBusiness(searchTerm);
                              setShowDropdown(false);
                            }}
                            style={{ padding: '12px 14px', fontSize: '13px', color: '#175fab', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Use &ldquo;{searchTerm}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 2: WhatsApp Number */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#175fab',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '900',
                        }}
                      >
                        2
                      </span>
                      <span>{t.step2Title}</span>
                    </label>

                    <div className="phone-input-group" style={{ height: '46px' }}>
                      <div className="phone-prefix">
                        <svg width="22" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2.5px', flexShrink: 0 }}>
                          <rect width="20" height="4.67" fill="#FF9933" />
                          <rect y="4.67" width="20" height="4.67" fill="#FFFFFF" />
                          <rect y="9.33" width="20" height="4.67" fill="#138808" />
                          <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.6" fill="none" />
                        </svg>
                        <span className="phone-code">+91</span>
                        <span className="phone-divider" />
                      </div>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="81234 56789"
                        className="phone-input-field"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                      transition: 'opacity 0.2s',
                      marginTop: '4px',
                    }}
                  >
                    {isSubmitting ? t.btnLoading : t.btnSubmit}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 8px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(59, 224, 109, 0.15)',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0B1020', marginBottom: '8px' }}>
                    {t.successTitle}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
                    {t.successDesc} <strong>+91 {phone}</strong>.
                  </p>
                  <Link
                    href="/tools/google-score-calculator"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                    }}
                  >
                    {t.successBtn}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM STATS METRICS & INDUSTRIES ─── */}
        <div style={{ marginTop: '64px' }}>
          <section
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            }}
          >
            {/* 4 Stat Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>{t.stat1Val}</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>{t.stat1Label}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>{t.stat2Val}</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>{t.stat2Label}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>{t.stat3Val}</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>{t.stat3Label}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#175fab' }}>{t.stat4Val}</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>{t.stat4Label}</div>
              </div>
            </div>

            {/* Industry Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0 18px' }}>
              <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748B' }}>
                {t.industriesHeading}
              </span>
              <span style={{ height: '1px', flex: 1, background: '#E2E8F0' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {t.industries.map((ind, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '50px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: '#334155',
                  }}
                >
                  {ind}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ─── SINGLE-LINER DARK FOOTER ─── */}
      <footer style={{
        background: '#0B1020',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 24px',
        fontSize: '13px',
        color: '#94A3B8',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span>© {new Date().getFullYear()} GrowLokal Technologies. {t.footerText}</span>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/refund" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
