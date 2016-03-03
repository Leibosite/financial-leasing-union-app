/**
* User.js
*
* @description :: TODO: 用户表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'user',
  attributes: {
    userName:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    headImage:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    passWord:{
      type:'string',
      size:80,
      defaultsTo:''
    },
    phoneNumber:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    realName:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    organization:{
      model:'Organization',
      size:64
    },
    position:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    workLife:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    identity:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    isStealth:{
      type:'integer',
      size:32,
      defaultsTo:0
      //是否隐身  是1、不是0
    },
    longitude:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    latitude:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    annualRate:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    updatedLocationAt:{
      type:'integer',
      size:64,
      defaultsTo:0
    },
    approachProjectCount:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    completeProjectCount:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    token:{
      type:'String',
      size: 100,
      defaultsTo:''
    },
    channel:{
      type:'string',
      size: 25,
      defaultsTo:''
    }
  }
};

