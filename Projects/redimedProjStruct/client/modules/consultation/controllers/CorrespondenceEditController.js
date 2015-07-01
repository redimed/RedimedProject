angular.module("app.loggedIn.patient.consult")
.controller('CorrespondenceEditController', function($scope, $state, $modalInstance, id){
	$scope.editcor = {
		success: false,
		id: id
	}

	$scope.$watch('editcor.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})