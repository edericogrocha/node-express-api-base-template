import * as debug from 'debug';
import * as http from 'http';

import { default as config } from './config/index';

import Server from './server/init.server';
import * as serverHandlers from './server/handlers.server';
import Logger from './core/middleware/logger/logger.middleware';

debug('ts-express:server');

const log = Logger('Server');

const port: string | number | boolean = serverHandlers.normalizePort( config.port || 3000 );

Server.set('port', port);

log.info(`Server listening on port ${port}`);

const server: http.Server = http.createServer(Server);

// server listen
server.listen(port);

// server handlers
server.on(
    'error',
    (error) => serverHandlers.onError(error, port));

server.on(
    'listening',
    serverHandlers.onListening.bind(server));