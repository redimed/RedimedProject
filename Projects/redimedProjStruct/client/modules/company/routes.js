
angular.module('app.loggedIn.company',['app.loggedIn.company.include'])

.config(function($stateProvider){
	$stateProvider
	// .state('loggedIn.company', {
	// 	url: '/patientid/:patient_id/company',
	// 	templateUrl: 'modules/company/views/list.html',
	// 	controller: 'CompanyListController'
			
	// })

	.state('loggedIn.patient.company', {
		url: '/company',
		// templateUrl: 'modules/company/views/list.html',
		// controller: 'CompanyListController'
		views: {
			'main-content@loggedIn.patient': {
				templateUrl: 'modules/company/views/list.html',
				controller: 'CompanyListController'
			}
		}
	})

	.state('loggedIn.patient.company.add', {
			url: '/add',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/add.html',
					controller: 'CompanyAddController'
				}
			}//end views
		})
	.state('loggedIn.patient.company.addCompanyNotFollow', {
			url: '/addCompany',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/addCompanyNotFollow.html'
				}
			}//end views
		})
	.state('loggedIn.patient.company.addParent',{
			url:'/addParent',
			views:{
				'@loggedIn':{
					templateUrl : 'modules/company/dialogs/addParent.html',
					controller : 'CompanyAddParentDialgosController'
				}
			}
	})
	.state('loggedIn.patient.company.addInsurer',{
			url:'/addParent',
			views:{
				'@loggedIn':{
					templateUrl : 'modules/company/dialogs/addInsurer.html',
					controller : 'CompanyInsurerDialgosController'
				}
			}
	})
	.state('loggedIn.patient.company.listParent', {
			url: '/listParent',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/listParent.html',
					controller: 'CompanyListParentController'
				}
			}//end views
		})
	.state('loggedIn.patient.company.listInsurer', {
			url: '/listInsurer',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/listInsurer.html',
					controller: 'CompanylistInsurerController'
				}
			}//end views
		})
	.state('loggedIn.patient.company.edit', {
			url: '/:companyId/edit',
			views: {
				'@loggedIn': {
					templateUrl: 'modules/company/views/edit.html',
					controller: 'CompanyEditController'
				}
			}//end views
		})
})