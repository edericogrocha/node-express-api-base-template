import * as express from 'express';
import { default as config } from '../../../config/index';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import StartFactory from '../factory/start.factory';


export default class StartController {
    
    constructor() {}

    public getHome(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let data: any = {
            
        };
        
        // Evaluate input by calling input validation
    
        // Process data onto the factory using collections and models
        let returnedData = new StartFactory().produceHome();
        // Pass processed data through response Transformer
        
        // Return transformed response
        
    }

    public getStart(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let data: any = {
            
        };
        
        // Evaluate input by calling input validation
    
        // Process data onto the factory using collections and models
        
        // Pass processed data through response Transformer
    
        // Return transformed response
        
    }
    

}