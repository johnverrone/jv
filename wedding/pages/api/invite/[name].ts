import { NextApiRequest, NextApiResponse } from 'next';
import { findInvites } from 'utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  const normalizedName = Array.isArray(name) ? name[0] : name ?? '';
  const invites = await findInvites(normalizedName);
  if (invites) {
    res.status(200).json(invites);
    return;
  }
  res.status(404).send('invite not found');
}
