import { default as config } from '../../../config/index';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import CacheConstructor from './cache.constructor';

export class CacheLib {
  public static cache = CacheConstructor().cache;

  public static get(key){
    return CacheLib.cache.get(key);
  }

  /**
   * [setData description]
   * @param  key        [description] - word that identify stored data
   * @param  val        [description] - value we want to store
   * @param  ttl        [description] - the standard ttl as number in seconds for every generated cache element, more info: https://www.npmjs.com/package/node-cache
   * @param  loggerName [description] - logger identifier
   * @return            [description] - void
   */
  public static set(key: any, val, loggerName: string, deleteOnExpire: boolean = true){
    CacheLib.cache.set(key, val, loggerName, deleteOnExpire);
  }

  /**
   * [deleteData description] - function to delete data from cache
   * @param  key        [description] - key of data we want to delete from cache
   * @param  loggerName [description] - name for logger
   * @return            [description] - Promise
   */
  public static deleteData(key: any, loggerName: any){
    return CacheLib.cache.deleteData(key, loggerName);
  }
  
  /**
   * [setSummary description]
   * @param  key        [description] - word that identify stored data
   * @param  val        [description] - value we want to store
   * @return            [description] - void
   */
  public static setSummary(key: any, val){
    CacheLib.cache.setSummary(key, val);
  }

}