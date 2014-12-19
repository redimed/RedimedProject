angular.module("app.loggedIn.item.services", [])
    .factory("ItemService", function (Restangular) {
        var instanceService = {};
        var appApi = Restangular.all("api/erm");

    /*
    *   header item 
    */
    instanceService.saveHeaderItems = function (header_id, item_list) {
        var list = [];
        for (var i = item_list.length - 1; i >= 0; i--) {
            list.push(item_list[i].ITEM_ID);
        };

            var data = {
                header_id: header_id,
                items: list
            };
            var detailApi = appApi.all("v2/items/insert_header_items");
            return detailApi.post(data);
        }

    instanceService.insertHeader = function(data) {
        var detailApi = appApi.all("v2/items/insert_header");
        return detailApi.post(data);
    }

    /*
    *   item
    */

        instanceService.insert = function (data) {
            var detailApi = appApi.all("v2/items/insert");
            return detailApi.post(data);
        }

        instanceService.insertFromSource = function () {
            var detailApi = appApi.all("v2/items/insert_from_source");
            return detailApi.post(data);
        }

        instanceService.detail = function (item_id) {
            var detailApi = appApi.all("v2/items/detail");
            return detailApi.post({
                ITEM_ID: item_id
            });
        }

        instanceService.update = function (ITEM_ID, data) {
            var detailApi = appApi.all("v2/items/update");
            return detailApi.post(data);
        }
        instanceService.getItemFees = function (item_id) {
            var detailApi = appApi.one("v2/fees/get_item_fees");
            return detailApi.get({
                item_id: item_id
            });
        }

        instanceService.insertItemFees = function (item_id, fee_list) {
            var list = [];
            console.log(fee_list);
            for (var i = fee_list.length - 1; i >= 0; i--) {
                if (fee_list[i].SCHEDULE_FEE !== undefined)
                    list.push(fee_list[i]);
            };
            var data = {
                item_id: item_id,
                fees: list
            };

            var detailApi = appApi.all("v2/fees/insert_item_fees");
            return detailApi.post(data);
        }

        instanceService.insertItemFundFees = function (item_id, fee_list) {
            var list = [];
            for (var i = fee_list.length - 1; i >= 0; i--) {
                if (fee_list[i].FEE !== undefined || fee_list[i].PERCENT_FEE !== undefined)
                    list.push(fee_list[i]);
            };
            var data = {
                item_id: item_id,
                fees: list
            };

            var detailApi = appApi.all("v2/fees/insert_item_fund_fees");
            return detailApi.post(data);
        }

        instanceService.updateTypePriceSource = function (type_id) {
            var detailApi = appApi.all("v2/fees/update_type_price_source");
            return detailApi.post({
                FEE_TYPE_ID: type_id
            });
        }

        instanceService.updateGroupPriceSource = function (group_id) {
            var detailApi = appApi.all("v2/fees/update_group_price_source");
            return detailApi.post({
                FEE_GROUP_ID: group_id
            });
        }

        //ITEM FEE GROUP START
        instanceService.feegroupinsert = function (data) {
            var detailApi = appApi.all("v2/fees/group/insert");
            return detailApi.post(data);
        }

        instanceService.feegroupdetail = function (group_id) {
            console.log(group_id);
            var detailApi = appApi.all("v2/fees/group/detail");
            return detailApi.post({
                "FEE_GROUP_ID": group_id
            });
        }

        instanceService.feegroupupdate = function (data) {
            var detailApi = appApi.all("v2/fees/group/update");
            return detailApi.post(data);
        }
        //ITEM FEE GROUP END

        //ITEM FEE TYPE START
        instanceService.feetypeinsert = function (data) {
            var detailApi = appApi.all("v2/fees/type/insert");
            return detailApi.post(data);
        }
        instanceService.feetypedetail = function (type_id) {
            var detailApi = appApi.all("v2/fees/type/detail");
            return detailApi.post({
                FEE_TYPE_ID: type_id
            });
        }
        instanceService.feetypeupdate = function (data) {
            var detailApi = appApi.all("v2/fees/type/update");
            return detailApi.post(data);
        }
        //ITEM FEE TYPE END

        //PRIVATE FUND START
        instanceService.privatefundsinsert = function (data) {
            var detailApi = appApi.all("v2/fees/funds/insert");
            return detailApi.post(data);
        }
        instanceService.privatefundsdetail = function (pf_id) {
            var detailApi = appApi.all("v2/fees/funds/detail");
            return detailApi.post({
                PF_id: pf_id
            });
        }
        instanceService.privatefundsupdate = function (data) {
            var detailApi = appApi.all("v2/fees/funds/update");
            return detailApi.post(data);
        }
        //PRIVATE FUND END

    /*
    *   fees
    */
    instanceService.all_fee_types = function(){
        var detailApi = appApi.all("v2/fees/search_type_fees");
        return detailApi.post();
    }

    instanceService.importItemFromXML = function() {
        var detailApi = appApi.all("v2/items/import_from_source");
        return detailApi.post();
    }

        return instanceService;
    })