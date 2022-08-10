import { promises as fs } from 'fs';
import { Attendance, RSVP } from './types';

const isRSVP = (obj: any): obj is RSVP => {
  return 'name' in obj && 'email' in obj && 'attendance' in obj;
};

const inviteMatch = (invite: RSVP, searchProp: string): boolean => {
  // normalize
  const name = invite.name.trim().toLowerCase();
  const search = searchProp.trim().toLowerCase();
  const host = invite.host?.trim().toLowerCase();

  return isRSVP(invite) && (name == search || host == search);
};

export const findInvites = async (
  search: string
): Promise<RSVP[] | undefined> => {
  const data = await fs.readFile('./INVITES.json', 'utf-8');
  try {
    const allInvites: any[] = JSON.parse(data);
    const invites: RSVP[] = [];
    allInvites.forEach((invite) => {
      if (inviteMatch(invite, search)) invites.push(invite);
    });
    return invites.length ? invites : undefined;
  } catch (err) {
    console.error('error parsing json', err);
  }
  return;
};

export const updateInvite = async (
  name: string,
  attendance: Attendance
): Promise<boolean> => {
  setValue('./INVITES.json', name, attendance);
  return false;
};

const setValue = (fileName: string, name: string, value: Attendance) =>
  fs
    .readFile(fileName, 'utf-8')
    .then((body) => JSON.parse(body))
    .then((json) => {
      const inv = Array.isArray(json)
        ? json.find((obj) => obj.name === name)
        : null;
      if (inv) {
        inv.attendance = value;
      }
      return json;
    })
    .then((json) => JSON.stringify(json, null, 2))
    .then((body) => fs.writeFile(fileName, body))
    .catch((error) => console.error(error));
