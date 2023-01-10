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

        <ul className={css.faqList}>
          <FAQ
            question="Are kids welcome?"
            answer="We have opted to make this a kid-free event. We ask that you make arrangements for your children for both the ceremony and reception."
          />
          <FAQ
            question="Can I bring a date?"
            answer={
              <>
                Your invitation will explicitly state &quot;<b>and guest</b>
                &quot; if we have planned for you to bring a guest.
              </>
            }
          />
          <FAQ
            question="What is the dress code?"
            answer={
              <>
                Our dress code is <b>cocktail attire</b> but we want you to be
                comfortable. Make sure it&apos;s good for dancing and know we
                always welcome over-dressed.
              </>
            }
          />
          <FAQ
            question="Will transportation be provided to the ceremony?"
            answer={
              <>
                We will provide shuttles that will run from the hotels to Hiwan
                before the ceremony, from Hiwan to downtown Evergreen after the
                reception, and from downtown Evergreen to hotels throughout the
                night. We can not accomidate shuttles stopping at every place
                where guests may be staying so if you plan to utilize the
                shuttles and are not staying at the hotels, please let us know
                so we can get an accurate head count!
              </>
            }
          />
          <FAQ
            question="Will I be able to Uber around Evergreen?"
            answer="It's highly unlikely. Ubers and Lyfts are rarely available in Evergreen. Please plan on renting a car, carpooling, or utilizing the provided shuttles. Whatever transportation method you choose, please do not drink and drive."
          />
          <FAQ
            question="Will there be cake?"
            answer="You may be asking yourself Why is this question even on here?' We have opted to not have a cake at our reception and apparently a lot of y'all are flabergasted at this decision. There will be dessert, but we don't want anything taking away from the dance party and frankly, we don't care too much about sweets. Just wanted to set the expectation ahead of time that no cake will be present. 😂"
          />
        </ul>
      </section>
    </>
  );
}
