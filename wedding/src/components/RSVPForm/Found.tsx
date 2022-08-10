import React from 'react';
import { RSVP } from '@utils/types';

interface FoundProps {
  invitations: RSVP[];
  onChange: () => void;
}

export const Found = ({ invitations, onChange }: FoundProps) => (
  <div>
    {invitations.map((inv) => (
      <div key={inv.name}>
        <p>
          {inv.name}, you have{' '}
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
