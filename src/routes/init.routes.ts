import * as express from 'express';
import { IServer } from '../server/interfaces/server.interface';


/**
 * @class Routes
 *  [init description] - this is the main router,
 *  this where you can can add new endpoints to the api,
 *  you can create new modules on ../modules/*, you need to create a new folder with controllers and routes,
 *  SEE the user example on ../modules/user
 */
export default class Routes {

    /**
     * @param  {IServer} server
     * @returns void
     */
    static init(server: IServer): void {
        const router: express.Router = express.Router();

        server.app.use('/', router);
        /**
            Loading modules routes from configuration
        **/
        
        //server.app.use('/start',new StartTemplateRouter().router);
        
    }
}
