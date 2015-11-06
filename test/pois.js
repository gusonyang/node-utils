var utils = require('../index');

var pois = utils.pois();

/*
pois.get_poi({latitude: '22.54662', longitude: '114.1066'}).then(function (result) {
    console.log(result);
});

pois.get_pois({latitude: '22.54662', longitude: '114.1066'}).then(function (result) {
    console.log(result);
});
*/


var data = {
    title: '测试2',
    address: '测试地址',
    latitude: 22.54662,
    longitude: 114.1066,
    coord_type: 3,
    ref_id: 1,
    geotable_id: 0
}

pois.sync_poi(data).then(function(result){
    console.log(result);
});