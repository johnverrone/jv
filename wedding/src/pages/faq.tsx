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
            answer="Your invitation will explicitly state 'and guest' if we have planned for you to bring a guest."
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
                <Link className="link" href="/travel#transportation">
                  travel page
                </Link>{' '}
                for more details.
              </>
            }
          />
          <FAQ
            question="Will I be able to Uber around Evergreen?"
            answer="It's highly unlikely. Ubers and Lyfts are rarely available in Evergreen. Please plan on renting a car, carpooling, or utilizing the provided shuttles. Whatever transportation method you choose, please do not drink and drive."
          />
          <FAQ
            question="Will there be cake?"
            answer="You may be asking yourself 'Why is this question even on here?' We have opted to not have a cake at our reception and apparently a lot of y'all are flabergasted at this decision. There will be dessert, but we don't want anything taking away from the dance party and frankly, we don't care too much about sweets. Just wanted to set the expectation ahead of time that no cake will be present. 😂"
          />
        </ul>
      </section>
    </>
  );
}
