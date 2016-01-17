var assert = require('assert'),
    utils = require('../index'),
    sms = utils.sms();

describe('短信测试', function () {
    it('发送验证码', function (done) {
        var tel = '13510946316', code = '123456';
        sms.send_code(tel, code).then(function (result) {
            assert.equal(true, result.success);
            done();
        });
    });
});