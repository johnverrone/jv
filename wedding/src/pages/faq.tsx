import { Text } from '../components/Text';
import Head from 'next/head';
import React from 'react';
import css from './faq.module.scss';
import { FAQ } from '../components/FAQ';
import Link from 'next/link';

export default function Faq({}) {
  return (
    <>
      <Head>
        <title>Molly &amp; John&apos;s Wedding FAQ</title>
        <meta
          name="description"
          content="Frequently asked questions for Molly and John's wedding."
        />
      </Head>

      <section className={css.faqContainer}>
        <div className={css.header}>
          <Text variant="body3" tag="p">
            Please reach out to us directly if you have additional questions!
          </Text>
        </div>

        <FAQ question="Are kids invited?" answer="No." />
        <FAQ
          question="Can I bring a date?"
          answer="You will know if you can."
        />
        <FAQ
          question="What is the dress code?"
          answer="We don't care, be comfortable. But if we had to put a label on our vision, 'Cocktail attire' would best fit the bill."
        />
        <FAQ
          question="Is there transportation to the ceremony?"
          answer={
            <>
              Yes, see the{' '}
              <Link className="link" href="/travel">
                travel page
              </Link>{' '}
              for more details.
            </>
          }
        />
        <FAQ
          question="Will I be able to Uber around Evergreen?"
          answer="Unfortunately not. Ubers and Lyfts are rarely available in Evergreen. Please plan on renting a car, carpooling, or riding in the shuttles. Whatever transportation method you choose, please do not drink and drive."
        />
        <FAQ question="Will there be cake?" answer="No." />
      </section>
    </>
  );
}
