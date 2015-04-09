angular.module("app.loggedIn.TimeSheet.Report4.Controller", [])
    .controller("Report4Controller", function($scope, localStorageService, StaffService, TimeSheetService, $cookieStore, toastr, $state, $filter) {

        //LOAD POSITION
        $scope.position = localStorageService.get('position');
        //END

        //SHOW WEEK
        StaffService.showWeek();
        //END SHOW WEEK

        $scope.listDepartmentChoose = [];
        $scope.listEmployeeChoose = [];
        //SERVICE LOAD DEPT

        $scope.ListNew = function(listNew) {
            TimeSheetService.LoadEmpReport(listNew).then(function(response) {
                if (response.status === "success") {
                    //LOAD EMP
                    var arrayEmp = [];
                    angular.forEach(response.result, function(emp, index) {
                        arrayEmp.push({
                            id: emp.Employee_ID,
                            label: emp.FirstName + " " + emp.LastName
                        });
                    });
                    $scope.listEmp = angular.copy(arrayEmp);
                    //END
                } else if (response.status === "error") {
                    $state.go("loggedIn.TimeSheetHome", null, {
                        "reload": true
                    });
                    toastr.error("Loading employee fail!", "Error");
                } else {
                    //catch exception
                    $state.go("loggedIn.TimeSheetHome", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };
        //FUNCTION GET WEEK NUMBER
        $scope.getWeekNumber = function(d) {
            d = new Date(+d);
            d.setHours(0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
            var yearStart = new Date(d.getFullYear(), 0, 1);
            var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            return weekNo;
        };
        //FUNCTION GET WEEK NUMBER

        $scope.SENDMAIL = function() {
            //CALL SERVICE CALL MAIL
            //END CALL
        };

        $scope.changeEmp = function(list) {
            if ($scope.dateWeekFrom !== undefined && $scope.dateWeekFrom !== null && $scope.dateWeekFrom !== "" &&
                $scope.dateWeekTo !== undefined && $scope.dateWeekTo !== null && $scope.dateWeekTo !== "" &&
                $scope.listEmployeeChoose.length !== 0) {
                var info = {};
                var weekNoFrom = new Date($scope.dateWeekFrom.substr(6, 4), $scope.dateWeekFrom.substr(3, 2) - 1, $scope.dateWeekFrom.substr(0, 2));
                var weekNoTo = new Date($scope.dateWeekTo.substr(6, 4), $scope.dateWeekTo.substr(3, 2) - 1, $scope.dateWeekTo.substr(0, 2));
                info.weekNoFrom = $scope.getWeekNumber(weekNoFrom);
                info.weekNoTo = $scope.getWeekNumber(weekNoTo);
                info.listEMP = angular.copy($scope.listEmployeeChoose);
                info.USER_ID = $cookieStore.get('userInfo').id;
                info.weekFrom = $scope.dateWeekFrom.substr(6, 4) + '-' + $scope.dateWeekFrom.substr(3, 2) + '-' + $scope.dateWeekFrom.substr(0, 2);
                info.weekTo = $scope.dateWeekTo.substr(6, 4) + '-' + $scope.dateWeekTo.substr(3, 2) + '-' + $scope.dateWeekTo.substr(0, 2);
                info.weekNoFrom = $scope.getWeekNumber(weekNoFrom);
                TimeSheetService.LoadReports1(info).then(function(response) {
                    if (response.status === "success") {
                        // PROCESSING PDF
                        $scope.USER_ID = $cookieStore.get('userInfo').id;
                        //END PDF
                    } else if (response.status === "error") {
                        $state.go("loggedIn.TimeSheetHome", null, {
                            "reload": true
                        });
                        toastr.error("Loading reports fail!", 'Error');
                    } else {
                        //catch exception
                        $state.go("loggedIn.TimeSheetHome", null, {
                            "reload": true
                        });
                        toastr.error("Server not response!", 'Error');
                    }
                });
            }

        };

        // END DEPT
        TimeSheetService.LoadDeptReport($cookieStore.get("userInfo").id).then(function(response) {
            if (response.status === "error") {
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Load Department fail!", "Error");
            } else if (response.status === "success") {
                $scope.listDept = response.result;
            } else {
                //catch exception
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
        //TRANLATION TEXT DEPT
        $scope.translationTextDept = {};
        $scope.translationTextDept = {
            checkAll: 'Check All',
            uncheckAll: 'Uncheck All',
            selectionCount: 'Department Selected',
            selectionOf: '/',
            nameAddon: "Department",
            searchPlaceholder: 'Search...',
            buttonDefaultText: '--Choose Department--',
            dynamicButtonTextSuffix: 'Department Selected'
        };
        //END DEPT

        // SEARCH DEPT
        $scope.searchDept = {
            enableSearch: true
        };
        // END SEARCH

        // SEARCH EMP
        $scope.searchEmp = {
            enableSearch: true
        };
        // END SEARCH

        //TRANLATION TEXT EMP
        $scope.translationTextEmp = {};
        $scope.translationTextEmp = {
            checkAll: 'Check All',
            uncheckAll: 'Uncheck All',
            selectionCount: 'Employee Selected',
            selectionOf: '/',
            nameAddon: "Employee",
            searchPlaceholder: 'Search...',
            buttonDefaultText: '--Choose Employee--',
            dynamicButtonTextSuffix: 'Employee Selected'
        };
        //END EMP
    });
