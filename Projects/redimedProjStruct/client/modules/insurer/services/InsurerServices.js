angular.module("app.loggedIn.insurer.services", [])
.factory("InsurerService", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api/erm");
    var insurerApi = Restangular.all("api/meditek/v1/insurer");
    
    
    instanceService.detail = function(id) {
        var instanceApi = appApi.one("v2/insurers/detail");
        return instanceApi.get({id: id});
    }
    instanceService.insert = function(data) {
        var instanceApi = appApi.all("v2/insurers/insert");
        return instanceApi.post({data: data});
    }

    instanceService.update = function(id, data) {
        var instanceApi = appApi.all("v2/insurers/update");
        return instanceApi.post({'id': id, data: data});
    }

    instanceService.delete = function(id) {
        var instanceApi = appApi.all("v2/insurer/delete");
        return instanceApi.post({id: id});
    }

    instanceService.oneFollowPatient = function(data){
        var instanceApi =  insurerApi.all('oneFollowPatient');
        return instanceApi.post({data: data});
    }

    instanceService.oneFollowCompany = function(data){
        var instanceApi =  insurerApi.all('oneFollowCompany');
        return instanceApi.post({data: data});
    }

    return instanceService;
})