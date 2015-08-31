angular.module("app.loggedIn.TimeSheet.Report6.Controller", [])
    .controller("Report6Controller", function($scope, localStorageService, StaffService, TimeSheetService, $cookieStore, toastr, $state, $filter) {
        //popup date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        //load position
        $scope.position = localStorageService.get('position');

        $scope.listDepartmentChoose = [];
        $scope.listEmployeeChoose = [];
        $scope.listDept = [];
        $scope.listEmp = [];

        /*
        ListNew: create new report
        input: list employee id
        output: - success: download file PDF
                - fail: send message error
        */
        $scope.ListNew = function(listNew) {
            if (listNew !== undefined &&
                listNew !== null &&
                listNew.length !== 0) {
                listNew[0].isStaff = $scope.isStaff;
                listNew[0].USER_ID = $cookieStore.get("userInfo").id;
                TimeSheetService.LoadEmpReport(listNew).then(function(response) {
                    if (response.status === "success") {
                        var arrayEmp = [];
                        angular.forEach(response.result, function(emp, index) {
                            arrayEmp.push({
                                id: emp.Employee_ID,
                                label: emp.FirstName + " " + emp.LastName
                            });
                        });
                        $scope.listEmp = angular.copy(arrayEmp);
                        $scope.listEmployeeChoose = [];
                    } else if (response.status === "error") {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Loading employee fail!", "Error");
                    } else {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Server not response!", "Error");
                    }
                });
            }
        };

        //get week's number
        $scope.GetWeekNumber = function(d) {
            d = new Date(+d);
            d.setHours(0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
            var yearStart = new Date(d.getFullYear(), 0, 1);
            var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            return weekNo;
        };

        //change date
        $scope.ChangeDate = function() {
            $scope.ChangeEmp($scope.listEmployeeChoose);
        };

        /*
        ChangeEmp: load employee when choose depoartment
        input: list department is choossed
        output: list employee
        */
        $scope.ChangeEmp = function(list) {
            if ($scope.dateWeekFrom !== undefined && $scope.dateWeekFrom !== null && $scope.dateWeekFrom !== "" &&
                $scope.dateWeekTo !== undefined && $scope.dateWeekTo !== null && $scope.dateWeekTo !== "" &&
                $scope.listEmployeeChoose.length !== 0) {
                var info = {};
                info.listEMP = angular.copy($scope.listEmployeeChoose);
                info.USER_ID = ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null;
                info.dateWeekFrom = $scope.dateWeekFrom;
                info.dateWeekTo = $scope.dateWeekTo;
                info.listDept = angular.copy($scope.listDepartmentChoose);
                TimeSheetService.LoadReportItemNumber(info).then(function(response) {
                    if (response.status === "success") {
                        //pdf
                        $scope.USER_ID = ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null;
                        $scope.disabledPrint = false;

                    } else if (response.status === "dataNull") {
                        toastr.error("Not data!", "Error");
                        $scope.disabledPrint = true;
                    } else if (response.status === "error") {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Loading reports fail!", 'Error');
                    } else {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Server not response!", 'Error');
                    }
                });
            }

        };

        /*
        LoadDeptReport: load list department of redimed
        input: id of user
        output: list department
        */
        $scope.LoadDeptReport = function(userId) {
            TimeSheetService.LoadDeptReport(userId).then(function(response) {
                if (response.status === "error") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Load Department fail!", "Error");
                } else if (response.status === "success") {
                    $scope.listDept = response.result;
                    $scope.isStaff = response.isStaff;
                } else {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };

        $scope.LoadDeptReport($cookieStore.get("userInfo").id);

        //tranlation text department
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

        //enable search department
        $scope.searchDept = {
            enableSearch: true
        };

        //enable search employee
        $scope.searchEmp = {
            enableSearch: true
        };

        //tranlation text employee
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
    });
