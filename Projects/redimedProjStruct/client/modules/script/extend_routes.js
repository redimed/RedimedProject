angular.module('app.loggedIn.script')
.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.patient.script_list', {
		url: '/script',
		views: {
			'main-content': {
				templateUrl: 'modules/script/views/list.html',
				controller: 'ScriptListController'
			}
		}

	})
	.state('loggedIn.patient.script.add', {
		url: '/add',
		views: {
			'@loggedIn': {
				templateUrl: 'modules/script/views/add.html',
				controller: 'ScriptAddController'
			}
		}

	})
	.state('loggedIn.patient.script.edit', {
		url: '/edit/:scriptId',
		views:{
			'@loggedIn': {
				templateUrl: 'modules/script/views/edit.html',
				controller: 'ScriptEditController'
			}
		}
	})

})