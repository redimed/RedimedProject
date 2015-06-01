angular.module('app.loggedIn.company.directives.listParent', [])

.directive('listParent', function(CompanyModel, $filter,$state){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/listParent.html',
		scope: {
			options: '=',
			limit: '@',
			onRowClick: '&',
			companyId: '='
		},
		link: function(scope, elem, attrs){
			 var setPage = function(page){
				scope.company.search.offset = (page-1)*scope.company.search.limit;
				scope.company.load();
			}
			var search = {
				page: 1,
				offset: 0,
				limit: 7,
				max_size: 5,
				Company_name: '',
				Company_id :scope.companyId,
				Industry:'',
				Addr:'',
				country:''
			}
			var load = function(){
				scope.company.loading = true;
				CompanyModel.listParent(search).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.list = response.data;
					scope.company.count = response.count;
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
			}
			scope.addClick = function(){
				// $state.go('loggedIn.company.add');//tan comment
				$state.go('loggedIn.patient.company.add');//tan add
			}
			var onSearch = function(option){
				switch(option.field){
					case 'Company_name':
						scope.company.search.Company_name = option.value;
						break;
					case 'Industry':
						scope.company.search.Industry = option.value;
						break;
					case 'Addr':
						scope.company.search.Addr = option.value;
						break;
				}//end switch
				scope.company.load();
				setPage(1);
			}
			scope.company = {
				search: search,
				error: '',
				count: 0,
				loading: false,
				list: [],
				load: function(){ load(); },
				setPage: function(page){ setPage(page); },
				onSearch: function(option){ onSearch(option)}
			}

			/* LOAD FIRST */
			scope.company.load();
			/* END LOAD FIRST */
		}//end link
	}//end return
	
})
