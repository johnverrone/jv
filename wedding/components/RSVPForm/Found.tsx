import React from 'react';
import { RSVP } from 'types/rsvp';

interface FoundProps {
  invitations: RSVP[];
  onChange: () => void;
}

export const Found = ({ invitations, onChange }: FoundProps) => (
  <div>
    {invitations.map((inv) => (
      <div>
        <p>
          You have{' '}
          {inv.attendance !== 'unknown' ? 'responded' : 'not responded'}
        </p>
        {inv.attendance !== 'unknown' && (
          <p>
            You are{' '}
            {inv.attendance === 'attending' ? 'attending' : 'not attending'}
          </p>
        )}
      </div>
    ))}
    <button onClick={onChange}>change response</button>
  </div>
);
