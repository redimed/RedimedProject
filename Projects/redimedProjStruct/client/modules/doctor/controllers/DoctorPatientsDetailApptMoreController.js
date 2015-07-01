angular.module("app.loggedIn.doctor")
.controller("DoctorPatientsDetailApptMoreController", function ($scope, $filter, $state, toastr, $cookieStore, ConfigService, DoctorService, localStorageService) {
	
	var arrGetBy =  $filter('arrGetBy');
	
	$scope.loadList = function(){
		DoctorService.searchItem($scope.searchObjectMap).then(function(data){
			// HIDE CHOOSEN ITEMS 
			for(var i = 0, len = data.list.length; i < len; ++i){
				data.list[i].chosen = arrGetBy($scope.chosenItems, 'ITEM_ID', data.list[i].ITEM_ID) ? true : false;
			}
			$scope.data = data;
		});
	}
	
	$scope.setPage = function () {
		$scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
		$scope.loadList();
	}
	
	$scope.setPageLimit = function () {
		$scope.searchObjectMap.offset = 0;
		$scope.searchObjectMap.currentPage = 1;
		$scope.loadList();
	}
	
	$scope.reset = function(){
		$scope.searchObjectMap = {
			limit: 10,
			offset: 0,
			maxSize: 5,
			currentPage: 1,
			data: {
				name: '',
				code: '',
				type: '',
			}
		};
		$scope.chosenItems = [];
		$scope.loadList();
	}

    var init = function () {
	    $scope.patient = localStorageService.get("patientTempInfo");
		$scope.options = {};
		
		if(!$scope.patient) {
			$state.go('loggedIn.doctor.home');
		}
		
		ConfigService.prefix_headers_option('item').then(function(data){
			$scope.options.prefixs = data;
		});
		$scope.reset();
    };
    
	init();
	
	
    /**
     *  PROCESS CHOOSE ITEM + SUBMIT FUNCTION
     */
	
	$scope.removeItem = function(item, index) {
		var t = arrGetBy($scope.data.list , 'ITEM_ID', item.ITEM_ID);
		if(t) t.chosen = false;
		$scope.chosenItems.splice(index, 1);
	}
	
	$scope.chooseItem = function(item){
		item.chosen = true;
		$scope.chosenItems.push(item);
		console.log($scope.chosenItems);
	}
	
	$scope.submit = function(){
		if($scope.chosenItems.length > 0)
			localStorageService.set('itemsTempList', $scope.chosenItems);
		$state.go('loggedIn.doctor.patients.detail.appt');
	}
});
