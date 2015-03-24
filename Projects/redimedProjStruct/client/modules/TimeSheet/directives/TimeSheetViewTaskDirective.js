angular.module("app.loggedIn.TimeSheet.ViewTask.Directive", [])
    .directive('viewTask', function(toastr, $state, TimeSheetService, $modal, MIN_TO_DEC, StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                onCancel: "&",
                onReject: "&",
                onApprove: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                scope.info = {};
                scope.$watch('ngModel', function(newModel, oldModel) {
                    if (!isNaN(newModel)) {
                        scope.info.idTaskWeek = newModel;
                        TimeSheetService.ViewApproved(newModel).then(function(response) {
                            if (response.status === "error") {
                                $state.go("loggedIn.ApproveTask", null, {
                                    "reload": true
                                });
                                toastr.error("Loading fail!", "Error");
                            } else if (response.status === "success") {
                                scope.list = response;
                                angular.forEach(scope.list.result, function(timeDate, indexD) {
                                    scope.list.result[indexD].AC = [];
                                    angular.forEach(scope.list.resultActivity, function(timeAC, indexAC) {
                                        if (scope.list.resultActivity[indexAC].date === scope.list.result[indexD].date) {
                                            scope.list.result[indexD].AC[scope.list.resultActivity[indexAC].type_activity_id] = scope.list.resultActivity[indexAC].sumAC;
                                        }
                                    });
                                });
                                scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                                scope.statusID = scope.list.result[0].task_status_id;
                                if (scope.list.result[0].task_status_id === 4) {
                                    scope.info.hasReject = true;
                                    scope.info.comments = scope.list.result[0].comments;
                                }
                                scope.info.time_rest = parseFloat(parseFloat(scope.list.result[0].chargeWeek) - parseFloat(38.00)).toFixed(2);
                                scope.info.time_in_lieu = null;
                                scope.info.over_time = null;
                                scope.info.TypeOfContruct = scope.list.result[0].TypeOfContruct;
                            } else {
                                //catch exception
                                $state.go("loggedIn.TimeSheetHome", null, {
                                    "reload": true
                                });
                                toastr.error('Server not response!', "Error");
                            }
                        });
                    } else if (newModel === "reject") {
                        scope.info.isReject = true;
                        scope.info.isApprove = false;
                        $('commentsID').focus();
                    } else
                    if (newModel === "chooseApprove") {
                        scope.info.isApprove = true;
                        scope.info.isReject = false;
                    }
                });
                scope.changeTimeInLieu = function() {
                    if (scope.info.time_in_lieu !== undefined) {
                        if (scope.info.time_in_lieu.length === 0) {
                            scope.info.time_in_lieu = null;
                            scope.info.over_time = null;
                        } else {
                            console.log(scope.info.time_rest);
                            scope.info.time_in_lieu_Real = StaffService.covertTimeCharge(scope.info.time_in_lieu).toFixed(2);
                            scope.info.over_time_Real = parseFloat(scope.info.time_rest - scope.info.time_in_lieu_Real).toFixed(2);
                            scope.info.over_time = StaffService.unCovertTimeCharge(scope.info.over_time_Real);
                        }
                    }
                };

                scope.changeOverTime = function() {
                    if (scope.info.over_time !== undefined) {
                        if (scope.info.over_time.length === 0) {
                            scope.info.over_time = null;
                            scope.info.time_in_lieu = null;
                        } else {

                            var hour = parseInt(scope.info.over_time.substring(0, 2));
                            var minute = parseInt(scope.info.over_time.substring(2, 4));
                            if ((hour + (minute / 60)) > scope.info.time_rest) {
                                scope.info.over_time = null;
                                scope.info.time_in_lieu = null;
                            } else {
                                //set over time auto
                                var tempMinute = (scope.info.time_rest * 60 - (minute + hour * 60));
                                var minuteOVER = tempMinute % 60;
                                var hourOVER = (parseInt(tempMinute / 60)) * 100;
                                if (hourOVER === 0) {
                                    if (minuteOVER < 10) {
                                        scope.info.time_in_lieu = "000" + minuteOVER.toString();
                                    } else {
                                        scope.info.time_in_lieu = "00" + minuteOVER.toString();
                                    }
                                } else {
                                    if (hourOVER < 10000) {
                                        if (minuteOVER < 10) {
                                            scope.info.time_in_lieu = "0" + (hourOVER / 100).toString() + "0" + minuteOVER.toString();
                                        } else {
                                            scope.info.time_in_lieu = "0" + (hourOVER / 100).toString() + minuteOVER.toString();
                                        }
                                    } else {
                                        scope.info.time_in_lieu = hourOVER.toString() + minuteOVER.toString();
                                    }
                                }
                                //end set over time auto
                            }
                        }
                    }
                };

                var dialogViewDetail = function(ID, DATE, detailType) {
                    var modalInstance = $modal.open({
                        templateUrl: "ViewDetail",
                        controller: function($scope) {
                            if (detailType === "all-date") {
                                //view all timesheet
                                $scope.idView = {
                                    ID: ID,
                                    STATUS: "all-date"
                                };
                            } else if (detailType === "on-date") {
                                //view one date timesheet
                                $scope.idView = {
                                    ID: ID,
                                    DATE: DATE,
                                    STATUS: "on-date"
                                };
                            }
                            $scope.clickCancel = function(value) {
                                modalInstance.close();
                            };
                        },
                        size: "lg"
                    });

                };

                scope.ViewDetail = function(ID, DATE, detailType) {
                    dialogViewDetail(ID, DATE, detailType);
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewTask.html"
        };
    });
