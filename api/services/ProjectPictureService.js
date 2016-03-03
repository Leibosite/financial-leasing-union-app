/**
 * Created by leibosite on 2016/1/15.
 */
var ResponseUtil=require('../util/ResponseUtil.js');
var Promise=require('bluebird');
var FileUtil = require('../util/FileUtil.js');
var path = require('path');
var ProjectIntergrityUtil = require('../util/ProjectIntergrityUtil.js');

module.exports = {
  /**
   * 上传项目 机构图片接口
   * @param req
   * @param res
   */
  mobileUpdateProjectImage: function(req,res){

    var projectId = req.param('projectId');
    var type = req.param('category');

    var pathSep = path.sep;

    if(!type || !projectId){
      sails.log.info('------Error-----mobileAddOrgImage----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var dirName = sails.config.IMAGE_FOLD_PATH + sails.config.PROJECT_IMAGE_PATH + pathSep + projectId + pathSep;

    Project.findOne({id:projectId}).exec(function(err,projectFind) {

      if (err || !projectFind) {
        sails.log.info('---ProjectService-----mobileAddOrgImage----Error----projectFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      req.file('imageFile').upload({
        maxBytes: sails.config.IMAGE_UPLOAD_MAX_BYTES,
        dirname: dirName
      }, function (err, image) {

        if (!image || image.length !== 1) {
          sails.log.info('-------image------is-------NULL-----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        var imageFileName = image[0].fd;
        var imageArr = imageFileName.split(pathSep);
        var imagePath = sails.config.PROJECT_IMAGE_PATH + pathSep + projectId + pathSep + imageArr[imageArr.length - 1];

        sails.log.info('-----iamgePath----', imagePath);

        var counterProject = ProjectIntergrityUtil.__counterIntegrity(projectFind);
        ProjectPicture.findOne({project: projectId, category: type}).exec(function (err, ProjectPictureFind) {

          if (err) {
            sails.log.error(err);
            return res.json(ResponseUtil.addErrorMessage());
          }

          var responseData = ResponseUtil.addSuccessMessage();


          if (ProjectPictureFind) {

            return ProjectPicture.update({id: ProjectPictureFind.id}, {pictureURL: imagePath}).exec(function (err, ProjectPictureUpdate) {

              ProjectPicture.count({project:projectFind.id}).exec(function(err,projectPictureCounter) {

                //算出项目完整度
                var intergrity = counterProject + projectPictureCounter * sails.config.PROJECT_PICTURE_VALUE;
                sails.log.info("ProjectPictureUpdate---", ProjectPictureUpdate);

                if (err || !ProjectPictureUpdate || ProjectPictureUpdate.length === 0) {
                  sails.log.info('---ProjectPictureServices-----mobileUpdateOrgImage----Error----ProjectPictureUpdate---');
                  return res.json(ResponseUtil.addErrorMessage());
                }

                Project.update({id: projectFind.id}, {integrity: intergrity}).exec(function (err, projectUpdate) {

                  if (err || !projectUpdate) {
                    sails.log.info(err.message);
                    return res.json(ResponseUtil.addErrorMessage());
                  }
                  responseData.projectPicture = {};
                  responseData.projectPicture.id = ProjectPictureUpdate[0].id;
                  responseData.projectPicture.category = ProjectPictureUpdate[0].category;
                  responseData.projectPicture.pictureURL = sails.config.IMAGE_HOST + ProjectPictureUpdate[0].pictureURL;

                  if (ProjectPictureFind.pictureURL) {
                    FileUtil.deleteFile(sails.config.IMAGE_FOLD_PATH + ProjectPictureFind.pictureURL, 'delete old project picture success!')
                  }
                  return res.json(responseData);
                });
              });
            });
          } else {
            return ProjectPicture.create({
              project: projectId,
              category: type,
              pictureURL: imagePath
            }).exec(function (err, projectPicturecreate) {

              if (err || !projectPicturecreate) {
                sails.log.info('---projectPictureServices-----mobileUpdateOrgImage----Error----projectPicturecreate---');
                return res.json(ResponseUtil.addErrorMessage());
              }

              //得到该项目图片有几张？
              ProjectPicture.count({project:projectFind.id}).exec(function(err,projectPictureCounter) {

                //算出项目完整度
                var intergrity = counterProject + projectPictureCounter * sails.config.PROJECT_PICTURE_VALUE;

                Project.update({id: projectFind.id}, {integrity: intergrity}).exec(function (err, projectUpdate) {

                  if (err || !projectUpdate) {
                    sails.log.info(err.message);
                    return res.json(ResponseUtil.addErrorMessage());
                  }
                  responseData.projectPicture = {};
                  responseData.projectPicture.id = projectPicturecreate.id;
                  responseData.projectPicture.category = projectPicturecreate.category;
                  responseData.projectPicture.pictureURL = sails.config.IMAGE_HOST + projectPicturecreate.pictureURL;
                  return res.json(responseData);
                });
              });
            });
          }
        });
      });
    });
  },

}
