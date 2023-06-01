import { Text } from '@/components/Text';
import { FAQ, IFAQ } from '@/components/FAQ';
import Head from 'next/head';
import React from 'react';
import css from './faq.module.scss';

const FAQs: IFAQ[] = [
  {
    question: 'Are kids welcome?',
    answer:
      'We have opted to make this a kid-free event. We ask that you make arrangements for your children for the welcome party, ceremony, and reception.',
  },
  {
    question: 'Can I bring a date?',
    answer: (
      <>
        Your invitation will explicitly state &quot;<b>and guest</b>
        &quot; if we have planned for you to bring a guest.
      </>
    ),
  },
  {
    question: 'What is the dress code?',
    answer: (
      <>
        Our dress code is <b>semi-formal</b> but we want you to be comfortable.
        Make sure it&apos;s good for dancing and know we always welcome
        over-dressed.
      </>
    ),
  },
  {
    question: 'Will transportation be provided to the ceremony?',
    answer: (
      <>
        We will provide shuttles to the venue from the hotels (and back). If you
        plan to utilize the shuttles and are not staying at the hotels, please
        make sure you let us know in your RSVP!
      </>
    ),
  },
  {
    question: 'Will I be able to Uber around Evergreen?',
    answer:
      "It's highly unlikely. Ubers and Lyfts are rarely available in Evergreen. Please plan on renting a car, carpooling, or utilizing the provided shuttles. Whatever transportation method you choose, please do not drink and drive.",
  },
  {
    question: 'Will there be cake?',
    answer:
      "You may be asking yourself 'Why is this question even on here?' We have opted to not have a cake at our reception and apparently a lot of y'all are flabergasted at this decision. There will be dessert, but we don't want anything taking away from the dance party and frankly, we don't care too much about sweets. Just wanted to set the expectation ahead of time that no cake will be present. 😂",
  },
];

export const metadata = {
  title: "Molly & John's Wedding FAQ",
  description: "Frequently asked questions for Molly and John's wedding.",
};

export default function Faq() {
  return (
    <section className={css.faqContainer}>
      <div className={css.header}>
        <Text variant="body3" tag="p">
          Please reach out to us directly if you have additional questions!
        </Text>
      </div>

      <ul className={css.faqList}>
        {FAQs.map(({ question, answer }) => (
          <FAQ key={question} question={question} answer={answer} />
        ))}
      </ul>
    </section>
  );
}
