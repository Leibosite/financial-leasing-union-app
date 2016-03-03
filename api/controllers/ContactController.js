/**
 * ContactController
 *
 * @description :: Server-side logic for managing Contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  mobileSearchContacts:function(req,res){
    var keywords = req.param('keywords');
    var userId = req.param('userId');
    ContactService.mobileSearchContacts(keywords,userId,res);
  },
  mobileContactList:function(req,res){
    var userId = req.param('userId');
    ContactService.mobileContactList(userId,res);
  },
  mobileAgreeApply:function(req,res){
    var userId = req.param('userId');
    var contactId = req.param('contactId');
    ContactService.mobileAgreeApply(userId,contactId,res);
  },
  mobileDeleteContact:function(req,res){
    var userId = req.param('userId');
    var contactId = req.param('contactId');
    ContactService.mobileDeleteContact(userId,contactId,res);
  },
  mobileShieldingContact:function(req,res){
    var userId = req.param('userId');
    var id = req.param('id');
    ContactService.mobileShieldingContact(userId,id,res);
  }
};

