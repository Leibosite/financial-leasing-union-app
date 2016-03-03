/**
 * Created By
 * User: leibosite
 * Time: 2016/3/2
 */

var crypto = require('crypto');
module.exports = {
  __getMd5HexEncode:function(str){
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
  }
}
