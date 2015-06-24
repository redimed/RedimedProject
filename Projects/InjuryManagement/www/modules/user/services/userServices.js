angular.module('starter.user.services',[])
    .factory("UserService", function(Restangular){
        var userService = {};
        var userApi = Restangular.all("api");

        userService.detail = function(){
            var detailApi = userApi.one("users/loggedin");
            return detailApi.get();
        }

        userService.menu = function(id){
            var menuApi = userApi.all("menu/side");
            return menuApi.post({id:id,isWeb:false});
            return menuApi.post({id:id, isWeb:false});
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
         userService.getPatientMenu = function(id){
            var info = userApi.one('im/menu');
            return info.get();
        }
      

        return userService;
    })