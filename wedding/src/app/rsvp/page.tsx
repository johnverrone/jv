import Head from 'next/head';
import React from 'react';
import { Text } from '@/components/Text';
import { RSVPForm } from '@/components/RSVPForm';
import css from './rsvp.module.scss';

export const metadata = {
  title: "Molly & John's Wedding RSVP",
  description: "RSVP here for Molly and John's wedding.",
};

export default function Rsvp() {
  const rsvpEnabled = process.env.NEXT_PUBLIC_RSVP_DISABLED !== '1';

  return (
    <div className={css.pageContainer}>
      {rsvpEnabled ? (
        <RSVPForm />
      ) : (
        <div className={css.comingSoon}>
          <Text variant="body1" tag="p">
            We look forward to hearing from you!
          </Text>
          <Text variant="body3" tag="p">
            This page will become active once invitiations have been sent out.
          </Text>
        </div>
      )}
    </div>
  );
}
