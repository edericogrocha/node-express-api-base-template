import * as mongoose from 'mongoose';
import { default as config } from '../../config/index';
import Logger from '../middleware/logger/logger.middleware';


interface connectOptions {
    autoReconnect: boolean;
    reconnectTries: number; // Never stop trying to reconnect
    reconnectInterval: number;
    loggerLevel?: string;
}
const connectOptions: connectOptions = {
    autoReconnect: config.database.settings.autoreconnect,
    reconnectTries: config.database.settings.reconnectTries,
    reconnectInterval: config.database.settings.reconnectInterval
};

const MONGO_URI: string = `https://${config.database.settings.host}:${config.database.settings.port}/${config.database.settings.db}`;
export const db: mongoose.Connection = mongoose.createConnection(MONGO_URI, connectOptions);

/**
 * [Logger description] - logger for MongoDB handlers
 */
const log = Logger('MongoDB');

/**
 * MongoDB handlers
 */
db.on('connecting', () => {
    log.info('connecting');
});

db.on('error', (error) => {
    log.error('connection', [error]);
    log.info('please check "../../config/environments/' + config.env + '.json" file.');
    mongoose.disconnect();
});

db.on('connected', () => {
    log.info('connected');
});

db.once('open', () => {
    log.info('connection opened');
});

db.on('reconnected', () => {
    log.info('reconnected');
});

db.on('reconnectFailed', () => {
    log.warn('reconnectFailed');
});

db.on('disconnected', () => {
    log.info('disconnected');
});

db.on('fullsetup', () => {
    log.info('reconnecting...');
});
