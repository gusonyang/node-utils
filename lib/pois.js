var Promise = require("bluebird"),
    request = require('request'),
    geohash = require('ngeohash');

module.exports = function (config, utils) {
    var debug = utils.debug('pois'), coords = utils.coords,
        place_host = config.place_host,
        ele_host = 'http://restapi.ele.me',
        baidu_host = 'http://api.map.baidu.com';

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
         * 创建表
         */
        create_geotable: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geodata/v3/geotable/create',
                method: 'POST',
                data: data
            }
            return api.json(place_host, params).then(function (result) {
                debug.log(result);
                return result;
            });
        },

        /**
         * 创建列
         */
        create_column: function (data) {
            data.ak = config.ak;
            var params = {
                url: '/geodata/v3/column/create',
                method: 'POST',
                data: data
            }
            return api.json(place_host, params).then(function (result) {
                debug.log(result);
                return result;
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
            var pois_sources = config.pois_sources;
            var pois;
            return Promise.mapSeries(pois_sources, function (name) {
                if (!pois) {
                    return api['get_poi_by' + name](params).then(function (result) {
                        pois = result;
                    });
                }
            }).then(function () {
                return pois;
            });
        },

        /**
         * 通过lbsyun获取地址
         */
        get_poi_bylbsyun: function (params) {
            return api.near_poi({
                geotable_id: config.regions_geotable_id,
                location: params.longitude + ',' + params.latitude,
                sortby: 'distance:1',
                radius: 6000,
                page_size: 1
            }).then(function (result) {
                if (result.status === 0) {
                    var pois = result.contents;
                    for (var i in pois) {
                        var poi = pois[i];
                        return {
                            name: poi.title,
                            address: poi.address,
                            latitude: poi.location[1],
                            longitude: poi.location[0]
                        }
                    }
                }
                return null;
            });
        },

        /**
         * 获取一个地址通过饿了吗
         */
        get_poi_byele: function (params) {
            var loc = coords.bd2gcj(params.longitude, params.latitude);
            var hash = geohash.encode(loc[1], loc[0]);
            var params = {
                url: '/v2/pois/' + hash,
                method: 'GET',
            }
            return api.json(ele_host, params).then(function (result) {
                if (result.name === 'SERVER_UNKNOWN_ERROR') {
                    return null;
                }
                var loc = coords.gcj2bd(result.longitude, result.latitude);
                return {
                    name: result.name,
                    address: result.address,
                    latitude: loc[1],
                    longitude: loc[0]
                };
            });
        },

        /**
         * 通过百度Api获取地址
         */
        get_poi_bybaidu: function (params, keyword) {
            return api.json(baidu_host, {
                url: '/geocoder/v2/',
                method: 'GET',
                data: {
                    pois: 1,
                    output: 'json',
                    ak: config.ak,
                    location: params.latitude + ',' + params.longitude
                }
            }).then(function (result) {
                if (result.status === 0) {
                    var pois = result.result.pois;
                    for (var i in pois) {
                        var poi = pois[i];
                        return {
                            name: poi.name,
                            address: poi.addr,
                            latitude: poi.point.y,
                            longitude: poi.point.x
                        }
                    }
                }
                return null;
            });
        },

        /**
         * 获取一组地址
         */
        get_pois: function (params, keyword) {
            var pois_sources = config.pois_sources;
            var pois;
            return Promise.mapSeries(pois_sources, function (name) {
                if (!pois) {
                    return api['get_pois_by' + name](params, keyword).then(function (result) {
                        pois = result;
                    });
                }
            }).then(function () {
                return pois;
            });
        },

        /**
         * 通过lbsyun获取地址
         */
        get_pois_bylbsyun: function (params, keyword) {
            var data = {
                geotable_id: config.regions_geotable_id,
                location: params.longitude + ',' + params.latitude,
                sortby: 'distance:1'
            }
            if (keyword) {
                data.q = keyword;
            } else {
                data.radius = 6000;
            }
            return api.near_poi(data).then(function (result) {
                if (result.status === 0) {
                    var pois = result.contents;
                    var newPois = [];
                    for (var i in pois) {
                        var poi = pois[i];
                        newPois.push({
                            name: poi.title,
                            address: poi.address,
                            latitude: poi.location[1],
                            longitude: poi.location[0]
                        });
                    }
                    return newPois;
                }
                return null;
            });
        },

        /**
         * 通过饿了吗获取地址
         */
        get_pois_byele: function (params, keyword) {
            var loc = coords.bd2gcj(params.longitude, params.latitude);
            var data = {
                geohash: geohash.encode(loc[1], loc[0]),
                limit: 20,
                type: 'nearby'
            }
            if (keyword) {
                data.keyword = keyword;
            }
            return api.json(ele_host, {
                url: '/v2/pois',
                method: 'GET',
                data: data
            }).then(function (rows) {
                if (rows.length) {
                    var pois = [];
                    for (var i in rows) {
                        var row = rows[i];
                        if (!row.name) return null;

                        var loc = coords.gcj2bd(row.longitude, row.latitude);
                        pois.push({
                            name: row.name,
                            address: row.address,
                            latitude: loc[1],
                            longitude: loc[0]
                        });
                    }
                    return pois;
                }
                return null;
            });
        },

        /**
         * 通过百度Api获取地址
         */
        get_pois_bybaidu: function (params, keyword) {
            if (keyword) {
                //搜索
                return api.json(baidu_host, {
                    url: '/place/v2/search',
                    method: 'GET',
                    data: {
                        pois: 1,
                        output: 'json',
                        ak: config.ak,
                        lat: params.latitude,
                        lng: params.longitude,
                        query: keyword,
                        region: config.region
                    }
                }).then(function (result) {
                    if (result.status === 0) {
                        var pois = result.results;
                        var newPois = [];
                        for (var i in pois) {
                            var poi = pois[i];
                            if (poi && poi.location) {
                                newPois.push({
                                    name: poi.name,
                                    address: poi.address,
                                    latitude: poi.location.lat,
                                    longitude: poi.location.lng
                                });
                            }
                        }
                        return newPois;
                    }
                    return null;
                });

            } else {
                //附近
                return api.json(baidu_host, {
                    url: '/geocoder/v2/',
                    method: 'GET',
                    data: {
                        pois: 1,
                        output: 'json',
                        ak: config.ak,
                        location: params.latitude + ',' + params.longitude
                    }
                }).then(function (result) {
                    if (result.status === 0) {
                        var pois = result.result.pois;
                        var newPois = [];
                        for (var i in pois) {
                            var poi = pois[i];
                            newPois.push({
                                name: poi.name,
                                address: poi.addr,
                                latitude: poi.point.y,
                                longitude: poi.point.x
                            });
                        }
                        return newPois;
                    }
                    return null;
                });

            }
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