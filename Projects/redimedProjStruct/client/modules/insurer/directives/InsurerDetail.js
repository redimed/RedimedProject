angular.module("app.loggedIn.insurer.detail.directive", [])
        .directive("insurerDetail", function (InsurerModel, InsurerService, ConfigService, toastr) {
            return{
                restrict: "EA",
                scope: {
                    data: "@",
                    options: "="
                },
                templateUrl: "modules/insurer/directives/templates/detail.html",
                link: function (scope, element, attrs) {
                    var loadData = function (id) {
                        InsurerService.detail(id).then(function (data) {
                            angular.extend(scope.modelObjectMap, data.row);
                            scope.modelObjectMap.isenable += '';
                            for (var key in scope.modelObjectMap) {
                                if (scope.modelObjectMap[key]) {
                                    if (key.indexOf("is") === 0 || key.indexOf("Is") === 0)
                                        scope.modelObjectMap[key] = scope.modelObjectMap[key].toString();
                                    if (key.indexOf("_date") != -1)
                                        scope.modelObjectMap[key] = new Date(scope.modelObjectMap[key]);
                                }
                            }
                            console.log(scope.modelObjectMap)
                        });
                    };
                    scope.modelObjectMap = angular.copy(InsurerModel);
                    scope.mode = {type: 'add', text: 'Add Company'};
                    if (scope.data) {
                        var data = scope.$eval(scope.data);
                        if (data.id) { // company id
                            loadData(data.id);
                            scope.mode = {type: 'edit', text: 'Edit Insurer'};
                        }
                    }

                    var addProcess = function (postData) {
                        InsurerService.insert(postData).then(function (response) {
                            if (response.status === 'success') {
                                toastr.success("Added a new Insurer", "Success");
                                scope.modelObjectMap = angular.copy(InsurerModel);
                                scope.isSubmit = false;
                            }
                        })
                    }

                    var editProcess = function (postData) {
                        var id = postData.id;
                        delete postData.id;
                        InsurerService.update(id, postData).then(function (response) {
                            if (response.status === 'success') {
                                toastr.success("Edit Insurer Successfully", "Success");
                                scope.isSubmit = false;
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