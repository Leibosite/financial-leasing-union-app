/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  mobileCompleteContact: function (req, res) {
    var projectId = req.param('projectId');
    var userId = req.param('userId');
    var id = req.param('id');
    ProjectService.mobileCompleteContact(projectId, userId, id, res);
  },
  mobilePublishProject: function (req, res) {

    var id = req.param('userId');
    var companyName = req.param('companyName');
    var companyType = req.param('companyType');
    var industryType = req.param('industryType');
    var financingAmount = req.param('financingAmount');
    var companyAddress = req.param('companyAddress');
    var publisherType = req.param('publisherType');
    var testFloat = req.param('testFloat');

    ProjectService.mobilePublishProject(id, companyName, companyType, industryType, financingAmount,
      companyAddress, publisherType, testFloat, res);
  },
  mobileGetCompanyIndustryType: function (req, res) {
    ProjectService.mobileGetCompanyIndustryType(req, res);
  },
  mobileUpdateFinanceInfo: function (req, res) {
    var id = req.param('id');
    var totalAsset = req.param('totalAsset');
    var totalDebt = req.param('totalDebt');
    var shortDebt = req.param('shortDebt');
    var primaryIncome = req.param('primaryIncome');
    var profit = req.param('profit');
    var sales = req.param('sales');
    ProjectService.mobileUpdateFinanceInfo(id, totalAsset, totalDebt, shortDebt, primaryIncome, profit, sales, res);
  },
  mobileAgreeContent: function (req, res) {
    var id = req.param('id');
    var projectId = req.param('projectId');
    var userId = req.param('userId');
    ProjectSrevice.mobileAgreeContent(id, projectId, userId, res);
  },
  mobileProjectApply: function (req, res) {
    var userId = req.param("userId");
    var id = req.param('id');
    ProjectService.mobileProjectApply(userId, id, res);
  },
  mobilePublishedList: function (req, res) {
    var userId = req.param('userId');
    var page = req.param('page');
    ProjectService.mobilePublishedList(userId, page, res);
  },
  mobileUpdateLeaseInfo: function (req, res) {
    var id = req.param('id');
    var leaseTerm = req.param('leaseTerm');
    var leaseName = req.param('leaseName');
    var purchaseTime = req.param('purchaseTime');
    var purchasePrice = req.param('purchasePrice');
    var invoiceState = req.param('invoiceState');
    var leaseDesp = req.param('leaseDesp');
    var fundsUsing = req.param('fundsUsing');
    ProjectService.mobileUpdateLeaseInfo(id, leaseTerm, leaseName, purchaseTime, purchasePrice, invoiceState, leaseDesp, fundsUsing, res);
  },
  mobileUpdateOtherDetail: function (req, res) {
    var id = req.param('id');
    var otherDetail = req.param('otherDetail');
    ProjectService.mobileUpdateOtherDetail(id, otherDetail, res);
  },
  mobilePublishedDetail: function (req, res) {
    var id = req.param('id');
    ProjectService.mobilePublishedDetail(id, res);
  },
  mobileProjectList: function (req, res) {
    var page = req.param('page');
    var orderBy = req.param('orderBy');
    var userId = req.param('userId');
    ProjectService.mobileProjectList(page, orderBy, userId, res);
  },
  mobileCollectList: function (req, res) {
    var userId = req.param('userId');
    var page = req.param('page');
    ProjectService.mobileCollectList(userId, page, res);
  },
  mobileProjectApplyDetail: function (req, res) {
    var userId = req.param('userId');
    var projectId = req.param('id');
    ProjectService.mobileProjectApplyDetail(userId, projectId, res);
  },
  mobileProjectSearchList: function (req, res) {
    var userId = req.param('userId');
    var page = req.param('page');
    var keywords = req.param('keywords');
    ProjectService.mobileProjectSearchList(userId, page, keywords, res);
  },
  mobileAgreeContact: function (req, res) {
    var userId = req.param('userId');
    var id = req.param('id');
    var investorId = req.param('investorId');
    ProjectService.mobileAgreeContact(userId, id, investorId, res);
  },
  mobileCancelContact: function (req, res) {
    var userId = req.param('userId');
    var id = req.param('id');
    var investorId = req.param('investorId');
    ProjectService.mobileCancelContact(userId, id, investorId, res);
  },
  mobileCompleteContact: function (req, res) {
    var userId = req.param('userId');
    var id = req.param('id');
    var investorId = req.param('investorId');
    ProjectService.mobileCompleteContact(userId, id, investorId, res);
  }
};

