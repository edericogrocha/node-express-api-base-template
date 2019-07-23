// default config

// Set the current environment or default to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config: any = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV,
};

// Load environment-specific settings
var localConfig: any = {};
var inputConfig: any = {};
var modules: any = {};

try {
    // The environment file might not exist
    localConfig = require('../../src/config/environments/' + config.env + '.json');
    inputConfig = require('./settings/inputvalidation.settings');

    var settingsPath = "";
    var moduleSettings: any = {};

    // Process modules configuration
    var mods = localConfig.modules || {};
    var moduleKeys = Object.keys(mods);    
    if (moduleKeys.length) {
        // There are modules
        var extraRoutes = new Array();
        var extraMiddleware = new Array();
        var extraCron = new Array();
        var extraInput = new Array();
        moduleKeys.forEach(function(key) {
            settingsPath = mods[key];
            moduleSettings = require('../../src' + settingsPath);
            // Set module middleware
            if ('middleware' in moduleSettings) {
                extraMiddleware.push('modules/' + key + '/' + moduleSettings.middleware);
            }
            localConfig['extraMiddleware'] = extraMiddleware;
            // Set module routes
            if ('routes' in moduleSettings) {
                extraRoutes.push('modules/' + key + '/' + moduleSettings.routes);
            }   
            localConfig['extraRoutes'] = extraRoutes;            
            // Set module cron
            if ('cron' in moduleSettings) {
                extraCron.push('modules/' + key + '/' + moduleSettings.cron);
            }  
            localConfig['extraCron'] = extraCron;            
            // TODO: This needs to change to immediately collect and add the input validations 
            // Set module input validations
            if ('inputval' in moduleSettings) {
                extraInput.push('modules/' + key + '/' + moduleSettings.inputval);
            }  
            localConfig['extraInput'] = extraInput;
            // Assign all to modules localconfig
            localConfig.modules[key] = moduleSettings;                        
        });        
    }
} catch (e) {
    console.error('Error on configuration: ', e);  
}

// merge the config files
// localConfig will override defaults
export default (< any > Object).assign({}, config, localConfig, inputConfig);
