/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.PmProperties.services',[])
.factory('PmPropertiesService', function(Restangular){
        var PmPropertiesService = {};
        var api = Restangular.all('api');

        PmPropertiesService.getList = function(){
            var list = api.one('PmProperties/list');
            return list.get();
        }

        PmPropertiesService.saveFunction = function(f){
            var saveApi = api.all('PmProperties/edit');
            return saveApi.post({f:f});
        }

        PmPropertiesService.insertFunction = function(f){
            var insertApi = api.all('PmProperties/insert');
            return insertApi.post({f:f});
        }

        PmPropertiesService.getDataById = function(id){
            var list = api.all('PmProperties/findById');
            return list.post({id:id});
        }


        return PmPropertiesService;
    })