import React from 'react';
import Link from 'next/link';

/**
 * Global Brand Logo & Favicon Configuration
 * 
 * You can configure your visual brand assets here in one central file:
 * 
 * 1. `headerLogoUrl`: Displayed in top navigation headers on light backgrounds (Dark Logo).
 * 2. `footerLogoUrl`: Displayed in footers on dark backgrounds (Light / White Logo).
 * 3. `faviconUrl`: Browser tab icon / favicon across all pages (e.g. '/favicon.ico', '/images/favicon.png', or 'https://...').
 * 4. `logoUrl`: Universal fallback logo if both header & footer share the same image.
 * 
 * Example:
 *   headerLogoUrl: '/images/logo-dark.png',
 *   footerLogoUrl: '/images/logo-light.png',
 *   faviconUrl: '/images/favicon.png',
 */
export const BRAND_CONFIG = {
  name: 'GrowLokal',
  tagline: 'Autonomous AI Marketing Platform for South Indian Local Businesses',
  
  headerLogoUrl: '', // <-- PASTE DARK LOGO FOR HEADER (e.g. '/images/logo-dark.png' or 'https://...')
  footerLogoUrl: '', // <-- PASTE LIGHT LOGO FOR FOOTER (e.g. '/images/logo-light.png' or 'https://...')
  faviconUrl: '',    // <-- PASTE FAVICON LINK HERE (e.g. '/favicon.ico', '/images/favicon.png' or 'https://...')
  logoUrl: '',       // <-- Universal fallback logo if both header & footer share the same file
  
  logoAlt: 'GrowLokal Logo',
  logoWidth: 150,
  logoHeight: 36,
};

export interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'compact';
  className?: string;
  href?: string;
  customLogoUrl?: string;
  style?: React.CSSProperties;
}

export function BrandLogo({
  variant = 'header',
  className = '',
  href = '/',
  customLogoUrl,
  style,
}: BrandLogoProps) {
  // Determine appropriate logo based on variant
  let logoUrl = customLogoUrl;
  if (!logoUrl) {
    if (variant === 'footer') {
      logoUrl = BRAND_CONFIG.footerLogoUrl || BRAND_CONFIG.logoUrl;
    } else {
      logoUrl = BRAND_CONFIG.headerLogoUrl || BRAND_CONFIG.logoUrl;
    }
  }

  const content = logoUrl ? (
    <img
      src={logoUrl}
      alt={BRAND_CONFIG.logoAlt}
      loading="eager"
      decoding="async"
      width={BRAND_CONFIG.logoWidth}
      height={BRAND_CONFIG.logoHeight}
      className={`brand-logo-img brand-logo-img--${variant} ${className}`}
      style={{
        maxHeight: variant === 'footer' ? '38px' : '32px',
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  ) : variant === 'footer' ? (
    <span
      className={`footer-brand ${className}`}
      style={{
        fontSize: '1.6rem',
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: '-0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
    >
      Grow<span style={{ color: '#3be06d' }}>Lokal</span>
    </span>
  ) : (
    <span
      className={`nav-brand ${className}`}
      style={{
        fontSize: variant === 'compact' ? '20px' : '23px',
        fontWeight: '900',
        color: '#0B1020',
        letterSpacing: '-0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
    >
      Grow<span style={{ color: '#175fab' }}>Lokal</span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="brand-logo-link"
        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
