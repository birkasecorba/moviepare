import movies from './movies.json';

export async function get(req, res) {
  res.status(200).json(movies);
}
