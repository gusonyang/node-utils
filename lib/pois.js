var Promise = require("bluebird"),
    request = require('request'),
    geohash = require('ngeohash');

module.exports = function (config, utils) {
    var debug = utils.debug('pois'), coords = utils.coords,
        place_host = config.place_host, ele_host = 'http://restapi.ele.me';

    var api = {

        /**
         * request
         * @param host
         * @param params
         */
        json: function (host, params) {
            return new Promise(function (resolve, reject) {
                var method = params.method || 'GET';
                request({
                    url: host + params.url,
                    method: method,
                    formData: method !== 'GET' ? params.data : false,
                    qs: method === 'GET' ? params.data : false
                }, function (err, response, body) {
                    if (err) {
                        debug.err(err);
                        return reject(err);
                    }
                    var data = JSON.parse(body);
                    return resolve(data);
                });
            });
        },

        /**
         * 查询地点
         */
        list_poi: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geodata/v3/poi/list',
                method: 'GET',
                data: data
            }
            return api.json(place_host, params).then(function (result) {
                debug.log(result);
                return result;
            });
        },

        /**
         * 创建地点
         */
        create_poi: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geodata/v3/poi/create',
                method: 'POST',
                data: data
            }
            return api.json(place_host, params).then(function (result) {
                debug.log(result);
                return result;
            });
        },

        /**
         * 更新地址
         * @param data
         */
        update_poi: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geodata/v3/poi/update',
                method: 'POST',
                data: data
            }
            return api.json(place_host, params).then(function (result) {
                debug.log(result);
                return result;
            });
        },

        /**
         * 删除地址
         * @param data
         */
        delete_poi: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geodata/v3/poi/delete',
                method: 'POST',
                data: data
            }
            return api.json(place_host, params).then(function (result) {
                debug.log(result);
                return result;
            });
        },

        /**
         * 附近地点
         */
        near_poi: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geosearch/v3/nearby',
                method: 'GET',
                data: data
            }
            return api.json(place_host, params);
        },

        /**
         * 获取一个地址
         */
        get_poi: function (params) {
            var loc = coords.bd2gcj(params.longitude, params.latitude);
            var hash = geohash.encode(loc[1], loc[0]);
            var params = {
                url: '/v2/pois/' + hash,
                method: 'GET',
            }
            return api.json(ele_host, params);
        },

        /**
         * 获取一组地址
         */
        get_pois: function (params, keyword) {
            var loc = coords.bd2gcj(params.longitude, params.latitude);
            var hash = geohash.encode(loc[1], loc[0]);
            var data = {
                geohash: hash,
                limit: 20,
                type: 'nearby'
            }
            if (keyword) {
                data.keyword = keyword;
            }
            var params = {
                url: '/v2/pois',
                method: 'GET',
                data: data
            }
            return api.json(ele_host, params).then(function (rows) {
                var pois = [];
                for (var i in rows) {
                    var row = rows[i];
                    var loc = coords.gcj2bd(row.longitude, row.latitude);
                    pois.push({
                        name: row.name,
                        address: row.address,
                        latitude: loc[1],
                        longitude: loc[0]
                    });
                }
                return pois;
            });
        },

        /**
         * 同步坐标
         */
        sync_poi: function (data) {
            return api.list_poi({
                ref_id: data.ref_id,
                geotable_id: data.geotable_id
            }).then(function (result) {
                if (result.status !== 0) {
                    debug.err(result);
                    return {success: false};
                }
                if (result.size) {
                    var pois = result.pois;
                    if (result.size > 1) {
                        for (var i = 1; i < pois.length; i++) {
                            api.delete_poi({geotable_id: data.geotable_id, id: pois[i].id});
                        }
                    }
                    data.id = pois[0].id;
                    return api.update_poi(data).then(function (result) {
                        if (result.status !== 0) {
                            debug.err(result);
                            return {success: false};
                        }
                        return {success: true, updated: true, data: result};
                    });
                } else {
                    return api.create_poi(data).then(function (result) {
                        if (result.status !== 0) {
                            debug.err(result);
                            return {success: false};
                        }
                        return {success: true, created: true, data: result};
                    });
                }
            });
        }
    }

    return api;
}