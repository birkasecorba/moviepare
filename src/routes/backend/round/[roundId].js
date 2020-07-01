import { q, client } from '@api/faunadb';

export async function get(req, res) {
  const { roundId } = req.params;
  const { data } = await client.query(
    q.Get(q.Ref(q.Collection('Rounds'), roundId)),
  );

  return res.status(200).json(data);
}
