angular.module('app.loggedIn.doctor')
.controller("FaChooseController",function($scope, $stateParams, $state){
	var patient_id = $scope.patient_id = $stateParams.patient_id;
	var cal_id = $scope.cal_id = $stateParams.cal_id;
	$scope.fa_panel={};

	$scope.fa = {
		select:0,
		scope: $scope.fa_panel,
		options: {
			api:'api/erm/v2/fa/fa_choose_search',
			method: 'post',
			scope: $scope.fa_panel,
			columns:[
                {field: 'FA_ID', is_hide: true},
                {field: 'TYPE', label: 'Type'},
                {field: 'FA_NAME', label: 'Name'},
            ],
            search:{
            	patient_id: patient_id,
            	cal_id: cal_id
            },
            use_filters: true,
            filters:{
            	TYPE: {type: 'text'},
            	FA_NAME: {type: 'text'}
            },
		}
	}

    $scope.clickRow = function(item){
    	// $state.go('loggedIn.fadefine.detail',{action:'edit', headerId: item.FA_ID});
    	console.log('this is choosen item', item);
  //   	var patient_id = $scope.patient_id = $stateParams.patient_id;
		// var cal_id = $scope.cal_id = $stateParams.cal_id;
		var params = {patient_id: patient_id, cal_id: cal_id, fa_id:item.FA_ID};
		var str_state = 'loggedIn.FA';
		$state.go(str_state, params);
	}
})