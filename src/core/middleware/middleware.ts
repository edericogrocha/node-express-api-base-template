import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as sanitize from 'express-sanitizer';
import { IServer } from '../../server/interfaces/server.interface';

import { default as config } from '../../config/index';

import headersMiddleware from './header/header.middleware';
import CacheMiddleware from './cache/cache.middleware';
import Logger from './logger/logger.middleware';
import ApiMiddleware from './api/api.middleware';

const caller = 'Core Middleware';
const log = Logger(caller);

/**
 * [Middleware description] - this the common middleware
 * @class Middleware
 */
export default class Middleware {
    
    /**
     * [init description] - Start middleware and is called on ../../server/init.server.ts
     * @param server [description] - server
     */
    static init(server: IServer): void {
        
        server.app.use(bodyParser.urlencoded({ extended: false }));
        server.app.use(bodyParser.json());
        server.app.use(sanitize());
        server.app.use(cookieParser());
        server.app.use(compression());
        server.app.use(helmet());
        server.app.use(cors());

        // Api middleware
        log.info( (config.application.isApi?'The application is an API':'The application is NOT an API.'), config.application );

        if (config.application.isApi) {
            log.debug('Loading API Middleware!');
            server.app.use(ApiMiddleware.api);
        }
        // cors
        server.app.use(headersMiddleware.headers);
        server.app.use(CacheMiddleware.isOnCache);

        // Load middleware from configuration
        //console.log('Config:', config);
        
    }
}