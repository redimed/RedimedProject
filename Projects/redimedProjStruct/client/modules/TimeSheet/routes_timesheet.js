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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.leaveHistory");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/jquery-mask/masked.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                                    .then(function() {
                                        callback(null);
                                    });
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetApproveLeaveController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveApproveDirective.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.leaveApprove");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.css")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/viewTimesheetController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/StaffCalendarController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },

                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetHistory");
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
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/jquery-mask/masked.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.css")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/createTimesheetController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/StaffCalendarController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetItemCodeDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetOnlyDigits.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                                .then(function() {
                                    callback(null);
                                });
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
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/jquery-mask/masked.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetApproveTaskController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetDetailDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewTaskDirective.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $state.go("loggedIn.timesheetHome.timesheetApprove");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport1Controller.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport1");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport2Controller.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport2");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport3Controller.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport3");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport4Controller.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport4");
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
                                $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport5Controller.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.timesheetHome.timesheetReport5");
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
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport6Controller.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $state.go("loggedIn.timesheetHome.timesheetReport6");
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
                            $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReportOweLeaveController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $state.go("loggedIn.timesheetHome.leaveReportOwe");
                        }
                    ]);
                }
            }
        });

        //END LOAD LEAVE REPORT 6
    });
