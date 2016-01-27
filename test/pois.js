var assert = require('assert'),
    utils = require('../index');

utils.config = require('../config');
var pois = utils.pois();
var coords = utils.coords;

describe('地点', function () {
    it('获取一个地址', function (done) {
        pois.get_poi({latitude: 22.5502, longitude: 114.118202}, '振').then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('通过百度获取一个地址', function (done) {
        pois.get_poi_bybaidu({latitude: 22.5502, longitude: 114.118202}, '振').then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('通过LBS获取一个地址', function (done) {
        pois.get_poi_bylbsyun({latitude: 22.5502, longitude: 114.118202}, '振').then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('通过饿了吗Api获取一个地址', function (done) {
        pois.get_poi_byele({latitude: 22.5502, longitude: 114.118202}, '振').then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('获取附近地址', function (done) {
        pois.get_pois({latitude: 22.5502, longitude: 114.118202}).then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('通过LBS获取附近地址', function (done) {
        pois.get_pois_bylbsyun({latitude: 22.5502, longitude: 114.118202}).then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('通过饿了吗获取附近地址', function (done) {
        pois.get_pois_byele({latitude: 22.5502, longitude: 114.118202}).then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });

    it('通过百度获取附近地址', function (done) {
        pois.get_pois_bybaidu({latitude: 22.5502, longitude: 114.118202}).then(function (result) {
            console.log(result);
            assert.equal(true, result != null);
            done();
        });
    });
});