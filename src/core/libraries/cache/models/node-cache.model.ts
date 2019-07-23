import { default as config } from '../../../../config/index';
import * as NodeCache from 'node-cache';
import EventsEmitter from '../../../../core/middleware/events-emitter/events-emitter.middleware';

export class NodeCacheModel {
  private cache: NodeCache;

  constructor(cache: NodeCache){
    this.cache = cache;
  }

  /**
   * [get description] - get data from node-cache
   * @param  key [description] - identifier
   * @return     [description]
   */
  public get(key: string){
    return new Promise((resolve, reject) => {
      return this.cache.get(key, (error: any, value: any) => {
        if(error){
          reject(error);
        }else{
          resolve(value);
        }
      });
    });
  }

  /**
   * [set description] - save data on node-cache
   * @param  key        [description] - cache data identifier
   * @param  val        [description] - value we want to save
   * @param  loggerName [description] - logger identifier
   * @return            [description]
   */
  public set(key: any, val, loggerName: string, deleteOnExpire: boolean = true){
    this.cache.set(key, val, deleteOnExpire ? config.cache.settings.stdTTL : 0, (err: any, success: any) => {
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
    return new Promise((resolve, reject) => {
      this.cache.del(key, (err: any, count: any) => {
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
   * [setSummary description] - save data on node-cache for summary use
   * @param  key        [description] - cache data identifier
   * @param  val        [description] - value we want to save
   * @return            [description]
   */
  public setSummary(key: any, val){
    this.cache.set(key, val, config.cache.settings.summaryExp, (err: any, success: any) => {
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
