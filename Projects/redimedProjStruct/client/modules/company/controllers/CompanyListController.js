angular.module('app.loggedIn.company.controllers.list', [])

.controller('CompanyListController', function($scope, $state){
	$scope.actionCenter={
		runWhenFinish:function(){
			$scope.getPatientInfo();
		}
	}
})