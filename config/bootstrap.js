/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
//var schedule = require("node-schedule");
var Promise = require('bluebird');

module.exports.bootstrap = function(cb) {

  //var rule = new schedule.RecurrenceRule();
  //
  //var times = [];

  //for(var i=1; i<60; i++){
  //
  //  times.push(i);
  //
  //}
  //
  //rule.second = times;

  //var c=0;
  //var j = schedule.scheduleJob(rule, function(){
  //  c++;
  //  console.log(c);
  //});

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var modifySql = [
    "alter table project modify purchasePrice DECIMAL(40,4);",
    "alter table project modify primaryIncome DECIMAL(40,4);",
    "alter table project modify totalAsset DECIMAL(40,4);",
    "alter table project modify totalDebt DECIMAL(40,4);",
    "alter table project modify shortDebt DECIMAL(40,4);",
    "alter table project modify profit DECIMAL(40,4);",
    "alter table project modify sales DECIMAL(40,4);",
    "alter table organization modify capital DECIMAL(40,4);",
    "alter table organization modify totalAsset DECIMAL(40,4);"];
  if(sails.config.models.migrate === "alter"){

    Promise.map(modifySql,function(sqlStr){
      Project.query(sqlStr,function(err,results){
        if(err){
          sails.log.error(err.message);
        } else {
          sails.log.info(" %s success!",sqlStr);
        }
      });
    });
  }
  cb();
};
