angular.module("app.loggedIn.template.model", [])
    
.factory("TemplateModel", function (Restangular, $http) {
    var instanceService = {};
    var appApi = Restangular.all("api/meditek/v1/template");
    var uploadUrl = "api/meditek/v1/template/";

    instanceService.add = function (data) {
        var detailApi = appApi.all("add");
        return detailApi.post({data: data});
    }

    instanceService.update = function (data) {
        var detailApi = appApi.all("update");
        return detailApi.post({data: data});
    }

    instanceService.list = function (data) {
        var detailApi = appApi.all("list");
        return detailApi.post({data: data});
    }

    instanceService.one = function(data){
        var detailApi = appApi.all("one");
        return detailApi.post({data: data});
    }

    return instanceService;
})