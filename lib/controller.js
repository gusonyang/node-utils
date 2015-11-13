var action_types = {
    browse: 'browse',
    load: 'browse',
    tree: 'browse',
    add: 'add',
    edit: 'edit',
    sort: 'edit',
    delete: 'delete'
};

var controller = {
    /**
     * 查询对象
     */
    pagination: function (params, filters, likes, order) {
        var where = {};
        //过滤属性
        if (filters) {
            for (var i in filters) {
                var filter = filters[i];
                var attr_value = params[filter];
                if (attr_value && attr_value !== 'all') {
                    where[filter] = attr_value;
                }
            }
        }
        //搜索条件
        if (params.keyword && likes) {
            var likes_where = {};
            for (var i in likes) {
                var like = likes[i];
                likes_where[like] = {
                    $like: '%' + params.keyword + '%'
                }
            }
            where['$or'] = likes_where;
        }
        //时间过虑
        var start = params.start, end = params.end;
        if (start && end) {
            where.created_at = {$gte: start, $lte: end};
        }
        //导出
        if (params.export) {
            params.offset = 0;
            params.limit = 5000;
        }
        //查询对象
        var query = {
            raw: true,
            where: where,
            offset: params.offset || 0,
            limit: params.limit || 20,
            order: order || [[params.order_key || 'id', params.order_value || 'asc']]
        }

        return query;
    },

    /**
     * 查询单个
     */
    load: function (model) {
        return function (params) {
            var where = {id: params.id};
            return model.findOne({where: where});
        }
    },

    /**
     * 添加
     */
    add: function (model, handle) {
        return function (body) {
            return model.create(body, {raw: true}).then(function (data) {

                var response = {success: true, data: data}
                if (handle) handle(response);
                return response;
            });
        }
    },

    /**
     * 编辑
     */
    edit: function (model, handle) {
        return function (body) {
            var where = {id: body.id};
            delete body.id;
            return model.update(body, {where: where}).then(function (result) {

                var response = {success: (result[0] > 0)};
                if (handle) handle(response);
                return response;
            });
        }
    },

    /**
     * 删除
     */
    delete: function (model, handle) {
        return function (body) {
            var where = {id: body.id};
            return model.destroy({where: where}).then(function (count) {

                var response = {success: (count > 0)};
                if (handle) handle(response);
                return response;
            });
        }
    },

    /**
     * 排序
     */
    sort: function (model, handle) {
        return function (body) {
            var excutes = [];
            for (var i in body) {
                var row = body[i];
                excutes.push(model.update({order_by: row.order_by}, {where: {id: row.id}}));
            }
            return Promise.all(excutes).then(function () {

                var response = {success: true};
                if (handle) handle(response);
                return response;
            });
        }
    },

    /**
     * 验证
     */
    validate: function (model, handle) {
        return function (body, params) {
            if (body.id) {
                body.id = {ne: body.id}
            }
            var opposite = params.opposite;
            return model.count({where: body}).then(function (count) {
                if (opposite) {
                    return {valid: (count > 0)};
                } else {
                    return {valid: !(count > 0)};
                }
            });
        }
    },

    /**
     * 扩展管理员 api
     */
    extend_admin: function (actions, model, object_type, methods) {
        actions.model = model;
        for (var i in methods) {
            var method = methods[i];
            actions[method] = controller[method](model);
        }
        for (var i in actions) {
            var action_type = action_types[i];
            if (action_type) {
                actions[i].permission = {object_type: object_type, action_type: action_type}
            }
        }
    }
};

module.exports = controller;