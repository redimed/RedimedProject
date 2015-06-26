angular.module('app.loggedIn.corres.edit.controller', [])
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