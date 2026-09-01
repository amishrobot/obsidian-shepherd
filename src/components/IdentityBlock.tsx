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

  // Reset the broken-image fallback whenever the resolved photo changes.
  useEffect(() => setPhotoFailed(false), [photoUrl]);

  const showPhoto = photoUrl && !photoFailed;

  return (
    <div class="shepherd-identity">
      <div class="shepherd-monogram" data-gender={member.gender || 'U'}>
        {showPhoto ? (
          <img
            class="shepherd-avatar-img"
            src={photoUrl as string}
            alt={member.name}
            onError={() => setPhotoFailed(true)}
          />
        ) : monogram}
      </div>
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
