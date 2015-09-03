angular.module("app.loggedIn.TimeSheet.ViewTask.Directive", [])
    .directive('viewTask', function(toastr, $state, TimeSheetService, $modal, MIN_TO_DEC, StaffService, $cookieStore) {
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
                        scope.info.USER_ID = ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null;
                        /*
                        ViewApproved: view Timesheet to approve
                        input: id of Timesheet
                        output: - success: send message success
                                - fail: send message error
                        */
                        scope.ViewApproved = function(idTimesheet) {
                            TimeSheetService.ViewApproved(idTimesheet).then(function(response) {
                                if (response.status === "error") {
                                    $state.go("loggedIn.timesheetHome.timesheetApprove", null, {
                                        "reload": true
                                    });
                                    toastr.error("Loading fail!", "Error");
                                } else if (response.status === "success") {
                                    scope.list = response;
                                    scope.info.forPermission = scope.list.forPermission;
                                    angular.forEach(scope.list.result, function(timeDate, indexD) {
                                        scope.list.result[indexD].AC = [];
                                        angular.forEach(scope.list.resultActivity, function(timeAC, indexAC) {
                                            if (scope.list.resultActivity[indexAC].date === scope.list.result[indexD].date) {
                                                scope.list.result[indexD].AC[scope.list.resultActivity[indexAC].activity_id] = scope.list.resultActivity[indexAC].sumAC;
                                            }
                                        });
                                    });
                                    scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                                    scope.statusID = scope.list.result[0].task_status_id;
                                    if (scope.list.result[0].task_status_id === 4) {
                                        scope.info.hasReject = true;
                                        scope.info.comments = scope.list.result[0].comments;
                                    }
                                    scope.info.time_rest = scope.list.result[0].chargeWeek - (38 * 60);
                                    if (scope.info.time_restFull < 0) {
                                        scope.info.time_restFull = 0;
                                    }
                                    scope.info.time_in_lieu = null;
                                    scope.info.over_time = null;
                                    scope.info.TypeOfContruct = scope.list.result[0].TypeOfContruct;
                                } else {
                                    $state.go("loggedIn.home", null, {
                                        "reload": true
                                    });
                                    toastr.error('Server not response!', "Error");
                                }
                            });
                        };
                        scope.ViewApproved(newModel);
                    } else if (newModel === "reject") {
                        scope.info.isReject = true;
                        scope.info.isApprove = false;
                        $('commentsID').focus();
                    } else
                    if (newModel === "chooseApprove") {
                        scope.info.isApprove = true;
                        scope.info.isReject = false;
                    } else if (newModel === "cancelOn") {
                        scope.info.isReject = null;
                        scope.info.isApprove = false;
                    }
                });

                scope.CancelClick = function() {
                    scope.info.isReject = 1;
                    scope.info.isApprove = 1;
                };

                //watch time in lieu
                scope.$watch('info.time_in_lieu', function(newTimeInLieu, oldTimeInLieu) {
                    if (newTimeInLieu !== undefined && newTimeInLieu !== null) {
                        //process
                        if (newTimeInLieu.length === 0) {
                            scope.info.time_in_lieu = null;
                            scope.info.over_time = null;
                        } else if (StaffService.ConvertShowToFull(newTimeInLieu) > scope.info.time_rest) {
                            scope.info.time_in_lieu = null;
                            scope.info.over_time = null;
                        } else {
                            scope.info.time_in_lieuFull = StaffService.ConvertShowToFull(newTimeInLieu);
                            scope.info.over_timeFull = scope.info.time_rest - scope.info.time_in_lieuFull;
                            scope.info.over_time = StaffService.ConvertFromFullToShow(scope.info.over_timeFull);
                        }
                        //end
                    }
                });

                //watch overtime
                scope.$watch('info.over_time', function(newOverTime, oldOverTime) {
                    if (newOverTime !== undefined && newOverTime !== null) {
                        //process
                        if (newOverTime.length === 0) {
                            scope.info.over_time = null;
                            scope.info.time_in_lieu = null;
                        } else if (StaffService.ConvertShowToFull(newOverTime) > scope.info.time_rest) {
                            scope.info.time_in_lieu = null;
                            scope.info.over_time = null;
                        } else {
                            scope.info.over_timeFull = StaffService.ConvertShowToFull(newOverTime);
                            scope.info.time_in_lieuFull = scope.info.time_rest - scope.info.over_timeFull;
                            scope.info.time_in_lieu = StaffService.ConvertFromFullToShow(scope.info.time_in_lieuFull);
                        }
                        //end
                    }
                });

                var DialogViewDetail = function(ID, DATE, detailType) {
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
                            $scope.ClickCancel = function(value) {
                                modalInstance.close();
                            };
                        },
                        size: "lg"
                    });

                };

                scope.ViewDetail = function(ID, DATE, detailType) {
                    DialogViewDetail(ID, DATE, detailType);
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewTask.html"
        };
    });
