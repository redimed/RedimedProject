angular.module("app.loggedIn.item.header_detail.directive", [])
.directive("itemHeaderDetail", function (ItemHeaderModel, ItemService, ConfigService, toastr) {
	return  {
        restrict: "EA",
        scope: {
            data: "@",
            onsuccess: '=onsuccess'
        },
        templateUrl: "modules/item/directives/templates/header_detail.html",
        link: function (scope, element, attrs) { 
            // console.log(scope.onsuccess)
            // scope.onsuccess({abc: 123});

            var loadData = function (id) {
                ItemService.detailHeader(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.row);
                    ConfigService.autoConvertData(scope.modelObjectMap);
                });
            };

            scope.modelObjectMap = angular.copy(ItemHeaderModel);
            scope.mode = {type: 'add', text: 'Add Popular'};

            if (scope.data) {
                var data = scope.$eval(scope.data);
                if (data.id) { 
                    loadData(data.id);
                    scope.mode = {type: 'edit', text: 'Edit Item'};
                }
            }

             var addProcess = function (postData) {
                console.log(postData); // return;
                ItemService.insertHeader(postData).then(function (response) {
                    console.log(response)
                    if (response.status === 'success') {
                        toastr.success("Added a Popular", "Success");
                        scope.modelObjectMap = angular.copy(ItemHeaderModel);
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            console.log(scope.onsuccess)
                            scope.onsuccess(response);
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
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
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
    };
});