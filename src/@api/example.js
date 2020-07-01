// https://github.com/sveltejs/realworld/blob/master/src/node_modules/api.js
const base = 'https://conduit.productionready.io/api';

function send({ method, path, data, token }) {
  const fetch = process.browser ? window.fetch : require('node-fetch').default;

  const opts = { method, headers: {} };

  if (data) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }

  if (token) {
    opts.headers['Authorization'] = `Token ${token}`;
  }

  return fetch(`${base}/${path}`, opts)
    .then(r => r.text())
    .then(json => {
      try {
        return JSON.parse(json);
      } catch (err) {
        return json;
      }
    });
}

export function get(path, token) {
  return send({ method: 'GET', path, token });
}

export function del(path, token) {
  return send({ method: 'DELETE', path, token });
}

export function post(path, data, token) {
  return send({ method: 'POST', path, data, token });
}

export function put(path, data, token) {
  return send({ method: 'PUT', path, data, token });
}
