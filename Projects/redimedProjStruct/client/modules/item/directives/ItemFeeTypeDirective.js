angular.module("app.loggedIn.item.feetype.detail.directive", [])
    .directive("feeTypeDetail", function (FeeTypesModel, ItemService, ConfigService, toastr) {
        return {
            restrict: "EA",
            scope: {
                data: "@",
                options: "=",
                on_success: '=onsuccess'
            },
            templateUrl: "modules/item/directives/templates/fee_type_detail.html",
            link: function (scope, element, attrs) {
                scope.groupOptions = scope.options.groupSelect.data.items;
                var loadData = function (id) {
                    ItemService.feetypedetail(id).then(function (data) {
                        angular.extend(scope.modelObjectMap, data.data);
                        ConfigService.autoConvertData(scope.modelObjectMap);
                    });
                };
                scope.modelObjectMap = angular.copy(FeeTypesModel);
                scope.mode = {
                    type: 'add',
                    text: 'Add Fee Type'
                };

                if (scope.data) {
                    var data = scope.$eval(scope.data);
                    if (data.id) {
                        loadData(data.id);
                        scope.mode = {
                            type: 'edit',
                            text: 'Edit Fee Type'
                        };
                    }
                }

                var addProcess = function (postData) {
                    ItemService.feetypeinsert(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Add successfully", "Success");
                            scope.modelObjectMap = angular.copy(FeeTypesModel);
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
                    ItemService.feetypeupdate(postData).then(function (response) {
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