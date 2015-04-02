angular.module('app.loggedIn.company.directives.listInsurer', [])

.directive('listInsurer', function(CompanyModel, $filter,$state){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/listInsurer.html',
		scope: {
			options: '=',
			limit: '@',
			onRowClick: '&'
		},
		link: function(scope, elem, attrs){
			var search = {
				Company_name: '',
				address:''
			}
			var load = function(){
				scope.company.loading = true;
				CompanyModel.listInsurer(search).then(function(response){
					scope.company.loading = false;
					scope.company.list = response.data;
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
			}
			scope.company = {
				search: search,
				loading: false,
				list: [],
				load: function(){ load(); }
			}

			scope.company.load();
		}//end link
	}//end return
	
})
