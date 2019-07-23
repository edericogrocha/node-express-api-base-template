import { Request, Response, NextFunction } from 'express';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import { CacheLib } from '../../../core/libraries/cache/cache.lib';
import { JwtLib } from '../../../core/libraries/jwt/jwt.lib';

export class CacheMiddleware {
    private jwt: JwtLib;
    private static events: EventsEmitter = new EventsEmitter('Cache - isOnCache');

    constructor(){
        this.jwt = new JwtLib();
    }

    /**
    * [isOnCache description] - this is a middleware function to check if request is on cache,
    *                           this is fired before all,
    *                           if request data is on cache will return these data
    * @param  req  [description] - tipical request param
    * @param  res  [description] - tipical response param
    * @param  next [description] - tipical next function next
    */
    public isOnCache(req: Request, res: Response, next: NextFunction){
        CacheMiddleware.on('info', [req.url]);

        if(req.url != '/ea/login'){
            CacheLib.get(req.url).then(value => {
                if(value != undefined){
                    CacheMiddleware.on('info', ['Request is on cache.']);
                    res.status(200).json(value);
                }else{
                    CacheMiddleware.on('warn', ['Request is not on cache.']);
                    next();
                }
            }).catch(error => {
                CacheMiddleware.on('error', [error]);
                next();
            });
        } else {
            next();
        }
    }

    private static on(key: string, value: any){
        CacheMiddleware.events.$emit('Cache - isOnCache', key, value);
    }

}

export default new CacheMiddleware();