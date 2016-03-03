/**
* Organization.js
*
* @description :: 用户机构信息表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'organization',
  attributes: {
    name:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    companyType:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    establishTime:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    companyLocation:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    staffCounter:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    largestHolder:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    capital:{
      type:'float',
      defaultsTo:0
    },
    totalAsset:{
      type:'float',
      defaultsTo:0
    },
    industryType:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    coverArea:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    productPutInYear:{
      type:'string',
      size:20,
      defaultsTo:""
    },
    operationCycle:{
      type:'string',
      size:50,
      defaultsTo:""
    },
    putOnScale:{
      type:'string',
      size:40,
      defaultsTo:""
    },
    annualRate:{
      type:'string',
      size:40,
      defaultsTo:""
    },
    user:{
      model:'User',
      size:64
    }
  }
};

