/**
 * ProjectPictureController
 *
 * @description :: Server-side logic for managing Projectpictures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  mobileUpdateProjectImage: function(req,res){
    ProjectPictureService.mobileUpdateProjectImage(req,res);
  }
};

