import fs from 'fs';
import { RSVP } from './types';

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
  const data = await fs.promises.readFile('./INVITES.json', 'utf-8');
  try {
    const allInvites: any[] = JSON.parse(data);
    const invites: RSVP[] = [];
    console.log('allInvites', allInvites);
    allInvites.forEach((invite) => {
      if (inviteMatch(invite, search)) invites.push(invite);
    });
    return invites.length ? invites : undefined;
  } catch (err) {
    console.error('error parsing json', err);
  }
  return;
};

export const updateInvite = (rsvp: RSVP): boolean => {
  // write to file
  return false;
};
