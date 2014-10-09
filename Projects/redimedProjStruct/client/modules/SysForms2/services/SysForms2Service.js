/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.SysForms2.services',[])
.factory('SysForms2Service', function(Restangular){
        var SysForms2Service = {};
        var api = Restangular.all('api');

        SysForms2Service.getList = function(){
            var list = api.one('SysForms2/list');
            return list.get();
        }

        SysForms2Service.saveFunction = function(f){
            var saveApi = api.all('SysForms2/edit');
            return saveApi.post({f:f});
        }

        SysForms2Service.insertFunction = function(f){
            var insertApi = api.all('SysForms2/insert');
            return insertApi.post({f:f});
        }

        SysForms2Service.getDataById = function(id){
            var list = api.all('SysForms2/findById');
            return list.post({id:id});
        }


        SysForms2Service.getSysForms2MASTER_SEQLOV = function(){
            var list = api.one('SysForms2/getSysForms2MASTER_SEQLOV');
            return list.get();
        }

        SysForms2Service.getListD = function(){
            var list = api.one('SysForms2/listD');
            return list.get();
        }

        SysForms2Service.saveFunctionD = function(f){
            var saveApi = api.all('SysForms2/editD');
            return saveApi.post({f:f});
        }

        SysForms2Service.insertFunctionD = function(f){
            var insertApi = api.all('SysForms2/insertD');
            return insertApi.post({f:f});
        }

        SysForms2Service.getDataByIdD = function(id){
            var list = api.all('SysForms2/findByIdD');
            return list.post({id:id});
        }

        SysForms2Service.getDataByMasterIdD = function(id){
            var list = api.all('SysForms2/findByMasterIdD');
            return list.post({id:id});
        }

        return SysForms2Service;
    })