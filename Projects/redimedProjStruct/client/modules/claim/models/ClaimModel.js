angular.module("app.loggedIn.claim.model", [])
    
.factory("ClaimModel", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api/meditek/v1/claim");

    instanceService.list = function () {
        var detailApi = appApi.one("list");
        return detailApi.get();
    }
  

    return instanceService;
})