import _flatMap from 'lodash/flatMap';
import _sampleSize from 'lodash/sampleSize';
import * as tmdb from '@api/tmdb';
import { generateId } from '@api/utils';

function uniqNumbers(max = 20, maxCount = 3) {
  return Array.from(new Set(Array(maxCount).fill(null).map(() => Math.ceil(Math.random() * max))));
}

export async function get(req, res) {
  // Get random set of movies with certain genre
  const { genreId } = req.params;
  const pages = uniqNumbers(30);
  const gameId = generateId();
  const urls = pages.map((page) => `/discover/movie?sort_by=popularity.desc&page=${page}&with_genres=${genreId}`);

  const fetchPromises = urls.map((url) => tmdb.get(url));
  const fetchResults = await Promise.all(fetchPromises);

  // Merge all results in one Array
  const allMovies = _flatMap(fetchResults, (jsonResult) => jsonResult.results);

  // Filter movies that only has poster urls
  const moviesWithImages = allMovies.filter((movie) => movie.poster_path && movie.backdrop_path);

  // Randomly pick subset of movies to send back.
  const selectedMovies = _sampleSize(moviesWithImages, 20);

  // Lite, remove unused/obscured points
  const liteMovies = selectedMovies.map((m) => ({
    id: m.id,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    title: m.title,
  }));

  const data = {
    id: gameId,
    movies: liteMovies,
  };

  return res.status(200).json(data);
}
