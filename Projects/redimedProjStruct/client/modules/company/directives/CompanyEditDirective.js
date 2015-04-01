angular.module('app.loggedIn.company.directives.edit', [])

.directive('editCompany', function(CompanyModel, ModalService, $filter,$state,CommonModel,localStorageService ,$stateParams  ){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/edit.html',
		scope: {
			options: '='
		},
		link: function(scope, elem, attrs){
		}//end link
		
	}//end return
})