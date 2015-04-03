angular.module('app.loggedIn.claim.directives.add', [])

.directive('claimAdd', function(){
	return {
		restrict: 'EA',
		scope:{
			params: '='
		},
		templateUrl: 'modules/claim/directives/templates/add.html',
		link: function(scope, elem, attrs){
			
		}
	}
})//END Claim List