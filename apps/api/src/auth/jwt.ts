// Minimal JWT sign/verify wrapper. Stateless sessions — the token carries
// userId + businessId so most requests need no DB lookup.
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AuthClaims {
  userId: string;
  businessId: string | null;
  role: string;
}

export function signToken(claims: AuthClaims): string {
  return jwt.sign(claims, config.JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): AuthClaims | null {
  try {
    return jwt.verify(token, config.JWT_SECRET) as AuthClaims;
  } catch {
    return null;
  }
}
