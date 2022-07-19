import { NextApiRequest, NextApiResponse } from 'next';

export interface RSVP {
  name: string;
  email: string;
  attending: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body }: { body: RSVP } = req;
  const { name, attending } = body;

  res.status(200).json({ name, attending });
}
