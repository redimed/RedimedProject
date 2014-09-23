angular.module("app.security.services", [])

.factory("SecurityService", function(Restangular){
    var securityService = {};
    var securityApi = Restangular.all("api");

    securityService.login = function(options){
        var loginApi = securityApi.all("users/login");
        return loginApi.post(options);
    }

    securityService.company = function(){
        var companyList = securityApi.one('users/companyList');
        return companyList.get();
    }

    return securityService;
})