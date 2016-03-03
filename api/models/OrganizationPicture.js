/**
* OrganizationPicture.js
*
* @description :: 机构图片表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'organization_picture',
  attributes: {
    category:{
      type:'string',
      size:20,
      defaultsTo:''
    },
    pictureURL:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    organization:{
      model:'Organization',
      size:64
    }
  }
};

