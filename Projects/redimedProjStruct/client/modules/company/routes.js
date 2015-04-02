
angular.module('app.loggedIn.company',['app.loggedIn.company.include'])

.config(function($stateProvider){
	$stateProvider
	 .state('loggedIn.company', {
		url: 'patient_id/:patient_id/company/:companyId',
		templateUrl: 'modules/company/views/list.html',
		controller: 'CompanyListController'
			
	})
	.state('loggedIn.company.add', {
			url: '/add',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/add.html',
					controller: 'CompanyAddController'
				}
			}//end views
		})
	.state('loggedIn.company.addParent',{
			url:'/addParent',
			views:{
				'@loggedIn':{
					templateUrl : 'modules/company/dialogs/addParent.html',
					controller : 'CompanyAddParentDialgosController'
				}
			}
	})
	.state('loggedIn.company.addInsurer',{
			url:'/addParent',
			views:{
				'@loggedIn':{
					templateUrl : 'modules/company/dialogs/addInsurer.html',
					controller : 'CompanyInsurerDialgosController'
				}
			}
	})
	.state('loggedIn.company.listParent', {
			url: '/listParent',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/listParent.html',
					controller: 'CompanyListParentController'
				}
			}//end views
		})
	.state('loggedIn.company.listInsurer', {
			url: '/listInsurer',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/listInsurer.html',
					controller: 'CompanylistInsurerController'
				}
			}//end views
		})
})