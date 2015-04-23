angular.module("app.loggedIn.TimeSheet.CreateLeave.Controller", [])
    .controller("CreateLeaveController", function($scope, TimeSheetService, $cookieStore, $state, toastr, moment, $modal) {
        $scope.info = {};
        // POPUP DATE
        $scope.dateOptions = {
            formatYear: "yy",
            startingDate: 1
        };
        //END

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
                    te.go("loggedIn.TimeSheetHome", null, {
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

        // //CHECK STANDARD OR NON-STANDARD
        // $scope.info.standard = 1;
        // $scope.info.non_standard = 1;
        // $scope.changeRequest = function(value) {
        //     $scope.info.standard = ($scope.info.standard === 1 ? 0 : 1);
        //     if (value === 'standard' && $scope.info.standard === 0) {
        //         swal({
        //             title: "Do you want apply for leave standard?",
        //             type: "warning",
        //             showCancelButton: true,
        //             confirmButtonColor: "#DD6B55",
        //             confirmButtonText: "Yes",
        //             closeOnConfirm: true
        //         }, function() {
        //             $scope.info.standard = 1;
        //         });
        //     } else if (value === 'non-standard' && $scope.info.non_standard === 1) {
        //         swal({
        //             title: "Do you want apply for leave non-standard?",
        //             type: "warning",
        //             showCancelButton: true,
        //             confirmButtonColor: "#DD6B55",
        //             confirmButtonText: "Yes",
        //             closeOnConfirm: true
        //         }, function() {
        //             $scope.info.standard = 0;
        //         });
        //     }
        // };
        //END CHECK

        //CHECK MIN DATE FINISH
        $scope.changeDateFinish = function(dateFinish) {
            var m = moment(new Date(dateFinish));
            $scope.minDateWork = m.add(1, 'day');
        };
        //END CHECK

        //FUNCTION SIGNATURE
        $scope.clickSignature = function() {
            $modal.open({
                "templateUrl": "SignatureID",
                controller: function($scope) {

                },
                size: "md"
            });
        };
        //END SIGNATURE
    });
