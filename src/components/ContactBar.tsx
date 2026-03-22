import { h } from 'preact';
import { Platform, Notice } from 'obsidian';

interface Props {
  phone: string;
  email: string;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    new Notice(`Copied ${label}: ${text}`);
  });
}

export function ContactBar({ phone, email }: Props) {
  if (!phone && !email) return null;

  const isIos = Platform.isIosApp;
  const isMobile = Platform.isMobile;

  return (
    <div class="shepherd-contact-bar">
      {phone && isIos && (
        <span class="shepherd-contact-btn" onClick={() => window.open(`tel:${phone}`)}>
          📞 Call
        </span>
      )}
      {phone && isIos && (
        <span class="shepherd-contact-btn" onClick={() => window.open(`sms:${phone}`)}>
          💬 Text
        </span>
      )}
      {phone && !isIos && (
        <span class="shepherd-contact-btn" onClick={() => copyToClipboard(phone, 'phone')}>
          📞 {phone}
        </span>
      )}
      {email && (
        <span class="shepherd-contact-btn" onClick={() => window.open(`mailto:${email}`)}>
          ✉️ {isMobile ? 'Email' : email}
        </span>
      )}
    </div>
  );
}
