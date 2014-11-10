angular.module("app.loggedIn.doctor.items.add.controller",[
])
.controller("DoctorItemsAddController", function($scope, $filter, $cookieStore, toastr, ConfigService, DoctorService){	
	
	$scope.reset = function(){
		$scope.isSubmit = false;
		$scope.modelObjectMap = {
			ITEM_TYPE: 'Services',
		};
		$scope.invalid = {};
	}
	
	var init = function(){
		$scope.reset();
		
		$scope.doctorInfo = $cookieStore.get('doctorInfo');
		var dept_id = $scope.doctorInfo.CLINICAL_DEPT_ID;
		$scope.info = {action: 'Add'};
		
		var initOption = function(){
			$scope.options = {};
			
			ConfigService.taxes_option().then(function(data){
				$scope.options.taxes = data;
			});
			ConfigService.prefix_headers_option('item').then(function(data){
				$scope.options.prefix_headers = data;
			});
			ConfigService.provider_types_option().then(function(data){
				$scope.options.provider_types = data;
			});
			
			ConfigService.inv_uoms_option().then(function(data){
				$scope.options.uoms = data;
			});
			
			DoctorService.getItemHeader(dept_id).then(function(data){
				$scope.options.item_headers = data;
			});
		}
		
		initOption();
	};
	
	$scope.validateForm = function(){
		var date_pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
		
		// CHECK FORMAT OF DATE
		if($scope.modelObjectMap.ITEM_START_DATE && !date_pattern.test($scope.modelObjectMap.ITEM_START_DATE)){
			$scope.invalid.ITEM_START_DATE = true;
		} else {
			$scope.invalid.ITEM_START_DATE = false;
		}

		if($scope.modelObjectMap.ITEM_END_DATE && !date_pattern.test($scope.modelObjectMap.ITEM_END_DATE)){
			$scope.invalid.ITEM_END_DATE = true;
		}  else {
			$scope.invalid.ITEM_END_DATE = false;
		}
		
		if($scope.invalid.ITEM_END_DATE || $scope.invalid.ITEM_START_DATE)
			return false;
			
			
		return true;
	}
	
	$scope.save = function(){
		$scope.isSubmit = true;
		
		if($scope.mainForm.$invalid || !$scope.validateForm()){
			toastr.error('Please Check Your Information !!!', "Error");
			return;
		} 
		
		var header_id = $scope.POPULAR_HEADER_ID;
		var t_start = $scope.modelObjectMap.ITEM_START_DATE;
		var t_end =  $scope.modelObjectMap.ITEM_END_DATE;
		
		$scope.modelObjectMap.ITEM_START_DATE = ConfigService.getCommonDateDatabase(t_start);
		$scope.modelObjectMap.ITEM_END_DATE = ConfigService.getCommonDateDatabase(t_end);
		
		var arrFilter =  $filter('arrGetBy');
		var obj = arrFilter($scope.options.prefix_headers, 'PREFIX_NAME', $scope.modelObjectMap.ITEM_TYPE);
		$scope.modelObjectMap.Prefix = obj.PREFIX;

		DoctorService.insertItem(header_id, $scope.modelObjectMap).then(function(data){
			if(data.status == 'success') {
				toastr.success('Insert Successfully!!!', "Success");
				$scope.reset();
			}
		});
		
		$scope.modelObjectMap.ITEM_START_DATE = t_start;
		$scope.modelObjectMap.ITEM_END_DATE = t_end;
	}
	
	init();
//	console.log($scope.options);
})