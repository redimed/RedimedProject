angular.module('app.loggedIn.company.directives.listNotFollow', [])

.directive('listCompanyNotfollow', function(CompanyModel, $filter,$state){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/listNotFollowPatient.html',
		scope: {
			options: '=',
			limit: '@',
			onRowClick: '&',
			listId:'='
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
				Industry :'',
				Addr:'',
				country:'',
				//listId:scope.listId
			}
			var load = function(){
				scope.company.loading = true;
				CompanyModel.listNotFollow(search).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.list = response.data;
					scope.company.count = response.count;
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
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
					case 'country':
						scope.company.search.country = option.value;
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
