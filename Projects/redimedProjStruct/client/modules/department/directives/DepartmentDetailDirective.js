angular.module("app.loggedIn.department.detail.directive", [])
.directive("departmentDetail", function (ClnDepartmentModel, DepartmentService, ConfigService, toastr) {
    return{
        restrict: "EA",
        scope: {
            data: "@",
            options: "=",
            on_success: '=onsuccess'
        },
        templateUrl: "modules/department/directives/templates/detail.html",
        link: function (scope, element, attrs) {
            var loadData = function (id) {
                DepartmentService.detail(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.row);
                    ConfigService.autoConvertData(scope.modelObjectMap);
                });
            };
            scope.modelObjectMap = angular.copy(ClnDepartmentModel);
            scope.mode = {type: 'add', text: 'Add Department'};
            
            if (scope.data) {
                var data = scope.$eval(scope.data);
                if (data.id) { 
                    loadData(data.id);
                    scope.mode = {type: 'edit', text: 'Edit Department'};
                }
            }

            var addProcess = function (postData) {
                DepartmentService.insert(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Added a new Department", "Success");
                        scope.modelObjectMap = angular.copy(ClnDepartmentModel);
                        scope.isSubmit = false;
                        if (scope.on_success) {
                            scope.on_success();
                        }
                    }
                })
            }

            var editProcess = function (postData) {
                var id = postData.id;
                delete postData.id;
                DepartmentService.update(id, postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Edit Department Successfully", "Success");
                        scope.isSubmit = false;
                        if (scope.on_success) {
                            scope.on_success();
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