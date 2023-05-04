import { Attendance, Person } from '@prisma/client';
import React from 'react';
import { Text } from '../Text';
import css from './index.module.scss';

export type AttendanceProps = keyof {
  [Key in keyof Person as Person[Key] extends Attendance
    ? Key
    : never]: Person[Key];
};

interface AcceptDeclineProps {
  name: string;
  property: AttendanceProps;
  attendance: Attendance;
  onChange: (
    name: string,
    property: AttendanceProps,
    value: Attendance
  ) => void;
  yesNo?: boolean;
}

export const AcceptDecline = ({
  name,
  property,
  attendance,
  onChange,
  yesNo = false,
}: AcceptDeclineProps) => {
  const attending = attendance === 'ATTENDING';
  const notAttending = attendance === 'NOT_ATTENDING';

  const handleChangeAttending = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      name,
      property,
      e.target.value === 'attending' ? 'ATTENDING' : 'NOT_ATTENDING'
    );

    // say no to shuttle if they are not attending the wedding
    if (property === 'attendance' && e.target.value === 'not-attending') {
      onChange(name, 'shuttle', 'NOT_ATTENDING');
    }
  };

  return (
    <div>
      <div className={css.editRow}>
        <Text variant="body2" bold>
          {name}
        </Text>
        <div>
          <input
            type="radio"
            name={`${name}-${property}-attendance`}
            id={`${name}-${property}-attendance-yes`}
            value="attending"
            checked={attending}
            onChange={handleChangeAttending}
            required
          />
          <Text
            tag="label"
            variant="body2"
            htmlFor={`${name}-${property}-attendance-yes`}
          >
            {yesNo ? 'Yes' : 'Accepts'}
          </Text>
          <div style={{ display: 'inline-block', width: 8 }} />
          <input
            type="radio"
            name={`${name}-${property}-attendance`}
            id={`${name}-${property}-attendance-no`}
            value="not-attending"
            checked={notAttending}
            onChange={handleChangeAttending}
            required
          />
          <Text
            tag="label"
            variant="body2"
            htmlFor={`${name}-${property}-attendance-no`}
          >
            {yesNo ? 'No' : 'Declines'}
          </Text>
        </div>
      </div>
    </div>
  );
};
