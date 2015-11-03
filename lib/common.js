var signature = require('cookie-signature');

module.exports = function (config) {
    return {

        /**
         * 生成加密的SID
         * @param sid
         * @returns {string}
         */
        generateSid: function (sid) {
            return 's:' + signature.sign(sid, config.secret);
        },

        /**
         * 获取方法的参数名
         * @param fn
         * @returns {*}
         */
        getParamsNames: function (fn) {
            var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            var code = fn.toString().replace(COMMENTS, '');
            var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
            return result === null ? [] : result;
        }
    }
}