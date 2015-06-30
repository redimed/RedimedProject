angular.module("app.loggedIn.doctor.items.edit.controller",[
])
.controller("DoctorItemsEditController", function($scope, $state, toastr, localStorageService, ConfigService, DoctorService){
		var old_header_id = '';
		var getData = function(item_id){
			DoctorService.getItemByCode(item_id).then(function(data){
				console.log(data);
				if(data.status == 'success') {
					console.log(data);
					data.result[0].ITEM_START_DATE = ConfigService.getCommonDateDefault(data.result[0].ITEM_START_DATE );
					data.result[0].ITEM_END_DATE = ConfigService.getCommonDateDefault(data.result[0].ITEM_END_DATE);
					angular.extend($scope.modelObjectMap, data.result[0]);
				} else {
					toastr.error('Something happened!', "Error");
				}
			});
		};

		var init = function(){
			$scope.modeFormItem.init();
			$scope.isSubmit = false;
			
			$scope.info = {action : 'Edit'};
			
			var updateMode = localStorageService.get("updateData");
			$scope.inUpdateMode = updateMode.isUpdateMode;
			if(updateMode != null && updateMode != undefined){
				if(updateMode.item_id != null && updateMode.item_id!= '' && updateMode.item_id!= undefined){
					getData(updateMode.item_id);
					$scope.POPULAR_HEADER_ID = updateMode.header_code;
					//angular.extend(old_header_id,updateMode.header_code);
					old_header_id = updateMode.header_code;
				}
			}
		};


		var submitForm = function(){
			var new_header_id = $scope.POPULAR_HEADER_ID;

			console.log('DATA SUBMIT ',$scope.modelObjectMap);

			DoctorService.editItem($scope.modelObjectMap, old_header_id, new_header_id).then(function(data){
				if(data.status == 'success') {
					toastr.success('Update Successfully!!!', "Success");
					$state.go('loggedIn.doctor.items');
				} else {
					//$scope.modelObjectMap.ITEM_START_DATE = '';
					//$scope.modelObjectMap.ITEM_END_DATE = '';
				}
			});
		};


		$scope.editItem = function(){
			$scope.isSubmit = true;
			if($scope.mainForm.$invalid || !$scope.modeFormItem.validate()){
				toastr.error('Please Check Your Information !!!', "Error");
				return;
			}

			delete $scope.modelObjectMap.CREATION_DATE;
			delete $scope.modelObjectMap.Last_update_date;
			delete $scope.modelObjectMap.BENEFIT_START_DATE;
			delete $scope.modelObjectMap.EMSN_START_DATE;
			delete $scope.modelObjectMap.EMSN_END_DATE;
			delete $scope.modelObjectMap.EMSN_CHANGE_DATE;
			delete $scope.modelObjectMap.EMSN_CHANGE_DATE;
			delete $scope.modelObjectMap.DERIVED_FEE_START_DATE;
			delete $scope.modelObjectMap.DESCRIPTION_START_DATE;
			delete $scope.modelObjectMap.QFE_START_DATE;
			delete $scope.modelObjectMap.QFE_END_DATE;

			$scope.modeFormItem.submit(submitForm);
		};

		init();
});