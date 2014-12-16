angular.module("app.loggedIn.item.detail.directive", [])
    .directive("itemDetail", function (ItemModel, ItemService, ConfigService, toastr) {
        return {
            restrict: "EA",
            scope: {
                data: "@",
                options: "=",
                on_success: '=onsuccess'
            },
            templateUrl: "modules/item/directives/templates/detail.html",
            link: function (scope, element, attrs) {
                // console.log(scope.options)
                var loadData = function (id) {
                    console.log(id);
                    ItemService.detail(id).then(function (data) {
                        angular.extend(scope.modelObjectMap, data.data);
                        ConfigService.autoConvertData(scope.modelObjectMap);
                    });
                };
                scope.modelObjectMap = angular.copy(ItemModel);
                scope.mode = {
                    type: 'add',
                    text: 'Add Item'
                };

                if (scope.data) {
                    var data = scope.$eval(scope.data);
                    if (data.id) {
                        loadData(data.id);
                        scope.mode = {
                            type: 'edit',
                            text: 'Edit Item'
                        };
                    }
                }

                var addProcess = function (postData) {
                    console.log(postData);
                    // return;
                    ItemService.insert(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Added a new Item", "Success");
                            scope.modelObjectMap = angular.copy(ItemModel);
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
                    ItemService.update(id, postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Edit Item Successfully", "Success");
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