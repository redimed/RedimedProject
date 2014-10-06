/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.menu.services',[])
.factory('MenuService',function(Restangular){
        var menuService = {};
        var api = Restangular.all('api');

        menuService.menuList = function(){
            var menuList = api.one('menu/list');
            return menuList.get();
        }

        menuService.functionList = function(){
            var functionList = api.one('function/list');
            return functionList.get();
        }

        menuService.insertMenu = function(info){
            var insert = api.all('menu/insert');
            return insert.post({info:info});
        }

        menuService.editMenu = function(info){
            var edit = api.all('menu/edit');
            return edit.post({info:info});
        }

        menuService.menuInfo = function(id){
            var info = api.all('menu/id');
            return info.post({id:id});
        }

        return menuService;
    });