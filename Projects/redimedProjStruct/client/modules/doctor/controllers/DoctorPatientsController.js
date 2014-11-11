angular.module("app.loggedIn.doctor.patients.controller", [
    "app.loggedIn.doctor.patients.detail.controller"
])
        .controller("DoctorPatientsController", function ($scope, $state, $cookieStore, DoctorService, localStorageService) {
			var userInfo = $cookieStore.get("userInfo");
            // LOAD DOCTOR DETAIL
            var loadDoctorDetail = function () {
                DoctorService.getByUserId(userInfo.id).then(function (data) {
                    $scope.searchObjectMap.doctor_id = data.doctor_id;
                })
            }
            // END LOAD DOCTOR DETAIL


            $scope.reset = function () {
                $scope.searchObjectMap = angular.copy($scope.searchPatientsObject);
                $scope.loadList();
            }

            //LOAD SEARCH
            $scope.loadList = function () {
                DoctorService.getByUserId(userInfo.id).then(function (data) {
                    $scope.searchObjectMap.doctor_id = data.doctor_id;
                    DoctorService.listPatients($scope.searchObjectMap).then(function (response) {
						//console.log(response);
                        $scope.list = response;
                    })
                })
            }
            //END LOAD SEARCH

            //CHANGE PAGE
            $scope.setPage = function () {
                $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
                $scope.loadList();
            }
            //END CHANGE PAGE

            //GO TO DETAIL
            $scope.goToTimetableDetail = function (list) {
				localStorageService.set("patientTempInfo", list);
                //$cookieStore.put("patientTempInfo", list);
                $state.go("loggedIn.doctor.patients.detail");
            }
            //END GO TO DETAIL

            var init = function () {
                //SEARCH FUNCTION
                $scope.searchObjectMap = angular.copy($scope.searchPatientsObject);
                //END SEARCH FUNCTION

                $scope.list = [];
                $scope.loadList();
            }

            init();


        });
