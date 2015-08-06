angular.module("app.loggedIn.item.detail.directive", [])
    .directive("itemDetail", function (ItemModel, ItemService, ConfigService, toastr, $timeout) {
        return {
            restrict: "EA",
            scope: {
                data: "@",//{id:''}
                on_success: '=onsuccess'
            },
            templateUrl: "modules/item/directives/templates/detail.html",
            controller: function ($scope,ConfigService) { 
                /**
                 * tannv.dts  add
                 * 28-07-2015
                 */
                ConfigService.taxes_option().then(function(data){
                    $scope.taxes = data;
                    exlog.log(data);
                });
                ConfigService.prefix_headers_option('item').then(function(data){
                    $scope.prefix_headers = data;
                });
                ConfigService.inv_uoms_option().then(function(data){
                    $scope.uoms = data;
                });
                 // EDIT 
                $scope.loadData = function (id) {
                    $scope.id = id;
                    ItemService.detail(id).then(function (data) {
                        angular.extend($scope.modelObjectMap, data.data);
                        ConfigService.autoConvertData($scope.modelObjectMap);
                    });
                };
            },
            link: function (scope, element, attrs) {
               
                scope.modelObjectMap = angular.copy(ItemModel);
                scope.mode = {
                    type: 'add',
                    text: 'Add Item'
                };

                if (scope.data) {
                    var data = scope.$eval(scope.data);

                    if (data.id) {
                        scope.itemId=data.id;
                        scope.loadData(data.id);
                        scope.mode = {
                            type: 'edit',
                            text: 'Save Item'
                        };
                    }
                }

                var addProcess = function (postData) {
                    ItemService.insert(postData).then(function (response) {
                        if (response.status === 'success') {
                            toastr.success("Added a new Item", "Success");
                            
                            scope.isSubmit = false;
                            
                            // CHANGE TO EDIT MODE
                            scope.modelObjectMap = angular.copy(response.data);
                            scope.mode = {
                                type: 'edit',
                                text: 'Save Item'
                            };
                            // CHANGE TO EDIT MODE

                            
                            // if (scope.on_success) {
                            //     scope.on_success(response);
                            // }
                        }
                    }, function(error){
                        toastr.error("Fail to add a new Item", "Error");
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
                            if (postData.TAX_ID) {
                                _.filter(scope.taxes, function(n) {

                                    if (n.TAX_ID == postData.TAX_ID) {
                                        console.log('postData',postData);
                                        postData.TAX_CODE = n.TAX_CODE;
                                        postData.TAX_RATE = n.TAX_RATE;
                                    };
                                });
                            };
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
