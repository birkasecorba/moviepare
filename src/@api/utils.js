export async function fetchJson(url, options) {
  try {
    const fecthRes = await fetch(url, options);
    const jsonRes = await fecthRes.json();
    return jsonRes;
  } catch (error) {
    throw new Error('Error fetching:', url, error);
  }
}

export function postJson(url, data) {
  return fetchJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function generateId(l = 16) {
  return Math.round(Math.random() * (10 ** Math.max(l, 16)));
}
