angular.module("app.loggedIn.company.services", [])
.factory("CompanyService", function(Restangular) {
    var companyService = {};
    var companyApi = Restangular.all("api/erm");

    companyService.detail = function(id) {
        var instanceApi = companyApi.one("v2/companies/detail");
        return instanceApi.get({id: id});
    }
    companyService.insert = function(data) {
        var instanceApi = companyApi.all("v2/companies/insert");
        return instanceApi.post({data: data});
    }

    companyService.update = function(id, data) {
        var instanceApi = companyApi.all("v2/companies/update");
        return instanceApi.post({'id': id, data: data});
    }

    companyService.delete = function(id) {
        var instanceApi = companyApi.all("v2/companies/delete");
        return instanceApi.post({id: id});
    }


    return companyService;
})