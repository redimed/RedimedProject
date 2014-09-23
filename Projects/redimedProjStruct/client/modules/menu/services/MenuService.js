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

        return menuService;
    });