angular.module("app.loggedIn.TimeSheet", [
        "app.loggedIn.TimeSheet.Service",
        "app.loggedIn.staff.service"
    ])
    .config(function($stateProvider) {

        $stateProvider
        //STRUCTURE
            .state("loggedIn.timesheetHome", {
                abstract: true,
                url: "/timesheet",
                templateUrl: "modules/TimeSheet/views/structure.html",
            })
            //END STRUCTURE

        //LOAD LEAVE HISTORY
        .state("loggedIn.timesheetHome.loadLeaveHistory", {
                url: "/load-leave-history",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.leaveHistory");
                                callback(null);
                            }
                        ]);

                    }
                }
            })
            //END LOAD LEAVE HISTORY

        //LOAD LEAVE CREATE
        .state("loggedIn.timesheetHome.loadLeaveCreate", {
                url: "/load-leave-create/:id",
                resolve: {
                    init: function($q, $rootScope, $state, $stateParams, $timeout, $ocLazyLoad) {

                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                                callback(null);
                            },
                            function(callback) {
                                if ($stateParams.id) {
                                    $state.go("loggedIn.timesheetHome.leaveCreate", {
                                        id: $stateParams.id
                                    });
                                } else {
                                    $state.go("loggedIn.timesheetHome.leaveCreate");
                                }
                            }
                        ]);

                    }
                }
            })
            //END LOAD LEAVE CREATE

        //LOAD LEAVE APPROVE
        .state("loggedIn.timesheetHome.loadLeaveApprove", {
                url: "/load-leave-approve",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetApproveLeaveController.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveApproveDirective.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.leaveApprove");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD LEAVE APPROVE

        //LOAD TIMESHEET HISTORY
        .state("loggedIn.timesheetHome.loadTimesheetHistory", {
                url: "/load-timesheet-history",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.css");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/viewTimesheetController.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/StaffCalendarController.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                                callback(null);
                            },

                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetHistory");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD TIMESHEET HISTORY

        //LOAD TIMESHEET CREATE
        .state("loggedIn.timesheetHome.loadTimesheetCreate", {
            url: "/timesheet-load-create/:id",
            resolve: {
                init: function($q, $rootScope, $state, $stateParams, $timeout, $ocLazyLoad) {
                    async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.css");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/createTimesheetController.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/StaffCalendarController.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                            callback(0);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetItemCodeDirective.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetOnlyDigits.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js");
                            callback(null);
                        },
                        function(callback) {
                            if ($stateParams.id) {
                                $state.go("loggedIn.timesheetHome.timesheetCreate", {
                                    id: $stateParams.id
                                });
                            } else {
                                $state.go("loggedIn.timesheetHome.timesheetCreate");
                            }
                        }
                    ]);

                }
            }
        })

        //END LOAD TIMESHEET CREATE

        //LOAD TIMESHEET APPROVE
        .state("loggedIn.timesheetHome.loadTimesheetApprove", {
            url: "/timesheet-load-approve",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetApproveTaskController.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetDetailDirective.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewTaskDirective.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                            callback(null);
                        },
                        function(callback) {
                            $state.go("loggedIn.timesheetHome.timesheetApprove");
                            callback(null);
                        }
                    ]);
                }
            }
        })

        //END LOAD TIMESHEET APPROVE

        //LOAD TIMESHEET REPORT1
        .state("loggedIn.timesheetHome.loadTimesheetReport1", {
                url: "/timesheet-load-report1",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport1Controller.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport1");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD TIMESHEET REPORT1

        //LOAD TIMESHEET REPORT2
        .state("loggedIn.timesheetHome.loadTimesheetReport2", {
                url: "/timesheet-load-report2",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport2Controller.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport2");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD TIMESHEET REPORT2

        //LOAD TIMESHEET REPORT3
        .state("loggedIn.timesheetHome.loadTimesheetReport3", {
                url: "/timesheet-load-report3",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport3Controller.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport3");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD TIMESHEET REPORT3

        //LOAD TIMESHEET REPORT4
        .state("loggedIn.timesheetHome.loadTimesheetReport4", {
                url: "/timesheet-load-report4",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport4Controller.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport4");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD TIMESHEET REPORT 4

        //LOAD TIMESHEET REPORT 5
        .state("loggedIn.timesheetHome.loadTimesheetReport5", {
                url: "/timesheet-load-report5",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                                callback(null);
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport5Controller.js");
                                callback(null);
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport5");
                                callback(null);
                            }
                        ]);
                    }
                }
            })
            //END LOAD TIMESHEET REPORT 5

        //LOAD TIMESHEET REPORT 6
        .state("loggedIn.timesheetHome.loadTimesheetReport6", {
            url: "/timesheet-load-report6",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport6Controller.js");
                            callback(null);
                        },
                        function(callback) {
                            $state.go("loggedIn.timesheetHome.timesheetReport6");
                            callback(null);
                        }
                    ]);
                }
            }
        })

        //END LOAD TIMESHEET REPORT 6

        //LOAD LEAVE REPORT OWE
        .state("loggedIn.timesheetHome.loadLeaveReportOwe", {
            url: "/leave-load-reportowe",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                            callback(null);
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReportOweLeaveController.js");
                            callback(null);
                        },
                        function(callback) {
                            $state.go("loggedIn.timesheetHome.leaveReportOwe");
                            callback(null);
                        }
                    ]);
                }
            }
        });

        //END LOAD LEAVE REPORT 6
    });
