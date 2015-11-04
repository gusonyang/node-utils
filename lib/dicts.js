var groups = {}, map = {};

/**
 * 字典
 * @type {{init: Function, groups: Function, group: Function, value: Function}}
 */
module.exports = {
    init: function (rows) {
        groups = {}, map = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!groups[row.type]) groups[row.type] = [];
            groups[row.type].push({name: row.name, value: row.value, color: row.color});
            map[row.type + '_' + row.name] = row.value;
        }
    },
    groups: function () {
        return groups;
    },
    group: function (type) {
        return groups[type] || [];
    },
    value: function (type, name) {
        return map[type + '_' + name] || '';
    }
};