/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  mobileUpdateMessage:function(req,res){
    var id = req.param('id');
    MessageService.mobileUpdateMessage(id,res);
  },
  mobileMessageList:function(req,res){
    var userId = req.param('userId');
    var page = req.param('page');
    MessageService.mobileMessageList(userId,page,res);
  },
  saveMessage:function(req,res){
    MessageService.saveMessage(req,res);
  }
};

