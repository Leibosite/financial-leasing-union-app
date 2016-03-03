/**
* Contact.js
*
* @description :: TODO: 用户联系人表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'contact',
  attributes: {

    state:{
      type:'integer',
      size:32,
      defaultsTo:1
      //1:为好友关系。 2、陌生人关系。3、黑名单
    },
    user:{
      model:'User',
      size:64
    },
    friend:{
      model:'User',
      size:64
    }

  }
};

