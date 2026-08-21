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

  headerLogoUrl: 'https://zugkwxy0oqkvrsu5.public.blob.vercel-storage.com/logo_right_text.png', // <-- PASTE DARK LOGO FOR HEADER (e.g. '/images/logo-dark.png' or 'https://...')
  footerLogoUrl: 'https://zugkwxy0oqkvrsu5.public.blob.vercel-storage.com/logo_white.png', // <-- PASTE LIGHT LOGO FOR FOOTER (e.g. '/images/logo-light.png' or 'https://...')
  faviconUrl: '/favicon.png', // <-- True 1:1 square icon (un-stretched)
  logoUrl: '',       // <-- Universal fallback logo if both header & footer share the same file

  logoAlt: 'GrowLokal Logo',
  logoWidth: 160,
  logoHeight: 46,
};

export interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'compact';
  className?: string;
  href?: string;
  customLogoUrl?: string;
  style?: React.CSSProperties;
  height?: number | string;
}

export function BrandLogo({
  variant = 'header',
  className = '',
  href = '/',
  customLogoUrl,
  style,
  height,
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

  // Calculate default heights based on variant
  const defaultHeight = height ?? (variant === 'footer' ? '50px' : variant === 'compact' ? '34px' : '44px');
  const defaultMaxHeight = variant === 'footer' ? '56px' : variant === 'compact' ? '38px' : '48px';

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
        height: defaultHeight,
        maxHeight: defaultMaxHeight,
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
      Grow<span style={{ color: '#F97316' }}>Lokal</span>
    </span>
  ) : (
    <span
      className={`nav-brand ${className}`}
      style={{
        fontSize: variant === 'compact' ? '20px' : '24px',
        fontWeight: '900',
        color: '#0B1020',
        letterSpacing: '-0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
    >
      Grow<span style={{ color: '#4F46E5' }}>Lokal</span>
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
