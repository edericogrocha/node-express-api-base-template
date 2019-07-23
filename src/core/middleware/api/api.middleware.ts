import { Request, Response, NextFunction } from 'express';
import LoggerMiddleware from '../logger/logger.middleware';

const caller = 'Module API Middleware';

export class ApiMiddleware {
    
    public api( req: Request, res: Response, next: NextFunction ) {
        var logger = LoggerMiddleware(caller);
        logger.debug('running!');
        next();
    }

}

export default new ApiMiddleware();