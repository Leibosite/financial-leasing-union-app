/**
 * created by leibosite at 2015/9/25
 */
var ResponseUtil=require('../util/ResponseUtil.js');
var Promise=require('bluebird');
var bcrypt=require('bcryptjs');
var FileUtil = require('../util/FileUtil.js');
var path = require('path');
var UtilTools = require('../util/UtilTools.js');

module.exports={
  /**
   * 用户注册接口
   * @param mobile
   * @param password
   * @param res
   * @returns {*}
   */
  mobileRegist:function(mobile,password,res) {

    if(!mobile || !password) {
      sails.log.info("----mobileRegist----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }

    User.findOne({phoneNumber:mobile}).exec(function(err,user) {

      if(err) {
       sails.log.info("----mobileRegist----query----error");
       return res.json(ResponseUtil.addErrorMessage());
      }
      if(user) {
        sails.log.info("----mobileRegist----AccountAlreadyExit");
        var responseDate = ResponseUtil.addAccountAlreadyExit();
        responseDate.user = {};
        responseDate.user.id = user.id;
        responseDate.user.token = user.token;
        responseDate.user.phoneNumber = user.phoneNumber;
        responseDate.user.isStealth = user.isStealth;
        responseDate.user.uuid = user.uuid;
        return res.json(responseDate);
      }

      var token = UtilTools.__getMd5HexEncode(mobile);

      bcrypt.hash(password,8,function(err,passwordResult){

        if(err || !passwordResult){
          sails.log.error(err);
          return res.json(ResponseUtil.addErrorMessage());
        }

        Organization.create().exec(function(err,organizationCraete){

          if(err || !organizationCraete){
            sails.log.info("----mobileRegist----organizationCraete----error");
            return res.json(ResponseUtil.addErrorMessage());
          }

          //sails.log.info("moblie: ",mobile,' password ',passwordResult);
          User.create({phoneNumber:mobile,passWord:passwordResult,token:token,organization:organizationCraete.id}).exec(function(err,userCreate) {
            //sails.log.info('userCreate ',userCreate);
            if(err || !userCreate){
              sails.log.info("----mobileRegist----createNewUser----error");
              return res.json(ResponseUtil.addErrorMessage());
            }

            Organization.update({id:organizationCraete.id},{user:userCreate.id}).exec(function(err,organizationUpdate){
              if(err || !organizationUpdate){
                sails.log.info("----mobileRegist----organizationUpdate----error");
                return res.json(ResponseUtil.addErrorMessage());
              }

              var responseData = ResponseUtil.addSuccessMessage();
              responseData.user = {};
              responseData.user.id = userCreate.id;
              responseData.user.phoneNumber = userCreate.phoneNumber;
              responseData.user.isStealth = userCreate.isStealth;
              responseData.user.token = userCreate.token;
              responseData.user.uuid = userCreate.uuid;

              return res.json(responseData);
            });

          });
        });
      });
    });
  },
  /**
   * 用户登录接口
   * @param mobile
   * @param password
   * @param res
   * @returns {*}
   */
  mobileLogin:function(mobile,password,res){
    if(!mobile || !password) {
      sails.log.info("----mobileLogin----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    User.findOne({phoneNumber:mobile}).exec(function(err,user){
      if(err){
        sails.log.info("----mobileLogin----query----error");
        return res.json(ResponseUtil.addErrorMessage());
      }
      if(!user) {
        sails.log.info("----mobileLogin----AccountNotExit----error");
        return res.json(ResponseUtil.addAccountNotExit());
      }
      else{
        bcrypt.compare(password,user.passWord, function (err,result) {
          if(err){
            sails.log.info("----mobileLogin----passwordCanNotcompare----error");
            return res.json(ResponseUtil.addErrorMessage());
          }
          if(result==false){
            sails.log.info("----mobileLogin----passwordNotCompare----error");
            return res.json(ResponseUtil.addLoginPasswordError());
          }
          var responseMessage=ResponseUtil.addSuccessMessage();
          responseMessage.user={};
          responseMessage.user.id=user.id;
          responseMessage.user.phoneNumber=user.phoneNumber;
          responseMessage.user.isStealth=user.isStealth;
          responseMessage.user.token = user.token;
          responseMessage.user.uuid = user.uuid;
          return res.json(responseMessage);
        });
      }
    });
  },
  /**
   * 找回密码接口
   * @param mobile
   * @param password
   * @param res
   */
  mobileForgetPassword:function(mobile,password,res) {
    if (!mobile || !password) {
      sails.log.info("----mobileForgetPassword----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    User.findOne({phoneNumber: mobile}).exec(function (err, user) {
      if (err) {
        sails.log.info("----mobileForgetPassword----query----error");
        return res.json(ResponseUtil.addErrorMessage());
      }
      if (!user) {
        sails.log.info("----mobileForgetPassword----phoneNotExist----error");
        return res.json(ResponseUtil.addAccountNotExit());
      }
      bcrypt.hash(password, 8, function (err, passwordResult) {
        if (err || !passwordResult) {
          sails.log.error(err);
          sails.log.info("----mobileForgetPassword---error----");
          return res.json(ResponseUtil.addErrorMessage());
        }
        User.update({phoneNumber: mobile}, {passWord: passwordResult}).exec(function (err, user) {
          if (err || !user) {
            sails.log.error(err);
            sails.log.info("----mobileForgetPassword---update-----error----");
            return res.json(ResponseUtil.addErrorMessage());
          }
          return res.json(ResponseUtil.addSuccessMessage());
        });
      });
    });
  },
  /**
   * 填写（修改）个人资料之个人基本信息接口
   * @param req
   * @param res
   */
  mobileUpdateUserInfo:function(req,res){

    var id = req.param("id");
    var realName = req.param("realName");
    var organization = req.param("organizationName");
    var position=req.param("position");
    var worklife=req.param("workLife");

    var pathSep = path.sep;

    var dirName = sails.config.IMAGE_FOLD_PATH + sails.config.USER_IMAGE_PATH + pathSep + id + pathSep;


    User.findOne({id:id}).exec(function(err,userFind){

      if(err || !userFind){
        sails.log.info("-----userService-----mobileFillInPersonalInfo----",err || !userFind);
        return res.json(ResponseUtil.addErrorMessage());
      }


      req.file('headImage').upload({
        maxBytes:sails.config.IMAGE_UPLOAD_MAX_BYTES,
        dirname:dirName
      },function(err,headImage){

        if(err){
          sails.log.error(err.message);
          return res.json(ResponseUtil.addErrorMessage());
        }

        //如果上传的图片为空
        if(!headImage || headImage.length !== 1){
          sails.log.info('-------headImage------is-------NULL-----');
          return Organization.update({id:userFind.organization},{name:organization}).exec(function(err,organizationUpdate){

            if(!organizationUpdate){
              return res.json(ResponseUtil.addErrorMessage());
            }
            User.update({id: id}, {realName: realName,
              position:position,workLife:worklife}).exec(function (err, userUpdate) {
              if(err || !userUpdate) {
                sails.log.error(err);
                sails.log.info("----mobileFillInPersonalInfo---update-----error----");
                return res.json(ResponseUtil.addErrorMessage());
              }
              var responseMessage=ResponseUtil.addSuccessMessage();
              return res.json(responseMessage);
            });
          });
          //return res.json(ResponseUtil.addErrorMessage());
        }

        var headImageFileName = headImage[0].fd;
        var headImageArr = headImageFileName.split(pathSep);
        var headImagePath = sails.config.USER_IMAGE_PATH + pathSep + id + pathSep + headImageArr[headImageArr.length - 1];

        sails.log.info('-----headIamgePath----',headImagePath);

        Organization.update({id:userFind.organization},{name:organization}).exec(function(err,organizationUpdate){

          if(!organizationUpdate){
            return res.json(ResponseUtil.addErrorMessage());
          }

          User.update({id: id}, {realName: realName, position:position,workLife:worklife,headImage:headImagePath}).exec(function (err, userUpdate) {

            if(err || !userUpdate) {
              sails.log.error(err);
              sails.log.info("----mobileFillInPersonalInfo---update-----error----");
              return res.json(ResponseUtil.addErrorMessage());
            }
            /*if(userFind.headImage){
              FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.headImage,'delete old headImage picture success!')
            }*/
            var responseMessage=ResponseUtil.addSuccessMessage();
            return res.json(responseMessage);
          });
        });
      });
    });
  },
  /**
   * 获取个人概要信息接口
   * @param id
   * @param res
   */
  mobileGetSummaryInfo:function(id,res){
    if (!id) {
      sails.log.info("----mobileGetSummaryInfo----param----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    User.findOne({id: id}).populate("organization").exec(function (err, user) {
      if(err){
        sails.log.info("----mobileGetSummaryInfo----query----error");
      }
      var responseMessage = ResponseUtil.addSuccessMessage();
      responseMessage.user = {};
      responseMessage.user.id = user.id;
      responseMessage.user.realName = user.realName;
      if(user.organization){
        responseMessage.user.organizationName = user.organization.name;
      }else{
        responseMessage.user.organizationName = '';
      }

      responseMessage.user.position = user.position;
      responseMessage.user.isStealth = user.isStealth;
      responseMessage.user.workLife = user.workLife;
      responseMessage.user.headImage = sails.config.IMAGE_HOST + user.headImage;

      return res.json(responseMessage);
    });
  },
  /**
   * 获取详细信息接口
   * @param id
   * @param res
   */
  mobileGetDetailInfo:function(id,res) {
    if (!id) {
      sails.log.info("----mobileGetDetailInfo----param----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    User.findOne({id: id}).exec(function (err,userFind) {

      if (!userFind) {
        sails.log.info('----mobileGetDetailInfo---userFind----error----');
        return res.json(ResponseUtil.addUserNotFoundById());
      }

      delete userFind.uuid;
      delete userFind.token;
      delete userFind.passWord;
      delete userFind.userName;
      delete userFind.isStealth;
      delete userFind.longitude;
      delete userFind.latitude;
      delete userFind.updatedLocationAt;
      delete userFind.createdAt;
      delete userFind.updatedAt;

      var responseData = ResponseUtil.addSuccessMessage();
      responseData.user = userFind;
      responseData.user.headImage = sails.config.IMAGE_HOST + userFind.headImage;

      //sails.log.info('organization----',responseData);
      Organization.findOne({id:userFind.organization}).exec(function(err,organizationFind){

        if(err || !organizationFind){
          sails.log.info('---mobileGetDetailInfo---organizationFind----error----');
          responseData.user.organization = {};
          responseData.user.organization.organizationPictures = [];
          return res.json(responseData);
        }

        delete organizationFind.user;
        delete organizationFind.craetedAt;
        delete organizationFind.updatedAt;
        delete userFind.uuid;

        responseData.user.organization = organizationFind;

        OrganizationPicture.find({organization:organizationFind.id}).exec(function(err,organzationPicturesFind){

          if(err || !organzationPicturesFind){
            return res.json(ResponseUtil.addErrorMessage());
          }
          if(organzationPicturesFind.length !== 0){

            for(var i in organzationPicturesFind){
              var organizationPicture = organzationPicturesFind[i];
              organizationPicture.pictureURL = sails.config.IMAGE_HOST + organizationPicture.pictureURL;
              delete organizationPicture.uuid;
              delete organizationPicture.createdAt;
              delete organizationPicture.updatedAt;
              delete organizationPicture.organization;
            }

            responseData.user.organization.organizationPictures = organzationPicturesFind;
            return res.json(responseData);
          }
          else{
            responseData.user.organization.organizationPictures = organzationPicturesFind;
            return res.json(responseData);
          }
        });
      });
    });
  },
  /**
   * 更改个人资料接口||接口废除
   * @param res
   */
  mobileUpdateInfo:function(req,res){

    var id = req.param("id");
    var realName = req.param("realName");
    var organization = req.param("organization");
    var position=req.param("position");
    var worklife=req.param("worklife");

    var pathSep = path.sep;

    if (!id || !realName||!organization||!position||!worklife) {
      sails.log.info("----mobileFillInPersonalInfo----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }

    var dirName = sails.config.IMAGE_FOLD_PATH + sails.config.USER_IMAGE_PATH + pathSep + id + pathSep;

    if(!FileUtil.mkdirsSync(dirName,777)){
      sails.log.info('-----userService-----mobileFillInPersonalInfo----mkdir-----error');
      return res.json(ResponseUtil.addErrorMessage());
    }

    User.findOne({id:id}).exec(function(err,userFind){

      if(err || !userFind){
        sails.log.info('---userService-----mobileFillInPersonalInfo----Error----userFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }


      req.file('headImage').upload({
        maxBytes:sails.config.IMAGE_UPLOAD_MAX_BYTES,
        dirname:dirName
      },function(err,headImage){

        if(err){
          sails.log.error(err.message);
          return res.json(ResponseUtil.addErrorMessage());
        }

        if(!headImage || headImage.length !== 1){
          sails.log.info('-------headImage------is-------NULL-----');
          return res.json(ResponseUtil.addErrorMessage());
        }


        var headImageFileName = headImage[0].fd;
        var headImageArr = headImageFileName.split(pathSep);
        var headImagePath = sails.config.USER_IMAGE_PATH + pathSep + id + pathSep + headImageArr[headImageArr.length - 1];

        sails.log.info('-----headIamgePath----',headImagePath);

        User.update({id: id}, {realName: realName,
          position:position,worklife:worklife,headImage:headImagePath}).exec(function (err, userResult) {
          if(err) {
            sails.log.error(err);
            sails.log.info("----mobileFillInPersonalInfo---update-----error----");
            return res.json(ResponseUtil.addErrorMessage());
          }

          Organization.update({id:userResult.organization},{name:organization}).exec(function(err,organizationUpdate){

            var responseMessage=ResponseUtil.addSuccessMessage();
            if(userFind.headImage){
              FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.headImage,'delete old headImage success!');
            }
            return res.json(responseMessage);
          });
        });
      });
    });
  },
  /**
   * 更改状态接口
   * @param id
   * @param isStealth
   * @param res
   */
  mobileUpdateStealth:function(id,isStealth,res){

    if (!id || !isStealth) {
      sails.log.info("----mobileUpdateStealth----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }

    User.update({id: id}, {isStealth: isStealth}).exec(function(err,user)
    {
      if(err||!user){
        sails.log.info("----mobileUpdateStealth----update----error");
        return res.json(ResponseUtil.addParamNotRight());
      }
      return res.json(ResponseUtil.addSuccessMessage());
    })
  },
  /**
   * 修改登录密码接口
   * @param id
   * @param password
   * @param new_password
   * @param res
   */
  mobileUpdatePassword:function(id,password,new_password,res){
    if (!id || !password || !new_password ) {
      sails.log.info("----mobileUpdatePassword----param----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    User.findOne({id:id}).exec(function(err,user){
      if(err||!user){
        sails.log.info("----mobileUpdatePassword----findUser----error");
        return res.json(ResponseUtil.addErrorMessage());
      }
      bcrypt.compare(password,user.passWord, function (err,result) {
        if(err){
          sails.log.info("----mobileLogin----passwordNotCompare----compare----error");
          return res.json(ResponseUtil.addErrorMessage());
        }
        if(result==false){
          sails.log.info("----mobileLogin----passwordNotCompare---compare-----error");
          return res.json(ResponseUtil.addUpdatePasswordError());
        }
        bcrypt.hash(new_password, 8, function (err, passwordResult) {
          if (err || !passwordResult) {
            sails.log.info("----mobileLogin----passwordNotCompare---SecretPasssword-----error");
            return res.json(ResponseUtil.addErrorMessage());
          }
          User.update({id: id}, {passWord: passwordResult}).exec(function (err, user){
            if(err||!user){
              sails.log.info("----mobileLogin----passwordNotCompare---update-----error");
              return res.json(ResponseUtil.addErrorMessage());
            }
            return res.json(ResponseUtil.addSuccessMessage());
          });
        });
      });
    })
  },

  /**
   * 更新个人位置接口
   * @param id
   * @param longitude
   * @param latitude
   * @param res
   */
  mobileUpdateLocation:function(id,longitude,latitude,res) {
    if (!id || !latitude||!longitude) {
      sails.log.info("----mobileUpdateLocation----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    User.update({id: id}, {longitude:longitude,latitude:latitude}).exec(function(err,user) {
      if (err || !user) {
        sails.log.info("----mobileUpdateLocation----update---update-----error");
        return res.json(ResponseUtil.addErrorMessage());
      }
      return res.json(ResponseUtil.addSuccessMessage());
    });
  },
  /**
   *  个人身份选择接口
   * @param id
   * @param identify
   * @param res
   */
  mobileUpdateIdentity:function(id,identify,res){
    if (!id || !identify) {
      sails.log.info("----mobileUpdatePassword----param----error");
      return res.json(ResponseUtil.addParamNotRight());
    }

    User.findOne({id:id}).exec(function(err,userFind){

      if(err || !userFind){
        sails.log.info('-----err-----mobileUpdateIdentity-----userfindOne------');
        return res.json(ResponseUtil.addErrorMessage());
      }

      User.update({id:id},{identity:identify}).exec(function(err,userUpdate){

        if(err || !userUpdate){
          sails.log.info('-----err-----mobileUpdateIdentity-----userUpdate------');
          return res.json(ResponseUtil.addErrorMessage());
        }
        return res.json(ResponseUtil.addSuccessMessage());
      });
    });
  },

  /**
   * 添加个人资料 机构图片接口
   * @param req
   * @param res
   * @returns {*}
   */
  mobileAddOrgImage:function(req,res){

    var id = req.param("id");
    var type = req.param("type");

    var pathSep = path.sep;

    if(!id || !type){
      sails.log.info('------Error-----mobileAddOrgImage----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var dirName = sails.config.IMAGE_FOLD_PATH + sails.config.USER_IMAGE_PATH + pathSep + id + pathSep;

    User.findOne({id:id}).exec(function(err,userFind){

      if(err || !userFind){
        sails.log.info('---userService-----mobileFillInPersonalInfo----Error----userFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      req.file('image').upload({
        maxBytes:sails.config.IMAGE_UPLOAD_MAX_BYTES,
        dirname:dirName
      },function(err,image){

        if(err){
          sails.log.error(err.message);
          return res.json(ResponseUtil.addErrorMessage());
        }

        if(!image || image.length !== 1){
          sails.log.info('-------image------is-------NULL-----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        var imageFileName = image[0].fd;
        var imageArr = imageFileName.split(pathSep);
        var imagePath = sails.config.USER_IMAGE_PATH + pathSep + id + pathSep + imageArr[imageArr.length - 1];

        sails.log.info('-----headIamgePath----',imagePath);

        var updateObject = {};

        if(type == 1){
          updateObject.orgImageOne = imagePath;

          if(userFind.orgImageOne !==''){
            FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.orgImageOne,'delete old headImage success!');
          }
        } else if(type == 2){
          updateObject.orgImageTwo = imagePath;

          if(userFind.orgImageTwo){
            FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.orgImageTwo,'delete old headImage success!');
          }
        } else if(type == 3){
          updateObject.orgImageThree = imagePath;

          if(userFind.orgImageThree){
            FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.orgImageThree,'delete old headImage success!');
          }
        }
        User.update({id: id}, updateObject).exec(function (err, userResult) {
          if(err || !userResult) {
            sails.log.error(err);
            sails.log.info("----mobileFillInPersonalInfo---update-----error----");
            return res.json(ResponseUtil.addErrorMessage());
          }
          return res.json(ResponseUtil.addSuccessMessage());
        });
      });
    });
  },

  /**
   * 删除个人资料 机构图片接口
   * @param id
   * @param type
   * @param res
   * @returns {*|callback|Array|{index: number, input: string}}
   */
  mobileDeleteOrgImage: function(id,type,res){

    if(!id || !type){
      sails.log.info('------Error-----mobileAddOrgImage----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    return User.findOne({id:id}).exec(function(err,userFind) {

      if (err || !userFind) {
        sails.log.info('---userService-----mobileFillInPersonalInfo----Error----userFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      var updateObject = {};
      if(type == 1){
        updateObject.orgImageOne = "";
        if(userFind.orgImageOne !==''){
          FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.orgImageOne,'delete old headImage success!')
        }
      } else if(type == 2){
        updateObject.orgImageTwo = "";
        if(userFind.orgImageTwo){
          FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.orgImageTwo,'delete old headImage success!')
        }
      } else if(type == 3){
        updateObject.orgImageThree = "";
        if(userFind.orgImageThree){
         FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + userFind.orgImageThree,'delete old headImage success!')
        }
      }

      User.update({id: id}, updateObject).exec(function (err, userResult) {

        if(err || !userResult) {
          sails.log.error(err);
          sails.log.info("----mobileFillInPersonalInfo---update-----error----");
          return res.json(ResponseUtil.addErrorMessage());
        }
        return res.json(ResponseUtil.addSuccessMessage());
      });
    });
  },

  /**
   * 获取关注者详细信息接口
   * @param userId
   * @param projectId
   * @param res
   */
  mobileGetFollowerDetail: function (userId, projectId, res) {

    UserProject.findOne({user: userId, project: projectId}).exec(function (err, userProjectFind) {

      if (!userProjectFind || err) {
        sails.log.info("------Error-----mobileGetFollowerDetail-----userProjectFind---");
        return res.json(ResponseUtil.addErrorMessage());
      }

      User.findOne({id: userId}).exec(function (err, userFind) {

        if (err || !userFind) {
          sails.log.info("------Error-----mobileGetFollowerDetail-----userFind---");
          return res.json(ResponseUtil.addErrorMessage());
        }
        //sails.log.info("user: ",userFind);
        for (var i in userFind) {
          var attr = i.toString();
          if (attr === "userName" || attr === "uuid" || attr === "createdAt" || attr === "updatedAt" || attr === "passWord" || attr === "token") {
            delete userFind[i];
          }
          if(attr === "headImage"){
            userFind.headImage = sails.config.IMAGE_HOST + userFind[i];
          }
        }
        var responseData = ResponseUtil.addSuccessMessage();

        responseData.user = userFind;

        Organization.findOne({user: userId}).exec(function (err, organizationFind) {

          if (!organizationFind || err) {
            sails.log.info("------Error-----mobileGetFollowerDetail-----organizationFind---");
            return res.json(ResponseUtil.addErrorMessage());
          }
          for (var j in organizationFind) {
            var attr = j.toString();
            if (attr === "uuid" || attr === "createdAt" || attr === "updatedAt") {
              delete organizationFind[j];
            }
          }

          responseData.user.organization = organizationFind;

          OrganizationPicture.find({organization: organizationFind.id}).exec(function (err, organizationPicturesFind) {

            if (err || !organizationPicturesFind) {
              sails.log.info("------Error-----mobileGetFollowerDetail-----organizationPicturesFind---");
              sails.log.error(err.message);
              return res.json(ResponseUtil.addErrorMessage());
            }
            if (organizationPicturesFind.length !== 0) {

              for (var i in organizationPicturesFind) {
                var organizationPicture = organizationPicturesFind[i];
                organizationPicture.pictureURL = sails.config.IMAGE_HOST + organizationPicture.pictureURL;
                delete organizationPicture.uuid;
                delete organizationPicture.createdAt;
                delete organizationPicture.updatedAt;
                delete organizationPicture.organization;
              }
            }

            responseData.user.organization.organizationPictures = organizationPicturesFind;

            if (userProjectFind.isRead === 0) {
              UserProject.update({id: userProjectFind.id}, {isRead: 1}).exec(function (err, userProjectUpdate) {
                if (err || !userProjectUpdate) {
                  sails.log.error(err.message);
                  return res.json(ResponseUtil.addErrorMessage());
                }
                return res.json(responseData);
              });
            }

            return res.json(responseData);
          });
        });
      });
    });
  },

  /**
   * 地图初始化接口
   * @param req
   * @param res
   */
  mobileInitMap:function(req,res){

    User.find().then(function(usersFind){
      var users = [];
      var responseDate = ResponseUtil.addSuccessMessage();
      return Promise.map(usersFind,function(user){
        users.push({
          id:user.id,
          longitude:user.longitude,
          latitude:user.latitude
        });
      }).then(function(){
        responseDate.users = users;
        return res.json(responseDate);
      });
    }).catch(function(err){
      if(err){
        sails.log.error("------mobileInitMap----error-----");
        return res.json(ResponseUtil.addErrorMessage());
      }
    });
  }
}
