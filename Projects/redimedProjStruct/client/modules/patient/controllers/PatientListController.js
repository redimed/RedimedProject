angular.module("app.loggedIn.patient.list.controller", [])

.controller("PatientListController", function($scope, $state, $cookieStore, PatientService, DoctorService){
	//SEARCH FUNCTION
    $scope.searchObjectMap = angular.copy($scope.searchObject);
    //END SEARCH FUNCTION

    // LOAD DOCTOR DETAIL
    var loadDoctorDetail = function(){
    	DoctorService.getByUserId($cookieStore.get("userInfo").id).then(function(data){
    		$scope.searchObjectMap.doctor_id = data.doctor_id;
    	})
    }
    // END LOAD DOCTOR DETAIL

    //LOAD SEARCH
    $scope.list = [];

    $scope.reset = function(){
        $scope.searchObjectMap = angular.copy($scope.searchObject);
        $scope.loadList();
    }

    $scope.loadList = function(){
    	DoctorService.getByUserId($cookieStore.get("userInfo").id).then(function(data){
            if(data){
                $scope.searchObjectMap.doctor_id = data.doctor_id;
                PatientService.search($scope.searchObjectMap).then(function(response){
                    $scope.list = response;
                })
            }
    	})
    }

    $scope.loadList();
    //END LOAD SEARCH

    //CHANGE PAGE
    $scope.setPage = function(){
        $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage-1)*$scope.searchObjectMap.limit;
        $scope.loadList();
    }
    //END CHANGE PAGE

    //GO TO DETAIL
    $scope.goToTimetableDetail = function(list){
    	$cookieStore.put("patientTempInfo", list);
        $state.go("loggedIn.patient.booking");
    }
    //END GO TO DETAIL
})
