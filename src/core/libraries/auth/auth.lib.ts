import { default as config } from '../../../config/index';
import axios from 'axios';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import { CacheLib } from '../../../core/libraries/cache/cache.lib';



export class AuthLib {
  public static axios: any = axios;

  constructor(){
    AuthLib.axios.defaults.timeout = 5 * 60 * 1000;
  }

  /**
   * [setAuthHeader description] - save and set default Authorization token for requests
   * @param  name [description] - token label
   * @param  val  [description] - token value
   * @return      [description] - void
   */
  public static setAuthHeader(name: string = '', val: any = ''){

    if(name != '' && val != '') {
      CacheLib.set(name, val, 'AuthLib - setAuthHeader');
    }

    CacheLib.get('token').then(token => {
      if(token != undefined){
        AuthLib.logger('AuthLib - setAuthHeader', 'info', ['Axios header is set.']);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }else{
        AuthLib.logger('AuthLib - setAuthHeader', 'error', ['Atention token is undefined.']);
      }
      AuthLib.axios = axios;
    }).catch(error => {
      AuthLib.logger('AuthLib - setAuthHeader', 'error', ['Atention token not found.', error]);
      AuthLib.axios = axios;
    });

  }

  /**
   * [setGUID description] - get USER GUID and save it
   * @param  val [description] - GUID
   * @return     [description] - void
   */
  public static setGUID(val: any){
    let name: string = 'x-stubhub-user-guid';

    if(val != ''){
      CacheLib.set(name, val, 'AuthLib - setGUID');
    }
  }

  /**
   * [setCookie description] - set required cookie to request headers and delete temporary Authorization,
   * NOTE - if run this method you need to run again setAuthHeader to set again Authorization token
   * @return [description]
   */
  public static setCookie(){
    if(AuthLib.axios.defaults){
      delete AuthLib.axios.defaults.headers.common.Authorization;
      AuthLib.axios.defaults.headers.Cookie = config.envConfig.stubhub.COOKIE;
      // AuthLib.axios.defaults.headers.agent = agent;
    }
  }

  /**
   * [getGUID description] - get stored GUID
   * @return [description]
   */
  public static getGUID(){

    CacheLib.get('x-stubhub-user-guid').then(guid => {
      AuthLib.logger('AuthLib - getGUID', 'info', ['Success getting stubhub guid']);
      return guid;
    }).catch(error => {
      AuthLib.logger('AuthLib - getGUID', 'error', ['Error getting stubhub guid', error]);
      return undefined;
    });
  }


  /**
   * [issetAuthHeader description] - check if auth token is set
   * @return [description] - true if set otherwise false
   */
  public static issetAuthHeader(){
    return AuthLib.axios ? ('undefined' !== typeof AuthLib.axios.defaults.headers.common['Authorization']) : false;
  }

  /**
   * [logger description] - print message on console
   * @param  eventLog [description]
   * @param  key      [description]
   * @param  value    [description]
   * @return          [description]
   */
  private static logger(eventLog: string, key: string, value: any){
    let eventLogger = new EventsEmitter(eventLog);
    eventLogger.$emit(eventLog, key, value);
  }
}
