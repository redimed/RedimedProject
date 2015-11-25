angular.module('starter.security.services',[])
    .factory("SecurityService", function(Restangular){
        var securityService = {};
        var securityApi = Restangular.all("api");
        
        securityService.login = function(options){
            var loginApi = securityApi.all("phUser/login");
            return loginApi.post(options);
        }

        securityService.signup = function(options){
        	var signupApi = securityApi.all("phUser/signup");
        	return signupApi.post(options);
        }

        securityService.checkUserName = function(options){
            var CheckUserApi = securityApi.all("phUser/checkUserName");
            return CheckUserApi.post({username:options});
        }

        securityService.forgotpass = function(options){
            var forgotpassAPi = securityApi.all("phUser/forgotpass");
            return forgotpassAPi.post({username:options});
        }

        securityService.updateUser = function(options, flag){
            var updateUserApi = securityApi.all("phUser/updateUser");
            return updateUserApi.post({userInfo:options, flag:flag});
        }

        securityService.changepass = function(infoPass,user_id){
            var changePassApi = securityApi.all("phUser/changePass");
            return changePassApi.post({infoPass:infoPass,user_id:user_id});
        }

        securityService.insertTokenId = function(tokenID, userID){
            var insertTokenIdApi = securityApi.all("phUser/insertTokenID");
            return insertTokenIdApi.post({tokenID:tokenID, userID:userID});
        }

        securityService.delTokenId = function(userID){
            var delTokenIdApi = securityApi.all("phUser/insertTokenID");
            return delTokenIdApi.post({userID:userID});
        }

        securityService.tokenID = {};

        return securityService;
    })