/**
* UserProject.js
*
* @description :: TODO: 用户项目关联表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'user_project',
  attributes: {
    status:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    //关联类型。 1、已发布项目 2、申请查看项目。 3、接洽中。4、已完成
    user:{
      model:'User',
      size:64
    },
    project:{
      model:'Project',
      size:64
    },
    isRead:{
      type:'integer',
      size:8, // 0 没有查看资金方资料 1 已查阅资金方资料
      defaultsTo:0
    }
  }
};

