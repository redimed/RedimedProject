angular.module("app.loggedIn.TimeSheet.CreateLeave.Controller", [])
    .controller("CreateLeaveController", function($scope, TimeSheetService, $cookieStore, $state, toastr, moment, $modal) {
        $scope.info = {};
        $scope.info.standard = 1;
        // POPUP DATE
        $scope.dateOptions = {
            formatYear: "yy",
            startingDate: 1
        };
        //END POPUP

        //LOAD INFO EMPLOYEE
        if ($cookieStore.get('userInfo') !== undefined && $cookieStore.get('userInfo') !== null &&
            $cookieStore.get("userInfo").id !== undefined && $cookieStore.get("userInfo").id !== null) {
            TimeSheetService.LoadInfoEmployee($cookieStore.get('userInfo').id).then(function(response) {
                if (response.status === "success") {
                    $scope.info.infoEmployee = angular.copy(response.result);
                    $scope.info.date_application = new Date();
                } else if (response.status === "error" || response.result.length === 0) {
                    $state.go("loggedIn.TimeSheetHome", null, {
                        "reload": true
                    });
                    toastr("Load infomation employee fail!", "Error");
                } else {
                    //catch exception
                    $state.go("loggedIn.TimeSheetHome", null, {
                        "reload": true
                    });
                    toastr("Server not response!", "Error");
                }
            });
        } else {
            $state.go('loggedIn.login', null, {
                "reload": true
            });
            toastr.error("You not section!", "Error");
        }
        //END LOAD INFO

        //CHECK MIN DATE FINISH
        $scope.changeDateFinish = function(dateFinish) {
            var m = moment(new Date(dateFinish));
            $scope.minDateWork = m.add(1, 'day');
        };
        //END CHECK
        $scope.clickSendServer = function(statusID) {
            //SAVE LEAVE FORM IN SERVER
            console.log($scope.info);
            // END SAVE SERVER
        };

        // LOAD TYPE LEAVE
        TimeSheetService.LoadTypeLeave().then(function(response) {
            if (response.status === "success") {
                $scope.info.infoTypeLeave = angular.copy(response.result);
            } else if (response.status === "error") {
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Load type leave fail!", "Error");
            } else {
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
        //END
    });
