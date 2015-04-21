angular.module('app.loggedIn.fadefine.detail.controller',[])
.controller("FaDefineDetailController", function($scope, ConfigService){

	$scope.oneAtATime = false;

	$scope.score_type_opt = ConfigService.score_type_option();
	$scope.comment_type_opt = ConfigService.comment_type_option();

	$scope.rating_type_opt = ConfigService.score_type_option(); //will change to rank table soon
});