angular.module("app.loggedIn.insurer.services", [])
.factory("InsurerService", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api/erm");
    
    
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

    return instanceService;
})