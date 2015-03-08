angular.module("app.loggedIn.TimeSheet.AddDept.Directive", [])
    .directive('addDept', function(TimeSheetService, $state, toastr) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onCancel: "&",
                onSave: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    //load location
                    TimeSheetService.LoadLocation().then(function(response) {
                        if (response.status === "error") {
                            $state.go("loggedIn.TimeSheetDept", null, {
                                "reload": true
                            });
                            toastr.error("Server response error!", "Error");
                        } else if (response.status === "success") {
                            scope.location = response.result;
                        } else {
                            //catch exception
                            $state.go("loggedIn.TimeSheetDept", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    //end load location
                    if (newModel !== null && newModel !== undefined) {
                        scope.addOrUpdateTitle = "Update Dept";
                        scope.addOrUpdateButton = "Update";
                        TimeSheetService.LoadOneDept(newModel).then(function(response) {
                            if (response.status === "error") {
                                $state.go("loggedIn.TimeSheetDept", null, {
                                    "reload": true
                                });
                                toastr.error("Server response error!", "Error");
                            } else if (response.status === "success") {
                                scope.info = {};
                                scope.info.departmentid = newModel;
                                scope.info.departmentName = response.result.departmentName;
                                scope.info.locationID = response.result.locationID;
                            } else {
                                //catch exception
                                $state.go("loggedIn.TimeSheetDept", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    } else {
                        scope.addOrUpdateTitle = "Add Dept";
                        scope.addOrUpdateButton = "Add";
                    }
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/addDept.html"
        };
    });
