import React, { FormEvent, useState } from 'react';
import { TextInput } from '../../components/TextInput';
import { Text } from '../../components/Text';
import css from './index.module.scss';
import { Button } from '../../components/Button';

interface LookupFormProps {
  search: string;
  onSubmit: (search: string) => void;
}

export const LookupForm = ({ search, onSubmit }: LookupFormProps) => {
  const [name, setName] = useState(search);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit} className={css.rsvpForm}>
      <div>
        <Text variant="body1" bold tag="h1">
          Find your invitation
        </Text>
        <Text variant="body3">
          <i>
            If you are responding for your guest or family, you will be able to
            RSVP for your entire group.
          </i>
        </Text>
      </div>
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
      <Button className={css.submitButton}>Search</Button>
    </form>
  );
};
