var assert = require('assert'),
    utils = require('../index'),
    pois = utils.pois();

describe('地点', function () {
    it('获取一个地址', function (done) {
        pois.get_poi({latitude: '22.5502', longitude: '114.118202'}).then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });
    it('获取附近地址', function (done) {
        pois.get_pois({latitude: '22.5502', longitude: '114.118202'}).then(function (result) {
            console.log(result);
            assert.equal(true, result.length > 0);
            done();
        });
    });
});