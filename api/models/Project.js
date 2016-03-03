/**
* Project.js
*
* @description :: TODO: 项目表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'project',

  attributes: {

    projectName:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    financingAmount:{
      type:'float'
    },
    publisherType:{
      type:'string',
      size:20
      //企业直发  盟友发布
    },
    leaseTerm:{
      type:'string',
      size:50,
      defaultsTo:''
    },
    leaseList:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    leaseName:{
      type:'string',
      size:40,
      defaultsTo:''
    },
    purchasePrice:{
      type:'float',
      defaultsTo:0
    },
    purchaseTime:{
      type:'string',
      size:64,
      defaultsTo:''
    },
    invoiceState:{
      type:'string',
      size:32,
      defaultsTo:''
    },
    leaseDesp:{
      type:'string',
      size:40,
      defaultsTo:''
    },
    fundsUsing:{
      type:'text',
      defaultsTo:''
    },
    companyName:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    companyAddress:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    integrity:{
      type:'float',
      defaultsTo:0
    },
    score:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    primaryIncome:{
      type:'float',
      size:40,
      defaultsTo:0
    },
    debtRatio:{
      type:'float',
      defaultsTo:0
    },
    profitRatio:{
      type:'float',
      defaultsTo:0
    },
    totalAsset:{
      type:'float',
      defaultsTo:0
    },
    totalDebt:{
      type:'float',
      defaultsTo:0
    },
    shortDebt:{
      type:'float',
      defaultsTo:0
    },
    profit:{
      type:'float',
      defaultsTo:0
    },
    sales:{
      type:'float',
      defaultsTo:0
    },
    otherDetail:{
      type:'text',
      defaultsTo:''
    },
    state:{
      type:'integer',
      size:32,
      defaultsTo:1
      //1、等待接洽
      //2、接洽中
      //3、已完成
    },
    publisher:{
      model:'User',
      size:64
    },
    companyType:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    industryType:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    publisherTime:{
      type:'integer',
      size:64,
      defaultsTo:0
    },
    contactCounter:{
      type:'integer',
      size:32,
      defaultsTo:0
    }
   /* toJSON: function () {
      var obj = this.toObject();
      obj.testFloat = obj.testFloat/10000.0;
      obj.debtRatio = obj.debtRatio / 10000.0;
      sails.log.info('------toJSON-------',obj);
      return obj;
    }*/
  },

  /*beforeCreate: function (values,cb) {
    sails.log.info('beforeCreate values testFloat ---',values.testFloat);

    values.testFloat = values.testFloat * 10000.0;
    cb();
  }*/
};

