var Promise = require('bluebird'),
    http = require('http'),
    qs = require('querystring');

/**
 * 打印
 */
module.exports = function (config, utils) {
    var debug = utils.debug('print');

    return {
        /**
         * 云打印
         */
        yun_print: function (printer, content) {
            return new Promise(function (resolve) {
                var options = {
                    port: 80,
                    hostname: config.ip,
                    path: config.host + '/printOrderAction',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                var req = http.request(options, function (res) {
                    res.setEncoding('utf-8');
                    res.on('data', function (response) {
                        var result = JSON.parse(response);
                        if (result && result.responseCode == 0) {
                            return resolve({success: true});
                        } else {
                            debug.log(result);
                            return resolve({success: false});
                        }
                    });
                });
                req.on('error', function (error) {
                    debug.err(error);
                    return resolve({success: false});
                });

                var content = qs.stringify({
                    sn: printer.printer_sn, //打印机编号
                    key: printer.printer_key, //key
                    printContent: content, //打印内容
                    times: printer.print_count || '1'//打印联数，默认为1
                });
                req.write(content);
                req.end();
            });
        }
    };
}