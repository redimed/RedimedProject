angular.module("app.loggedIn.TimeSheet.Report1.Controller", [])
    .controller("Report1Controller", function($scope, localStorageService, StaffService, TimeSheetService, $cookieStore, toastr, $state, $filter) {

        // POPUP Date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        // END
        //LOAD POSITION
        $scope.position = localStorageService.get('position');
        //END
        $scope.listDepartmentChoose = [];
        $scope.listEmployeeChoose = [];
        $scope.listDept = [];
        $scope.listEmp = [];
        $scope.isHavedata = 0;
        //SERVICE LOAD DEPT

        $scope.ListNew = function(listNew) {
            if (listNew !== undefined &&
                listNew !== null &&
                listNew.length !== 0) {
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
                        $scope.listEmployeeChoose = [];
                        //END
                    } else if (response.status === "error") {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Loading employee fail!", "Error");
                    } else {
                        //catch exception
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Server not response!", "Error");
                    }
                });
            }

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

        $scope.changeEmp = function(list) {
            if ($scope.listEmployeeChoose.length !== 0) {
                $scope.isHavedata = 1;
                var info = {};
                info.listEMP = angular.copy($scope.listEmployeeChoose);
                info.USER_ID = $cookieStore.get('userInfo').id;
                info.listDept = angular.copy($scope.listDepartmentChoose);
                TimeSheetService.LoadReportTimeInLieu(info).then(function(response) {
                    if (response.status === "success") {
                        // PROCESSING PDF
                        $scope.USER_ID = $cookieStore.get('userInfo').id;
                        //END PDF
                    } 
                    else if (response.status === "error") {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Loading reports fail!", 'Error');
                    }
                    else if(response.status === "null") {
                        $scope.isHavedata = 0;
                        toastr.error("No Data!!!!",'Error');
                    } 
                    else {
                        //catch exception
                        $state.go("loggedIn.home", null, {
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
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Load Department fail!", "Error");
            } else if (response.status === "success") {
                $scope.listDept = response.result;
            } else {
                //catch exception
                $state.go("loggedIn.home", null, {
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
            nameAddon: ($scope.position === 'Director') ? 'Departments' : 'Department',
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
            nameAddon: ($scope.position === 'Director' || $scope.position === 'Head of Dept.') ? 'Employees' : 'Employee',
            searchPlaceholder: 'Search...',
            buttonDefaultText: '--Choose Employee--',
            dynamicButtonTextSuffix: 'Employee Selected'
        };
        //END EMP
    });
