var Promise = require("bluebird"),
    request = require('request'),
    geohash = require('ngeohash');

module.exports = function (config, utils) {
    var debug = utils.debug('pois'), place_host = config.place_host, ele_host = 'http://restapi.ele.me';

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
         * 创建地点
         */
        create_poi: function (data) {
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
            var hash = geohash.encode(params.latitude, params.longitude);
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
            var hash = geohash.encode(params.latitude, params.longitude);
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
            return api.json(ele_host, params);
        }
    }

    return api;
}