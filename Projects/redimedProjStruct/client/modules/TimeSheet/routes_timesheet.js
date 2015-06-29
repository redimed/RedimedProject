angular.module("app.loggedIn.TimeSheet", [
        "app.loggedIn.TimeSheet.Service",
        "app.loggedIn.staff.service"
    ])
    .config(function($stateProvider) {

        $stateProvider
            .state("loggedIn.leaveLoadHistory", {
                url: "/leave-load-history",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.leaveLoadApply", {
                url: "/leave-load-apply",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.leaveLoadApprove", {
                url: "/timesheet-load-approve",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadHistory", {
                url: "/timesheet-load-history",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadCreate", {
                url: "/timesheet-load-create",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadApprove", {
                url: "/timesheet-load-approve",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadReport1", {
                url: "/timesheet-load-report1",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadReport2", {
                url: "/timesheet-load-report2",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadReport3", {
                url: "/timesheet-load-report3",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadReport4", {
                url: "/timesheet-load-report4",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadReport5", {
                url: "/timesheet-load-report5",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.timesheetLoadReport6", {
                url: "/timesheet-load-report6",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
            .state("loggedIn.leaveLoadReportOwe", {
                url: "/leave-load-reportowe",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        .then(function() {
                            $state.go("loggedIn.TimeSheetHome");
                        });
                    }
                }
            })
    });
