var Promise = require('bluebird'),
    request = require('request');

/**
 * 抓取工具
 */
module.exports = function (config, utils) {
    var debug = utils.debug('fetch');

    return {
        images: function (body) {
            return new Promise(function (resolve, reject) {
                request.post({
                    url: config.images,
                    form: body,
                    json: true
                }, function (error, response, result) {
                    if (error) {
                        debug.err(error);
                        return resolve({success: false});
                    } else {
                        debug.log(result);
                    }
                    resolve(result);
                });
            });
        }
    };
}