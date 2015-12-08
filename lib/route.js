var _ = require('lodash'),
    Promise = require('bluebird');

module.exports = function (utils) {
    var debug = utils.debug('route'), settings = utils.settings;

    return function (app) {

        var route = {
            /**
             * 检查是否有权限
             */
            check: function (req, res, handle, action) {
                var params = {
                    params: _.extend({}, req.query, req.params),
                    user_id: req.session.user_id
                }
                if (handle.permission === true && !params.user_id) {
                    return Promise.reject(new Error('401'));
                }
                if (handle.direct) {
                    return Promise.resolve({params: params.params});
                }
                var action_params = [], params_names = utils.common().getParamsNames(handle);
                for (var i in params_names) {
                    var name = params_names[i];
                    action_params.push(params[name]);
                }
                return handle.apply(action, action_params);
            },

            /**
             * 错误处理
             * @param req
             * @param res
             * @param err
             */
            err_handle: function (req, res, err) {
                debug.log(err.message + ' ' + req.url);
                switch (err.message) {
                    case '401':
                        return res.status(401).send({success: false, code: 401, message: '用户未登录'});
                        break;
                    case '403':
                        return res.status(403).send({success: false, code: 403, message: '用户没有该权限'});
                        break;
                    default :
                        if (err.stack) {
                            debug.err(err.stack);
                        }
                        if (req.body && req.body.length) {
                            debug.log(req.body);
                        }
                        return res.status(500).send({success: false, code: 500, message: err.message});
                        break;
                }
            },

            /**
             * api处理
             * @param req
             * @param res
             * @param method
             * @param action
             */
            api_handle: function (req, res, method, action) {
                return route.check(req, res, method, action).then(function (response) {
                    for (var i in response) {
                        if (response[i] === null)
                            delete response[i];
                    }
                    return res.send(response);
                }).catch(function (err) {
                    return route.err_handle(req, res, err);
                });
            },

            /**
             * 处理 view
             * @param req
             * @param res
             * @param view
             * @param view_name
             */
            view_handle: function (req, res, view, view_name) {
                return route.check(req, res, view).then(function (response) {
                    response.view_name = view_name;
                    return res.render('views/' + view_name, response);
                }).catch(function (err) {
                    route.err_handle(req, res, err);
                });
            },

            /**
             * 页面处理
             * @param req
             * @param res
             * @param page
             * @param page_name
             */
            page_handle: function (req, res, page, page_name) {
                return route.check(req, res, page).then(function (response) {
                    if (response.redirect) {
                        return res.redirect(response.redirect);
                    }
                    response.layout = page.layout || 'page';
                    response.page_name = page_name;
                    response.settings = settings.values();
                    return res.render('pages/' + page_name, response);
                }).catch(function (err) {
                    switch (err.message) {
                        case '401':
                            return res.redirect('login?redirectURL=' + encodeURIComponent(req.originalUrl));
                            break;
                        default :
                            return res.status(500).send({success: false, code: 500, message: err.message});
                            break;
                    }
                });
            },

            /**
             * 初始化 api
             */
            actions: function (path, directory) {
                var actions = require(directory);
                app.use(path, function (req, res, next) {
                    var matcher = req.path.split('/'),
                        module = matcher && matcher[1],
                        action = module && actions[module];
                    if (action) {
                        var method = action[matcher[2]];
                        if (method) {
                            return route.api_handle(req, res, method, action);
                        }
                    }
                    next();
                });
            },

            /**
             * 初始化 view
             */
            views: function (path, directory) {
                var views = require(directory);
                app.use(path, function (req, res, next) {
                    var matcher = req.path.split('/'),
                        name = matcher && matcher[1],
                        view = name && views[name];
                    if (view) {
                        return route.view_handle(req, res, view, name);
                    }
                    next();
                });
            },

            /**
             * 初始化 page
             */
            pages: function (path, directory) {
                var pages = require(directory);
                app.use(path, function (req, res, next) {
                    var matcher = req.path.split('/'),
                        name = matcher && matcher[1],
                        page = name && pages[name];
                    if (page) {
                        return route.page_handle(req, res, page, name);
                    }
                    next();
                });
            }
        }

        return route;
    }
}