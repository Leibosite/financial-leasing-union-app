/**
* ApproachRecord.js
*
* @description :: 接洽历史表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'approach_record',
  attributes: {
    user:{
    model:'User',
    size:64
    },
    project:{
      model:'Project',
      size:64
    }
  }
};

