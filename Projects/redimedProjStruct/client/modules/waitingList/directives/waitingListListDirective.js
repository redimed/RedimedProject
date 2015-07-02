angular.module('app.loggedIn.waitingList')

.directive('waitingListList', function($modal, WaitingListModel, ConfigService, $cookieStore, OutreferralModel){
	return {
		restrict: 'EA',
		scope: {
			success: '=',
			doctorId: '=',
			clickRow: '&'
		},
		templateUrl: 'modules/waitingList/directives/templates/list.html',
		link: function(scope, elem, attrs){
			var load = function(){
				WaitingListModel.list().then(function(response){
					scope.waitingList.list = response.data;
				}, function(error){})
			}

			scope.waitingList = {
				list: [],
				load: function(){
					load();
				}
			}

			scope.waitingList.load();
		}
	}
})