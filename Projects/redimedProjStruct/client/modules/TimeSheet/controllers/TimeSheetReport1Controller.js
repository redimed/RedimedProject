angular.module("app.loggedIn.TimeSheet.Report1.Controller", [])
    .controller("Report1Controller", function($scope, localStorageService, TimeSheetService, $cookieStore, toastr, $state) {
        //POSITION
        $scope.position = localStorageService.get('position');
        //END
        //INPUT DATE
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //END
        $scope.toDate = new Date();
        $scope.listDepartment = [];
        $scope.listEmployee   = [];
        $scope.listDept = [];
        $scope.listEmpl = [];
        $scope.list = [];
        $scope.translationDept = {
            checkAll: 'Check All',
            uncheckAll: 'Uncheck All',
            selectionCount: 'Department Selected',
            nameAddon: "Department",
            buttonDefaultText: '--Choose Department--',
            dynamicButtonTextSuffix: 'Department Selected'
        };
        $scope.translationEmpl = {
            checkAll: 'Check All',
            uncheckAll: 'Uncheck All',
            selectionCount: 'Employee Selected',
            nameAddon: "Employee",
            buttonDefaultText: '--Choose Employee--',
            dynamicButtonTextSuffix: 'Employee Selected'
        };
        TimeSheetService.LoadDeptReport($cookieStore.get("userInfo").id).then(function(result){
            if(result.status==="error"){
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Load Department fail!", "Error");
            }
            else if(result.status==="success"){
                $scope.listDept = result.result;
            }
            else{
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");

            }
        });
         //FUNCTION GET WEEK NUMBER
        $scope.getWeekNumber = function(d) {
            d = new Date(+d);
            d.setHours(0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
            var yearStart = new Date(d.getFullYear(), 0, 1);
            var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            return weekNo;
        };

        $scope.GetEmpl =function(ListNew){
            TimeSheetService.LoadEmpReport(ListNew).then(function(result){
                if(result.status==="success"){
                    var arr = [];
                    angular.forEach(result.result, function(emp, index) {
                        arr.push({
                            id: emp.Employee_ID,
                            label: emp.FirstName + " " + emp.LastName
                        });
                    });
                    $scope.listEmpl = angular.copy(arr);
                }
                else if(result.status==="error"){
                    $state.go("loggedIn.TimeSheetHome",null,{
                        "reload": true
                    });
                    toastr.error("Load Employee fail!","Error");
                }
                else{
                    $state.go("loggedIn.TimeSheetHome",null,{
                        "reload": true
                    });
                    toastr.error("Server not response!","Error");
                }
            });
           
        };
        $scope.LoadEmpl = function(list){
            if(($scope.dateweekfrom!==null && $scope.dateweekfrom!==undefined && $scope.dateweekfrom!=="") && ($scope.dateweekto!==null && $scope.dateweekto!==undefined && $scope.dateweekto!=="") && $scope.listEmployee.length!==0){
                var info = {};
                var Weeknofrom   = $scope.dateweekfrom;
                var Weeknoto     = $scope.dateweekto;
                info.Weeknofrom  = $scope.getWeekNumber(Weeknofrom);
                info.Weeknoto    = $scope.getWeekNumber(Weeknoto);
                info.listEmpl    = angular.copy($scope.listEmployee);
                info.USER_ID     = $cookieStore.get('userInfo').id;
                info.WeekFrom    = $scope.dateweekfrom;
                info.WeekTo      = $scope.dateweekto;
                info.listDept    = $scope.listDepartment;
                TimeSheetService.InsertTimeinlieuReport(info).then(function(result){
                    if(result.status==="success"){
                        $scope.list = result.data;
                        toastr.success("Success!!!");
                    }
                    else{
                        toastr.error("Fail!!!!");
                    }
                });


            }
        }
    });
