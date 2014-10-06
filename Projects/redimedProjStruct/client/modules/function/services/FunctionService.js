/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.function.services',[])
.factory("FunctionService", function(Restangular){
        var functionService = {};
        var api = Restangular.all("api");

        functionService.getList = function(){
            var list = api.one("function/list");
            return list.get();
        }

        functionService.saveFunction = function(f){
            var saveApi = api.all("function/edit");
            return saveApi.post({f:f});
        }

        functionService.insertFunction = function(f){
            var insertApi = api.all("function/insert");
            return insertApi.post({f:f});
        }

        functionService.getFunctionInfo = function(id){
            var info = api.all('function/id');
            return info.post({id:id});
        }

        return functionService;
    })