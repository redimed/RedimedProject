angular.module('app.loggedIn.mdtredimedsites.search.directive', []).directive('mdtredimedsitesSearch', function(mdtRedimedsitesService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/mdtredimedsites/directives/templates/search.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.list = {};
				scope.params = {
					pagination: {
						limit: 5,
						offset: 0,
						current_page: 1,
						max_size: 3
					},
					filters: [
						{type: 'text', name: 'Site_name', value:''},
						{type: 'text', name: 'Site_addr', value:''},
						{type: 'text', name: 'postcode', value:''}
					],
					select: [
						'Site_name', 'Site_addr', 'postcode'
					]
				}
			}//end init
			var loadList = function(){
				mdtRedimedsitesService.search(scope.params).then(function(response){
					if(response.status==='error') toastr.error('Cannot get Seacrh', 'Error')
					scope.list = response;
				})
			}
			init();
			loadList();
			scope.setPage = function(){
				scope.params.pagination.offset = (scope.params.pagination.current_page-1)*scope.params.pagination.limit;
				loadList();
			}
		}//end link
	}//end return
})