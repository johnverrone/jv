import React, { Fragment } from 'react';
import { Text } from '../../components/Text';
import { Check, HelpCircle, X } from 'react-feather';
import css from './index.module.scss';
import { Button } from '../../components/Button';
import { Person } from '@prisma/client';

interface FoundProps {
  invitations: Person[];
  onChange: () => void;
  onCancel: () => void;
}

export const Found = ({ invitations, onChange, onCancel }: FoundProps) => {
  const firstTime = invitations.every(
    (invite) => invite.attendance === 'UNKNOWN'
  );

  return (
    <div className={css.rsvpForm}>
      {!firstTime && (
        <div>
          <Text variant="heading1">Welcome back!</Text>
          <Text variant="body2">Here&apos;s a recap of your RSVP.</Text>
        </div>
      )}
      <div>
        {invitations.map((inv) => {
          const attending = inv.attendance === 'ATTENDING';
          const unknown = inv.attendance === 'UNKNOWN';
          const golfing = inv.golf === 'ATTENDING';
          return (
            <Fragment key={inv.name}>
              <div className={css.foundInvite}>
                {unknown ? <HelpCircle /> : attending ? <Check /> : <X />}
                <Text variant="body2">
                  <strong>{inv.name}</strong>
                  {`${
                    unknown
                      ? ' has not responded'
                      : attending
                      ? ` is attending${golfing ? ' and golfing' : ''}`
                      : ' is not attending'
                  }`}
                </Text>
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className={css.rowItems}>
        <Button variant="secondary" onClick={onCancel}>
          Done
        </Button>
        <Button variant="primary" onClick={onChange}>
          Change Response
        </Button>
      </div>
    </div>
  );
};
