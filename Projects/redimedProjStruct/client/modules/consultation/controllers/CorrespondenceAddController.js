angular.module("app.loggedIn.patient.consult")
.controller('CorrespondenceAddController', function($scope, $state, $modalInstance ){
	$scope.addcor = {
		success: false
	}

	$scope.$watch('addcor.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})