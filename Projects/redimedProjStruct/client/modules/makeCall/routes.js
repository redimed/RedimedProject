angular.module('app.calling', [])

.config(function($stateProvider){
	$stateProvider
		.state('make_call', {
			url: '/makeCall/:apiKey/:sessionId/:token/:callUser/:isCaller/:patientId',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/user/services/UserServices.js");
				}
			},
	        views: {
	            "root": {
	                templateUrl: "modules/makeCall/views/call.html",
	                controller: 'callController'
	            }
	        }
		})

		.state('whiteboard', {
			url: '/whiteboard/:apiKey/:sessionId/:token/:patientId',
	        views: {
	            "root": {
	                templateUrl: "modules/makeCall/views/whiteboard.html",
	                controller: 'whiteboardController'
	            }
	        }
		})


})