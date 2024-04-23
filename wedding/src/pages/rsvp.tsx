import Head from "next/head";
import React from "react";
import { Text } from "../components/Text";
import { RSVPForm } from "../components/RSVPForm";
import css from "./rsvp.module.scss";

export default function Rsvp({}) {
  const rsvpEnabled = process.env.NEXT_PUBLIC_RSVP_DISABLED !== "1";

  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding RSVP</title>
        <meta
          name="description"
          content="RSVP here for Molly and John's wedding."
        />
      </Head>

      <div className={css.pageContainer}>
        {rsvpEnabled ? (
          <RSVPForm />
        ) : (
          <div className={css.comingSoon}>
            <Text variant="body1" tag="p">
              Thank you for making our day so special!
            </Text>
          </div>
        )}
      </div>
    </>
  );
}
