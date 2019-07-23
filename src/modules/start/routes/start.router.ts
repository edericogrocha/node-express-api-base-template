import { Router } from 'express';

import StartController from '../controllers/start.controller';

export default class StartRouter {
    public router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * [routes description] - define the router endpoints
     */
    public routes(): void {
        this.router.get( '/', new StartController().getStart );
        this.router.get( '/home', new StartController().getHome );
    }

}
