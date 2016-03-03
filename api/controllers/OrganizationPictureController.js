/**
 * OrganizationPictureController
 *
 * @description :: Server-side logic for managing Organizationpictures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  mobileUpdateOrgImage: function(req,res){
    OrganizationPictureService.mobileUpdateOrgImage(req,res);
  },
  mobileDeleteOrgImage: function(req,res){
    var id = req.param('id');
    OrganizationPictureService.mobileDeleteOrgImage(id,res);
  }
};

