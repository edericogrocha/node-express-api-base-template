import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, prettyPrint } = format;
import * as path from 'path';
import * as colors from 'colors';
import { default as config } from '../../../config/index';


const Color = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
}


class LoggerMiddleware {
  private name: string;
  private logger;

  /**
   * @param name [description] - reference to the class that write the log
   */
  constructor(name: string) {
    this.name = name;
    this.logger = createLogger(
        { 
            level: config.logger.level,
            exitOnError: false,
            format: combine(
                format.splat(),
                format.simple(),
                format.label({ 
                    label: this.paintMe(
                        process.mainModule.filename, 
                        { 
                            foreground: 'cyan',
                            background: 'black',
                            effect: 'underscore'
                        }
                    )
                }),
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.printf(info => `${info.level} at ${info.timestamp} from ${info.label} :: ${info.message}`)
            ),                             

            transports: [ new transports.Console()]
        }
    );
    //winston.cli.apply();
  }
    
    /**
    * [debug, info, warn, error description] - log
    * @param  format    [description] - description of the log
    * @param  ...params [description] - any additional values that you can need to pass
    */
    debug(format: string, ...params: any[]) {
        this.formatLog( 'debug', format, params );   
    }

    info(format: string, ...params: any[]) {
        this.formatLog( 'info', format, params );  
    }

    warn(format: string, ...params: any[]) {
        this.formatLog( 'warn', format, params );
    }

    error(format: string, ...params: any[]) {
        this.formatLog( 'error', format, params );
    }
    
    private formatLog( lvl: string, str: string, add: any[] ) {
        var msg = this.name + " > " + str,options;
        if ( 
            (typeof add === 'object' && Object.keys(add).length) || 
            (Array.isArray(add) && add.length) ) {
            this.logger.log( 
                lvl, 
                msg + "\n" + this.paintMe(
                                JSON.stringify(add, null, 4),
                                {
                                    foreground: 'yellow',
                                    background: 'black',
                                    effect: 'dim'                                    
                                }
                    )
            );
        } else {
            this.logger.log( lvl, msg );

        }
        
    }
    
    
    /**
    *
    *
    * options - { foreground, background, effect }, where the defaults are:
    *   foreground - white
    ª   background - black
    *   effect - none
    */
    private paintMe( str: string, options: any ) {
        var result = "";
        if (typeof options === 'object' && Object.keys(options).length) {
            switch(options.foreground) {
                case 'black':   result = Color.FgBlack; break;
                case 'red':     result = Color.FgRed; break;
                case 'green':   result = Color.FgGreen; break;
                case 'yellow':  result = Color.FgYellow; break;
                case 'blue':    result = Color.FgBlue; break;
                case 'magenta': result = Color.FgMagenta; break;
                case 'cyan':    result = Color.FgCyan; break;                
                case 'white':   result = Color.FgWhite; break;     
                default:        result = Color.FgWhite; break;
            }
            switch(options.background) {
                case 'black':   result += Color.BgBlack; break;
                case 'red':     result += Color.BgRed; break;
                case 'green':   result += Color.BgGreen; break;
                case 'yellow':  result += Color.FgYellow; break;
                case 'blue':    result += Color.FgBlue; break;
                case 'magenta': result += Color.FgMagenta; break;
                case 'cyan':    result += Color.FgCyan; break;                
                case 'white':   result += Color.FgWhite; break;     
                default:        result += Color.BgBlack; break;
            }
            switch(options.effect) {
                case 'bright':    result += Color.Bright; break;
                case 'dim':       result += Color.Dim; break;
                case 'underscore':result += Color.Underscore; break;
                case 'blink':     result += Color.Blink; break;
                case 'reverse':   result += Color.Reverse; break;
                case 'hidden':    result += Color.Hidden; break;   
                default: break;
            }            
            result += str + Color.Reset;
        } else {
            result = Color.FgWhite + Color.BgBlack + str + Color.Reset;
        }
        return result;
    }
    
       
}

export default (name: string) => {
  return new LoggerMiddleware(name);
}
