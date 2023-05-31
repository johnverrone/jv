import React, { FormEvent, useState } from 'react';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { TextArea } from '../../components/TextArea';
import css from './index.module.scss';
import { Attendance, Person } from '@prisma/client';
import { AcceptDecline, AttendanceProps } from './AcceptDecline';
import { AnimatePresence, motion } from 'framer-motion';

const container = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const item = {
  hide: { opacity: 0 },
  show: { opacity: 1 },
};

type PersonByName = {
  [key: string]: Person;
};

const weddingAttendeesFilter = ([name, rsvp]: [string, Person]) =>
  rsvp.attendance === 'ATTENDING';

interface EditingForm {
  initialState: Person[];
  onSubmit: (rsvps: Person[]) => void;
  onCancel: () => void;
}

export const EditingForm = ({
  initialState,
  onSubmit,
  onCancel,
}: EditingForm) => {
  const inital = initialState?.reduce<PersonByName>((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
  }, {});
  const [rsvps, setRsvps] = useState(inital);
  const [notes, setNotes] = useState(initialState[0]?.notes ?? '');

  const showShuttleQuestion = Object.values(rsvps).some(
    (rsvp) => rsvp.attendance === 'ATTENDING'
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const rsvpsWithNotes = Object.values(rsvps).map((p) => ({ ...p, notes }));
    onSubmit(rsvpsWithNotes);
  };

  const updateRsvp = (
    name: string,
    property: AttendanceProps,
    attending: Attendance
  ) => {
    setRsvps((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [property]: attending,
      },
    }));
  };

  return (
    <>
      <motion.form
        variants={container}
        initial="hide"
        animate="show"
        exit="hide"
        className={css.rsvpForm}
        onSubmit={handleSubmit}
      >
        <motion.div variants={item}>
          <div className={css.eventInfo}>
            <Text variant="heading3">Welcome Party</Text>
            <div className={css.iconRow}>
              <i className="las la-calendar la-lg" />
              <Text variant="body3">Friday, August 25, 2022 at 7:00pm</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-map-marker la-lg" />
              <Text variant="body3">The Wild Game Evergreen</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-tshirt la-lg" />
              <Text variant="body3">Casual</Text>
            </div>
          </div>
          {Object.entries(rsvps).map(([name, rsvp]) => (
            <AcceptDecline
              key={name}
              name={name}
              property="welcome"
              attendance={rsvp.welcome}
              onChange={updateRsvp}
            />
          ))}
        </motion.div>
        <motion.div variants={item}>
          <div className={css.eventInfo}>
            <Text variant="heading3">Wedding Ceremony & Reception</Text>
            <div className={css.iconRow}>
              <i className="las la-calendar la-lg" />
              <Text variant="body3">Saturday, August 26, 2022 at 5:00pm</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-map-marker la-lg" />
              <Text variant="body3">Hiwan Golf Club</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-tshirt la-lg" />
              <Text variant="body3">Semi-formal</Text>
            </div>
          </div>
          {Object.entries(rsvps).map(([name, rsvp]) => (
            <AcceptDecline
              key={name}
              name={name}
              property="attendance"
              attendance={rsvp.attendance}
              onChange={updateRsvp}
            />
          ))}
        </motion.div>
        <AnimatePresence>
          {showShuttleQuestion && (
            <motion.div variants={item}>
              <div className={css.eventInfo}>
                <Text variant="heading3">Transportation</Text>
                <Text variant="body3">
                  There will be a shuttle running from the Comfort Suites Golden
                  West to the venue and back. Are the attending guests planning
                  on utilizing this shuttle?
                </Text>
              </div>
              {Object.entries(rsvps)
                .filter(weddingAttendeesFilter)
                .map(([name, rsvp]) => (
                  <AcceptDecline
                    key={name}
                    name={name}
                    property="shuttle"
                    attendance={rsvp.shuttle}
                    onChange={updateRsvp}
                    yesNo
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div variants={item}>
            <div className={css.eventInfo}>
              <Text variant="heading3">Dietary Restrictions</Text>
              <Text variant="body3">
                Please inform us of any dietary restrictions for anyone in your
                party so we can accomadate everyone accordingly.
              </Text>
            </div>
            <TextArea
              id="notes"
              placeholder=""
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </motion.div>
        </AnimatePresence>
        <div className={css.rowItems}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </motion.form>
    </>
  );
};
