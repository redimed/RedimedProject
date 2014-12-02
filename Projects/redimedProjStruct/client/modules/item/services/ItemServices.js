angular.module("app.loggedIn.item.services", [])
    .factory("ItemService", function (Restangular) {
        var instanceService = {};
        var appApi = Restangular.all("api");

        instanceService.get = function (service_id) {
            var detailApi = appApi.one("item/get");
            return detailApi.get();
        }

        instanceService.post = function (data) {
            var detailApi = appApi.all("item/post");
            return detailApi.post(data);
        }
        return instanceService;
    })