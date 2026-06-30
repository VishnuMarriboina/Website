'use strict';

import logger from '../logger';

interface RequestLike {
  method:      string;
  originalUrl: string;
  ip?:         string;
}

interface ResponseLike {
  statusCode: number;
  on(event: string, listener: () => void): void;
}

const requestLogger = (req: RequestLike, res: ResponseLike, next: () => void): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms — ${req.ip ?? ''}`;

    if      (res.statusCode >= 500) logger.error(log);
    else if (res.statusCode >= 400) logger.warn(log);
    else                            logger.http(log);
  });

  next();
};

export default requestLogger;
