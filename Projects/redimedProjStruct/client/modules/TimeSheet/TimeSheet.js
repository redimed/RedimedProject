angular.module("app.loggedIn.TimeSheet", [
        "app.loggedIn.TimeSheet.Home.Controller",
        "app.loggedIn.TimeSheet.Directives",
        "app.loggedIn.TimeSheet.Service",
        "app.loggedIn.staff.service"
    ])
    .config(function($stateProvider) {

        $stateProvider
        //HOME
            .state("loggedIn.TimeSheetHome", {
                abstract: true,
                url: "/timesheet",
                templateUrl: "modules/TimeSheet/views/structure.html",
                controller: "TimeSheetHomeController"
            })
            //END HOME

        // APPROVE TASK
        .state("loggedIn.TimeSheetHome.ApproveTask", {
                position: ["Head of Dept.", "Director"],
                url: "/approve-task",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ApproveTask.html",
                        controller: "ApproveTask"
                    }
                }
            })
            //END APPROVE TASK

        //VIEW APPROVED 
        .state("loggedIn.TimeSheetHome.ViewAppovedTimeSheet", {
                position: ["Head of Dept.", "Director"],
                url: "/view-approved-task",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ViewApproved.html",
                        controller: "ViewApprovedTimeSheet"
                    }
                }
            })
            //END VIEW APPROVED

        // REPORT TIME IN LIEU
        .state("loggedIn.TimeSheetHome.Report1TimeSheet", {
                url: "/report-time-in-lieu",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report1.html",
                        controller: "Report1Controller"
                    }
                }

            })
            //END REPORT TIME IN LIEU

        // REPORT ON UTILIZATION RATIO DETAIL
        .state("loggedIn.TimeSheetHome.Report2TimeSheet", {
                url: "/report-on-utilization-ratio-detail",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report2.html",
                        controller: "Report2Controller"
                    }
                }
            })
            //END REPORT

        // REPORT UTILIZATION SUMMARY
        .state("loggedIn.TimeSheetHome.Report3TimeSheet", {
                url: "/report-on-utilization-ratio-summary",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report3.html",
                        controller: "Report3Controller"
                    }
                }
            })
            //END REPORT

        // REPORT WORKING HOURS
        .state("loggedIn.TimeSheetHome.Report4TimeSheet", {
                url: "/report-on-actual-working-hours",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report4.html",
                        controller: "Report4Controller"
                    }
                }
            })
            //END REPORT 

        // REPORT WORKING RATIO
        .state("loggedIn.TimeSheetHome.Report5TimeSheet", {
                url: "/report-on-actual-working-ratio",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report5.html",
                        controller: "Report5Controller"
                    }
                }
            })
            //END REPORT

        // REPORT ITEM NUMBER
        .state("loggedIn.TimeSheetHome.Report6TimeSheet", {
                url: "/report-on-item-number",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/Report6.html",
                        controller: "Report6Controller"
                    }
                }
            })
            //END REPORT

        // CREATE LEAVE
        .state("loggedIn.TimeSheetHome.CreateLeave", {
                position: ["Staff", "Head of Dept."],
                url: "/create-leave/:id",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/CreateLeave.html",
                        controller: "CreateLeaveController"
                    }
                }
            })
            //END CREATE LEAVE

        // LEAVE HISTORY
        .state("loggedIn.TimeSheetHome.LeaveHistory", {
                position: ["Staff", "Head of Dept."],
                url: "/leave-history",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/HistoryLeave.html",
                        controller: "HistoryLeaveController"
                    }
                }
            })
            //END LEAVE HISTORY

        // APPROVE LEAVE
        .state("loggedIn.TimeSheetHome.ApproveLeave", {
                position: ["Head of Dept.", "Director"],
                url: "/approve-leave",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ApproveLeave.html",
                        controller: "ApproveLeaveController"
                    }
                }
            })
            //END APPROVE LEAVE

        //REPORT SUBMMITED LEAVE FORM
        .state("loggedIn.TimeSheetHome.ReportOweLeave", {
                position: ["Head of Dept.", "Director"],
                url: "/report-unsubmitted-leave-form",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/ReportOweLeave.html",
                        controller: "ReportOweLeave"
                    }
                }
            })
            //END REPORT

        //VIEW TIME-SHEET
        .state("loggedIn.TimeSheetHome.view", {
                position: ["Staff", "Head of Dept."],
                url: "/view-timesheet",
                views: {
                    "main-content": {
                        templateUrl: "modules/TimeSheet/views/viewTimesheet.html",
                        controller: "TimesheetViewController"
                    }
                }
            })
            //END VIEW TIME-SHEET

        //CREATE TIME-SHEET
        .state("loggedIn.TimeSheetHome.create", {
            position: ["Staff", "Head of Dept."],
            url: "/create/:id",
            views: {
                "main-content": {
                    templateUrl: "modules/TimeSheet/views/createTimesheet.html",
                    controller: "TimesheetCreateController"
                }
            }
        });
        //END CREATE TIME-SHEET
    });
