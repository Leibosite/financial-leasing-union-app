/**
 * Created by leibosite on 2016/1/13.
 */

var ResponseUtil=require('../util/ResponseUtil.js');
var Promise=require('bluebird');
var FileUtil = require('../util/FileUtil.js');
var path = require('path');

module.exports = {
  /**
   * 修改机构简介接口
   * @param id
   * @param establishTime
   * @param companyLocation
   * @param staffCounter
   * @param largestHolder
   * @param capital
   * @param totalAsset
   * @param res
   */
  mobileUpdateOrganization:function(id,establishTime,companyLocation,
                                    staffCounter,largestHolder,capital,totalAsset,companyType,res){
    if (!id) {
      sails.log.info("----mobileUpdateOrganization----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }

    Organization.update({id: id}, {companyType:companyType || '',establishTime:establishTime || 0,companyLocation:companyLocation || '',staffCounter:staffCounter || 0,
      largestHolder:largestHolder || '',capital:capital || 0,totalAsset:totalAsset || 0}).exec(function (err, OrganizationUpdate) {

      if (err || !OrganizationUpdate) {
        sails.log.info(err);
        sails.log.info("----mobileUpdateOrganization----OrganizationUpdate---update-----error");
        return res.json(ResponseUtil.addErrorMessage());
      }

      return res.json(ResponseUtil.addSuccessMessage());
    });
  },
  /**
   * 修改个人资料 产品简介接口
   * @param id
   * @param industryType
   * @param coverArea
   * @param productPutInYear
   * @param operationSpeed
   * @param putOnScale
   * @param annualRate
   * @param res
   */
  mobileUpdateProduct:function(id,industryType,coverArea,productPutInYear, operationSpeed,putOnScale,annualRate,res){

    if(!id){
      sails.log.info('---userService-----mobileUpdateProduct----Error----param---');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Organization.update({id: id},{coverArea:coverArea || '',productPutInYear:productPutInYear || '',
      operationCycle:operationSpeed || '',industryType:industryType || '',putOnScale:putOnScale || '',annualRate:annualRate || ''}).exec(function (err, OrganizationUpdate){

      if(err||!OrganizationUpdate) {
        sails.log.info("----mobileUpdateProduct----update----error");
        return res.json(ResponseUtil.addErrorMessage());
      }
      return res.json(ResponseUtil.addSuccessMessage());

    });
  },

}
