angular.module("app.loggedIn.TimeSheet.ViewTask.Directive", [])
    .directive('viewTask', function(toastr, $state, TimeSheetService) {
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
                                scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                                scope.statusID = scope.list.result[0].task_status_id;
                                if (scope.list.result[0].task_status_id === 4) {
                                    scope.info.hasReject = true;
                                    scope.info.comments = scope.list.result[0].comments;
                                }
                                scope.info.time_rest = scope.list.result[0].time_rest;
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
                    } else if (newModel === "chooseApprove") {
                        scope.info.isApprove = true;
                        scope.info.isReject = false;
                    }
                });
                scope.changeTimeInLieu = function() {
                    if (scope.info.time_in_lieu) {
                        var hour = parseInt(scope.info.time_in_lieu.substring(0, 2));
                        var minute = parseInt(scope.info.time_in_lieu.substring(2, 4));
                        if ((hour + (minute / 60)) > scope.info.time_rest) {
                            scope.info.time_in_lieu = null;
                        } else {
                            //set over time auto
                            var tempMinute = (scope.info.time_rest * 60 - (minute + hour * 60));
                            var minuteOVER = tempMinute % 60;
                            var hourOVER = (parseInt(tempMinute / 60)) * 100;
                            if (hourOVER === 0) {
                                if (minuteOVER < 10) {
                                    scope.info.over_time = "000" + minuteOVER.toString();
                                } else {
                                    scope.info.over_time = "00" + minuteOVER.toString();
                                }
                            } else {
                                if (hourOVER < 10000) {
                                    if (minuteOVER < 10) {
                                        scope.info.over_time = "0" + (hourOVER / 100).toString() + "0" + minuteOVER.toString();
                                    } else {
                                        scope.info.over_time = "0" + (hourOVER / 100).toString() + minuteOVER.toString();
                                    }
                                } else {
                                    scope.info.over_time = hourOVER.toString() + minuteOVER.toString();
                                }
                            }
                            //end set over time auto
                        }
                    }
                };

                scope.changeOverTime = function() {
                    if (scope.info.over_time) {
                        var hour = parseInt(scope.info.over_time.substring(0, 2));
                        var minute = parseInt(scope.info.over_time.substring(2, 4));
                        if ((hour + (minute / 60)) > scope.info.time_rest) {
                            scope.info.over_time = null;
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
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewTask.html"
        };
    });
