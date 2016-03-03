/**
 * Created By
 * User: leibosite
 * Time: 2016/2/25
 */

var ResponseUtil = require('../util/ResponseUtil.js');
var Promise = require('bluebird');

module.exports = {

  /**
   * 读取消息接口
   * @param id
   * @param res
   * @returns {*}
   */
  mobileUpdateMessage: function (id, res) {

    if(!id){
      sails.log.info('---ERROR---mobileUpdateMessage----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Message.update({id:id},{isReceived:1}).exec(function(err,messageUpdate){
      if(err || !messageUpdate){
        sails.log.info("---ERROR---mobileUpdateMessage----messageUpdate----");
        return res.json(ResponseUtil.addErrorMessage());
      }

      return res.json(ResponseUtil.addSuccessMessage());
    });

  },

  /**
   * 消息列表接口
   * @param userId
   * @param page
   * @param res
   */
  mobileMessageList:function (userId,page,res){

    if(!userId || !page){
      sails.log.info('---ERROR---mobileMessageList----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var pageNumber = sails.config.PAGE * (page-1);
    Message.find({user:userId,isReceived:0}).limit(sails.config.PAGE).skip(pageNumber).sort("createdAt DESC").exec(function(err,messagesFind){
      if(err || !messagesFind){
        sails.log.info('---ERROR---mobileMessageList----message find-----');
        return res.json(ResponseUtil.addParamNotRight());
      }

      var responseDate = ResponseUtil.addSuccessMessage();
      responseDate.messages = messagesFind;
      return res.json(responseDate);
    });
  },

  /**
   * It's for test json string save!
   * @param req
   * @param res
   */
  saveMessage:function(req,res){

    var content = {
      head:'It is Just a test!',
      body:'test message',
      end:'hello world'
    };
    var jsonContent = JSON.stringify(content);
    sails.log.info(typeof content);
    sails.log.info(typeof jsonContent);
    var message = {content:jsonContent,type:0,jumpId:1,user:1,isReceived:0};

    Message.create(message).exec(function(err,messageCreate){

      if(err||!messageCreate){
        sails.log.info('message error!');
        return res.json(ResponseUtil.addErrorMessage());
      }

      sails.log.info(messageCreate);
      sails.log.info(typeof messageCreate.content);

      return res.json(JSON.parse(messageCreate.content));
    })
  },



}
