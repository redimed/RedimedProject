angular.module("app.loggedIn.insurer.services", [])
    .factory("InsurerService", function (Restangular) {
        var instanceService = {};
        var appApi = Restangular.all("api");

        instanceService.get = function (service_id) {
            var detailApi = appApi.one("insurer/get");
            return detailApi.get();
        }

        instanceService.post = function (data) {
            var detailApi = appApi.all("insurer/post");
            return detailApi.post(data);
        }
        return instanceService;
    })