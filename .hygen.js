const moment = require('moment');

module.exports = {
    templates: `${__dirname}/templates`,
    helpers:{
        timestamp: () => moment().format(`YYYYMMDDHHmmss`)
    }
}