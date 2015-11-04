var utils = {
    /**
     * 配置
     */
    config: {
        secret: '',
        debug: {
            filter: 'sms,print',
            error_handle: false
        },
        moment: {
            lang: 'zh-cn',
            date_pattern: 'YYYY-MM-DD',
            time_pattern: 'YYYY-MM-DD HH:mm'
        },
        sms: {
            platform: 'yunpian',
            app: '',
            key: ''
        },
        qiniu: {
            AccessKey: '',
            SecretKey: '',
            bucket: '',
            domain: ''
        },
        print: {
            ip: "115.28.225.82",
            host: "/FeieServer"
        },
        middleware: {
            templates_path: ''
        },
        pois: {
            place_host: 'http://api.map.baidu.com'
        }
    }
};

/**
 * 调试
 * @param type
 * @returns {*}
 */
var debugs = {};
var debugs_namespaces;
utils.debug = function (namespace) {
    if (!debugs_namespaces) {
        debugs_namespaces = {};
        var namespaces = utils.config.debug.filter.split(',');
        for (var i in namespaces) {
            debugs_namespaces[namespaces[i]] = true;
        }
    }

    if (!debugs[namespace]) {
        debugs[namespace] = {
            namespace: namespace,
            enable: debugs_namespaces[namespace],
            log: function (log) {
                if (!this.enable) return;
                console.log(this.namespace, log);
            },
            err: function (err) {
                var handle = utils.config.debug.error_handle;
                if (handle) {
                    handle(this.namespace, err);
                }
                console.error(this.namespace, err);
            }
        }
    }
    return debugs[namespace];
}

/**
 * 时间
 */
var moment;
utils.moment = function () {
    if (!moment) {
        moment = require('./lib/moment')(utils.config.moment);
    }
    return moment;
}

/**
 * 公共方法
 */
var common;
utils.common = function () {
    if (!common) {
        common = require('./lib/common')(utils.config);
    }
    return common;
};

/**
 * 发送消息
 */
var sms;
utils.sms = function () {
    if (!sms) {
        sms = require('./lib/sms')(utils.config.sms, utils);
    }
    return sms;
};

/**
 * 打印
 */
var print;
utils.print = function () {
    if (!print) {
        print = require('./lib/print')(utils.config.print, utils);
    }
    return print;
};

/**
 * 七牛
 */
var qiniu;
utils.qiniu = function () {
    if (!qiniu) {
        qiniu = require('./lib/qiniu')(utils.config.qiniu);
    }
    return qiniu;
}

/**
 * 中间件
 */
var middleware;
utils.middleware = function () {
    if (!middleware) {
        middleware = require('./lib/middleware')(utils.config.middleware, utils);
    }
    return middleware;
}

/**
 * 路由
 */
var route;
utils.route = function (app) {
    if (!route) {
        route = require('./lib/route')(utils);
    }
    return route(app);
}


/**
 * pois
 */
var pois;
utils.pois = function (app) {
    if (!pois) {
        pois = require('./lib/pois')(utils.config.pois, utils);
    }
    return pois;
}

/**
 * 字典
 */
utils.dicts = require('./lib/dicts');

/**
 * 设置
 */
utils.settings = require('./lib/settings');

/**
 * 坐标
 */
utils.coords = require('./lib/coords');

/**
 * 控制器工具类
 */
utils.controller = require('./lib/controller');

/**
 * handlebars 帮助类
 */
utils.hbs = require('./lib/hbs')(utils);

module.exports = utils;
