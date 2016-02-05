var assert = require('assert'),
    utils = require('../index');

utils.config = require('../config');
var pois = utils.pois();
var coords = utils.coords;

var stores_geotable_name = 'sz-stores-05';
var stores_geotable_id;
var regions_geotable_name = 'sz-regions-05';
var regions_geotable_id;

describe('lbsyun', function () {
    describe('stores', function () {
        it('create_geotable', function (done) {
            pois.create_geotable({
                name: stores_geotable_name,
                geotype: 1,
                is_published: 1
            }).then(function (result) {
                stores_geotable_id = result.id;
            }).then(done, done);
        });
        it('create_column_style', function (done) {
            pois.create_column({
                name: '样式信息',
                key: 'icon_style_id',
                type: 3,
                geotable_id: stores_geotable_id,
                max_length: 32,
                default_value: 'sid1',
                is_sortfilter_field: 0,
                is_search_field: 0,
                is_index_field: 0,
                is_unique_field: 0
            }).then(function (result) {

            }).then(done, done);
        });
        it('create_column_ref', function (done) {
            pois.create_column({
                name: '编号',
                key: 'ref_id',
                type: 3,
                geotable_id: stores_geotable_id,
                max_length: 512,
                is_sortfilter_field: 0,
                is_search_field: 1,
                is_index_field: 1,
                is_unique_field: 1
            }).then(function (result) {

            }).then(done, done);
        });
    });

    describe('regions', function () {
        it('create_geotable', function (done) {
            pois.create_geotable({
                name: regions_geotable_name,
                geotype: 1,
                is_published: 1
            }).then(function (result) {
                regions_geotable_id = result.id;
            }).then(done, done);
        });
        it('create_column_style', function (done) {
            pois.create_column({
                name: '样式信息',
                key: 'icon_style_id',
                type: 3,
                geotable_id: regions_geotable_id,
                max_length: 32,
                default_value: 'sid1',
                is_sortfilter_field: 0,
                is_search_field: 0,
                is_index_field: 0,
                is_unique_field: 0
            }).then(function (result) {

            }).then(done, done);
        });
        it('create_column_ref', function (done) {
            pois.create_column({
                name: '编号',
                key: 'ref_id',
                type: 3,
                geotable_id: regions_geotable_id,
                max_length: 512,
                is_sortfilter_field: 0,
                is_search_field: 1,
                is_index_field: 1,
                is_unique_field: 1
            }).then(function (result) {

            }).then(done, done);
        });
    });
});