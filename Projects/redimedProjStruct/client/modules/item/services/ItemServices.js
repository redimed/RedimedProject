angular.module("app.loggedIn.item.services", [])
    .factory("ItemService", function (Restangular) {
        var instanceService = {};
        var appApi = Restangular.all("api/erm");

        instanceService.saveHeaderItems = function (header_id, item_list) {
            var list = [];
            for (var i = item_list.length - 1; i >= 0; i--) {
                list.push(item_list[i].ITEM_ID);
            };

            var data = {header_id: header_id, items: list};
            var detailApi = appApi.all("v2/items/insert_header_items");
            return detailApi.post(data);
        }

        instanceService.insertHeader = function(data) {
            var detailApi = appApi.all("v2/items/insert_header");
            return detailApi.post(data);
        }

        instanceService.insert = function(data) {
            var detailApi = appApi.all("v2/items/insert");
            return detailApi.post(data);
        }

        return instanceService;
    })