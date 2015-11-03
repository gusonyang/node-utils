var Promise = require('bluebird'),
    request = require('request'),
    qiniu = require('qiniu');

module.exports = function (config) {

    qiniu.conf.ACCESS_KEY = config.AccessKey;
    qiniu.conf.SECRET_KEY = config.SecretKey;
    var client = new qiniu.rs.Client();
    var putPolicy = {};

    return {
        /**
         * 获取上传凭证
         */
        uptoken: function (bucket) {
            if (!putPolicy[bucket]) {
                putPolicy[bucket] = new qiniu.rs.PutPolicy(bucket);
            }
            var uptoken = putPolicy[bucket].token();
            return {uptoken: uptoken};
        },

        /**
         * 删除图片
         */
        remove: function (image) {
            client.remove(image.bucket, image.key, function (err, ret) {
                if (err) {
                    return console.log(err);
                }
            })
        },

        /**
         * 上传图片
         * @param images
         * @param bucket
         * @returns {*}
         */
        uploadFiles: function (images, bucket) {
            if (!putPolicy[bucket]) {
                putPolicy[bucket] = new qiniu.rs.PutPolicy(bucket);
            }
            var uptoken = putPolicy[bucket].token();
            var all = [];
            var handle = function (key, filename, image) {
                var resolver = Promise.defer();
                if (image.indexOf('//') == 0) {
                    image = 'http:' + image;
                }
                request.get(image).on('end', function () {
                    var extra = new qiniu.io.PutExtra();
                    qiniu.io.putFile(uptoken, key, filename, extra, function (err, ret) {
                        if (err) {
                            console.log(err);
                            return resolver.reject({success: false});
                        }
                        return resolver.resolve({success: true, ret: ret});
                    });
                }).pipe(fs.createWriteStream(filename));
                return resolver.promise;
            }

            for (var i in images) {
                var key = '' + new Date().getTime() + Math.floor(Math.random() * 100000);
                var filename = config.folder + key;
                all.push(handle(key, filename, images[i]));
            }

            return Promise.all(all).catch(function (result) {
                console.log(result);
            });
        }
    }
}

