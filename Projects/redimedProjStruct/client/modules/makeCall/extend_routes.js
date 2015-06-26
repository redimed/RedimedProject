angular.module('app.loggedIn.calling')

.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.make_call', {
		url: '/makeCall/:apiKey/:sessionId/:token/:callUser/:isCaller/:patientId',
        views: {
            "root": {
                templateUrl: "modules/makeCall/views/call.html",
                controller: 'callController'
            }
        }
	})

	.state('loggedIn.whiteboard', {
		url: '/whiteboard/:apiKey/:sessionId/:token/:patientId',
        views: {
            "root": {
                templateUrl: "modules/makeCall/views/whiteboard.html",
                controller: 'whiteboardController'
            }
        }
	})
})