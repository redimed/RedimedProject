angular.module("app.loggedIn.doctor.patients.controller", [
    "app.loggedIn.doctor.patients.detail.controller"
])
        .controller("DoctorPatientsController", function ($scope, $state, $cookieStore, DoctorService, localStorageService,CompanyModel) {
			var userInfo = $cookieStore.get("userInfo");

            var doctorInfo = $cookieStore.get("doctorInfo");

            $scope.isFilterBelowDoctor=1;

            if(!doctorInfo) $state.go('loggedIn.home') ;


            $scope.reset = function () {
                $scope.searchObjectMap = angular.copy($scope.searchPatientsObject);
                $scope.loadList();
            }

            //LOAD SEARCH
            $scope.loadList = function () {
                DoctorService.getByUserId(userInfo.id).then(function (data) {
                    if($scope.isFilterBelowDoctor==1)
                    {
                        $scope.searchObjectMap.doctor_id = data.doctor_id;
                    }
                    else
                    {
                        delete $scope.searchObjectMap.doctor_id;
                    }
                    
                    DoctorService.listPatients($scope.searchObjectMap).then(function (response) {
						console.log(response);
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
                //$state.go("loggedIn.doctor.patients.detail");//tan rem


                //tan: begin add
                var postData = {
                    datetime : moment().format('YYYY-MM-DD hh:mm:ss'),
                    patient_id :list.Patient_id
                }
                ////exlog.alert(postData)
                CompanyModel.getFromTime(postData)
                .then(function(response){
                    if (response.data == -1 ) {
                       $state.go("loggedIn.patient.appointment", {patient_id: list.Patient_id, cal_id: -1}); 
                    }else{
                        $state.go("loggedIn.patient.appointment", {patient_id: list.Patient_id, cal_id: response.data.CAL_ID});
                    }
                    
                }, function(error){

                })
                //tan: end add
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
