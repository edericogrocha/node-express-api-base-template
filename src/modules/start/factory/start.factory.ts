import * as express from 'express';
import { default as config } from '../../../config/index';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import StartProcesses from './processes/start.processes';

export class StartFactory {
    
    constructor() {}
    
    public produceStart() {
        
    }
    
    public produceHome() {
        let processData = {
            data: {
                
            },
            errors: {
                
            }
        };
        
    }
    
}

export default StartFactory;