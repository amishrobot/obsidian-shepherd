export function monogramFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

interface EyebrowInput {
  age: number | null;
  priesthood: string;
  calling: string;
}

export function parseEyebrowSegments(input: EyebrowInput): string[] {
  const segments: string[] = [];
  if (input.age != null) segments.push(String(input.age));
  if (input.priesthood && input.priesthood !== 'none') {
    segments.push(input.priesthood.toUpperCase());
  }
  const orgMatch = input.calling.match(/\(([^)]+)\)\s*$/);
  if (orgMatch) segments.push(orgMatch[1].toUpperCase());
  return segments;
}

export function parseCallingSubtitle(calling: string): string | null {
  if (!calling.trim()) return null;
  const stripped = calling.replace(/\s*\([^)]+\)\s*$/, '').trim();
  return stripped || null;
}

export function parseCity(address: string): string | null {
  if (!address.trim()) return null;
  const lastSegment = address.split(',').pop()?.trim() ?? '';
  const match = lastSegment.match(/^(.+?)\s+([A-Z]{2})\s+\d{5}/i);
  if (!match) return null;
  const cityRaw = match[1].trim();
  const state = match[2].toUpperCase();
  const city = cityRaw
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return `${city}, ${state}`;
}

export function parsePhoneDisplay(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  let useDigits = digits;
  if (digits.length === 11 && digits.startsWith('1')) {
    useDigits = digits.slice(1);
  }
  if (useDigits.length === 10) {
    return `${useDigits.slice(0, 3)}-${useDigits.slice(3, 6)}-${useDigits.slice(6)}`;
  }
  return raw;
}

export function formatLastContact(dateStr: string | null, nowMs: number = Date.now()): string {
  if (!dateStr) return 'never';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'never';
  const days = Math.floor((nowMs - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days <= 30) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks <= 12) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function buildMapsUrl(address: string, isAppleDevice: boolean): string {
  if (!address) return '';
  const encoded = encodeURIComponent(address);
  if (isAppleDevice) {
    return `maps://?q=${encoded}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}
