/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.menu.services',[])
.factory('MenuService',function(Restangular){
        var menuService = {};
        var api = Restangular.all('api');

        menuService.menuRootList = function(){
            var menuList = api.one('menu/list/root');
            return menuList.get();
        }

        menuService.menuList = function(id){
            var list = api.all('menu/list/id');
            return list.post({id:id});
        }

        menuService.functionList = function(){
            var functionList = api.one('function/list');
            return functionList.get();
        }

        menuService.insertMenu = function(info){
            var insert = api.all('menu/new');
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

        menuService.deleteRootMenu = function(id){
            var a = api.all('menu/delete');
            return a.post({id:id,isRoot:true});
        }
        menuService.deleteMenu = function(id){
            var a = api.all('menu/delete');
            return a.post({id:id,isRoot:false});
        }
        return menuService;
    });