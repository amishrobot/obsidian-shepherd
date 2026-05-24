import { h } from 'preact';
import { MemberState } from '../models/types';
import { monogramFromName, parseEyebrowSegments, parseCallingSubtitle } from '../services/helpers';

interface Props {
  member: MemberState;
}

export function IdentityBlock({ member }: Props) {
  const monogram = monogramFromName(member.name);
  const eyebrowSegments = parseEyebrowSegments({
    age: member.age,
    priesthood: member.priesthood,
    calling: member.calling,
  });
  const subtitle = parseCallingSubtitle(member.calling);

  return (
    <div class="shepherd-identity">
      <div class="shepherd-monogram" data-gender={member.gender || 'U'}>{monogram}</div>
      <div class="shepherd-identity-text">
        {eyebrowSegments.length > 0 && (
          <div class="shepherd-eyebrow">{eyebrowSegments.join(' · ')}</div>
        )}
        <div class="shepherd-name">{member.name}</div>
        {subtitle && <div class="shepherd-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
