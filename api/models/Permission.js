/**
* Permission.js
*
* @description :: TODO: 权限表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'permission',
  attributes: {
    name:{
      type:'string',
      size:20,
      defaultsTo:''
    },
    type:{
      type:'integer',
      size:32,
      defaultsTo:1
      //1:界面权限 ， 2、数据权限。
    },
    model:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    action:{
      type:'string',
      size:20,
      defaultsTo:''
    },
    url:{
      type:'string',
      size:200,
      defaultsTo:''
    }
  }
};

