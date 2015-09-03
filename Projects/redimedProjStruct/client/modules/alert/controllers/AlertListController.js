angular.module('app.loggedIn.alert.controllers.list', [])

.controller('AlertAddDialog', function($scope, $modalInstance){
	
	$scope.alert = {
		success: false
	}
    
	$scope.$watch('alert.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})

})

.controller('AlertListController', function($scope, $modal, toastr){
	// Dialog add alert
	var add = function(){
		$scope.alert.reload = false;

		$modal.open({
			templateUrl: 'dialogAlertAdd',
			controller: 'AlertAddDialog',
			size: 'lg'
		})
		.result.then(function(response){
			if(response === 'success'){
				toastr.success('Added Successfully');
				$scope.alert.reload = true;
			}
		})
	}

	$scope.alert = {
		dialog: {
			add: function(){ add(); }
		},
		reload: false,
		limit: 20
	}
})