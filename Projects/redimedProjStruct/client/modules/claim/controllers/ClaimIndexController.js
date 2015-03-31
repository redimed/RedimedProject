angular.module('app.loggedIn.claim.controllers.index', [])

.controller('ClaimIndexController', function($scope, ClaimModel){
	console.log(ClaimModel);

	ClaimModel.list().then(function(response){

	}, function(error){
		
	})
})