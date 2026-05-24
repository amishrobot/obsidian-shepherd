import { h } from 'preact';
import { Platform } from 'obsidian';
import { parsePhoneDisplay, parseCity, buildMapsUrl } from '../services/helpers';

interface Props {
  phone: string;
  email: string;
  address: string;
}

export function ContactChips({ phone, email, address }: Props) {
  const phoneDigits = phone.replace(/\D/g, '');
  const phoneDisplay = parsePhoneDisplay(phone);
  const city = parseCity(address);
  const isApple = Platform.isMacOS || Platform.isIosApp;
  const mapsUrl = buildMapsUrl(address, isApple);
  const emailLocal = email.split('@')[0] || email;

  return (
    <div class="shepherd-chips">
      {phone && (
        <a class="shepherd-chip" href={`tel:${phoneDigits}`}>📞 {phoneDisplay}</a>
      )}
      {email && (
        <a class="shepherd-chip" href={`mailto:${email}`}>✉ {emailLocal}</a>
      )}
      {city && (
        <a class="shepherd-chip" href={mapsUrl} target="_blank">📍 {city}</a>
      )}
    </div>
  );
}
