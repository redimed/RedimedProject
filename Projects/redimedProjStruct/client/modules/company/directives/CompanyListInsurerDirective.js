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
			scope.setPage = function(page){
				scope.company.search.offset = (page-1)*scope.company.search.limit;
				scope.company.load();
			}
			var search = {
				page: 1,
				offset: 0,
				limit: 7,
				max_size: 5,
				Company_name: '',
				Industry:'',
				address:''
			}
			var load = function(){
				scope.company.loading = true;
				CompanyModel.listInsurer(search).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.list = response.data;
					scope.company.count = response.count;
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
			}
			scope.company = {
				search: search,
				error: '',
				count: 0,
				loading: false,
				list: [],
				load: function(){ load(); },
				loadPage: function(page){ loadPage(page); },
				onSearch: function(option){ onSearch(option)}
			}

			/* LOAD FIRST */
			scope.company.load();
			/* END LOAD FIRST */
		}//end link
	}//end return
	
})
