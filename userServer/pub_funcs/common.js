var sha = require('./SHA.js');

var sign = {
    getRandomstring: function() {
        var length = 10;
        var chars = 'ABCDEFGHIJKMNOPQRSTWXYZabcdefhijkmnprstwxyz12345678';
        var maxPos = chars.length;
        var randomString = '';
        for (var i = 0; i < length; i++) {
            var nowChar = chars[Math.floor(Math.random() * maxPos)];
            randomString += nowChar;
        }
        return randomString;
    }
};
var createHeaders = function(logined) {
    var returnHeaders = {};
    returnHeaders.ts = (new Date()).valueOf();
    returnHeaders.key = sign.getRandomstring();
    var tokenString = 'timestamp=' + returnHeaders.ts + 'key=' + returnHeaders.key + 'mzSx42jMB6sXrH6P6EcZDgZr';
    returnHeaders.token = sha.sha256(tokenString);

    if ($.cookie('ticket') && $.cookie('username')) { //添加 ticked 和 username 请求头
        returnHeaders.ticket = $.cookie('ticket');
        returnHeaders.username = $.cookie('username');
    }

    return returnHeaders;
}

module.exports = createHeaders;