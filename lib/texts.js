var map_data = {};

/**
 * 文本
 * @type {{init: Function, groups: Function, group: Function, value: Function}}
 */
module.exports = {
    init: function (rows) {
        map_data = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            map_data[row.type + '_' + row.name] = row;
        }
    },
    data: function (type, name) {
        return map_data[type + '_' + name] || '';
    }
};