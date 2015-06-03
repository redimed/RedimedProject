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
                            $state.go("loggedIn.TimeSheetHome.ViewAppovedTimeSheet", null, {
                                "reload": true
                            });
                            toastr.error("Loading fail!", "Error");
                        } else if (response.status === "success") {
                            scope.list = response;
                            scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                        } else {
                            //catch exception
                            $state.go("loggedIn.home", null, {
                                "reload": true
                            });
                            toastr.error('Server not response!', "Error");
                        }
                    });
                });
                scope.DetailItem = function(taskID) {
                    dialogItem(taskID);
                };

                //VIEW ITEM CODE
                var dialogItem = function(taskID) {
                    var modalInstance = $modal.open({
                        templateUrl: "ViewItem",
                        controller: function($scope) {
                            $scope.taskID = taskID;
                            $scope.clickCancel = function() {
                                modalInstance.close();
                            };
                        },
                        size: "lg"
                    });
                };
                //END VIEW ITEM CODE
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewDetail.html"
        };
    });
