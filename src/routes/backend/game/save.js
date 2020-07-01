import { q, client } from '@api/faunadb';

export async function post(req, res) {
  const data = req.body;
  const saveRes = await client.query(
    q.Create(q.Ref(q.Collection('Games'), data.id),
      { data }),
  );

  res.status(200).json(saveRes);
}
