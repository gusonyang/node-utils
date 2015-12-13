var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

/**
 * 坐标
 */
var coords = {

    /**
     * 百度坐标转其它坐标
     */
    bd2gcj: function (bd_lon, bd_lat) {
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    },

    /**
     * 其它坐标转百度坐标
     */
    gcj2bd: function (lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    },

    getRad: function (d) {
        return d * Math.PI / 180.0;
    },

    /**
     * 两点的距离
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @returns {number}
     */
    getDistance: function (lat1, lng1, lat2, lng2) {
        var radLat1 = coords.getRad(lat1);
        var radLat2 = coords.getRad(lat2);
        var a = radLat1 - radLat2;
        var b = coords.getRad(lng1) - coords.getRad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378137.0;
        s = Math.round(s * 10000) / 10000.0;
        return s;
    }

}

module.exports = coords;