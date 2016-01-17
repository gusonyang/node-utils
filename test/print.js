var assert = require('assert'),
    utils = require('../index'),
    print = utils.print();

describe('打印', function () {
    it('飞鹅', function (done) {
        print.yun_print({
            printer_sn: '915500673',
            printer_key: 'LRhQB282',
            print_count: 1
        }, '您好').then(function (result) {
            assert.equal(true, result.success);
            done();
        });
    });
});