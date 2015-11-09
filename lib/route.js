var Promise = require('bluebird');

module.exports = function (utils) {
    var debug = utils.debug('route'), settings = utils.settings;

    return function (app) {

        var route = {
            /**
             * 检查是否有权限
             */
            check: function (req, res, handle, action) {
                return Promise.resolve({success: true});
            },

            /**
             * 错误处理
             * @param req
             * @param res
             * @param err
             */
            err_handle: function (req, res, err) {
                var code = 500;
                if (err) {
                    if (err.stack) {
                        debug.err(err.stack);
                    } else {
                        debug.err(err);
                    }
                    if (req.body && req.body.length) {
                        debug.log(req.body);
                    }
                    if (err.code) {
                        code = err.code;
                    }
                }
                var result = {success: false};
                if (err.message) {
                    result.message = err.message
                }
                return res.status(code).send(result);
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
                    route.err_handle(req, res, err);
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
                    response.layout = page.layout || 'page';
                    response.page_name = page_name;
                    response.settings = settings.values();
                    return res.render('pages/' + page_name, response);
                }).catch(function (err) {
                    if (err) {
                        if (err.stack) {
                            debug.err(err.stack);
                        } else {
                            debug.err(err);
                        }
                    }
                    var code = err.code || 500;
                    switch (err.code) {
                        case 401:
                            return res.redirect('login?redirectURL=' + encodeURIComponent(req.originalUrl));
                            break;
                        default :
                            return res.status(code).send({success: false});
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