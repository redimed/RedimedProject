angular.module('app.loggedIn.company')

.controller('CompanyListController', function($scope, $state){
	$scope.actionCenter={
		runWhenFinish:function(){
			$scope.getPatientInfo();
		}
	}
})