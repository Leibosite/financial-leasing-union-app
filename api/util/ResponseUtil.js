/**
 * Created by leibosite on 2015/12/24.
 */

module.exports = {
  addSuccessMessage: function () {
    var result = {};
    result.result_code = 200001;
    result.result_msg = "success";
    return result;
  },
  addParamNotRight:function(){
    var result = {};
    result.result_code = 200003;
    result.result_msg = "the request parameter is not right";
    return result;
  },
  addErrorMessage:function(){
    var result = {};
    result.result_code = 200002;
    result.result_msg = "failure";
    return result;
  },
  addAccountAlreadyExit:function(){
    var result = {};
    result.result_code = 400001;
    result.result_msg = "手机号码已存在";
    return result;
  },
  addAccountNotExit:function(){
    var result = {};
    result.result_code = 400002;
    result.result_msg = "账号不存在";
    return result;
  },
  addLoginPasswordError:function(){
    var result = {};
    result.result_code = 400003;
    result.result_msg = "登录密码错误";
    return result;
  },
  addUpdatePasswordError:function(){
    var result = {};
    result.result_code = 400004;
    result.result_msg = "原始密码错误";
    return result;
  },
  addUserNotFoundById:function(){
    var result = {};
    result.result_code = 400005;
    result.result_msg = "通过id,没有找到该用户";
    return result;
  },
  addProjectListEmpty: function(){
    var result = {};
    result.result_code = 400006;
    result.result_msg = "project list is empty";
    return result;
  },
  addProjectIsNotADay:function(){
    var result = {};
    result.result_code = 400007;
    result.result_msg = "Less than one day approached the project";
    return result;
  },
  addAlreadyFriends:function(){
    var result = {};
    result.result_code = 400010;
    result.result_msg = "already is you friend!";
    return result;
  }
}
