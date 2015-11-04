var settings;

/**
 * 设置
 * @type {{init: Function, value: Function}}
 */
module.exports = {
    init: function (map) {
        settings = map;
    },
    values: function () {
        return settings;
    },
    value: function (name) {
        return settings[name] || '';
    }
};