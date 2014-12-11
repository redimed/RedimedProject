angular.module("app.loggedIn.doctor.timetable.controller",[
	"app.loggedIn.doctor.timetable.detail.controller"
])

.controller("DoctorTimetableController", function($scope, $state){
    //PARAMS
    $scope.params_doctor_add = {
        permission: { create: true, popup: true },
        popupId: "TimetableDoctorAdd"
    }

    $scope.relationships = {
        specialties: {
            count: 0
        }
    }
    //END PARAMS

    //ACTION
    $scope.openPopup = function(option){
        if(option.module === 'doctor'){
            switch(option.type){
                case 'add':
                    angular.element("#"+$scope.params_doctor_add.popupId).fadeIn();
                    break;
            }
        }
    }
    //END ACTION

    //ACCORDION
    $scope.accordion = {
        oneAtATime: false,
        specialties: true
    }
    //END ACCORDION

    //SELECT DOCTOR
    $scope.selectedDoctor = {};
    $scope.selectDoctor = function(row){
        $scope.selectedDoctor =  row;

        $state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId: $scope.selectedDoctor.doctor_id});
    }
    //END SELECT DOCTOR
    
	//SEARCH FUNCTION
    //$scope.searchObjectMap = angular.copy($scope.searchObject);
    //END SEARCH FUNCTION

    //LOAD SEARCH
    /*$scope.list = [];

    $scope.reset = function(){
        $scope.searchObjectMap = angular.copy($scope.searchObject);
        $scope.loadList();
    }

    $scope.loadList = function(){
    	DoctorService.search($scope.searchObjectMap).then(function(response){
    		$scope.list = response;
    	})
    }

    $scope.loadList();*/
    //END LOAD SEARCH

    //CHANGE PAGE
    /*$scope.setPage = function(){
        $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage-1)*$scope.searchObjectMap.limit;
        $scope.loadList();
    }*/
    //END CHANGE PAGE

    //GO TO DETAIL
    /*$scope.goToTimetableDetail = function(list){
    	$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId: list.doctor_id});
    }*/
    //END GO TO DETAIL

    // GO TO
    /*$scope.goToDoctor = function(){
        $state.go("loggedIn.doctor.add");
    }*/
    // END GO TO
    
})