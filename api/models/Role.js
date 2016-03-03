/**
* Role.js
*
* @description :: TODO: 角色表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'role',
  attributes: {
    name:{
      type:'string',
      size:20,
      defaultsTo:''
    }

  }
};

