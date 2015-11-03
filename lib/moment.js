var moment = require('moment');

/**
 * 时间工具
 */
module.exports = function (config) {
    /**
     * 设置时间
     */
    moment.locale(config.lang || 'zh-cn');
    /**
     * 格式化日期
     */
    moment.format_date = function (date) {
        return moment(date).format(config.date_pattern || 'YYYY-MM-DD');
    }
    /**
     * 格式化时间
     */
    moment.format_time = function (date) {
        return moment(date).format(config.time_pattern || 'YYYY-MM-DD HH:mm');
    }

    return moment;
}