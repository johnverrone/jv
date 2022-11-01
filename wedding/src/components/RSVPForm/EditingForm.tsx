import React, { FormEvent, useState } from 'react';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import css from './index.module.scss';
import { Person } from '@prisma/client';

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
  const inital = initialState?.reduce<{ [key: string]: Person }>(
    (acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    },
    {}
  );
  const [rsvps, setRsvps] = useState(inital);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(Object.values(rsvps));
  };

  return (
    <form className={css.rsvpForm} onSubmit={handleSubmit}>
      {rsvps &&
        Object.keys(rsvps).map((name) => {
          const attending = rsvps[name].attendance === 'ATTENDING';
          const notAttending = rsvps[name].attendance === 'NOT_ATTENDING';
          const playingGolf = rsvps[name].golf === 'ATTENDING';

          const handleChangeAttending = (
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setRsvps((prev) => ({
              ...prev,
              [name]: {
                ...prev[name],
                attendance:
                  e.target.value === 'attending'
                    ? 'ATTENDING'
                    : 'NOT_ATTENDING',
                golf: 'NOT_ATTENDING',
              },
            }));

          const handleGolfAttending = (
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setRsvps((prev) => ({
              ...prev,
              [name]: {
                ...prev[name],
                golf:
                  prev[name].golf === 'ATTENDING'
                    ? 'NOT_ATTENDING'
                    : 'ATTENDING',
              },
            }));

          return (
            <div key={name}>
              <div className={css.editRow}>
                <Text variant="body1">{name}</Text>
                <div>
                  <input
                    type="radio"
                    name={`${name}-attendance`}
                    id={`${name}-attendance-yes`}
                    value="attending"
                    checked={attending}
                    onChange={handleChangeAttending}
                    required
                  />
                  <Text
                    tag="label"
                    variant="body2"
                    htmlFor={`${name}-attendance-yes`}
                  >
                    Accept
                  </Text>
                  <div style={{ display: 'inline-block', width: 8 }} />
                  <input
                    type="radio"
                    name={`${name}-attendance`}
                    id={`${name}-attendance-no`}
                    value="not-attending"
                    checked={notAttending}
                    onChange={handleChangeAttending}
                    required
                  />
                  <Text
                    tag="label"
                    variant="body2"
                    htmlFor={`${name}-attendance-no`}
                  >
                    Decline
                  </Text>
                </div>
              </div>
              {attending && (
                <div className={css.golfContainer}>
                  <Text variant="body3">
                    Will you be joining us for a round of golf at Hiwan Golf
                    Club on Friday morning for $100?
                    <br />
                    (more info on the <strong>Wedding Weekend</strong> page)
                  </Text>
                  <input
                    type="checkbox"
                    checked={playingGolf}
                    onChange={handleGolfAttending}
                  />
                </div>
              )}
            </div>
          );
        })}
      <div className={css.rowItems}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </form>
  );
};
