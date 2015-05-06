angular.module('app.loggedIn.mdtoutdoctor.add.dialog', [])
.controller('MdtoutdoctorAdddialog', function($scope,$modalInstance){
	$scope.OutsideDoctor = {
		success: false
	}
	$scope.$watch('OutsideDoctor.success', function(success){
		if(success)
			$modalInstance.close('success');
	})
})