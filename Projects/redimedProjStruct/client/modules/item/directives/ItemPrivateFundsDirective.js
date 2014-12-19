angular.module("app.loggedIn.item.privatefunds.detail.directive", [])
    .directive("privateFundsDetail", function (PrivateFundsModel, ItemService, ConfigService, toastr) {
        return {
            restrict: "EA",
            scope: {
                data: "@",
                options: "=",
                on_success: '=onsuccess'
            },
            templateUrl: "modules/item/directives/templates/private_fund_detail.html",
            link: function (scope, element, attrs) {
                var loadData = function (id) {
                    ItemService.privatefundsdetail(id).then(function (data) {
                        angular.extend(scope.modelObjectMap, data.data);
                        ConfigService.autoConvertData(scope.modelObjectMap);
                        if (scope.modelObjectMap.isAHSA === '1') {
                            scope.AHSAorBUPA = 0;
                        } else {
                            scope.AHSAorBUPA = 1;
                        }
                    });
                };
                scope.modelObjectMap = angular.copy(PrivateFundsModel);
                scope.mode = {
                    type: 'add',
                    text: 'Add Private Funds'
                };

                if (scope.data) {
                    var data = scope.$eval(scope.data);
                    if (data.id) {
                        loadData(data.id);

                        scope.mode = {
                            type: 'edit',
                            text: 'Edit Private Funds'
                        };
                    }
                }

                var addProcess = function (postData) {
                    ItemService.privatefundsinsert(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Add successfully", "Success");
                            scope.modelObjectMap = angular.copy(PrivateFundsModel);
                            scope.isSubmit = false;
                            if (scope.on_success) {
                                scope.on_success(response);
                            }
                        }
                    })
                }

                var editProcess = function (postData) {
                    var id = postData.id;
                    delete postData.id;
                    ItemService.privatefundsupdate(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Edit successfully", "Success");
                            scope.isSubmit = false;
                            if (scope.on_success) {
                                scope.on_success(response);
                            }
                        }
                    })
                }

                scope.clickAction = function (option) {

                    if (option.type != 'view') {
                        scope.isSubmit = true;

                        if (!scope.mainForm.$invalid) {
                            console.log(scope.AHSAorBUPA);
                            if (scope.AHSAorBUPA === '0') {
                                scope.modelObjectMap.isAHSA = 1;
                                scope.modelObjectMap.isBUPA = 0;
                            } else {
                                scope.modelObjectMap.isAHSA = 0;
                                scope.modelObjectMap.isBUPA = 1;
                            }
                            var postData = angular.copy(scope.modelObjectMap);

                            // DATE
                            for (var key in postData) {
                                if (postData[key] instanceof Date) {
                                    postData[key] = ConfigService.getCommonDate(postData[key]);
                                }
                            }
                            // END DATE

                            if (option.type == 'add') {
                                addProcess(postData);
                            } else if (option.type == 'edit') {
                                editProcess(postData);
                            }
                        }
                    } else {
                        // view process
                    }
                }

            }
        } // END RETURN
    }) // END DIRECTIVE