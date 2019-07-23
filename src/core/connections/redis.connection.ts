import * as redis from 'express-redis-cache';
import { default as config } from '../../config/index';
import Logger from '../middleware/logger/logger.middleware';

/**
 * [Logger description] - logger for Redis handlers
 */
const log = Logger('REDIS');
// let client: redis;


export let startClient = (client: redis) => {

  client.on('error', (error) => {
      log.error('Connection', [error]);
      log.warn('Please check "../../config/environments/' + config.env + '.json" file.');
  });

  client.on('connected', () => {
      log.info('connected');
  });

  client.once('message', (message) => {
      log.info(message);
  });

  client.on('deprecated', (deprecated) => {
      let data: any = {
        type: deprecated.type,
        name: deprecated.name,
        substitute: deprecated.substitute,
        file: deprecated.file,
        line: deprecated.line
      };
      log.warn(JSON.stringify(data));
  });

  client.on('disconnected', () => {
      log.info('disconnected');
  });

};
