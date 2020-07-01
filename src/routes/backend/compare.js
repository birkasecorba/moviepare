import * as tmdb from '@api/tmdb';

export async function post(req, res) {
  const { movieIds } = req.body;
  const promises = movieIds.map((id) => tmdb.get(`/movie/${id}`));
  const movies = await Promise.all(promises);
  const highVote = Math.max(...movies.map((m) => m.vote_average));
  const movie = movies.find((m) => m.vote_average === highVote);
  return res.status(200).json(movie);
}
