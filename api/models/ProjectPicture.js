/**
* ProjectPicture.js
*
* @description :: 项目图片表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'project_picture',
  attributes: {
    category:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    pictureURL:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    project:{
      model:'Project',
      size:64
    }

  }
};

