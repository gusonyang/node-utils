var utils = require('../');

utils.config = {DEBUG: 'worker'};

utils.debug('worker').log({username: 'gusonyang'});
utils.debug('worker').err({username: 'gusonyang'});