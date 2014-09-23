angular.module("app.loggedIn.user.services", [])

.factory("UserService", function(Restangular){
    var userService = {};
    var userApi = Restangular.all("api");

    userService.detail = function(){
        var detailApi = userApi.one("users/loggedin");
        return detailApi.get();
    }

    userService.menu = function(){
        var menuApi = userApi.all("users/home");
        return menuApi.post();
    }

    return userService;
})