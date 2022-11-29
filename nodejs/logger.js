const log = require("log4js");
log.configure({
        appenders: {console: {type: 'console'}},
        categories: {
            default: {
                appenders: ['console'],
                level: 'debug'
            },
            Access: {
                appenders: ['console'],
                level: 'debug'
            },
            GetAPI: {
                appenders: ['console'],
                level: 'debug'
            },
            PostAPI: {
                appenders: ['console'],
                level: 'debug'
            },
            Function: {
                appenders: ['console'],
                level: 'debug'
            },
            Error: {
                appenders: ['console'],
                level: 'error'
            }
        }
    }
);

module.exports.logger = log.getLogger('Access');
module.exports.GetApi = log.getLogger('GetAPI');
module.exports.PostApi = log.getLogger('PostAPI');
module.exports.Function = log.getLogger('Function');
module.exports.Error = log.getLogger('Error');

