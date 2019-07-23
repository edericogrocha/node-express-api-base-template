import { default as config } from '../../../config/index';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import { NodeCacheModel } from './models/node-cache.model';
import * as NodeCache from 'node-cache';
import * as client from '../../connections/redis.connection';
import * as redis from 'express-redis-cache';
import { RedisCacheModel } from './models/redis-cache.model';

export class CacheConstructor {
  public cache;

  constructor(){
    this.cache = this.startCache();
  }

  /**
   * [startCache description] - start cache with environment settings
   * @return [description]
   */
  private startCache(){
    let cache: any = undefined;
    switch(config.cache.mode){
      case 'redis-cache':
        let newClient: redis = redis(config.cache.redis);
        client.startClient(newClient);
        cache = new RedisCacheModel(newClient);
        break;
      case 'node-cache':
      default:
        cache = new NodeCacheModel(new NodeCache(config.cache.nodeCache));
        break;
    };
    return cache;
  }

}

export default () => {
  return new CacheConstructor();
}
