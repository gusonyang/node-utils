module.exports = function (config, utils) {
    return {

        /**
         * 字典jQuery扩展
         * /scripts/jquery.dicts.js?k=appoint_status,appoint_time
         */
        dicts: function (req, res) {
            var dicts = {};
            var k = req.query.k;
            if (k) {
                var keys = k.split(',');
                for (var i in keys) {
                    var key = keys[i];
                    dicts[key] = utils.dicts.group(key);
                }
            } else {
                dicts = utils.dicts.groups();
            }
            res.type('text/javascript').send("$.dicts_list=" + JSON.stringify(dicts) + ";" +
                "$.dicts_map={};for(var i in $.dicts_list){for(var j in $.dicts_list[i]){$.dicts_map[i+'_' +$.dicts_list[i][j].name]=$.dicts_list[i][j];}};" +
                "$.dicts=function(type){return $.dicts_list[type];};" +
                "$.dict=function(type, name){return $.dicts_map[$.trim(type+'_'+name)];};" +
                "$.dictValue=function(type, name){return $.dicts_map[$.trim(type+'_'+name)].value;};");
        },

        /**
         * 模板jQuery扩展
         * /scripts/jquery.templates.js?p=admin&k=withdraw
         */
        templates: function (req, res) {
            var templates = {};
            var p = req.query.p;
            var k = req.query.k;
            var path = config.templates_path;
            if (p && k) {
                var keys = k.split(',');
                for (var i in keys) {
                    var key = keys[i];
                    templates[key] = fs.readFileSync(path + p + '-template-' + key + '.handlebars', "utf8");
                }
            }
            res.type('text/javascript').send("$.templates=" + JSON.stringify(templates) + ";");
        }
    }
}