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
                                scope.info.time_restFull = StaffService.fortMatFullTime(scope.list.result[0].chargeWeek) - (38 * 60);
                                if (scope.info.time_restFull < 0) {
                                    scope.info.time_restFull = 0;
                                }
                                scope.info.time_rest = StaffService.convertTimeSave(scope.info.time_restFull); //FUNCTION GET FORTMAT SAVE
                                scope.info.time_restFull = StaffService.fortMatFullTime(scope.info.time_rest);
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
                    } else if (newModel === "cancelOn") {
                        scope.info.isReject = null;
                        scope.info.isApprove = false;
                    }
                });

                scope.cancelClick = function() {
                    scope.info.isReject = 1;
                    scope.info.isApprove = 1;
                };
                scope.changeTimeInLieu = function() {
                    if (scope.info.time_in_lieu !== undefined) {
                        //process
                        if (scope.info.time_in_lieu.length === 0) {
                            scope.info.time_in_lieu = null;
                            scope.info.over_time = null;
                        } else if (StaffService.fortMatFullTime(StaffService.covertTimeCharge(scope.info.time_in_lieu)) > scope.info.time_restFull) {
                            scope.info.time_in_lieu = null;
                        } else {
                            scope.info.time_in_lieuFull = StaffService.fortMatFullTime(StaffService.covertTimeCharge(scope.info.time_in_lieu));
                            scope.info.time_in_lieuReal = StaffService.convertTimeSave(scope.info.time_in_lieuFull);
                            scope.info.over_timeFull = scope.info.time_restFull - scope.info.time_in_lieuFull;
                            scope.info.over_time = StaffService.convertFromFullToShow(scope.info.over_timeFull);
                            scope.info.over_time_Real = StaffService.convertTimeSave(scope.info.over_timeFull);
                            console.log('oVERTREAL:' + scope.info.over_time_Real);
                            console.log('inlieuReaL:' + scope.info.time_in_lieuReal);
                        }
                        //end
                    }
                };

                scope.changeOverTime = function() {
                    if (scope.info.over_time !== undefined) {
                        if (scope.info.over_time.length === 0) {
                            scope.info.over_time = null;
                            scope.info.time_in_lieu = null;
                        } else {
                            if (StaffService.covertTimeCharge(scope.info.over_time) > StaffService.covertTimeCharge(scope.info.time_rest)) {
                                scope.info.over_time = null;
                                scope.info.time_in_lieu = null;
                            } else if (StaffService.covertTimeCharge(scope.info.over_time) <= 0) {
                                scope.info.time_in_lieu_Real = (StaffService.covertTimeCharge(scope.info.time_rest));
                                scope.info.time_in_lieu = StaffService.unCovertTimeCharge(scope.info.time_rest);
                            } else {
                                //processing
                                scope.info.over_time_Real = StaffService.covertTimeCharge(scope.info.over_time);
                                scope.info.time_in_lieu_Real = parseFloat(parseFloat(StaffService.covertTimeCharge(scope.info.time_rest)) - parseFloat(scope.info.over_time_Real));
                                scope.info.time_in_lieu = StaffService.unCovertTimeCharge(scope.info.time_in_lieu_Real);
                                //end processing
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
