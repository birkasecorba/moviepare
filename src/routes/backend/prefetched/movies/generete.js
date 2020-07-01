import _flatMap from 'lodash/flatMap';
import * as tmdb from '@api/tmdb';

function uniqNumbers(max = 20, maxCount = 3) {
  return Array.from(new Set(Array(maxCount).fill(null).map(() => Math.ceil(Math.random() * max))));
}

export async function get(req, res) {
  const pages = uniqNumbers(100, 10);
  const urls = pages.map((page) => `/discover/movie?sort_by=popularity.desc&page=${page}`);

  const fetchPromises = urls.map((url) => tmdb.get(url));
  const fetchResults = await Promise.all(fetchPromises);

  // Merge all results in one Array
  const allMovies = _flatMap(fetchResults, (jsonResult) => jsonResult.results);

  // Filter movies that only has poster urls
  const moviesWithImages = allMovies.filter((movie) => movie.poster_path && movie.backdrop_path);

  // Lite, remove unused/obscured points
  const liteMovies = moviesWithImages.map((m) => ({
    poster_path: m.poster_path,
  }));

  const data = {
    movies: liteMovies,
  };

  return res.status(200).json(data);
}
