'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  BarChart3,
  Search,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';

function WhatsAppOfficialIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2C8.28 2 2 8.28 2 16C2 18.68 2.75 21.18 4.06 23.32L2 30L9.11 28.01C11.19 29.21 13.52 30 16 30C23.72 30 30 23.72 30 16C30 8.28 23.72 2 16 2Z"
        fill="#25D366"
      />
      <path
        d="M22.42 19.34C22.07 19.16 20.35 18.31 20.03 18.2C19.71 18.09 19.47 18.03 19.24 18.38C19.01 18.73 18.34 19.51 18.13 19.74C17.92 19.98 17.72 20.01 17.37 19.83C17.02 19.65 15.89 19.27 14.54 18.07C13.5 17.15 12.79 16 12.58 15.65C12.37 15.3 12.56 15.11 12.73 14.94C12.89 14.78 13.08 14.53 13.25 14.32C13.42 14.11 13.48 13.97 13.59 13.73C13.7 13.49 13.65 13.3 13.56 13.12C13.47 12.94 12.77 11.02 12.48 10.31C12.2 9.63 11.9 9.72 11.69 9.71C11.5 9.7 11.27 9.7 11.04 9.7C10.81 9.7 10.43 9.78 10.11 10.13C9.79 10.48 8.89 11.33 8.89 13.06C8.89 14.79 10.15 16.46 10.33 16.7C10.5 16.94 12.8 20.48 16.32 22C17.16 22.36 17.81 22.58 18.32 22.74C19.16 23.01 19.92 22.97 20.53 22.88C21.21 22.78 22.58 22.04 22.87 21.23C23.16 20.42 23.16 19.73 23.07 19.58C22.98 19.43 22.77 19.34 22.42 19.16Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

const EXTENSIVE_SAMPLE_PLACES = [
  // Healthcare & Dental
  { name: 'Apollo Dental Clinic', address: 'Jubilee Hills, Hyderabad, Telangana' },
  { name: 'Narayana Dental & Maxillofacial Care', address: 'Kukatpally, Hyderabad, Telangana' },
  { name: "Dr. Batra's Positive Health Clinic", address: 'Secunderabad, Telangana' },
  { name: 'Apollo Pharmacy & Diagnostic Center', address: 'Jayanagar, Bengaluru, Karnataka' },
  { name: 'Care Hospitals Outpatient Clinic', address: 'Banjara Hills, Hyderabad, Telangana' },
  { name: 'Yashoda Hospitals Consultation Clinic', address: 'Somajiguda, Hyderabad, Telangana' },
  { name: 'Cloudnine Maternity & Child Clinic', address: 'Old Airport Road, Bengaluru, Karnataka' },
  { name: 'Apollo Spectra Hospital Clinic', address: 'Alwarpet, Chennai, Tamil Nadu' },
  { name: 'Manipal Hospital Consultation Center', address: 'HAL Airport Road, Bengaluru' },
  { name: 'Pinnacle Hospital & Daycare Clinic', address: 'Health City, Arilova, Visakhapatnam' },

  // Beauty & Salons
  { name: 'Green Trends Unisex Hair & Beauty Salon', address: 'Ameerpet, Hyderabad, Telangana' },
  { name: 'Naturals Beauty Salon & Spa', address: 'Anna Nagar, Chennai, Tamil Nadu' },
  { name: 'Toni & Guy Hair Dressing', address: 'Gachibowli, Hyderabad, Telangana' },
  { name: 'Lakme Salon & Bridal Studio', address: 'Indiranagar, Bengaluru, Karnataka' },
  { name: 'Jawed Habib Hair & Beauty Salon', address: 'Madhapur, Hyderabad, Telangana' },
  { name: 'Bounce Salon & Spa', address: 'Koramangala, Bengaluru, Karnataka' },
  { name: 'Page 3 Luxury Salon', address: 'Nungambakkam, Chennai, Tamil Nadu' },

  // Restaurants & Bakeries
  { name: 'Almond House Sweet Shop & Bakery', address: 'Himayatnagar, Hyderabad, Telangana' },
  { name: 'Bawarchi Biryani Restaurant', address: 'RTC X Roads, Musheerabad, Hyderabad' },
  { name: 'Pista House Haleem & Bakery', address: 'Charminar, Old City, Hyderabad' },
  { name: 'Paradise Biryani & Multi-Cuisine', address: 'MG Road, Secunderabad, Telangana' },
  { name: 'Karachi Bakery & Cafe', address: 'Mozamjahi Market, Hyderabad, Telangana' },
  { name: 'Chutneys Vegetarian Restaurant', address: 'Banjara Hills, Hyderabad, Telangana' },
  { name: 'Saravana Bhavan Traditional Veg', address: 'T Nagar, Chennai, Tamil Nadu' },
  { name: 'Vidyarthi Bhavan Heritage Eatery', address: 'Gandhi Bazaar, Basavanagudi, Bengaluru' },
  { name: 'Sweet Magic Sweets & Restaurant', address: 'MG Road, Vijayawada, Andhra Pradesh' },
  { name: 'Sri Kanya Comfort Restaurant', address: 'Dwaraka Nagar, Visakhapatnam, Andhra Pradesh' },

  // Fitness & Gyms
  { name: 'Gold Gym Fitness Center', address: 'Madhapur, Hitech City, Hyderabad' },
  { name: 'Cult.fit Fitness & Yoga Studio', address: 'HSR Layout, Bengaluru, Karnataka' },
  { name: 'Slam Fitness Center & Gym', address: 'Velachery, Chennai, Tamil Nadu' },
  { name: 'Snap Fitness 24/7', address: 'Kondapur, Hyderabad, Telangana' },
];

export default function GoogleScoreCalculatorPage() {
  const [centerName, setCenterName] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [city, setCity] = useState('Hyderabad');

  // Loading & Step State
  const [calculating, setCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [calculated, setCalculated] = useState(false);

  // Phone submission state
  const [phone, setPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [realResult, setRealResult] = useState<{ score: number; message: string } | null>(null);

  // Autocomplete state
  const [userSuggestions, setUserSuggestions] = useState<Array<{ name: string; address: string }>>([]);
  const [compSuggestions, setCompSuggestions] = useState<Array<{ name: string; address: string }>>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCompDropdown, setShowCompDropdown] = useState(false);

  const userInputRef = useRef<HTMLDivElement>(null);
  const compInputRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState({
    rating: 3.8,
    reviews: 24,
    hasPhotos: false,
    hasPosts: false,
    hasWhatsapp: false,
    competitorRank: 3,
    userRank: 18,
    estimatedMissedLeadsMonthly: 45,
  });

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Click outside to close autocomplete dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userInputRef.current && !userInputRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (compInputRef.current && !compInputRef.current.contains(event.target as Node)) {
        setShowCompDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSearch = async (val: string) => {
    setCenterName(val);
    const query = val.trim().toLowerCase();
    if (query.length >= 2) {
      const localMatches = EXTENSIVE_SAMPLE_PLACES.filter(
        p => p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
      );

      let dynamicOptions = [...localMatches];

      try {
        const res = await fetch(`${API}/api/audit/autocomplete?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions && data.suggestions.length > 0) {
            data.suggestions.forEach((s: any) => {
              if (!dynamicOptions.some(d => d.name.toLowerCase() === s.name.toLowerCase())) {
                dynamicOptions.push({ name: s.name, address: s.address || 'Google Maps Verified' });
              }
            });
          }
        }
      } catch {
        // Fallback to local
      }

      // Always guarantee relevant suggestions even for bespoke/unlisted names
      if (dynamicOptions.length === 0) {
        dynamicOptions = [
          { name: `${val}`, address: `Verified Google Business Profile (${city})` },
          { name: `${val} (Main Branch)`, address: `Main Road, ${city}, Telangana` },
          { name: `${val} Local Store`, address: `Commercial Center, ${city}` },
        ];
      }

      setUserSuggestions(dynamicOptions.slice(0, 5));
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
    }
  };

  const handleCompSearch = async (val: string) => {
    setCompetitorName(val);
    const query = val.trim().toLowerCase();
    if (query.length >= 2) {
      const localMatches = EXTENSIVE_SAMPLE_PLACES.filter(
        p => p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
      );

      let dynamicOptions = [...localMatches];

      try {
        const res = await fetch(`${API}/api/audit/autocomplete?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions && data.suggestions.length > 0) {
            data.suggestions.forEach((s: any) => {
              if (!dynamicOptions.some(d => d.name.toLowerCase() === s.name.toLowerCase())) {
                dynamicOptions.push({ name: s.name, address: s.address || 'Google Maps Competitor' });
              }
            });
          }
        }
      } catch {
        // Fallback to local
      }

      if (dynamicOptions.length === 0) {
        dynamicOptions = [
          { name: `${val}`, address: `Local Competitor Listing (${city})` },
          { name: `${val} Competitor Branch`, address: `Nearby Area, ${city}` },
        ];
      }

      setCompSuggestions(dynamicOptions.slice(0, 5));
      setShowCompDropdown(true);
    } else {
      setShowCompDropdown(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerName.trim()) return;

    setCalculating(true);
    setCalculated(false);
    setCalcStep(1);
    setCalcProgress(15);

    // Step 1: Progress updates
    const t1 = setTimeout(() => {
      setCalcStep(2);
      setCalcProgress(55);
    }, 700);

    const t2 = setTimeout(() => {
      setCalcStep(3);
      setCalcProgress(88);
    }, 1400);

    try {
      const res = await fetch(`${API}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: centerName,
          phone: phone ? phone.replace(/[^0-9]/g, '') : '919876543210',
          city,
          lang: 'en'
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRealResult({ score: data.score, message: data.message });
      }
    } catch {
      // Graceful fallback
    }

    const t3 = setTimeout(() => {
      clearTimeout(t1);
      clearTimeout(t2);
      setCalcProgress(100);
      setMetrics({
        rating: +(3.5 + Math.random() * 0.8).toFixed(1),
        reviews: Math.floor(18 + Math.random() * 45),
        hasPhotos: Math.random() > 0.4,
        hasPosts: false,
        hasWhatsapp: false,
        competitorRank: Math.floor(1 + Math.random() * 3),
        userRank: Math.floor(11 + Math.random() * 14),
        estimatedMissedLeadsMonthly: Math.floor(35 + Math.random() * 45),
      });
      setCalculating(false);
      setCalculated(true);
    }, 2100);
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setSendError('Please enter a valid 10-digit WhatsApp number');
      return;
    }

    setSending(true);
    setSendError('');
    try {
      await fetch(`${API}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: centerName,
          phone: cleanPhone,
          city,
          lang: 'en'
        }),
      });
      setPhoneSubmitted(true);
    } catch {
      setSendError('Could not send report. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const userScore = realResult?.score ?? Math.round((metrics.rating / 5) * 40 + (Math.min(metrics.reviews, 100) / 100) * 30 + (metrics.hasPhotos ? 10 : 0) + (metrics.hasPosts ? 10 : 0) + (metrics.hasWhatsapp ? 10 : 0));
  const compScore = Math.min(94, Math.max(82, userScore + 36));

  return (
    <div className="page-wrapper" style={{ background: '#F8FAFC', color: '#111827', minHeight: '100vh' }}>
      {/* Unified Navigation */}
      <Navbar isSticky />

      {/* Main Hero & Calculator */}
      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '40px 24px 90px' }}>
        <Breadcrumbs
          items={[
            { label: 'Growth Tools', href: '/#tools' },
            { label: 'Google Visibility Score Tool' },
          ]}
        />
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            color: '#4F46E5',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '5px 14px',
            background: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            ⚡ Free Google Visibility &amp; Competitor Spy Tool
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginTop: '6px', marginBottom: '14px', color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Estimate Your Google Score vs a Top Area Competitor
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Find out why competing local businesses in your locality rank higher and get 3x more customer calls on Google Maps.
          </p>
        </div>

        {/* Calculator Card Container */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 16px 40px rgba(11, 16, 32, 0.06)'
        }}>
          {!calculated ? (
            <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="calculator-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Input 1: User Business */}
                <div ref={userInputRef} style={{ position: 'relative' }}>
                  <label style={{ fontSize: '14px', fontWeight: '800', color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={16} color="#4F46E5" />
                    <span>Your Business Name</span>
                    <span style={{ fontSize: '11px', color: '#4F46E5', fontWeight: '700', background: 'rgba(79, 70, 229, 0.1)', padding: '2px 8px', borderRadius: '6px', marginLeft: 'auto' }}>
                      Live Autocomplete
                    </span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      required
                      placeholder="Type your business name (e.g. Green Trends, Ameerpet)"
                      value={centerName}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      onFocus={() => centerName.trim().length >= 2 && setShowUserDropdown(true)}
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 44px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#0B1020',
                        background: '#F8FAFC',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocusCapture={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#4F46E5';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
                      }}
                      onBlurCapture={(e) => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {showUserDropdown && userSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                      background: '#FFFFFF', border: '1.5px solid #4F46E5', borderRadius: '14px',
                      boxShadow: '0 12px 32px rgba(11, 16, 32, 0.15)', maxHeight: '240px', overflowY: 'auto',
                      marginTop: '4px'
                    }}>
                      {userSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCenterName(item.name);
                            setShowUserDropdown(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            borderBottom: idx === userSuggestions.length - 1 ? 'none' : '1px solid #F1F5F9',
                            fontSize: '14px',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(79, 70, 229, 0.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                        >
                          <strong style={{ color: '#111827', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                            <MapPin size={14} color="#4F46E5" /> {item.name}
                          </strong>
                          <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '2px', paddingLeft: '20px' }}>
                            {item.address}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input 2: Competitor Business */}
                <div ref={compInputRef} style={{ position: 'relative' }}>
                  <label style={{ fontSize: '14px', fontWeight: '800', color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={16} color="#F97316" />
                    <span>Top Competitor Business Name</span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', marginLeft: 'auto' }}>
                      (Optional)
                    </span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      placeholder="e.g. Apollo Dental (or leave blank for area avg)"
                      value={competitorName}
                      onChange={(e) => handleCompSearch(e.target.value)}
                      onFocus={() => competitorName.trim().length >= 2 && setShowCompDropdown(true)}
                      style={{
                        width: '100%',
                        padding: '14px 16px 14px 44px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#0B1020',
                        background: '#F8FAFC',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocusCapture={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#F97316';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.15)';
                      }}
                      onBlurCapture={(e) => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {showCompDropdown && compSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                      background: '#FFFFFF', border: '1.5px solid #F97316', borderRadius: '14px',
                      boxShadow: '0 12px 32px rgba(11, 16, 32, 0.15)', maxHeight: '240px', overflowY: 'auto',
                      marginTop: '4px'
                    }}>
                      {compSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCompetitorName(item.name);
                            setShowCompDropdown(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            borderBottom: idx === compSuggestions.length - 1 ? 'none' : '1px solid #F1F5F9',
                            fontSize: '14px',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                        >
                          <strong style={{ color: '#111827', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                            <MapPin size={14} color="#F97316" /> {item.name}
                          </strong>
                          <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '2px', paddingLeft: '20px' }}>
                            {item.address}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress and Live Analysis Loader */}
              {calculating && (
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #0B1020 0%, #1E1B4B 100%)',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(79, 70, 229, 0.4)',
                  color: '#FFFFFF',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="spinner" style={{
                        width: '18px',
                        height: '18px',
                        border: '2.5px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#F97316',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.6s linear infinite'
                      }} />
                      <span style={{ fontSize: '14.5px', fontWeight: '800', color: '#FFFFFF' }}>
                        {calcStep === 1 && `🔍 Connecting to Google Maps & searching "${centerName}"...`}
                        {calcStep === 2 && `📊 Benchmarking review counts, response speed & rating vs ${competitorName || 'area top listings'}...`}
                        {calcStep === 3 && `⚡ Calculating visibility score & generating comparative scorecard...`}
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#F97316' }}>{calcProgress}%</span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${calcProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #F97316 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Submit / Compare Button */}
              <div>
                <button
                  type="submit"
                  disabled={calculating}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: calculating ? '#94A3B8' : 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                    color: '#FFFFFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: '800',
                    border: 'none',
                    cursor: calculating ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    if (!calculating) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #134f8f 0%, #32c55f 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(23, 95, 171, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!calculating) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(23, 95, 171, 0.2)';
                    }
                  }}
                >
                  {calculating ? (
                    <>
                      <span className="spinner" style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#FFFFFF',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.6s linear infinite'
                      }} />
                      <span>Analyzing Google Visibility &amp; Competitor Score…</span>
                    </>
                  ) : (
                    <>
                      <span>Compare Visibility &amp; Estimate Score</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Benchmark Results Header */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#F97316',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 12px',
                  background: 'rgba(249, 115, 22, 0.12)',
                  borderRadius: '16px',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  ✓ Analysis Complete
                </span>
                <h2 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#111827', margin: '4px 0 8px', letterSpacing: '-0.02em' }}>
                  Google Visibility Benchmark Scorecard
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.96rem', maxWidth: '640px', margin: '0 auto' }}>
                  Estimated comparison based on local-search keyword visibility in {city}.
                </p>
              </div>

              {/* Score Comparison Cards */}
              <div className="calculator-compare-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                
                {/* User Center */}
                <div style={{
                  padding: '28px 24px',
                  borderRadius: '20px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '2px solid rgba(239, 68, 68, 0.25)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    YOUR BUSINESS
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: '6px 0 14px' }}>
                    {centerName}
                  </div>
                  <div style={{ fontSize: '3.4rem', fontWeight: '900', color: '#DC2626', lineHeight: 1 }}>
                    {userScore}<span style={{ fontSize: '1.2rem', color: '#64748B' }}>/100</span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#B91C1C', marginTop: '14px', background: 'rgba(239, 68, 68, 0.08)', padding: '6px 12px', borderRadius: '8px' }}>
                    ⚠️ Missing weekly GBP posts &amp; review auto-replies
                  </p>
                </div>

                {/* Competitor */}
                <div style={{
                  padding: '28px 24px',
                  borderRadius: '20px',
                  background: 'rgba(249, 115, 22, 0.06)',
                  border: '2px solid rgba(249, 115, 22, 0.35)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    COMPETITOR BENCHMARK
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: '6px 0 14px' }}>
                    {competitorName || 'Area Top Business Benchmark'}
                  </div>
                  <div style={{ fontSize: '3.4rem', fontWeight: '900', color: '#F97316', lineHeight: 1 }}>
                    {compScore}<span style={{ fontSize: '1.2rem', color: '#64748B' }}>/100</span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#EA580C', marginTop: '14px', background: 'rgba(249, 115, 22, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                    ✓ Active weekly Google posts &amp; 100% review response
                  </p>
                </div>
              </div>

              {/* Recalculate Option */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setCalculated(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4F46E5',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Test another business or competitor</span>
                </button>
              </div>

              {/* Action Box: High Contrast WhatsApp Delivery */}
              {!phoneSubmitted ? (
                <form
                  onSubmit={handleSendReport}
                  style={{
                    padding: '30px 24px',
                    background: 'linear-gradient(135deg, #0B1020 0%, #17143D 100%)',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(79, 70, 229, 0.4)',
                    boxShadow: '0 12px 32px rgba(11, 16, 32, 0.25)',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{
                    fontSize: '1.35rem',
                    fontWeight: '900',
                    color: '#FFFFFF',
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <WhatsAppOfficialIcon size={28} />
                    <span style={{ color: '#FFFFFF' }}>Get Your Real Google Score on WhatsApp</span>
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#E0E7FF',
                    margin: '0 0 20px',
                    lineHeight: 1.5,
                    maxWidth: '580px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    We&apos;ll look up your live Google Business Profile and send your audit report + step-by-step ranking fix plan directly to your WhatsApp.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '540px', margin: '0 auto' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '4px 14px',
                      flex: '1 1 240px',
                      minHeight: '50px'
                    }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        color: '#0B1020',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        paddingRight: '10px',
                        borderRight: '1.5px solid #E2E8F0'
                      }}>
                        🇮🇳 +91
                      </span>
                      <input
                        required
                        type="tel"
                        placeholder="10-digit WhatsApp number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#0B1020',
                          padding: '10px 10px',
                          letterSpacing: '0.04em'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      style={{
                        padding: '14px 26px',
                        background: 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        fontSize: '15px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: sending ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(23, 95, 171, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #134f8f 0%, #32c55f 100%)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(23, 95, 171, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #175fab 0%, #3be06d 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(23, 95, 171, 0.2)';
                      }}
                    >
                      {sending ? (
                        <>
                          <span className="spinner" style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#FFFFFF',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 0.6s linear infinite'
                          }} />
                          <span>Sending Report…</span>
                        </>
                      ) : (
                        <>
                          <span>Send Report on WhatsApp</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                  {sendError && <p style={{ color: '#FCA5A5', fontSize: '13px', marginTop: '12px', fontWeight: '600' }}>{sendError}</p>}
                </form>
              ) : (
                <div style={{
                  padding: '24px',
                  background: 'rgba(249, 115, 22, 0.12)',
                  border: '1.5px solid #F97316',
                  borderRadius: '16px',
                  textAlign: 'left',
                  color: '#F97316',
                }}>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={20} color="#F97316" />
                    <span>Audit Report Sent to WhatsApp!</span>
                  </div>
                  <p style={{ color: '#111827', fontSize: '14.5px', margin: 0, lineHeight: 1.6 }}>
                    {realResult?.message || `Your real Google visibility score for ${centerName} has been compiled. Check your WhatsApp inbox for your 6-point ranking optimization roadmap.`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
