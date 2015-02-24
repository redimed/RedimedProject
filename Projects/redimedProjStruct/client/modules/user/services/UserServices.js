angular.module("app.loggedIn.user.services", [])

.factory("UserService", function(Restangular){
    var userService = {};
    var userApi = Restangular.all("api");
    var mdtUserApi = Restangular.all("api/meditek/v1/user/");

    userService.all = function(){
        var funcApi = mdtUserApi.one('all');
        return funcApi.get();
    }


    userService.detail = function(username){
        var detailApi = userApi.one("users/loggedin");
        return detailApi.get();
    }

    userService.menu = function(id){
        var menuApi = userApi.all("menu/side");
        return menuApi.post({id:id,isWeb:true});
    }

    userService.getFunction = function(id){
        var a = userApi.all('function/id');
        return a.post({id:id});
    }

    userService.getCompany = function(){
        var comp = userApi.one('company/list');
        return comp.get();
    }

    userService.updateProfile = function(info){
        var edit = userApi.all('users/editProfile');
        return edit.post({info:info});
    }

    userService.getUserInfo = function(id){
        var info = userApi.all('users/id');
        return info.post({id:id});
    }

    userService.getUserType = function(){
        return userApi.one('users/type').get();
    }

    userService.updateUserType = function(info){
        return userApi.all('users/type/edit').post({info:info});
    }

    userService.deleteUserType = function(id){
        return userApi.all('users/type/delete').post({id:id});
    }

    userService.insertUserType = function(info){
        return userApi.all('users/type/insert').post({info:info});
    }

    userService.getUserTypeMenu = function(id){
        return userApi.all('users/type/menu').post({id:id});
    }

    userService.insertUserTypeMenu = function(info){
        return userApi.all('users/type/menu/insert').post({info:info});
    }

    userService.updateUserTypeMenu = function(info,id,type_id){
        return userApi.all('users/type/menu/edit').post({info:info,id:id,typeId:type_id});
    }

    userService.deleteUserTypeMenu = function(id){
        return userApi.all('users/type/menu/delete').post({id:id});
    }

    userService.getOnlineUsers = function(){
        return userApi.one('im/getOnlineUsers').get();
    }

    return userService;
})