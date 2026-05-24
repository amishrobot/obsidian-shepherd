import { describe, it, expect } from 'vitest';
import {
  monogramFromName,
  parseEyebrowSegments,
  parseCallingSubtitle,
  parseCity,
  parsePhoneDisplay,
  formatLastContact,
  buildMapsUrl,
} from './helpers';

describe('monogramFromName', () => {
  it('returns first letter of first + last name', () => {
    expect(monogramFromName('Peter Quinanola')).toBe('PQ');
  });
  it('returns first two letters when only one name', () => {
    expect(monogramFromName('Madonna')).toBe('MA');
  });
  it('uppercases lowercase input', () => {
    expect(monogramFromName('peter quinanola')).toBe('PQ');
  });
  it('handles three-part names by taking first and last', () => {
    expect(monogramFromName('Jacob Van Skyhawk')).toBe('JS');
  });
  it('returns empty string for empty input', () => {
    expect(monogramFromName('')).toBe('');
  });
});

describe('parseEyebrowSegments', () => {
  it('returns age, priesthood, org for full data', () => {
    expect(parseEyebrowSegments({
      age: 33, priesthood: 'elder', calling: 'Assistant Activity Coordinator (Elders Quorum)',
    })).toEqual(['33', 'ELDER', 'ELDERS QUORUM']);
  });
  it('skips priesthood when value is none', () => {
    expect(parseEyebrowSegments({
      age: 27, priesthood: 'none', calling: 'Relief Society President (Relief Society)',
    })).toEqual(['27', 'RELIEF SOCIETY']);
  });
  it('skips org when calling has no parenthetical', () => {
    expect(parseEyebrowSegments({
      age: 29, priesthood: 'elder', calling: 'Ward Mission Leader',
    })).toEqual(['29', 'ELDER']);
  });
  it('returns just age when nothing else available', () => {
    expect(parseEyebrowSegments({
      age: 33, priesthood: 'none', calling: '',
    })).toEqual(['33']);
  });
  it('returns empty array when no data at all', () => {
    expect(parseEyebrowSegments({
      age: null, priesthood: 'none', calling: '',
    })).toEqual([]);
  });
  it('handles missing age (null)', () => {
    expect(parseEyebrowSegments({
      age: null, priesthood: 'elder', calling: 'Sunday School Teacher (Sunday School)',
    })).toEqual(['ELDER', 'SUNDAY SCHOOL']);
  });
});

describe('parseCallingSubtitle', () => {
  it('strips trailing parenthetical org', () => {
    expect(parseCallingSubtitle('Assistant Activity Coordinator (Elders Quorum)'))
      .toBe('Assistant Activity Coordinator');
  });
  it('returns full calling when no parenthetical', () => {
    expect(parseCallingSubtitle('Ward Mission Leader')).toBe('Ward Mission Leader');
  });
  it('returns null for empty', () => {
    expect(parseCallingSubtitle('')).toBeNull();
  });
  it('handles inner parens correctly (only strips trailing)', () => {
    expect(parseCallingSubtitle('Some Role (with detail) (Relief Society)'))
      .toBe('Some Role (with detail)');
  });
  it('trims trailing whitespace after stripping', () => {
    expect(parseCallingSubtitle('Role   (Org)')).toBe('Role');
  });
});

describe('parseCity', () => {
  it('parses simple "Street, City ST ZIP" address', () => {
    expect(parseCity('178 E 540 N, Vineyard UT 84059-6067'))
      .toBe('Vineyard, UT');
  });
  it('parses address with apartment line', () => {
    expect(parseCity('120 W Bend St, 1126, Vineyard UT 84059'))
      .toBe('Vineyard, UT');
  });
  it('handles all-caps city', () => {
    expect(parseCity('47 W SILVER SPRINGS DR, VINEYARD UT 84059-6529'))
      .toBe('Vineyard, UT');
  });
  it('handles multi-word city', () => {
    expect(parseCity('123 Main St, Salt Lake City UT 84101'))
      .toBe('Salt Lake City, UT');
  });
  it('returns null when no parseable city', () => {
    expect(parseCity('')).toBeNull();
    expect(parseCity('just some text')).toBeNull();
  });
});

describe('parsePhoneDisplay', () => {
  it('formats 10-digit US number', () => {
    expect(parsePhoneDisplay('8018881139')).toBe('801-888-1139');
  });
  it('strips leading 1 from 11-digit number', () => {
    expect(parsePhoneDisplay('18016516052')).toBe('801-651-6052');
  });
  it('strips +1 from international format', () => {
    expect(parsePhoneDisplay('+12395807920')).toBe('239-580-7920');
  });
  it('preserves hyphenated input', () => {
    expect(parsePhoneDisplay('385-535-6913')).toBe('385-535-6913');
  });
  it('returns input as-is for non-US shapes', () => {
    expect(parsePhoneDisplay('+44 20 7946 0958')).toBe('+44 20 7946 0958');
  });
  it('returns empty for empty', () => {
    expect(parsePhoneDisplay('')).toBe('');
  });
});

describe('formatLastContact', () => {
  const NOW = new Date('2026-05-23T12:00:00Z').getTime();

  it('returns "never" for null or empty', () => {
    expect(formatLastContact(null, NOW)).toBe('never');
    expect(formatLastContact('', NOW)).toBe('never');
  });
  it('returns "today" for 0d', () => {
    expect(formatLastContact('2026-05-23', NOW)).toBe('today');
  });
  it('returns "Xd ago" for ≤ 30 days', () => {
    expect(formatLastContact('2026-05-20', NOW)).toBe('3d ago');
    expect(formatLastContact('2026-04-23', NOW)).toBe('30d ago');
  });
  it('returns "Xw ago" for > 30d and ≤ 12 weeks', () => {
    expect(formatLastContact('2026-04-15', NOW)).toBe('5w ago');
  });
  it('returns "Xmo ago" beyond 12 weeks', () => {
    expect(formatLastContact('2026-01-23', NOW)).toBe('4mo ago');
  });
  it('returns "never" for unparseable date', () => {
    expect(formatLastContact('garbage', NOW)).toBe('never');
  });
});

describe('buildMapsUrl', () => {
  it('uses Apple Maps URL when isAppleDevice=true', () => {
    expect(buildMapsUrl('178 E 540 N, Vineyard UT 84059', true))
      .toBe('maps://?q=178%20E%20540%20N%2C%20Vineyard%20UT%2084059');
  });
  it('uses Google Maps URL when isAppleDevice=false', () => {
    expect(buildMapsUrl('178 E 540 N, Vineyard UT 84059', false))
      .toBe('https://www.google.com/maps/search/?api=1&query=178%20E%20540%20N%2C%20Vineyard%20UT%2084059');
  });
  it('returns empty string for empty address', () => {
    expect(buildMapsUrl('', true)).toBe('');
  });
});
