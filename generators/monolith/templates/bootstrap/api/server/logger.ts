import pino from 'pino';

const l = pino({
  name: process.env.APP_ID || 'application-id',
  level: process.env.LOG_LEVEL || 'debug',
  prettyPrint: { forceColor: true }
});

export default l;
