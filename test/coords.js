var assert = require('assert'),
    utils = require('../index'),
    coords = utils.coords;

describe('坐标', function () {
    it('转百度坐标', function () {
        console.log(coords.gcj2bd(114.1118, 22.543928));
    });
});