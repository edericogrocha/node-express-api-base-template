import { default as config } from '../../../../config/index';
import * as redis from 'express-redis-cache';
import EventsEmitter from '../../../../core/middleware/events-emitter/events-emitter.middleware';

export class RedisCacheModel {
  private client: redis;

  constructor(client: redis){
    this.client = client;
  }

  /**
   * [get description] - get data from redis-cache
   * @param  key [description] - identifier
   * @return     [description]
   */
  public get(key: string){
    return new Promise((resolve, reject) => {
      return this.client.get(key, (error: any, value: any) => {
        if(error){
          reject(error);
        }else{
          resolve(this.validateCacheValue(value));
        }
      });
    });
  }

  /**
   * [set description] - save data on redis-cache
   * @param  key        [description] - cache data identifier
   * @param  val        [description] - value we want to save
   * @param  loggerName [description] - logger identifier
   * @return            [description]
   */
  public set(key: any, val, loggerName: string, deleteOnExpire: boolean = true){
    this.client.add(key, JSON.stringify(val), { expire: deleteOnExpire ? config.envConfig.cache.redis.expire : 0 }, (err: any, success: any) => {
      if(err){
        this.logger(loggerName, 'error', [err]);
      }else{
        this.logger(loggerName, 'info', ['Success new data on cache.']);
      }
    });
  }

  /**
   * [deleteData description] - remove date from cahce
   * @param  key        [description] - cache data identifier
   * @param  loggerName [description] - logger identifier
   * @return            [description]
   */
  public deleteData(key: any, loggerName: any){
    let eventsLogger: EventsEmitter = new EventsEmitter(loggerName);
    return new Promise((resolve, reject) => {
      this.client.del(key, (err: any, count: any) => {
        if(err){
          this.logger(loggerName, 'error', [err]);
          return reject(['Data not found']);
        }else{
          this.logger(loggerName, 'info', ['Deleted data on cache.', `Count: ${count}`]);
          return resolve(true);
        }
      });
    });
  }

  /**
   * [validateCacheValue description] - format and validate redis cache data
   * @param  value [description] - value we want format
   * @return       [description]
   */
  private validateCacheValue(value: any){
    if(Array.isArray(value)){
      if(value.length == 0){
        value = undefined;
      }else{
        value = JSON.parse(value[0].body);
      }
    }
    return value;
  }

  /**
   * [setSummary description] - save data on redis-cache for summary use
   * @param  key        [description] - cache data identifier
   * @param  val        [description] - value we want to save
   * @return            [description]
   */
  public setSummary(key: any, val){
    this.client.add(key, JSON.stringify(val), { expire: config.envConfig.cache.redis.summaryExp }, (err: any, success: any) => {
      if(err){
        this.logger('CacheSummary', 'error', [err]);
      }else{
        this.logger('CacheSummary', 'info', ['Success new summary data on cache.']);
      }
    });
  }

  /**
   * [logger description] ~ print messages on console
   * @param  loggerName [description]
   * @param  key        [description]
   * @param  value      [description]
   * @return            [description]
   */
  private logger(loggerName: string, key: string, value: any){
    let eventsLogger: EventsEmitter = new EventsEmitter(loggerName);
    eventsLogger.$emit(loggerName, key, value);
  }

}
