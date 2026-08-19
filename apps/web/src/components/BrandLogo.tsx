import React from 'react';
import Link from 'next/link';

/**
 * Global Brand Logo Configuration
 * 
 * To change the logo across all headers, navigation menus, and footers on the website,
 * simply place your image link in `logoUrl` below (e.g. '/images/logo.svg', '/images/logo.png', or 'https://...').
 * 
 * When `logoUrl` is provided, all pages will automatically render the image logo.
 * If `logoUrl` is empty or null, it gracefully displays the high-contrast GrowLokal brand typography.
 */
export const BRAND_CONFIG = {
  name: 'GrowLokal',
  tagline: 'Autonomous AI Marketing Platform for South Indian Local Businesses',
  logoUrl: '', // <-- PASTE YOUR LOGO LINK HERE (e.g. '/images/logo.png' or 'https://...')
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
  const logoUrl = customLogoUrl !== undefined ? customLogoUrl : BRAND_CONFIG.logoUrl;

  const content = logoUrl ? (
    <img
      src={logoUrl}
      alt={BRAND_CONFIG.logoAlt}
      loading="eager"
      decoding="async"
      width={BRAND_CONFIG.logoWidth}
      height={BRAND_CONFIG.logoHeight}
      className={`brand-logo-img ${className}`}
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
        color: '#111827',
        letterSpacing: '-0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
    >
      Grow<span style={{ color: '#175fab' }}>Lokal</span>
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
