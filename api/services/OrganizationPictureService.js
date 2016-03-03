var ResponseUtil=require('../util/ResponseUtil.js');
var Promise=require('bluebird');
var FileUtil = require('../util/FileUtil.js');
var path = require('path');

module.exports = {

  /**
   * 修改个人资料之机构图片接口
   * @param req
   * @param res
   * @returns {*}
   */
  mobileUpdateOrgImage:function(req,res){

    var id = req.param("organizationId");
    var type = req.param("category");

    var pathSep = path.sep;

    if(!id || !type){
      sails.log.info('------Error-----mobileAddOrgImage----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var dirName = sails.config.IMAGE_FOLD_PATH + sails.config.ORGANIZATION_IMAGE_PATH + pathSep + id + pathSep;

    Organization.findOne({id:id}).exec(function(err,OrganizationFind){

      if(err || !OrganizationFind){
        sails.log.info('---organizationPictureServices-----mobileUpdateOrgImage----Error----OrganizationFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      req.file('imageFile').upload({
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
        var imagePath = sails.config.ORGANIZATION_IMAGE_PATH + pathSep + id + pathSep + imageArr[imageArr.length - 1];

        sails.log.info('-----headIamgePath----',imagePath);

        OrganizationPicture.findOne({organization:id,category:type}).exec(function(err,organizationPictureFind){

          if(err){
            sails.log.error(err);
            return res.json(ResponseUtil.addErrorMessage());
          }

          var responseData = ResponseUtil.addSuccessMessage();
          if(organizationPictureFind){
            return OrganizationPicture.update({ id:organizationPictureFind.id}, {pictureURL : imagePath }).exec(function (err,organizationPictureUpdate){

              sails.log.info("organizationPictureUpdate---",organizationPictureUpdate);

              if(err || !organizationPictureUpdate || organizationPictureUpdate.length === 0){
                sails.log.info('---organizationPictureServices-----mobileUpdateOrgImage----Error----organizationPictureUpdate---');
                return res.json(ResponseUtil.addErrorMessage());
              }

              responseData.organizationPicture = {};
              responseData.organizationPicture.id = organizationPictureUpdate[0].id;
              responseData.organizationPicture.category = organizationPictureUpdate[0].category;
              responseData.organizationPicture.pictureURL = sails.config.IMAGE_HOST + organizationPictureUpdate[0].pictureURL;

              if(organizationPictureFind.pictureURL){
                FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + organizationPictureFind.pictureURL,'delete old organization picture success!')
              }

              return res.json(responseData);
            });
          } else {
            return OrganizationPicture.create({ organization:id , category : type, pictureURL : imagePath }).exec(function (err , organizationPicturecreate){

                if(err || !organizationPicturecreate){
                  sails.log.info('---organizationPictureServices-----mobileUpdateOrgImage----Error----organizationPictureUpdate---');
                  return res.json(ResponseUtil.addErrorMessage());
                }

                responseData.organizationPicture = {};
                responseData.organizationPicture.id = organizationPicturecreate.id;
                responseData.organizationPicture.category = organizationPicturecreate.category;
                responseData.organizationPicture.pictureURL = sails.config.IMAGE_HOST + organizationPicturecreate.pictureURL;
                return res.json(responseData);
              });
          }
        });
      });
    });
  },

  /**
   * 删除机构图片接口
   * @param id
   * @param res
   */
  mobileDeleteOrgImage: function(id,res){
    if(!id){
      sails.log.info('------Error-----mobileAddOrgImage----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    OrganizationPicture.destroy({id:id}).exec(function(err){

      if(err){
        sails.log.error(err);
        return res.json(ResponseUtil.addErrorMessage());
      }
      sails.log.info('delete organization picture success , id = ',id);
      return res.json(ResponseUtil.addSuccessMessage());
    });
  }
}
