angular.module('app.loggedIn.mdtoutdoctor.add.dialog', [])
.controller('MdtoutdoctorAdddialog', function($scope,$modalInstance){
	 $scope.ok = function () {
	    $modalInstance.close();
	  };
	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
})