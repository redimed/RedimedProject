angular.module("app.loggedIn.TimeSheet.ViewDetail.Directive", [])
    .directive("viewDetail", function(TimeSheetService, toastr, $state, $filter, $modal) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                onCancel: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                scope.$watch('ngModel', function(newId, oldId) {
                    TimeSheetService.ViewApproved(newId).then(function(response) {
                        if (response.status === "error") {
                            $state.go("loggedIn.timesheetHome.timesheetApprove");
                            toastr.error("Loading fail!", "Error");
                        } else if (response.status === "success") {
                            scope.list = response;
                            scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                        } else {
                            $state.go("loggedIn.home", null, {
                                "reload": true
                            });
                            toastr.error('Server not response!', "Error");
                        }
                    });
                });
                scope.DetailItem = function(taskID) {
                    DialogItem(taskID);
                };

                //view item code
                var DialogItem = function(taskID) {
                    var modalInstance = $modal.open({
                        templateUrl: "ViewItem",
                        controller: function($scope) {
                            $scope.taskID = taskID;
                            $scope.ClickCancel = function() {
                                modalInstance.close();
                            };
                        },
                        size: "lg"
                    });
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewDetail.html"
        };
    });
