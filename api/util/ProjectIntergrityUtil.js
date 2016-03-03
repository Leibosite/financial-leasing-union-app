/**
 * Created by leibosite on 2016/1/15.
 */

module.exports = {
  //TODO:
  __counterIntegrity : function (project){
    var counter = 0;
    //项目的每项对应的分值
    var projectMapValue = {companyName:4, companyType:6, industryType:6, financingAmount:4, companyAddress:4, leaseTerm:4,
      leaseList:4,fundsUsing:4,businessLicensePictureURL:4, businessAccountPictureURL:4, legalPersonPictureURL:4,
      organizationPictureURL:4, taxCertificatePictureURL:4, bankCardPictureURL:4, FinancialStatements:4, auditReport:4,
      totalAsset:4, totalDebt:4, shortDebt:4, primaryIncome:4, profit:4, sales:4, buildingPicture:4, otherDetail:4 };
    /*var projectKey = ["companyName","companyType","industryType","financingAmount","companyAddress","leaseTerm","leaseList",
     "fundsUsing","businessLicensePictureURL","businessAccountPictureURL","legalPersonPictureURL","organizationPictureURL",
     "taxCertificatePictureURL","bankCardPictureURL","FinancialStatements","auditReport","totalAsset","totalDebt","shortDebt",
     "primaryIncome","profit","sales","buildingPicture","otherDetail"];*/

    for(var key in projectMapValue){
      if(project[key.toString()]){
        counter = counter + projectMapValue[key];
      }
    }
    return counter;
  },
  __projectFilter: function(project,projectImages){
    var projectKey = ["companyName","companyType","industryType","financingAmount","companyAddress","leaseTerm","leaseList",
      "fundsUsing","businessLicensePictureURL","businessAccountPictureURL","legalPersonPictureURL","organizationPictureURL",
      "taxCertificatePictureURL","bankCardPictureURL","FinancialStatements","auditReport","totalAsset","totalDebt","shortDebt",
      "primaryIncome","profit","sales","gatewayPictureURL","otherDetail"];
    var filterDetail = [0,0,0,0,0,0,0,0,
                        0,0,0,0,0,0,0,0,
                        0,0,0,0,0,0,0,0];
    for(var key in projectKey){
      if(project[projectKey[key].toString()]){
        //sails.log.info(projectKey[key]);
        filterDetail[key] = 1;
      } else {
        for(var i in projectImages){
          if(projectKey[key].toString() === projectImages[i].toString()){
            //sails.log.info('category: ',projectImages[i]);
            filterDetail[key] = 1;
          }
        }
      }
    }
    return filterDetail;
  }

}
