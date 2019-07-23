import { Request, Response, NextFunction } from 'express';
import { Event } from "typescript.events";

import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';


/**


*/
export default class Api {
    private appKey: string;
    private appName: string;
    private apiKey: string;
    private reqIp: string;
    private reqDate: Date;
  
    constructor() {
        
    }
    
    public validate( req: Request, res: Response, next: NextFunction ) {
        if ( this.isDataOnRequest( req ) ) {
            
        } else {
            
        }

    }
    
    public isDataOnRequest( req: Request ) {
        
        return true;
    }
    
    private static logger(eventLog: string, key: string, value: any) {
        let eventLogger = new EventsEmitter(eventLog);
        eventLogger.$emit(eventLog, key, value);
    }
    
}