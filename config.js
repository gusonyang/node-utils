/**
 * 测试环境
 */
var test = {
    secret: '456123',
    debug: {
        filter: '',
        error_handle: false
    },
    moment: {
        lang: 'zh-cn',
        time_pattern: 'HH:mm',
        date_pattern: 'YYYY-MM-DD',
        datetime_pattern: 'YYYY-MM-DD HH:mm'
    },
    sms: {
        platform: 'yunpian',
        app: '',
        key: ''
    },
    qiniu: {
        AccessKey: '',
        SecretKey: '',
        bucket: '',
        domain: '',
        folder: ''
    },
    print: {
        ip: "115.28.225.82",
        host: "/FeieServer"
    },
    middleware: {
        templates_path: ''
    },
    pois: {
        place_host: 'http://api.map.baidu.com',
        ak: 'MZogKNZUGvUnZMWzhYxRWkG5',
        region: '深圳',
        pois_sources: ['ele', 'baidu', 'lbsyun'],
        stores_geotable_id: 127979,
        regions_geotable_id: 127976
    },
    fetch: {
        images: 'http://kostudio.duapp.com/fetch_goods'
    }
}

/**
 * 导出config
 */
module.exports = test;