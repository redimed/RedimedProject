angular.module("app.loggedIn.doctor.items.add.controller",[
])
.controller("DoctorItemsAddController", function($scope, $cookieStore, toastr, ConfigService, DoctorService){	

	
	var init = function(){
		$scope.info = {action: 'Add'};
		$scope.modeFormItem.init();
	
	};
	
	var submitForm = function(){
		var header_id = $scope.POPULAR_HEADER_ID;
		console.log('DATA SUBMIT ',$scope.modelObjectMap);

		DoctorService.insertItem(header_id, $scope.modelObjectMap).then(function(data){
			if(data.status == 'success') {
				toastr.success('Insert Successfully!!!', "Success");
				$scope.modeFormItem.reset();
				$scope.isSubmit = false;
			} else {
				$scope.modelObjectMap.ITEM_START_DATE = '';
				$scope.modelObjectMap.ITEM_END_DATE = '';
			}
		});
	}
	
	$scope.save = function(){
		$scope.isSubmit = true;
		
		if($scope.mainForm.$invalid || !$scope.modeFormItem.validate()){
			toastr.error('Please Check Your Information !!!', "Error");
			return;
		} 
		$scope.modeFormItem.submit(submitForm);
	}
	
	init();
//	console.log($scope.options);
})