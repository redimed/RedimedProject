angular.module("app.security.terms.controller",[])
.controller('SecurityTermsController',function($scope,$cookieStore,$state){
    // console.log($state);
    var from = $cookieStore.get('fromState');
	var params = {};
    console.log(from);
    $scope.changeState = function(){
    	$state.go(from.fromState.name,params,{location: "replace", reload: false});
    }
})