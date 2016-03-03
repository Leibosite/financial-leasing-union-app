/**
 * Created by leibosite on 2015/12/30.
 */

var ResponseUtil = require('../util/ResponseUtil.js');
var Promise = require('bluebird');
var FileUtil = require('../util/FileUtil.js');
var path = require('path');
var ProjectIntergrityUtil = require('../util/ProjectIntergrityUtil.js');
var moment = require('moment');
var ObjectUtil = require('../util/ObjectUtil.js');

module.exports = {

  /**
   * 发布新项目接口
   * @param id
   * @param companyName
   * @param companyType
   * @param industryType
   * @param financingAmount
   * @param companyAddress
   * @param publisherType
   * @returns {*}
   */
  mobilePublishProject: function (id, companyName, companyType, industryType, financingAmount, companyAddress, publisherType, testFloat, res) {

    if (!id || !companyAddress || !companyName || !companyType || !financingAmount || !publisherType || !industryType) {
      sails.log.info('-----Error-----mobilePublishProject----params-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    //publisherType 1、企业直发 2、盟友发布
    var project = {
      publisher: id, companyName: companyName, companyAddress: companyAddress, companyType: companyType,
      industryType: industryType, financingAmount: financingAmount, publisherType: publisherType, testFloat: testFloat
    };
    var integrity = ProjectIntergrityUtil.__counterIntegrity(project);
    project.integrity = integrity;
    Project.create(project).exec(function (err, projectCreator) {

      //sails.log.info('-----projectCreator-----',projectCreator);

      if (err || !projectCreator) {
        sails.log.info('-----Error-----mobilePublishProject----project-----craete------');
        return res.json(ResponseUtil.addErrorMessage());
      }


      return res.json(ResponseUtil.addSuccessMessage());
    });
  },
  /**
   * 获取企业、行业类型接口
   * @param req
   * @param res
   */
  mobileGetCompanyIndustryType: function (req, res) {

    CompanyTypeEnum.find().exec(function (err, companyTypes) {

      if (err) {
        sails.log.info('-----Error-----mobileGetCompanyIndustryType-----find----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      if (!companyTypes || companyTypes.length === 0) {
        companyTypes = [];
      }
      for (var i in companyTypes) {
        var temp = companyTypes[i];
        for (var j in temp) {
          var attr = j.toString();
          if (attr.toString() === "id" || attr.toString() === "name") {
            continue;
          }
          delete companyTypes[i][j];
        }
      }
      IndustryTypeEnum.find().exec(function (err, industryTypes) {

        if (err) {
          sails.log.info('-----Error-----mobileGetCompanyIndustryType-----find----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        if (!industryTypes || industryTypes.length === 0) {
          industryTypes = [];
        }

        for (var i in industryTypes) {
          var temp = industryTypes[i];
          for (var j in temp) {
            var attr = j.toString();
            if (attr.toString() === "id" || attr.toString() === "name") {
              continue;
            }
            delete industryTypes[i][j];
          }
        }
        var responseDate = ResponseUtil.addSuccessMessage();
        responseDate.companyType = companyTypes;
        responseDate.industryType = industryTypes;
        return res.json(responseDate);
      })
    });
  },
  /**
   * 确认项目完成接口
   * @param projectId
   * @param userId
   * @param id
   * @param res
   *
   */
  mobileCompleteContact: function (projectId, userId, id, res) {
    if (!projectId || !userId || !id) {
      sails.log.info("----mobileCompleteContact----params----error");
      return res.json(ResponseUtil.addParamNotRight());
    }
    Project.update({id: projectId}, {state: 3}).then(function (project) {
      if (!project) {
        sails.log.info("----mobileCompleteContact----update----project-----error");
        return res.json(ResponseUtil.addErrorMessage());
      }
    }).then(function () {
      UserProject.update({project: projectId, user: userId}, {type: 4}).then(function (userproject) {
        if (!userproject) {
          sails.log.info("----mobileCompleteContact----update---UserProject--error");
          return res.json(ResponseUtil.addErrorMessage());
        }
        return res.json(ResponseUtil.addSuccessMessage());
      });
    });
  },

  /**
   * 修改项目 财务信息接口
   * @param id
   * @param projectId
   * @param totalAsset
   * @param shortDebt
   * @param primaryIncome
   * @param profit
   * @param sales
   * @param res
   * @returns {*}
   */
  mobileUpdateFinanceInfo: function (id, totalAsset, totalDebt, shortDebt, primaryIncome, profit, sales, res) {

    if (!id) {
      sails.log.info('------Error-----mobileUpdateFinanceInfo----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Project.find({id: id}).exec(function (err, projectFind) {

      if (err || !projectFind) {
        sails.log.info('---ProjectService-----mobileUpdateFinanceInfo----Error----projectFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      Project.update({id: id}, {
        totalAsset: totalAsset || 0, totalDebt: totalDebt || 0, shortDebt: shortDebt || 0,
        primaryIncome: primaryIncome || 0, profit: profit || 0, sales: sales || 0
      }).exec(function (err, projectUpdate) {

        if (err || !projectUpdate || !projectUpdate[0]) {
          sails.log.info('------Error-----mobileUpdateFinanceInfo----projectUpdate-----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        var projectIntegrity = ProjectIntergrityUtil.__counterIntegrity(projectUpdate[0]);

        ProjectPicture.count({project: id}).exec(function (err, projectPictureCounter) {

          Project.update({id: id}, {integrity: projectPictureCounter + projectIntegrity}).exec(function (err, projectUpdateIntegrity) {

            if (err || !projectUpdateIntegrity || !projectUpdateIntegrity[0]) {
              sails.log.info('------Error-----mobileUpdateFinanceInfo----projectUpdateIntegrity-----');
              return res.json(ResponseUtil.addErrorMessage());
            }
            return res.json(ResponseUtil.addSuccessMessage());
          });
        });
      });
    });
  },

  /**
   * 已发布项目列表接口：（我的发布）
   * @param userId
   * @param page
   * @param res
   */
  mobilePublishedList: function (userId, page, res) {

    if (!userId || !page) {
      sails.log.info('------Error-----mobilePublishedList----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var pageNumber = (page - 1) * sails.config.PAGE;
    //var projects = [];
    Project.find({publisher: userId}).limit(sails.config.PAGE).skip(pageNumber).sort("createdAt DESC").then(function (projectFind) {

      if (!projectFind || projectFind.length === 0) {
        throw new Error('PROJECT_LIST_EMPTY');
      }

      for (var project in projectFind) {
        for (var key in projectFind[project]) {
          var attr = key.toString();
          if (attr === "id" || attr === "createdAt" || attr === "companyAddress" || attr === "companyName" ||
            attr === "companyType" || attr === "industryType" || attr === "integrity" || attr === "financingAmount" ||
            attr === "publisherType" || attr === "state") {
            continue;
          }
          delete projectFind[project][key];
        }
      }
      //sails.log.info('projectFind----',projectFind);
      return projectFind;
    }).then(function (projects) {

      return Promise.map(projects, function (project) {
        return ProjectPicture.findOne({
          project: project.id,
          category: "gatewayPictureURL"
        }).then(function (projectPiture) {
          if (!projectPiture) {
            project.backImage = sails.config.IMAGE_HOST;
          } else {
            project.backImage = sails.config.IMAGE_HOST + projectPiture.pictureURL;
          }
        })
      }).then(function () {
        var responseData = ResponseUtil.addSuccessMessage();
        //sails.log.info("project-----",projects);
        responseData.projects = projects;
        return res.json(responseData);
      })
    }).catch(function (err) {
      if (err.message === "PROJECT_LIST_EMPTY") {
        sails.log.error('----', err.message, '-----');
        var responseData = ResponseUtil.addSuccessMessage();
        //sails.log.info("project-----",projects);
        responseData.projects = [];
        return res.json(responseData);
      } else if (err) {
        sails.log.error(err.message);
        return res.json(ResponseUtil.addErrorMessage);
      }
    });
  },
  /**
   * 发送申请接口
   * @param userId
   * @param id
   * @param res
   * @desp
   */
  mobileProjectApply: function (userId, id, res) {

    if (!userId || !id) {
      sails.log.info('------Error-----mobileProjectApply----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    UserProject.create({user: userId, project: id, status: 1, isRead: 0}).exec(function (err, userProject) {
      if (!userProject || err) {
        sails.log.info('------Error-----mobileProjectApply----create-----');
        return res.json(ResponseUtil.addErrorMessage());
      }
      return res.json(ResponseUtil.addSuccessMessage());
    });
  },

  /**
   * 项目列表接口
   * @param page
   * @param orderBy
   * @param res
   */
  mobileProjectList: function (page, orderBy, userId, res) {

    if (!page || !orderBy || !userId) {
      sails.log.info('------Error-----mobilePublishedList----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var pageNumber = ( page - 1 ) * sails.config.PAGE;
    var order = "";
    if (orderBy === "createdAt") {
      order = "createdAt DESC";
    } else if (orderBy === "integrity") {
      order = "integrity DESC";
    }

    Project.find().limit(sails.config.PAGE).skip(pageNumber).sort(order).then(function (projectsFind) {

      //sails.log.info('projectsFind : ',projectsFind);

      if (!projectsFind || projectsFind.length === 0) {
        sails.log.info('---------------');
        throw new Error("PROJECT_LIST_EMPTY");
      }

      for (var i in projectsFind) {
        var project = projectsFind[i];
        for (var j in project) {

          var attr = j.toString();
          if (attr === "createdAt") {
            project.createdAt = moment(projectsFind[i][j]).format("YYYY-MM-DD HH:mm:ss");
            continue;
          }
          if (attr === "id" || attr === "companyAddress" || attr === "companyName" ||
            attr === "publisherType" || attr === "publisher" || attr === "integrity" || attr === "state") {
            continue;
          }
          delete project[j];
        }
      }
      return projectsFind;
    }).then(function (projects) {
      //sails.log.info('projects : ',projects);
      return Promise.map(projects, function (project) {
        //sails.log.info('project : ',project);
        return UserProject.findOne({user: userId, project: project.id}).then(function (userProjectFind) {

          if (!userProjectFind) {
            project.status = -1;
          } else {
            project.status = userProjectFind.status;
          }
          return ProjectPicture.findOne({
            project: project.id,
            category: "gatewayPictureURL"
          }).then(function (projectPictureGateway) {

            if (!projectPictureGateway || !projectPictureGateway.pictureURL) {
              project.backImage = sails.config.IMAGE_HOST;
            } else {
              project.backImage = sails.config.IMAGE_HOST + projectPictureGateway.pictureURL;
            }
          });
        });
      }).then(function () {
        var responseData = ResponseUtil.addSuccessMessage();
        responseData.projects = projects;
        //sails.log.info('responseData : ',responseData);
        return res.json(responseData);
      });
    }).catch(function (err) {
      if (err.message === "PROJECT_LIST_EMPTY") {
        sails.log.info('----', err.message, '-----');
        var responseDate = ResponseUtil.addSuccessMessage();
        responseDate.projects = [];
        return res.json(responseDate);
      } else if (err) {
        sails.log.info('------++++++-----');
        sails.log.error(err.message);
        return res.json(ResponseUtil.addErrorMessage)
      }
    });
  },

  /**
   * 修改项目之租赁信息接口
   * @param id
   * @param leaseTerm
   * @param leaseName
   * @param purchaseTime
   * @param purchasePrice
   * @param invoiceState
   * @param leaseDesp
   * @param fundsUsing
   * @param res
   */
  mobileUpdateLeaseInfo: function (id, leaseTerm, leaseName, purchaseTime, purchasePrice, invoiceState, leaseDesp, fundsUsing, res) {
    if (!id) {
      sails.log.info('------Error--project---mobileUpdateLeaseInfo----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Project.find({id: id}).exec(function (err, projectFind) {

      if (err || !projectFind) {
        sails.log.info('---ProjectService-----mobileUpdateLeaseInfo----Error----projectFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      Project.update({id: id}, {
        leaseTerm: leaseTerm || '', leaseName: leaseName || '', purchaseTime: purchaseTime || '',
        purchasePrice: purchasePrice || 0, invoiceState: invoiceState || '', leaseDesp: leaseDesp || '',
        fundsUsing: fundsUsing || ''
      }).exec(function (err, projectUpdate) {

        if (err || !projectUpdate || !projectUpdate[0]) {
          sails.log.info('------Error-----mobileUpdateLeaseInfo----projectUpdate-----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        var projectIntegrity = ProjectIntergrityUtil.__counterIntegrity(projectUpdate[0]);

        ProjectPicture.count({project: id}).exec(function (err, projectPictureCounter) {

          Project.update({id: id}, {integrity: projectPictureCounter + projectIntegrity}).exec(function (err, projectUpdateIntegrity) {

            if (err || !projectUpdateIntegrity || !projectUpdateIntegrity[0]) {
              sails.log.info('------Error-----mobileUpdateLeaseInfo----projectUpdateIntegrity-----');
              return res.json(ResponseUtil.addErrorMessage());
            }
            return res.json(ResponseUtil.addSuccessMessage());
          });
        });
      });
    });

  },

  /**
   * 修改项目之更多详情接口
   * @param id
   * @param otherDetail
   * @param res
   */
  mobileUpdateOtherDetail: function (id, otherDetail, res) {
    if (!id) {
      sails.log.info('------Error--project---mobileUpdateOtherDetail----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Project.find({id: id}).exec(function (err, projectFind) {

      if (err || !projectFind) {
        sails.log.info('---ProjectService-----mobileUpdateOtherDetail----Error----projectFind---');
        return res.json(ResponseUtil.addErrorMessage());
      }

      Project.update({id: id}, {otherDetail: otherDetail || ''}).exec(function (err, projectUpdate) {

        if (err || !projectUpdate || !projectUpdate[0]) {
          sails.log.info('------Error-----mobileUpdateOtherDetail----projectUpdate-----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        var projectIntegrity = ProjectIntergrityUtil.__counterIntegrity(projectUpdate[0]);

        ProjectPicture.count({project: id}).exec(function (err, projectPictureCounter) {

          Project.update({id: id}, {integrity: projectPictureCounter + projectIntegrity}).exec(function (err, projectUpdateIntegrity) {

            if (err || !projectUpdateIntegrity || !projectUpdateIntegrity[0]) {
              sails.log.info('------Error-----mobileUpdateOtherDetail----projectUpdateIntegrity-----');
              return res.json(ResponseUtil.addErrorMessage());
            }
            return res.json(ResponseUtil.addSuccessMessage());
          });
        });
      });
    });
  },

  /**
   * 项目详情展示接口
   * @param id
   * @param res
   */
  mobilePublishedDetail: function (id, res) {

    if (!id) {
      sails.log.info('------Error--project---mobilePublishedDetail----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Project.findOne({id: id}).exec(function (error, projectFind) {

      if (error || !projectFind) {
        sails.log.info('------Error--project---mobilePublishedDetail----projectFind-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      //delete projectFind.createdAt;
      delete projectFind.publisherTime;
      delete projectFind.updatedAt;
      delete projectFind.uuid;
      projectFind.createdAt = moment(projectFind.createdAt).format('YYYY-MM-DD HH:mm');

      User.findOne({id: projectFind.publisher}).populate('organization').exec(function (error, publisherFind) {

        if (!publisherFind || error) {
          sails.log.info('user organization is null !');
          sails.log.info(!publisherFind || error.message);
          return res.json(ResponseUtil.addErrorMessage());
        }

        var responseData = ResponseUtil.addSuccessMessage();
        responseData.project = projectFind;
        var publisher = {};
        publisher.id = publisherFind.id;
        publisher.realName = publisherFind.realName;
        publisher.organizationName = publisherFind.organization.name;
        publisher.position = publisherFind.position;
        publisher.workLife = publisherFind.workLife;
        publisher.headImage = sails.config.IMAGE_HOST + publisherFind.headImage;

        responseData.project.user = publisher;

        UserProject.find({project: id}).populate('user').sort("status DESC").exec(function (error, usersFind) {

          for (var i in usersFind) {
            for (var j in usersFind[i]) {
              var attr = j.toString();
              if (attr === "user") {
                var userFind = usersFind[i][j];
                //sails.log.info('user---',user);
                usersFind[i].realName = userFind.realName;
                usersFind[i].headImage = sails.config.IMAGE_HOST + userFind.headImage;
                usersFind[i].id = userFind.id;

                delete usersFind[i][j];
              }
              if (attr === "createdAt" || attr === "updatedAt" || attr === "uuid" || attr === "project" || attr === "id") {
                delete usersFind[i][j];
              }
            }
          }

          responseData.project.users = usersFind;
          responseData.project.backImage = sails.config.IMAGE_HOST;
          ProjectPicture.find({project: id}).exec(function (error, projectPicturesFind) {

            for (var i in projectPicturesFind) {
              var projectPicture = projectPicturesFind[i];
              for (var j in projectPicture) {
                var attr = j.toString();

                //projectPicture.pictureURL = sails.config.IMAGE_HOST;
                if (attr === "uuid" || attr === "createdAt" || attr === "updatedAt") {
                  delete projectPicture[j];
                  continue;
                }
                if (attr === "category" && projectPicture[j] === "gatewayPictureURL") {
                  responseData.project.backImage = sails.config.IMAGE_HOST + projectPicture.pictureURL;
                  continue;
                }
                if (attr === "pictureURL") {
                  projectPicture.pictureURL = sails.config.IMAGE_HOST + projectPicture.pictureURL;
                  continue;
                }
              }
            }

            responseData.project.projectPictures = projectPicturesFind;
            return res.json(responseData);
          });

        });
      });
    });
  },

  /**
   * 我的收藏列表接口
   * @param userId
   * @param page
   * @param res
   * @desp 展示该用户（userId）申请查看的项目，接洽过的项目，完成的项目
   */
  mobileCollectList: function (userId, page, res) {

    if (!userId || !page) {
      sails.log.info('------Error--project---mobileCollectList----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var pageNumber = ( page - 1 ) * sails.config.PAGE;

    UserProject.find({user: userId}).limit(sails.config.PAGE).skip(pageNumber).sort("createdAt DESC").then(function (userProjectsFind) {

      var responseData = ResponseUtil.addSuccessMessage();
      var projects = [];

      if (!userProjectsFind || userProjectsFind.length === 0) {
        responseData.projects = projects;
        return res.json(responseData);
      }

      return Promise.map(userProjectsFind, function (userProject) {
        return Project.findOne({id: userProject.project}).then(function (projectFind) {

          for (var i in projectFind) {
            var attr = i.toString();
            if (attr === "createdAt") {
              projectFind.createdAt = moment(projectFind[i]).format("YYYY-MM-DD HH:mm:ss");
              continue;
            }
            if (attr === "id" || attr === "companyAddress" || attr === "companyName" ||
              attr === "publisherType" || attr === "publisher" || attr === "integrity" || attr === "state") {
              continue;
            }
            delete projectFind[i];
          }
          projectFind.status = userProject.status;
          return ProjectPicture.findOne({
            category: "gatewayPictureURL",
            project: projectFind.id
          }).then(function (projectPictureFind) {
            if (!projectPictureFind) {
              projectFind.backImage = sails.config.IMAGE_HOST;
            } else {
              projectFind.backImage = sails.config.IMAGE_HOST + projectPictureFind.pictureURL;
            }
            projects.push(projectFind);
          });
        })
      }).then(function () {
        responseData.projects = projects;
        return res.json(responseData);
      });
    }).catch(function (err) {
      if (err) {
        sails.log.error(err.message);
        return res.json(ResponseUtil.addErrorMessage());
      }
    });
  },

  /**
   * 申请查看项目详情接口
   * @param userId
   * @param projectId
   * @param res
   */
  mobileProjectApplyDetail: function (userId, projectId, res) {

    if (!userId || !projectId) {
      sails.log.info('------Error--project---mobileProjectApplyDetail----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Project.findOne({id: projectId}).exec(function (err, projectFind) {

      if (!projectFind) {
        return res.json(ResponseUtil.addErrorMessage());
      }

      var project = ObjectUtil.cloneAttributes(projectFind);
      for (var i in project) {

        var attr = i.toString();
        if (attr === "createdAt") {
          project.createdAt = moment(project[i]).format("YYYY-MM-DD HH:mm:ss");
          continue;
        }
        if (attr === "id" || attr === "companyAddress" || attr === "companyName" || attr === "industryType" || attr === "companyType" ||
          attr === "publisherType" || attr === "publisher" || attr === "integrity" || attr === "state" || attr === "financingAmount") {
          continue;
        }
        delete project[i];
      }
      var responseDate = ResponseUtil.addSuccessMessage();

      responseDate.project = project;
      responseDate.project.backImage = sails.config.IMAGE_HOST;

      UserProject.findOne({project: projectId, user: userId}).exec(function (err, userProject) {

        if (!userProject || err) {
          responseDate.project.status = -1;
        } else {
          responseDate.project.status = 1;
        }

        ProjectPicture.find({project: projectId}).exec(function (err, projectPicturesFind) {

          var projectPictures = [];
          if (!projectPicturesFind || projectPicturesFind.length === 0 || err) {
            responseDate.project.backImage = sails.config.IMAGE_HOST;
          } else {
            for (var i in projectPicturesFind) {
              projectPictures.push(projectPicturesFind[i].category);
              if (projectPicturesFind[i].category === "gatewayPictureURL") {
                responseDate.project.backImage = sails.config.IMAGE_HOST + projectPicturesFind[i].pictureURL;
              }
            }
          }

          var details = ProjectIntergrityUtil.__projectFilter(projectFind, projectPictures);
          responseDate.project.details = details;
          return res.json(responseDate);
        })
      });
    });
  },

  /**
   * 搜索 项目列表
   * @param userId
   * @param page
   * @param keywords
   * @param res
   */
  mobileProjectSearchList: function (userId, page, keywords, res) {

    if (!userId || !page || !keywords) {
      sails.log.info('------Error--project---mobileProjectSearchList----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    var pageNumber = ( page - 1 ) * sails.config.PAGE;

    Project.find({companyName: {'contains': keywords}}).limit(sails.config.PAGE).skip(pageNumber).sort("createdAt DESC").then(function (projectsFind) {

      //sails.log.info('projectsFind : ',projectsFind);

      if (!projectsFind || projectsFind.length === 0) {
        sails.log.info('---------------');
        throw new Error("PROJECT_LIST_EMPTY");
      }

      for (var i in projectsFind) {
        var project = projectsFind[i];
        for (var j in project) {

          var attr = j.toString();
          if (attr === "createdAt") {
            project.createdAt = moment(projectsFind[i][j]).format("YYYY-MM-DD HH:mm:ss");
            continue;
          }
          if (attr === "id" || attr === "companyAddress" || attr === "companyName" ||
            attr === "publisherType" || attr === "publisher" || attr === "integrity" || attr === "state") {
            continue;
          }
          delete project[j];
        }
      }
      return projectsFind;
    }).then(function (projects) {
      //sails.log.info('projects : ',projects);
      return Promise.map(projects, function (project) {
        //sails.log.info('project : ',project);
        return UserProject.findOne({user: userId, project: project.id}).then(function (userProjectFind) {

          if (!userProjectFind) {
            project.status = 0;
          } else {
            project.status = userProjectFind.status;
          }
          return ProjectPicture.findOne({
            project: project.id,
            category: "gatewayPictureURL"
          }).then(function (projectPictureGateway) {

            if (!projectPictureGateway || !projectPictureGateway.pictureURL) {
              project.backImage = sails.config.IMAGE_HOST;
            } else {
              project.backImage = sails.config.IMAGE_HOST + projectPictureGateway.pictureURL;
            }
          });
        });
      }).then(function () {
        var responseData = ResponseUtil.addSuccessMessage();
        responseData.projects = projects;
        //sails.log.info('responseData : ',responseData);
        return res.json(responseData);
      });
    }).catch(function (err) {
      if (err.message === "PROJECT_LIST_EMPTY") {
        sails.log.info('----', err.message, '-----');
        var responseDate = ResponseUtil.addSuccessMessage();
        responseDate.projects = [];
        return res.json(responseDate);
      } else if (err) {
        sails.log.info('------++++++-----');
        sails.log.error(err.message);
        return res.json(ResponseUtil.addErrorMessage)
      }
    });
  },

  /**
   * 同意接洽接口
   * @param userId
   * @param id
   * @param investorId
   * @param res
   */
  mobileAgreeContact: function (userId, id, investorId, res) {

    if (!userId || !id || !investorId) {
      sails.log.info('------Error-----mobileAgreeContact----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    UserProject.update({user: investorId, project: id}, {status: 2}).exec(function (err, userProject) {

      if (!userProject || err) {
        sails.log.info(err, userProject);
        sails.log.info('------Error-----mobileAgreeContact----update-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      ApproachRecord.findOrCreate({user: investorId, project: id}).exec(function (err, user) {

        if (!user || err) {
          sails.log.info('------Error-----mobileAgreeContact----ApproachRecord Findorcreate----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        User.findOne({id: userId}).exec(function (err, userFind) {

          if (err || !userFind) {
            sails.log.info('------Error-----mobileAgreeContact----user Find----');
            return res.json(ResponseUtil.addErrorMessage());
          }

          //user.approachProjectCount = user.approachProjectCount + 1;
          //TODO:个人与项目方，两人的项目接洽数都需要增加么？
          User.update({id: userId}, {approachProjectCount: userFind.approachProjectCount + 1}).
            exec(function (err, userProject) {

              if (err || !userProject) {
                sails.log.info('------Error-----mobileAgreeContact----User update----');
                return res.json(ResponseUtil.addErrorMessage());
              }

              Project.findOne({id:id}).exec(function(err,projectFind){

                if(err || !projectFind){
                  sails.log.info('------Error-----mobileAgreeContact----project find----');
                  return res.json(ResponseUtil.addErrorMessage());
                }

                Project.update({id: id}, {state: 2,contactCounter:projectFind.contactCounter+1}).exec(function (err, projectUpdate) {

                  if (err || !projectUpdate) {
                    sails.log.info('------Error-----mobileAgreeContact----Project update----');
                    return res.json(ResponseUtil.addErrorMessage());
                  }
                  return res.json(ResponseUtil.addSuccessMessage());
                });
              })
            });
        });
      });
    });
  },

  /**
   * 取消项目接洽接口
   * @param userId
   * @param id
   * @param investorId
   * @param res
   */
  mobileCancelContact: function (userId, id, investorId, res) {

    if (!userId || !id || !investorId) {
      sails.log.info('------Error-----mobileCancelContact----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    UserProject.findOne({user: investorId, project: id}).exec(function (err, userProjectFind) {

      if (err || !userProjectFind) {
        sails.log.info("-----Error-----mobileCancelContact----userProjectFind-----");
        return res.json(ResponseUtil.addErrorMessage());
      }

      var timeUpdatedAt = new Date(userProjectFind.updatedAt).getTime();
      var timeNow = new Date().getTime();

      var compare = timeNow - timeUpdatedAt;

      if (compare > sails.config.DAY_MILLISECOND) {
        var responseDate = ResponseUtil.addSuccessMessage();
        UserProject.update({id: userProjectFind.id}, {status: 1}).exec(function (err, userProjectUpdate) {

          if (err || !userProjectUpdate) {
            sails.log.info('------Error-----mobileCancelContact----userProjectUpdate-----');
            return res.json(ResponseUtil.addErrorMessage());
          }

          Project.update({id: id}, {state: 1}).exec(function (err, projectUpdate) {

            if (err || !projectUpdate) {
              sails.log.info('------Error-----mobileCancelContact----projectUpdate-----');
              return res.json(ResponseUtil.addErrorMessage());
            }
            return res.json(responseDate);
          });
        });
      } else {
        return res.json(ResponseUtil.addProjectIsNotADay());
      }
    });
  },

  /**
   * 确认项目完成接口
   * @param userId
   * @param id
   * @param investorId
   * @param res
   */
  mobileCompleteContact: function (userId, id, investorId, res) {

    if (!userId || !id || !investorId) {
      sails.log.info('------Error-----mobileCompleteContact----param-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    Project.update({id: id}, {state: 3}).exec(function (err, projectUpdate) {

      if (err || !projectUpdate) {
        sails.log.info("------Error-----mobileCompleteContact----project update-----");
        return res.json(ResponseUtil.addErrorMessage());
      }

      sails.log.info('---------proectComplete-------projectId = -----',id);
      UserProject.update({user: investorId, project: id}, {status: 3}).exec(function (err, userProjectUpdate) {

        if (err || !userProjectUpdate) {
          sails.log.info("------Error-----mobileCompleteContact----userProject update-----");
          return res.json(ResponseUtil.addErrorMessage());
        }
        sails.log.info('---------UserProject-------userProjectId = -----',userProjectUpdate);
        User.findOne({id: investorId}).exec(function (err, investorFind) {

          if (err || !investorFind) {
            sails.log.info("------Error-----mobileCompleteContact----user find-----");
            return res.json(ResponseUtil.addErrorMessage());
          }

          User.update({id: investorId}, {completeProjectCount: investorFind.completeProjectCount + 1}).exec(function (err, investorUpdate) {

            sails.log.info("----",investorUpdate);

            if (err || !investorUpdate) {
              sails.log.info("------Error-----mobileCompleteContact----user update-----");
              return res.json(ResponseUtil.addErrorMessage());
            }

            sails.log.info('---------investor-------complementd project user id  = -----',investorFind);

            User.findOne({id:userId}).exec(function(err,userFind){

              if (err || !userFind) {
                sails.log.info("------Error-----mobileCompleteContact----user find-----");
                return res.json(ResponseUtil.addErrorMessage());
              }

              User.update({id : userId},{completeProjectCount: userFind.completeProjectCount + 1}).exec(function (err, userUpdate) {

                //sails.log.info("----",userUpdate);

                sails.log.info('---------user-------complementd project user id  = -----',investorFind);

                if (err || !userUpdate) {
                  sails.log.info("------Error-----mobileCompleteContact----user update-----");
                  return res.json(ResponseUtil.addErrorMessage());
                }

                return res.json(ResponseUtil.addSuccessMessage());
              });
            });

          })
        });
      });
    })
  }
}

