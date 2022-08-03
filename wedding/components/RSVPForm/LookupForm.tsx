import React, { FormEvent, useState } from 'react';
import { TextInput } from 'components/TextInput';
import css from 'styles/rsvp.module.css';

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
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};
