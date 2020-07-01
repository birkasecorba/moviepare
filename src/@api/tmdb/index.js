import fetch from 'node-fetch';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function get(path = '') {
  try {
    const safePath = path.startsWith('/') ? path : `/${path}`;
    const fetchRes = await fetch(`${TMDB_BASE_URL}${safePath}`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_V4_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const jsonRes = await fetchRes.json();
    return jsonRes;
  } catch (error) {
    throw new Error(error);
  }
}
