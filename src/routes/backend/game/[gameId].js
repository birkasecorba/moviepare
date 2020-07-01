import { q, client } from '@api/faunadb';

export async function get(req, res) {
  const { gameId } = req.params;
  const { data } = await client.query(
    q.Get(q.Ref(q.Collection('Games'), gameId)),
  );

  return res.status(200).json(data);
}
