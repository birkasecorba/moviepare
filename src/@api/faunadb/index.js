import fauna from 'faunadb';

export const q = fauna.query;
export const client = new fauna.Client({ secret: process.env.FAUNA_SECRET });

export default { q, client };
