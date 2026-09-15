import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { App, TFile } from 'obsidian';
import { MemberState } from '../models/types';
import { monogramFromName, parseEyebrowSegments, parseCallingSubtitle, formatMovedInSince } from '../services/helpers';

interface Props {
  app: App;
  member: MemberState;
}

export function IdentityBlock({ app, member }: Props) {
  const monogram = monogramFromName(member.name);
  const eyebrowSegments = parseEyebrowSegments({
    age: member.age,
    priesthood: member.priesthood,
    calling: member.calling,
  });
  const subtitle = parseCallingSubtitle(member.calling);
  const tenure = formatMovedInSince(member.movedIn);

  const photoFile = member.photo ? app.vault.getAbstractFileByPath(member.photo) : null;
  const photoUrl = photoFile instanceof TFile ? app.vault.getResourcePath(photoFile) : null;
  const [photoFailed, setPhotoFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // Reset the broken-image fallback whenever the resolved photo changes.
  useEffect(() => setPhotoFailed(false), [photoUrl]);

  // A zoomed photo closes on Escape as well as on click — the panel is narrow
  // and the overlay covers it, so there must be a keyboard way out.
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [zoomed]);

  // Never leave the overlay open behind a different member's panel.
  useEffect(() => setZoomed(false), [member.name]);

  const showPhoto = photoUrl && !photoFailed;

  return (
    <div class="shepherd-identity">
      <div class="shepherd-monogram" data-gender={member.gender || 'U'}>
        {showPhoto ? (
          <img
            class="shepherd-avatar-img"
            src={photoUrl as string}
            alt={member.name}
            role="button"
            tabIndex={0}
            title="Click to enlarge"
            onError={() => setPhotoFailed(true)}
            onClick={() => setZoomed(true)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setZoomed(true);
              }
            }}
          />
        ) : monogram}
      </div>
      {zoomed && showPhoto && (
        <div
          class="shepherd-lightbox"
          role="dialog"
          aria-label={`${member.name} — photo`}
          onClick={() => setZoomed(false)}
        >
          <img class="shepherd-lightbox-img" src={photoUrl as string} alt={member.name} />
        </div>
      )}
      <div class="shepherd-identity-text">
        {eyebrowSegments.length > 0 && (
          <div class="shepherd-eyebrow">{eyebrowSegments.join(' · ')}</div>
        )}
        <div class="shepherd-name">{member.name}</div>
        {subtitle && <div class="shepherd-subtitle">{subtitle}</div>}
        {tenure && <div class="shepherd-tenure">{tenure}</div>}
      </div>
    </div>
  );
}
