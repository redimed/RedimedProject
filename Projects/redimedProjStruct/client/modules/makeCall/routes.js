angular.module('app.calling', [])

.config(function($stateProvider){
	$stateProvider
		.state('test_call', {
			url: '/testCall/:apiKey/:clientId/:callUser/:isCaller/:patientId',
	        views: {
	            "root": {
	                templateUrl: "modules/makeCall/views/call_apiRTC.html",
	                controller: 'callControllerApiRTC'
	            }
	        }
		})

		.state('make_call', {
			url: '/makeCall/:apiKey/:sessionId/:token/:callUser/:isCaller/:patientId',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
	                    function(callback){
	                        $ocLazyLoad.load("modules/user/services/UserServices.js")
	                        .then(function() {
	                            callback(null);
	                        })
	                    },
	                ]);
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