import React, { FormEvent, useState } from 'react';
import { Button } from '@components/Button';
import { TextInput } from '@components/TextInput';
import { RSVP } from 'types/rsvp';
import css from '@styles/rsvp.module.css';

interface EditingForm {
  initialState?: RSVP;
  onSubmit: (rsvps: RSVP[]) => void;
}

export const EditingForm = ({ initialState, onSubmit }: EditingForm) => {
  const [name, setName] = useState(initialState?.name);
  const [email, setEmail] = useState(initialState?.email);
  const [attending, setAttending] = useState(
    initialState?.attendance === 'attending'
  );

  const handleChangeAttending = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttending(e.target.value === 'attending');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onSubmit([
        {
          name,
          email,
          attendance: attending ? 'attending' : 'not-attending',
        },
      ]);
    }
  };

  return (
    <form className={css.rsvpForm} onSubmit={handleSubmit}>
      <div className={css.formItem}>
        <label htmlFor="name">Name</label>
        <TextInput
          type="text"
          id="name"
          autoComplete="name"
          placeholder="Benjamin Evalent"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={css.formItem}>
        <label htmlFor="email">Email</label>
        <TextInput
          type="email"
          id="email"
          autoComplete="email"
          placeholder="benevalent@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={css.formItem}>
        <span>Attendance</span>
        <div>
          <input
            type="radio"
            name="attendance"
            id="attendance-yes"
            value="attending"
            checked={attending}
            onChange={handleChangeAttending}
            required
          />
          <label htmlFor="attendance-yes">Yes</label>
          <input
            type="radio"
            name="attendance"
            id="attendance-no"
            value="not-attending"
            checked={!attending}
            onChange={handleChangeAttending}
            required
          />
          <label htmlFor="attendance-no">No</label>
        </div>
      </div>
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
};
