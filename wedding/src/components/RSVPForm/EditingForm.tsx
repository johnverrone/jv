import React, { FormEvent, useState } from 'react';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import css from './index.module.scss';
import { Attendance, Person } from '@prisma/client';
import { AcceptDecline, AttendanceProps } from './AcceptDecline';
import { motion } from 'framer-motion';

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

  const showFridayEvents = Object.values(rsvps).some(
    (rsvp) => rsvp.attendance === 'ATTENDING'
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(Object.values(rsvps));
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
            <Text variant="heading3">
              Friday Morning Golf &mdash; *optional*
            </Text>
            <div className={css.iconRow}>
              <i className="las la-dollar-sign la-lg" />
              <Text variant="body3">cost per player</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-calendar la-lg" />
              <Text variant="body3">Friday, August 25, 2022 at 8:00am</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-map-pin la-lg" />
              <Text variant="body3">Hiwan Golf Club</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-tshirt la-lg" />
              <Text variant="body3">Golf</Text>
            </div>
          </div>
          {Object.entries(rsvps).map(([name, rsvp]) => (
            <AcceptDecline
              key={name}
              name={name}
              property="golf"
              attendance={rsvp.golf}
              onChange={updateRsvp}
            />
          ))}
        </motion.div>
        <motion.div variants={item}>
          <div className={css.eventInfo}>
            <Text variant="heading3">Welcome Party</Text>
            <div className={css.iconRow}>
              <i className="las la-calendar la-lg" />
              <Text variant="body3">Friday, August 25, 2022 at 6:00pm</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-map-pin la-lg" />
              <Text variant="body3">Location TBD</Text>
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
              <i className="las la-map-pin la-lg" />
              <Text variant="body3">Hiwan Golf Club</Text>
            </div>
            <div className={css.iconRow}>
              <i className="las la-tshirt la-lg" />
              <Text variant="body3">Cocktail</Text>
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
