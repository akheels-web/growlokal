'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Tagline */}
          <div className="footer-brand-col">
            <BrandLogo variant="footer" />
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
              <li className="footer-link-item"><Link href="/tools/google-score-calculator">Google Score Benchmark</Link></li>
              <li className="footer-link-item"><Link href="/tools/revenue-roi-calculator">Revenue Growth Calculator</Link></li>
              <li className="footer-link-item"><Link href="/free-gbp-report">Free GBP Audit Report</Link></li>
              <li className="footer-link-item"><Link href="/resources/whatsapp-kit">WhatsApp Growth Kit</Link></li>
              <li className="footer-link-item"><Link href="/blog">Local SEO Playbooks</Link></li>
            </ul>
          </div>

          {/* Col 3: Industry Solutions */}
          <div>
            <h4 className="footer-col-title">Solutions</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link href="/industry/clinics-doctors">Clinics &amp; Healthcare</Link></li>
              <li className="footer-link-item"><Link href="/industry/salons-spas">Salons &amp; Spas</Link></li>
              <li className="footer-link-item"><Link href="/industry/restaurants-cafes">Restaurants &amp; Cafes</Link></li>
              <li className="footer-link-item"><Link href="/industry/interior-design">Interior Designers</Link></li>
              <li className="footer-link-item"><Link href="/industry/home-services">Home Services</Link></li>
              <li className="footer-link-item"><Link href="/#industries">View All Sectors →</Link></li>
            </ul>
          </div>

          {/* Col 4: Top Locations (SEO) */}
          <div>
            <h4 className="footer-col-title">Top Locations</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link href="/city/hyderabad">Hyderabad, Telangana</Link></li>
              <li className="footer-link-item"><Link href="/city/bengaluru">Bengaluru, Karnataka</Link></li>
              <li className="footer-link-item"><Link href="/city/chennai">Chennai, Tamil Nadu</Link></li>
              <li className="footer-link-item"><Link href="/city/visakhapatnam">Visakhapatnam, AP</Link></li>
              <li className="footer-link-item"><Link href="/city/vijayawada">Vijayawada, AP</Link></li>
              <li className="footer-link-item"><Link href="/city/coimbatore">Coimbatore, TN</Link></li>
              <li className="footer-link-item"><Link href="/city/kochi">Kochi, Kerala</Link></li>
            </ul>
          </div>

          {/* Col 5: Account & Support */}
          <div>
            <h4 className="footer-col-title">Account &amp; Help</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link href="/login">Owner Sign In</Link></li>
              <li className="footer-link-item"><Link href="/#pricing">Growth Plan Pricing</Link></li>
              <li className="footer-link-item"><Link href="/book-free-demo">Book Free 1-on-1 Demo</Link></li>
              <li className="footer-link-item"><a href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20GrowLokal%20Support" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></li>
              <li className="footer-link-item"><Link href="/privacy">Privacy Policy</Link></li>
              <li className="footer-link-item"><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li className="footer-link-item"><Link href="/refund">Refund Policy</Link></li>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
