var utils = require('../index');

var pois = utils.pois();

pois.get_poi({latitude: '22.54662', longitude: '114.1066'}).then(function (result) {
    console.log(result);
});

pois.get_pois({latitude: '22.54662', longitude: '114.1066'}).then(function (result) {
    console.log(result);
});