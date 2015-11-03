var Promise = require('bluebird'),
    request = require('request'),
    qs = require('querystring');

/**
 * 短信工具
 */
module.exports = function (config, utils) {
    var sms = {}, debug = utils.debug('sms');

    if (config.platform == 'juhe') { //聚合平台  https://www.juhe.cn/
        /**
         * 发送验证码
         */
        sms.send_code = function (tel, code) {
            var resolver = Promise.defer();
            request.get({
                url: 'http://v.juhe.cn/sms/send?' + qs.stringify({
                    mobile: tel,
                    tpl_id: config.tmpl,
                    tpl_value: '%23code%23%3D' + code,
                    key: config.key
                }),
                json: true
            }, function (error, response, result) {
                if (error) {
                    debug.err(error);
                    return resolver.resolve({success: false});
                } else {
                    debug.log(result);
                }
                resolver.resolve({success: (result.error_code == 0)});
            });
            return resolver.promise;
        }
    } else if (config.platform == 'yunpian') { //云片平台 http://www.yunpian.com/

        /**
         * 发送验证码
         */
        sms.send_code = function (tel, code) {
            var resolver = Promise.defer();
            request.post({
                url: 'http://yunpian.com/v1/sms/send.json',
                form: {
                    apikey: config.key,
                    mobile: tel,
                    text: '【' + config.app + '】您的验证码是' + code
                },
                json: true
            }, function (error, response, result) {
                if (error) {
                    debug.err(error);
                    return resolver.resolve({success: false});
                } else {
                    debug.log(result);
                }
                resolver.resolve({success: (result.code == 0)});
            });
            return resolver.promise;
        }

        /**
         * 语音验证码
         */
        sms.voice_code = function (tel, code) {
            var resolver = Promise.defer();
            request.post({
                url: 'http://voice.yunpian.com/v1/voice/send.json',
                form: {
                    apikey: config.key,
                    mobile: tel,
                    code: code
                },
                json: true
            }, function (error, response, result) {
                if (error) {
                    debug.err(error);
                    return resolver.resolve({success: false});
                } else {
                    debug.log(result);
                }
                resolver.resolve({success: (result.code == 0)});
            });
            return resolver.promise;
        }
    }

    return sms;
}