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
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.leaveHistory");
                            });
                        //END LOAD DIRECTIVE
                    }
                }
            })
            //END LOAD LEAVE HISTORY

        //LOAD LEAVE CREATE
        .state("loggedIn.timesheetHome.loadLeaveCreate", {
                url: "/load-leave-create",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                        //END LOAD LIBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js")
                            //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules//TimeSheet/directives/TimeSheetFilter.js")
                            //END LOAD DIRECTIVE
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.leaveCreate");
                            });
                    }
                }
            })
            //END LOAD LEAVE CREATE

        //LOAD LEAVE APPROVE
        .state("loggedIn.timesheetHome.loadLeaveApprove", {
                url: "/load-leave-approve",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetApproveLeaveController.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveApproveDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                            //END LOAD DIRECTIVE
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.leaveApprove");
                            });
                    }
                }
            })
            //END LOAD LEAVE APPROVE

        //LOAD TIMESHEET HISTORY
        .state("loggedIn.timesheetHome.loadTimesheetHistory", {
                url: "/load-timesheet-history",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.css");
                        //END LOAD LIBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/viewTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffCalendarController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                            //END LOAD DIRECTIVE
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.timesheetHistory");
                            });
                    }
                }
            })
            //END LOAD TIMESHEET HISTORY

        //LOAD TIMESHEET CREATE
        .state("loggedIn.timesheetHome.loadTimesheetCreate", {
            url: "/timesheet-load-create",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {

                    //LOAD ROUTE
                    $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                    //END LOAD ROUTE

                    //LOAD LIBRARY
                    $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                    $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                    $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                    $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.css");
                    //END LOAD LIBRARY

                    //LOAD CONTROLLER
                    $ocLazyLoad.load("modules/TimeSheet/controllers/createTimesheetController.js");
                    $ocLazyLoad.load("modules/TimeSheet/controllers/StaffCalendarController.js");
                    $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                    $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                    //END LOAD CONTROLLER

                    //LOAD DIRECTIVE
                    $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetItemCodeDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetOnlyDigits.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetTimeDirective.js");
                    $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                        //END LOAD DIRECTIVE
                        .then(function() {
                            $state.go("loggedIn.timesheetHome.timesheetCreate");
                        });
                }
            }
        })

        //END LOAD TIMESHEET CREATE

        //LOAD TIMESHEET APPROVE
        .state("loggedIn.timesheetHome.loadTimesheetApprove", {
            url: "/timesheet-load-approve",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    //LOAD ROUTE
                    $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                        //END LOAD ROUTE

                    //LOAD LIBRARY
                    $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                    //END LOAD LIBRARY

                    //LOAD CONTROLLER
                    $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetApproveTaskController.js")
                        //END LOAD CONTROLLER

                    //LOAD DIRECTIVE
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetDetailDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewTaskDirective.js");
                    $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js")
                        //END LOAD DIRECTIVE
                        .then(function() {
                            $state.go("loggedIn.timesheetHome.timesheetApprove");
                        });
                }
            }
        })

        //END LOAD TIMESHEET APPROVE

        //LOAD TIMESHEET REPORT1
        .state("loggedIn.timesheetHome.loadTimesheetReport1", {
                url: "/timesheet-load-report1",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {

                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                            //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        //END LOAD LUBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport1Controller.js")
                            //END LOAD CONTROLLER
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.timesheetReport1");
                            });
                    }
                }
            })
            //END LOAD TIMESHEET REPORT1

        //LOAD TIMESHEET REPORT2
        .state("loggedIn.timesheetHome.loadTimesheetReport2", {
                url: "/timesheet-load-report2",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                            //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        //END LOAD LUBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport2Controller.js")
                            //END LOAD CONTROLLER
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.timesheetReport2");
                            });
                    }
                }
            })
            //END LOAD TIMESHEET REPORT2

        //LOAD TIMESHEET REPORT3
        .state("loggedIn.timesheetHome.loadTimesheetReport3", {
                url: "/timesheet-load-report3",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                            //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        //END LOAD LUBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport3Controller.js")
                            //END LOAD CONTROLLER
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.timesheetReport3");
                            });
                    }
                }
            })
            //END LOAD TIMESHEET REPORT3

        //LOAD TIMESHEET REPORT4
        .state("loggedIn.timesheetHome.loadTimesheetReport4", {
                url: "/timesheet-load-report4",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                            //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        //END LOAD LUBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport4Controller.js")
                            //END LOAD CONTROLLER
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.timesheetReport4");
                            });
                    }
                }
            })
            //END LOAD TIMESHEET REPORT 4

        //LOAD TIMESHEET REPORT 5
        .state("loggedIn.timesheetHome.loadTimesheetReport5", {
                url: "/timesheet-load-report5",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                            //END LOAD ROUTE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        //END LOAD LUBRARY

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport5Controller.js")
                            //END LOAD CONTROLLER                            
                            .then(function() {
                                $state.go("loggedIn.timesheetHome.timesheetReport5");
                            });
                    }
                }
            })
            //END LOAD TIMESHEET REPORT 5

        //LOAD TIMESHEET REPORT 6
        .state("loggedIn.timesheetHome.loadTimesheetReport6", {
            url: "/timesheet-load-report6",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    //LOAD ROUTE
                    $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                        //END LOAD ROUTE

                    //LOAD LIBRARY
                    $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                    //END LOAD LUBRARY

                    //LOAD CONTROLLER
                    $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport6Controller.js")
                        //END LOAD CONTROLLER
                        .then(function() {
                            $state.go("loggedIn.timesheetHome.timesheetReport6");
                        });
                }
            }
        })

        //END LOAD TIMESHEET REPORT 6

        //LOAD LEAVE REPORT OWE
        .state("loggedIn.timesheetHome.loadLeaveReportOwe", {
            url: "/leave-load-reportowe",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    //LOAD ROUTE
                    $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js")
                        //END LOAD ROUTE

                    //LOAD LIBRARY
                    $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                    //END LOAD LUBRARY

                    //LOAD CONTROLLER
                    $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReportOweLeaveController.js")
                        //END LOAD CONTROLLER
                        .then(function() {
                            $state.go("loggedIn.timesheetHome.leaveReportOwe");
                        });
                }
            }
        });

        //END LOAD LEAVE REPORT 6
    });
