/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
module.exports = {

  mobileRegist: function (req, res) {
    var mobile = req.param("phoneNumber");
    var password = req.param("password");
    UserService.mobileRegist(mobile, password, res);
  },
  mobileLogin: function (req, res) {
    var mobile = req.param("phoneNumber");
    var password = req.param("password");
    UserService.mobileLogin(mobile, password, res);
  },
  mobileForgetPassword: function (req, res) {
    var mobile = req.param("phoneNumber");
    var password = req.param("password");
    UserService.mobileForgetPassword(mobile, password, res);
  },
  mobileUpdateUserInfo: function (req, res) {
    UserService.mobileUpdateUserInfo(req, res);
  },
  mobileGetSummaryInfo: function (req, res) {
    var id = req.param("id");
    UserService.mobileGetSummaryInfo(id, res);
  },
  mobileGetDetailInfo: function (req, res) {
    var id = req.param("id");
    UserService.mobileGetDetailInfo(id, res);
  },
  //mobileUpdateInfo: function (req, res) {
  //    UserService.mobileUpdateInfo(req, res);
  //},
  mobileUpdatePassword: function (req, res) {
    var id = req.param("id");
    var password = req.param("password");
    var new_password = req.param("new_password");
    UserService.mobileUpdatePassword(id, password, new_password, res);
  },
  mobileUpdateStealth: function (req, res) {
    var id = req.param("id");
    var isStealth = req.param("isStealth");
    UserService.mobileUpdateStealth(id, isStealth, res);
  },
  mobileUpdateLocation: function (req, res) {
    var id = req.param('id');
    var longitude = req.param('longitude');
    var latitude = req.param('latitude');
    UserService.mobileUpdateLocation(id, longitude, latitude, res);
  },
  mobileUpdateIdentity: function (req, res) {
    var id = req.param('id');
    var identify = req.param('identify');
    UserService.mobileUpdateIdentity(id, identify, res);
  },
  mobileAddOrgImage: function (req, res) {
    ProjectService.mobileAddOrgImage(req, res);
  },

  mobileDeleteOrgImage: function (req, res) {
    var id = req.param('id');
    var type = req.param('type');
    UserService.mobileDeleteOrgImage(id, type, res);
  },
  mobileGetFollowerDetail: function (req, res) {
    var userId = req.param('userId');
    var projectId = req.param('projectId');
    UserService.mobileGetFollowerDetail(userId, projectId, res);
  },
  mobileInitMap: function (req, res) {
    UserService.mobileInitMap(req, res);
  }
}

