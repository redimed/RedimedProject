angular.module('app.loggedIn.fadefine',[
	'app.loggedIn.fadefine.controller',
	'app.loggedIn.fadefine.service'
])
.config(function($stateProvider){
	$stateProvider

	.state("loggedIn.fadefine",{
		abstract:true,
		templateUrl: 'modules/fadefine/views/home.html',
		controller: 'FaDefineController'
	})
	.state('loggedIn.fadefine.list',{
		url:'/fa/list',
		views: {
			'main-content':{
				templateUrl:'modules/fadefine/views/list.html',
				controller: 'FaDefineListController'
			}
		}
	})
	.state('loggedIn.fadefine.detail',{
		url:'/fa/:action/:headerId',
		views: {
			'main-content':{
				templateUrl:'modules/fadefine/views/detail.html',
				controller: 'FaDefineDetailController'
			}
		}
	})
});