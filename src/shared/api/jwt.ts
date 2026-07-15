import type { JwtPayload, UserRole } from '../types/user';

function toBase64(input: string): string {
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(input);
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let i = 0;
  while (i < input.length) {
    const a = input.charCodeAt(i++);
    const b = i < input.length ? input.charCodeAt(i++) : Number.NaN;
    const c = i < input.length ? input.charCodeAt(i++) : Number.NaN;

    const bitmap = (a << 16) | ((Number.isNaN(b) ? 0 : b) << 8) | (Number.isNaN(c) ? 0 : c);

    output += chars.charAt((bitmap >> 18) & 63);
    output += chars.charAt((bitmap >> 12) & 63);
    output += Number.isNaN(b) ? '=' : chars.charAt((bitmap >> 6) & 63);
    output += Number.isNaN(c) ? '=' : chars.charAt(bitmap & 63);
  }
  return output;
}

function fromBase64(input: string): string {
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(input);
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const str = input.replace(/=+$/, '');
  let output = '';
  let i = 0;

  while (i < str.length) {
    const encoded1 = chars.indexOf(str.charAt(i++));
    const encoded2 = chars.indexOf(str.charAt(i++));
    const encoded3 = chars.indexOf(str.charAt(i++));
    const encoded4 = chars.indexOf(str.charAt(i++));

    const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
    output += String.fromCharCode((bitmap >> 16) & 255);
    if (encoded3 !== 64 && encoded3 !== -1) {
      output += String.fromCharCode((bitmap >> 8) & 255);
    }
    if (encoded4 !== 64 && encoded4 !== -1) {
      output += String.fromCharCode(bitmap & 255);
    }
  }
  return output;
}

function base64UrlEncode(value: string): string {
  return toBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return fromBase64(padded);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) {
      return null;
    }

    const json = base64UrlDecode(parts[1]);
    const payload = JSON.parse(json) as JwtPayload;

    if (!payload.role || !payload.sub) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): UserRole | null {
  return decodeJwtPayload(token)?.role ?? null;
}

/** Creates an unsigned mock JWT for scaffold / demo auth only. */
export function createMockJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + 60 * 60 * 8,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(fullPayload));
  return `${header}.${body}.mock-signature`;
}
