import { NextApiRequest, NextApiResponse } from 'next';
import { getInvite } from 'utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  const normalizedName = Array.isArray(name) ? name[0] : name ?? '';
  const invite = await getInvite(normalizedName);
  if (invite) {
    res.status(200).json(invite);
    return;
  }
  res.status(404).send('invite not found');
}
