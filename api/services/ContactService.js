/**
 * Created By
 * User: leibosite
 * Time: 2016/2/25
 */
var ResponseUtil = require('../util/ResponseUtil.js');
var Promise = require('bluebird');
module.exports={

  /**
   * 搜索联系人好友
   * @param keywords
   * @param userId
   * @param res
   * @returns {*}
   */
  mobileSearchContacts:function(keywords,userId,res){
    if (!keywords || !userId) {
      sails.log.info('------Error-----mobileSearchContacts----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }
    var sqlStr = "select c.id,u.id friendId,u.realName,u.phoneNumber,u.headImage,c.state FROM contact c , user u where" +
      " u.id = c.friend and c.user = "+userId+" and u.realName like '%"+keywords+"%' or u.phoneNumber like '%"+keywords+"%';";

    sails.log.info('sqlstr ----',sqlStr);

    Contact.query(sqlStr,function(err,usersFind){

      if(err || !usersFind){
        sails.log.info('------Error-----mobileSearchContacts----usersFind  empty-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      var responseDate = ResponseUtil.addSuccessMessage();
      if(usersFind.length === 0){
        responseDate.contacts = [];
        return res.json(responseDate);
      }else {
        for(var i in usersFind){
          var user = usersFind[i];
          user.headImage = sails.config.IMAGE_HOST + user.headImage;
        }
        responseDate.contacts = usersFind;
        return res.json(responseDate);
      }
    });
  },

  /**
   * 联系人列表接口
   * @param userId
   * @param res
   * @returns {*}
   */
  mobileContactList:function(userId,res){

    if(!userId){
      sails.log.info("-----Error-----Contact------mobileContactList-----param-----");
      return res.json(ResponseUtil.addParamNotRight());
    }

    var sqlStr = "select c.id,u.id friendId,u.uuid,u.realName,u.phoneNumber,u.headImage,c.state FROM contact c , user u where u.id = c.friend and c.user = "+userId+";";

    Contact.query(sqlStr,function(err,contactsFind){

      if(err || !contactsFind){
        sails.log.info('------Error-----mobileContactList----contactsFind  empty-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      var responseDate = ResponseUtil.addSuccessMessage();
      if(contactsFind.length === 0){
        responseDate.contacts = [];
        return res.json(responseDate);
      }else {
        for(var i in contactsFind){
          var user = contactsFind[i];
          user.headImage = sails.config.IMAGE_HOST + user.headImage;
        }
        responseDate.users = contactsFind;
        return res.json(responseDate);
      }
    });
  },

  /**
   * 同意添加好友申请接口
   * @param userId
   * @param contactId
   * @param res
   */
  mobileAgreeApply:function(userId,contactId,res){

    if(!userId || !contactId){
      sails.log.info('------error------mobileAgreeApply----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var contact = {user:userId,friend:contactId};

    Contact.findOne(contact).exec(function(err,contactFind){

      if(err){
        sails.log.info('------error------mobileAgreeApply----contact findorcreate-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      if(!contactFind){
        Contact.create(contact).exec(function(err,contactUserCreate){

          if(err || !contactUserCreate){
            sails.log.info('------error------mobileAgreeApply----contactUserCreate-----');
            return res.json(ResponseUtil.addErrorMessage());
          }

          Contact.findOrCreate({user:contactId,friend:userId}).exec(function(err,contactFriendFind){

            if(err || !contactFriendFind){
              sails.log.info('------error------mobileAgreeApply----contactFriendFind-----');
              return res.json(ResponseUtil.addErrorMessage());
            }

            if(contactFriendFind.state !==1){

              Contact.update({user:contactId,friend:userId},{state:1}).exec(function(err,contactFriendUpdate){

                if(err || !contactFriendUpdate){
                  sails.log.info('------error------mobileAgreeApply----contactFriendUpdate-----');
                  return res.json(ResponseUtil.addErrorMessage());
                }

                return res.json(ResponseUtil.addSuccessMessage());
              });
            }else{

              return res.json(ResponseUtil.addSuccessMessage());
            }
          });
        });
      }else {

        if(contactFind.state !==1){

          Contact.update(contact,{state:1}).exec(function(err,contactFriendUpdate){

            if(err || !contactFriendUpdate){
              sails.log.info('------error------mobileAgreeApply----contactFriendUpdate-----');
              return res.json(ResponseUtil.addErrorMessage());
            }

            return res.json(ResponseUtil.addSuccessMessage());
          });
        }else{

          return res.json(ResponseUtil.addAlreadyFriends());
        }
      }
    });
  },

  /**
   * 删除好友接口
   * @param userId
   * @param contactId
   * @param res
   */
  mobileDeleteContact:function(userId,contactId,res){

    if(!userId || !contactId){
      sails.log.info('------error------mobileDeleteContact----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Contact.update({user:userId,friend:contactId},{state:2}).exec(function(err,contactUpdate){
      if(err|| !contactUpdate){
        sails.log.info('------error------mobileDeleteContact----contactUpdate-----');
        return res.json(ResponseUtil.addErrorMessage());
      }
      return res.json(ResponseUtil.addSuccessMessage());
    })

  },

  /**
   * 好友拉黑名单接口
   * @param userId
   * @param id
   * @param res
   */
  mobileShieldingContact:function(userId,id,res){

    if(!userId || !id){
      sails.log.info('------error------mobileShieldingContact----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Contact.findOne({user:userId,friend:id}).exec(function(err,contactFind){

      if(err || !contactFind){
        sails.log.error("-----mobileShieldingContact----Error---contactFind----");
        return res.json(ResponseUtil.addErrorMessage());
      }

      Contact.update({id:contactFind.id},{state:3}).exec(function(err,contactUpdate){

        if(err || !contactUpdate || contactUpdate.length === 0){
          sails.log.info("-----mobileShieldingContact----Error---contactFind----");
          return res.json(ResponseUtil.addErrorMessage());
        }

        return res.json(ResponseUtil.addSuccessMessage());
      });
    });
  }

}
