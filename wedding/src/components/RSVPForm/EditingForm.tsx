import React, { FormEvent, useState } from 'react';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import css from './index.module.scss';
import { Person } from '@prisma/client';

interface EditingForm {
  initialState: Person[];
  onSubmit: (rsvps: Person[]) => void;
}

export const EditingForm = ({ initialState, onSubmit }: EditingForm) => {
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
              },
            }));
          return (
            <div key={name} className={css.editRow}>
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
          );
        })}
      <Button type="submit" variant="primary" className={css.submitButton}>
        Submit
      </Button>
    </form>
  );
};
