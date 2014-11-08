angular.module("app.security.services", [])

.factory("SecurityService", function(Restangular){
    var securityService = {};
    var securityApi = Restangular.all("api");

    securityService.login = function(options){
        var loginApi = securityApi.all("users/login");
        return loginApi.post(options);
    }

    securityService.company = function(){
        var companyList = securityApi.one('company/list');
        return companyList.get();
    }
     securityService.regNewUser = function(user){
            var userList = securityApi.all('users/insert');
            return userList.post({user:user,isReg:true});
     }
        securityService.checkEmail = function(email){
            var emailCheck = securityApi.one('users/checkEmail');
            return emailCheck.get({email:email})
        }
        securityService.checkUserName = function(username){
            var usernameCheck = securityApi.one('users/checkUser');
            return usernameCheck.get({user_name:username});
        }
        securityService.forgotPass = function(email){
            var forgotMail = securityApi.one('users/forgotPassword');
            return forgotMail.get({email:email});
        }



    return securityService;
})