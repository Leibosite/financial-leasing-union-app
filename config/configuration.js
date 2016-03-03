/**
 * @desp 用于项目的基本配置
 * Created by leibosite on 2015/12/28.
 */
module.exports = {

  //图片公有路径
  IMAGE_FOLD_PATH : '/home/ftp',


  //图片资源访问路径
  IMAGE_HOST : 'http://101.200.174.126:16888',

  //用户图片路径
  USER_IMAGE_PATH : '/upload/financialApp/user',

  //用户机构图片路径
  ORGANIZATION_IMAGE_PATH : '/upload/financialApp/organization',

  //项目图片路径
  PROJECT_IMAGE_PATH : '/upload/financialApp/project',

  //项目端口号
  //port:60020

  //每页读取的数目
  PAGE:5,

  //文件上传最大限制
  IMAGE_UPLOAD_MAX_BYTES : 5000000,

  //每张项目的分值
  PROJECT_PICTURE_VALUE : 4,

  //24小时的毫秒数
  DAY_MILLISECOND : 86400000
}
