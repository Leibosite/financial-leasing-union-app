/**
* Message.js
*
* @description :: TODO: 消息表
* @docs        :: http://sailsjs.org/#!documentation/models
 *@desp
 * type :
       0 跳转到关注者资料详情
       1 跳转到已发布项目详情
       2 不跳转，只显示内容
       3 跳转到项目方详情
   jumpID:
       如果type是0，那么jumpID代表关注者ID
       如果type是1，那么jumpID代表已发布项目ID
       如果type是3，那么jumpID代表项目ID
   user:
       type是0，发送给申请查看项目的人
       type是1，发送给项目方
       type是2，发送给资金方
       type是3，发送给资金方
*/

module.exports = {

  tableName:'message',
  attributes: {
    content:{
      type:'text',
      defaultsTo:''
    },
    isReceived:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    type:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    jumpId:{
      type:'integer',
      size:64,
      defaultsTo:0
    },
    user:{
      model:'User',
      size:64
    }
  }
};

