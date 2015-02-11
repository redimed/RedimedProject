angular.module('app.loggedIn.rlob.paperless.controller',[])
    .controller("rlob_paperlessController", function($scope,rlobService,$cookieStore,$state) {
    	$scope.userType=rlobConstant.userType;
    	$scope.loginInfo=$cookieStore.get('userInfo').user_type;
      console.log($scope.loginInfo);
    	$scope.isDoctor = true;
    	if ($scope.loginInfo == $scope.userType.doctor) {
    		$scope.isDoctor = false;
    	};
    	$scope.isAdmin = true;
    	if ($scope.loginInfo == $scope.userType.admin) {
    		$scope.isAdmin = false;
    	};
    	$scope.isAssistant = true;
    	if ($scope.loginInfo == $scope.userType.assistant) {
    		$scope.isAssistant = false;
    	};
    	console.log($scope.userType.doctor);
});