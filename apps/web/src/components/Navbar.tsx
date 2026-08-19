'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export type Lang = 'en' | 'te' | 'ta' | 'kn';

interface NavbarProps {
  currentLang?: Lang;
  onLangChange?: (lang: Lang) => void;
  isSticky?: boolean;
}

export function Navbar({ currentLang = 'en', onLangChange, isSticky = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(isSticky);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Lang>(currentLang);

  useEffect(() => {
    setSelectedLang(currentLang);
  }, [currentLang]);

  const handleLangSelect = (newLang: Lang) => {
    setSelectedLang(newLang);
    if (onLangChange) {
      onLangChange(newLang);
    }
  };

  useEffect(() => {
    if (isSticky) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isSticky]);

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
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ─── DESKTOP & MOBILE MAIN HEADER ─── */}
      <header
        className={`nav-header ${scrolled ? 'nav-header--scrolled' : ''}`}
        style={isSticky ? { position: 'sticky', top: 0, zIndex: 100 } : undefined}
      >
        <div className="nav-container">
          {/* Brand Logo */}
          <div className="nav-brand-group">
            <Link href="/" className="nav-brand">
              Grow<span>Lokal</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-desktop-links" aria-label="Main navigation">
            <Link href="/#how-it-works" className="nav-link-item">
              How it works
            </Link>
            <Link href="/#agents" className="nav-link-item">
              AI Agents
            </Link>
            <Link href="/#pricing" className="nav-link-item">
              Pricing
            </Link>
            <Link href="/#industries" className="nav-link-item">
              Industries
            </Link>
            <Link href="/free-gbp-report" className="nav-link-item" style={{ color: '#4F46E5', fontWeight: '700' }}>
              Free GBP Report
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="nav-actions">
            <Link href="/login" className="nav-signin-link">
              Sign In
            </Link>
            <Link
              href="/book-free-demo"
              className="nav-cta-btn"
            >
              <span>Book Free Demo →</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              id="toggleOpen"
              aria-controls="mobile-nav-drawer"
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="nav-mobile-toggle"
            >
              <svg
                className="nav-hamburger-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DRAWER BACKDROP ─── */}
      {mobileMenuOpen && (
        <div
          className="nav-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── MOBILE DRAWER PANEL ─── */}
      <div
        id="mobile-nav-drawer"
        tabIndex={-1}
        aria-hidden={!mobileMenuOpen}
        className={`nav-mobile-drawer ${mobileMenuOpen ? 'nav-mobile-drawer--open' : ''}`}
      >
        {/* Drawer Header */}
        <div className="nav-drawer-header">
          <Link href="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
            Grow<span>Lokal</span>
          </Link>
          <button
            type="button"
            id="toggleClose"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-drawer-close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-close-icon"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="nav-drawer-body">
          {/* Links List */}
          <nav className="nav-drawer-links" aria-label="Mobile navigation">
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link">
              <span>How it works</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
            <Link href="/#agents" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link">
              <span>AI Agents</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
            <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link">
              <span>Pricing Plans</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
            <Link href="/#industries" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link">
              <span>Industries &amp; Sectors</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
            <Link href="/free-gbp-report" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link" style={{ color: '#4F46E5', fontWeight: '700' }}>
              <span>⚡ Free GBP Report</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
            <Link href="/tools/revenue-roi-calculator" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link">
              <span>Revenue ROI Calculator</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
            <Link href="/tools/google-score-calculator" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-link">
              <span>Google Score Tool</span>
              <span className="nav-drawer-link-arrow">→</span>
            </Link>
          </nav>

          {/* Drawer Actions */}
          <div className="nav-drawer-actions">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="nav-drawer-signin">
              Sign In
            </Link>
            <Link
              href="/book-free-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-drawer-cta"
            >
              💬 Book Free Demo →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
