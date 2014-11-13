angular.module("app.loggedIn.doctor.timetable.controller",[
	"app.loggedIn.doctor.timetable.detail.controller"
])

.controller("DoctorTimetableController", function($scope, $state, ConfigService, DoctorService){
	//SEARCH FUNCTION
    $scope.searchObjectMap = angular.copy($scope.searchObject);
    //END SEARCH FUNCTION

    //LOAD SEARCH
    $scope.list = [];

    $scope.reset = function(){
        $scope.searchObjectMap = angular.copy($scope.searchObject);
        $scope.loadList();
    }

    $scope.loadList = function(){
    	DoctorService.search($scope.searchObjectMap).then(function(response){
    		$scope.list = response;
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
    	$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId: list.doctor_id});
    }
    //END GO TO DETAIL

    // GO TO
    $scope.goToDoctor = function(){
        $state.go("loggedIn.doctor.add");
    }
    // END GO TO
    
})