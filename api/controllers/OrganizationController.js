/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing Organizations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  mobileUpdateOrganization: function (req, res) {
    var id = req.param("id");
    var establishTime = req.param("establishTime");
    var companyLocation = req.param("companyLocation");
    var staffCounter = req.param("staffCounter");
    var largestHolder = req.param("largestHolder");
    var capital = req.param("capital");
    var totalAsset = req.param("totalAsset");
    var companyType = req.param("companyType")
    OrganizationService.mobileUpdateOrganization(id, establishTime, companyLocation,
      staffCounter, largestHolder, capital, totalAsset, companyType, res);
  },
  mobileUpdateProduct:function(req,res) {
    var id = req.param('id');
    var industryType = req.param('industryType');
    var coverArea = req.param('coverArea');
    var productPutInYear = req.param('productPutInYear');
    var operationSpeed = req.param('operationCycle');
    var putOnScale = req.param('putOnScale');
    var annualRate = req.param('annualRate');

    OrganizationService.mobileUpdateProduct(id, industryType, coverArea, productPutInYear, operationSpeed, putOnScale,
      annualRate, res);
  },

};

