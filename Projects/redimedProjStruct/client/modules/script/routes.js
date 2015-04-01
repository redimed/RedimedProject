angular.module('app.loggedIn.script', [
	'app.loggedIn.script.include'
])
.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.script', {
		url: '/patient/:patientId/script/:calId',
		templateUrl: 'modules/script/views/list.html',
		controller: 'ScriptListController'

	})
	.state('loggedIn.script.add', {
		url: '/add',
		views: {
			'@loggedIn': {
				templateUrl: 'modules/script/views/add.html',
				controller: 'ScriptAddController'
			}
		}

	})
	.state('loggedIn.script.edit', {
		url: '/edit/:scriptId',
		views:{
			'@loggedIn': {
				templateUrl: 'modules/script/views/edit.html',
				controller: 'ScriptEditController'
			}
		}
	})

})