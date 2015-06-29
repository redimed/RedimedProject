angular.module("app.loggedIn.TimeSheet", [])
    .config(function($stateProvider) {

        $stateProvider
            .state("loggedIn.timesheetStaffLoad", {
                url: "/timesheet-staff-load",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/ViewTaskController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/createTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/viewTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport2Controller.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport3Controller.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport6Controller.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetItemCodeDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetOnlyDigits.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetTimeDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                        //END LOAD DIRECTIVE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                            //END LOAD LIBRARY
                            .then(function() {
                                // $state.go("loggedIn.TimeSheetHome");
                                console.log("LOAD FINISH");
                            });
                    }
                }
            })
            .state("loggedIn.timesheetHODLoad", {
                url: "/timesheet-hod-load",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/TimeSheet/controllers/ViewTaskController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/createTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/viewTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport2Controller.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport3Controller.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport6Controller.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetItemCodeDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetOnlyDigits.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetTimeDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                        //END LOAD DIRECTIVE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                            //END LOAD LIBRARY
                            .then(function() {
                                $state.go("loggedIn.TimeSheetHome");
                            });
                    }
                }
            })
            .state("loggedIn.timesheetDir", {
                url: "/timesheet-dir-load",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/TimeSheet/extend_routes_timesheet.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("vendor/jquery-mask/masked.js");
                        $ocLazyLoad.load("vendor/dropdown-multiselect/src/angularjs-dropdown-multiselect.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jquery.animate.clip.js");
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/calendar-jquery/jCal.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/ViewTaskController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffWeekController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/StaffMonthController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/createTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/viewTimesheetController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport2Controller.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport3Controller.js");
                        $ocLazyLoad.load("modules/TimeSheet/controllers/TimeSheetReport6Controller.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetItemCodeDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetOnlyDigits.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetFilter.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetTimeDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffCalendarDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffMonthDirective.js");
                        $ocLazyLoad.load("modules/TimeSheet/directives/StaffWeekDirective.js");
                        //END LOAD DIRECTIVE

                        //LOAD LIBRARY
                        $ocLazyLoad.load("vendor/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js")
                            //END LOAD LIBRARY
                            .then(function() {
                                $state.go("loggedIn.TimeSheetHome");
                            });
                    }
                }
            });
    });
