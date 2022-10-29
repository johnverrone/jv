import React, { Fragment } from 'react';
import { Text } from '../../components/Text';
import { Check, HelpCircle, X } from 'react-feather';
import css from './index.module.scss';
import { Button } from '../../components/Button';
import Link from 'next/link';
import { Person } from '@prisma/client';

interface FoundProps {
  invitations: Person[];
  onChange: () => void;
}

export const Found = ({ invitations, onChange }: FoundProps) => {
  const firstTime = invitations.every(
    (invite) => invite.attendance === 'UNKNOWN'
  );

  return (
    <div className={css.rsvpForm}>
      {!firstTime && (
        <Text variant="heading3">
          Welcome back! Here&apos;s a recap of your RSVP.
        </Text>
      )}
      <div>
        {invitations.map((inv) => {
          const attending = inv.attendance === 'ATTENDING';
          const unknown = inv.attendance === 'UNKNOWN';
          return (
            <Fragment key={inv.name}>
              <div className={css.foundInvite}>
                {unknown ? <HelpCircle /> : attending ? <Check /> : <X />}
                <span>
                  <strong>{inv.name}</strong>
                  {`${
                    unknown
                      ? ' has not responded'
                      : attending
                      ? ' is attending'
                      : ' is not attending'
                  }`}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className={css.rowItems}>
        <Link href="/">&lt; Return Home</Link>
        <Button onClick={onChange}>Change Response</Button>
      </div>
    </div>
  );
};
