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

/**
 * Parses the vault's `ministering` frontmatter string, e.g.
 * "Ministered by: Alice Smith, Bob Jones | Ministers to: Carol White, Dan Black".
 * A label may repeat across segments; results are merged and de-duplicated,
 * preserving first-seen order.
 */
export function parseMinistering(raw: string): { ministeredBy: string[]; ministersTo: string[] } {
  const ministeredBy: string[] = [];
  const ministersTo: string[] = [];
  if (!raw.trim()) return { ministeredBy, ministersTo };

  const segments = raw.split('|').map((s) => s.trim()).filter(Boolean);
  for (const segment of segments) {
    const match = segment.match(/^(Ministered by|Ministers to)\s*:\s*(.*)$/i);
    if (!match) continue;
    const target = match[1].toLowerCase() === 'ministered by' ? ministeredBy : ministersTo;
    const names = match[2].split(',').map((n) => n.trim()).filter(Boolean);
    for (const name of names) {
      if (!target.includes(name)) target.push(name);
    }
  }
  return { ministeredBy, ministersTo };
}

/**
 * Normalizes an address for housemate comparison: lowercase, punctuation
 * stripped, whitespace collapsed, and a trailing zip+4 suffix reduced to
 * the base 5-digit zip.
 */
export function normalizeAddress(address: string): string {
  if (!address.trim()) return '';
  return address
    .toLowerCase()
    .replace(/[.,#]/g, ' ')
    .replace(/(\d{5})-\d{4}\b/, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats a `moved-in` date into "in ward since <Mon YYYY> · <N yr M mo>".
 * Returns null when the date is missing or unparseable.
 */
export function formatMovedInSince(movedIn: string, nowMs: number = Date.now()): string | null {
  if (!movedIn.trim()) return null;
  const d = new Date(movedIn);
  if (isNaN(d.getTime())) return null;
  const now = new Date(nowMs);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

  let totalMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  if (now.getDate() < d.getDate()) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr`);
  if (months > 0 || years === 0) parts.push(`${months} mo`);

  return `in ward since ${label} · ${parts.join(' ')}`;
}
