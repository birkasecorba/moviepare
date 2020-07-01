import 'dotenv/config';
import sirv from 'sirv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import * as sapper from '@sapper/server';
import UAParser from 'ua-parser-js';

const {
  PORT, NODE_ENV,
} = process.env;
const dev = NODE_ENV === 'development';

const app = express();

app.use(
  cookieParser(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  compression({ threshold: 0 }),
  sirv('static', { dev }),
  sapper.middleware({
    session: (req) => {
      const parser = new UAParser();
      const ua = req.headers['user-agent'] || '';
      parser.setUA(ua);
      return {
        'user-agent': ua,
        deviceType: parser.getResult().device.type,
      };
    },
  }),
);

app.listen(PORT, (err) => {
  if (err) console.log('error', err);
});

// Required for vercel/now deploy
export default app;
