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
            return new Promise(function (resolve) {
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
                        return resolve({success: false});
                    } else {
                        debug.log(result);
                    }
                    return resolve({success: (result.error_code == 0)});
                });
            });
        }
    } else if (config.platform == 'yunpian') { //云片平台 http://www.yunpian.com/

        /**
         * 发送验证码
         */
        sms.send_code = function (tel, code) {
            return new Promise(function (resolve) {
                request.post({
                    url: 'http://yunpian.com/v1/sms/send.json',
                    form: {
                        mobile: tel,
                        text: '【' + config.app + '】您的验证码是' + code,
                        apikey: config.key
                    },
                    json: true
                }, function (error, response, result) {
                    if (error) {
                        debug.err(error);
                        return resolve({success: false});
                    } else {
                        debug.log(result);
                    }
                    return resolve({success: (result.code == 0)});
                });
            });
        }

        /**
         * 语音验证码
         */
        sms.voice_code = function (tel, code) {
            return new Promise(function (resolve) {
                request.post({
                    url: 'http://voice.yunpian.com/v1/voice/send.json',
                    form: {
                        mobile: tel,
                        code: code,
                        apikey: config.key
                    },
                    json: true
                }, function (error, response, result) {
                    if (error) {
                        debug.err(error);
                        return resolve({success: false});
                    } else {
                        debug.log(result);
                    }
                    return resolve({success: (result.code == 0)});
                });
            });
        }
    }

    return sms;
}