import { CronJob } from 'cron';
import Logger from '../core/middleware/logger/logger.middleware';

const TEST_CRON_INTERVAL: string = '* 1 * * * *';
const log = Logger('Cron');

/**
 * @class Cron
 * [Cron description] - this is where you create new cron jobs
 */
export default class Cron {

    /**
     * [testCron description] - default example cron job
     */
    private static testCron(): void {
        new CronJob(TEST_CRON_INTERVAL, (): void => {
            log.info('Hello, I am Cron! Please see ./cron/cron.ts');
        },
            null,
            true);
    }

    /**
     * [init description] - start cron on ../server/init.server.ts
     */
    static init(): void {
        Cron.testCron();
    }
}
