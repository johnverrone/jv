import fs from 'fs';
import { RSVP } from 'types/rsvp';

const isRSVP = (obj: any): obj is RSVP => {
  return 'name' in obj && 'email' in obj && 'attendance' in obj;
};

export const getInvite = async (search: string): Promise<RSVP | undefined> => {
  const data = await fs.promises.readFile('./INVITES.json', 'utf-8');
  try {
    const invites: any[] = JSON.parse(data);
    console.log('invites', invites);
    return invites.find((invite) => {
      if (isRSVP(invite)) {
        return invite.name.toLowerCase() === search.toLowerCase();
      }
      return false;
    });
  } catch (err) {
    console.error('error parsing json', err);
  }
  return;
};
