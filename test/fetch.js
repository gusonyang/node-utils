var assert = require('assert'),
    utils = require('../index'),
    fetch = utils.fetch();

describe('图片抓取测试', function () {
    //天猫 http://chaoshi.detail.tmall.com/
    it('天猫', function (done) {
        var url = 'http://world.tmall.com/item/524508339111.htm?spm=a2160.7230762.1997224353.1.abOILV&id=524508339111'
        fetch.images({url: url}).then(function (result) {
            assert.equal(true, result.success);
            done();
        });
    });
    //苏宁易购 http://product.suning.com/
    it('苏宁易购', function (done) {
        var url = 'http://product.suning.com/detail_0070092164_135783372.html?srcpoint=chaoshi_nj_lc01_01'
        fetch.images({url: url}).then(function (result) {
            assert.equal(true, result.success);
            done();
        });
    });
    //1号店 http://item.yhd.com/
    it('1号店', function (done) {
        var url = 'http://item.yhd.com/item/56061283?ref=ad.16397_25644618_1&tc=ad.0.0.16397-25644618.1&tp=2049.0.m2400727.0.10.L9FDeZD-10-91pE6&ti=EE3W'
        fetch.images({url: url}).then(function (result) {
            assert.equal(true, result.success);
            done();
        });
    });
    //我买网 http://womai.com/
    it('我买网', function (done) {
        var url = 'http://gz.womai.com/Product-200-10254876.htm'
        fetch.images({url: url}).then(function (result) {
            assert.equal(true, result.success);
            done();
        });
    });
});