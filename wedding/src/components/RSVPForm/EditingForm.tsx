import React, { FormEvent, useState } from 'react';
import { Button } from '@components/Button';
import { TextInput } from '@components/TextInput';
import { Attendance, RSVP } from '@utils/types';
import css from '@styles/rsvp.module.css';

interface EditingForm {
  initialState: RSVP[];
  onSubmit: (rsvps: RSVP[]) => void;
}

export const EditingForm = ({ initialState, onSubmit }: EditingForm) => {
  const inital = initialState?.reduce<{ [key: string]: RSVP }>((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
  }, {});
  const [rsvps, setRsvps] = useState(inital);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(Object.values(rsvps));
  };

  return (
    <form className={css.rsvpForm} onSubmit={handleSubmit}>
      {rsvps &&
        Object.keys(rsvps).map((name) => {
          const attending = rsvps[name].attendance === 'attending';
          const handleChangeAttending = (
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setRsvps((prev) => ({
              ...prev,
              [name]: {
                ...prev[name],
                attendance:
                  e.target.value === 'attending'
                    ? 'attending'
                    : 'not-attending',
              },
            }));
          return (
            <div key={name}>
              <span>{name}</span>
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
                <label htmlFor={`${name}-attendance-yes`}>Yes</label>
                <input
                  type="radio"
                  name={`${name}-attendance`}
                  id={`${name}-attendance-no`}
                  value="not-attending"
                  checked={!attending}
                  onChange={handleChangeAttending}
                  required
                />
                <label htmlFor={`${name}-attendance-no`}>No</label>
              </div>
            </div>
          );
        })}
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
};
