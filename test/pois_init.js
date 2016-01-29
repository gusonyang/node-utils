var assert = require('assert'),
    utils = require('../index');

utils.config = require('../config');
var pois = utils.pois();
var coords = utils.coords;

describe('地点', function () {
    it('通过LBS获取附近地址', function (done) {
        pois.get_pois_bylbsyun({latitude: 22.5502, longitude: 114.118202}).then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
        }).then(done, done);
    });
});