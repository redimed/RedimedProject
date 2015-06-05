angular.module('app.loggedIn.template', [
	'app.loggedIn.template.include'
])

.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.template', {
		url: '/template',
		templateUrl: 'modules/template/views/list.html',
		controller: 'TemplateListController'
	})

})