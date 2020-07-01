import * as tmdb from '@api/tmdb';
import _flatMap from 'lodash/flatMap';

export async function get(req, res) {
  const { genres } = await tmdb.get('/genre/movie/list');
  let filteredGenres = genres.filter((g) => g.id !== 99);

  const urls = filteredGenres.map((currentGenre) => {
    const otherGenres = filteredGenres
      .map((g) => g.id)
      .filter((id) => id !== currentGenre.id)
      .join();
    return `/discover/movie?page=1&sort_by=popularity.desc&with_genres=${currentGenre.id}&without_genres=${otherGenres}`;
  });
  const fetchPromises = urls.map((url) => tmdb.get(url));
  const fetchResults = await Promise.all(fetchPromises);
  const allMovies = _flatMap(fetchResults, (jsonResult) => jsonResult.results[0]);
  filteredGenres = filteredGenres.map((genre, index) => ({
    ...genre,
    poster_path: allMovies[index].poster_path,
    backdrop_path: allMovies[index].backdrop_path,
  }));

  // -------------
  return res.status(200).json({ genres: filteredGenres });
}
