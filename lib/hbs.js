module.exports = function (utils) {
    var dicts = utils.dicts, moment = utils.moment();

    return {
        /**
         * 字典
         */
        dict: function (type, name) {
            return dicts.value(type, name);
        },

        /**
         * 字典颜色
         */
        dict_color: function (type, name) {
            return dicts.data(type, name).color;
        },

        /**
         * 判断两个值是否相等
         */
        if_eq: function (a, b, options) {
            if (a == b)
                return options.fn(this);
            else
                return options.inverse(this);
        },

        /**
         * 是否包含
         */
        if_has: function (a, b, options) {
            if (b.indexOf(a) != -1)
                return options.fn(this);
            else
                return options.inverse(this);
        },

        /**
         * 格式化时间
         */
        format_time: moment.format_time,

        /**
         * 格式化日期
         */
        format_date: moment.format_date,

        /**
         * 格式化金额
         */
        format_price: function (price) {
            return price.toFixed(2);
        },

        /**
         * 序号
         */
        inc: function (value) {
            return parseInt(value) + 1;
        },

        /**
         * 格式化成 json 字符串
         */
        json: function (data) {
            return JSON.stringify(data);
        },

        /**
         * 乘
         */
        multiply: function (a, b) {
            return (a * b).toFixed(2);
        },

        /**
         * 减
         */
        minus: function (a, b) {
            return (a - b).toFixed(2);
        },

        /**
         * 或
         */
        or: function (a, b, c) {
            return a || b || c;
        },

        /**
         * 折扣
         */
        discount: function (market, price) {
            return ((market - (market - price)) / market * 10).toFixed(1);
        },

        /**
         * 比较
         */
        lesser: function (a, b, opts) {
            if (a < b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        },

        /**
         * 判断是否在数据中存在
         * 格式 user-brower||goods-brower
         */
        allow: function (allowString, permissions, options) {
            var allowlist = allowString.split('||');
            for (var i in allowlist) {
                allowlist[i] = allowlist[i].split('-');
            }
            for (var i in permissions) {
                var permission = permissions[i];
                for (var j in allowlist) {
                    var allowobj = allowlist[j];
                    if (permission.object_type == allowobj[0] && permission.action_type == allowobj[1])
                        return options.fn(this);
                }
            }
            return options.inverse(this);
        }
    }
}
