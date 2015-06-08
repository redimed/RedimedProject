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

	.state('loggedIn.template_add', {
		url: '/template/add',
		templateUrl: 'modules/template/views/add.html',
		controller: 'TemplateAddController'
	})

	.state('loggedIn.template_write', {
		url: '/template/write/:id',
		templateUrl: 'modules/template/views/write.html',
		controller: 'TemplateWriteController'
	})

	.state('loggedIn.template_edit', {
		url: '/template/edit/:id',
		templateUrl: 'modules/template/views/edit.html',
		controller: 'TemplateEditController'
	})

})