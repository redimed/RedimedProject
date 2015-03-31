angular.module('app.loggedIn.claim.directives.list', [])

.directive('claimList', function(ClaimModel){
	return {
		restrict: 'EA',
		templateUrl: 'modules/claim/directives/templates/list.html',
		link: function(scope, elem, attrs){
			ClaimModel.list().then(function(response){

			}, function(error){

			})
		}
	}//end return
})//end directive