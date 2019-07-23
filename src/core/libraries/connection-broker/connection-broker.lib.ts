import { default as config } from '../../../config/index';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';

export class ConnectionBrokerLib {
  private connections: any[] = Object.keys(config.envConfig.connectionBroker);
  private connectionName: string = '';
  private brokers: any = config.envConfig.connectionBroker;
  private isOk: boolean = false;
  private brokerCore: any = [];

  constructor(connection: string){
    this.connectionName = connection;
    this.isOk = this.connections.findIndex(conn => conn == connection) > -1;
    if(this.isOk)
      this.brokerCore = Object.keys(this.brokers[this.connectionName]);
  }

  /**
   * [connect description] - where we can get the http request
   * @param  method [description]
   * @param  data   [description]
   * @return        [description]
   */
  public connect(method: string, data: any){
    if(this.isOk){
      return new Promise((resolve, reject) => {
        let brokerCoreCounter: number = 0
        let brokersCounter: number = 0;


        let resultHandler = (result) => {
            if(brokersCounter < this.brokers[this.connectionName][this.brokerCore[brokerCoreCounter]].length-1){
                brokersCounter++;
                nextRequest();
            }else{
                brokersCounter = 0;
                if(brokerCoreCounter < this.brokerCore.length-1){
                    brokerCoreCounter++;
                    nextRequest();
                }else{
                    reject(result);
                }
            }
        };

        let nextRequest = () => {
          let mainService = this.call(
            this.connectionName,
            this.brokers[this.connectionName][this.brokerCore[brokerCoreCounter]][brokersCounter].name,
            this.brokerCore[brokerCoreCounter]
          );
          mainService[method](data).then(result => {
            // if(process.env.NODE_ENV == 'development') this.logger('info', 'Result: ' + JSON.stringify(result));
            if(result.status && process.env.NODE_ENV == 'development'){
              reject(result);
            }else{
              resolve(result);
            }
          }).catch(error => {
            process.env.NODE_ENV == 'development' ? resultHandler(error) : reject(error);
          });
        };

        nextRequest();
      });

    }else{
      return Promise.reject({
        response: {
          status: 404,
          data: 'Unknown connection.'
        }
      });
    }
  }

  /**
   * [call description] - function to emulate all services called by the controllers
   * @param  serviceName [description] - required class name
   * @param  method      [description] - name of the method we need to call (inside that class)
   * @param  data        [description] - data we need to pass, function param
   * @param  serviceMode [description] - type of service mock OR service
   */
  private call(serviceName: string, fileName: string, serviceMode: string){
    let sName: string = serviceName.toLowerCase();
    let singularServiceName: string = serviceMode.slice(0, -1);
    this.logger('info', 'Running '+ serviceMode);

    let service: any = require(`../../../modules/${sName}/main/${serviceMode}/${fileName}.${singularServiceName}`);
    return service.default;
  }

  private logger(key: string, value: any){
    let eventLogger = new EventsEmitter('ConnectionBroker');
    eventLogger.$emit('ConnectionBroker', key, value);
  }

}