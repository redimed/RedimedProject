angular.module("app.loggedIn.doctor.items.controller",[
	"app.loggedIn.doctor.items.cat.controller",
	"app.loggedIn.doctor.items.add.controller",
	"app.loggedIn.doctor.items.edit.controller",
])
.controller("DoctorItemsController", function($scope,  $cookieStore, DoctorService){
	console.log('ITEMS PAGE ' );
	
	$scope.objectMap = {};
	
	var init = function(){
	
		$scope.doctorInfo = $cookieStore.get('doctorInfo');
		
		var dept_id = $scope.doctorInfo.CLINICAL_DEPT_ID;
		DoctorService.getItemByDept(dept_id, false).then(function(data){
			console.log(data);
			$scope.item_list = data;
		});
		
		DoctorService.getItemHeader(dept_id).then(function(data){
			$scope.optCat = data;
			$scope.optCat.unshift({POPULAR_HEADER_ID: '', POPULAR_NAME: '-- All Categories --'});
		});
		
		$scope.optEnable = [
			{code: '', title: 'All'},
			{code: '1', title: 'Enable'},
			{code: '0', title: 'Disable'}
		];
		
		$scope.searchObj = {
			ISENABLE: '1',
			POPULAR_HEADER_ID: '',
		};
	}
	
	init();
});
