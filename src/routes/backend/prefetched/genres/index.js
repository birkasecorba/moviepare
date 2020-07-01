import genres from './genres.json';

export async function get(req, res) {
  res.status(200).json(genres);
}
