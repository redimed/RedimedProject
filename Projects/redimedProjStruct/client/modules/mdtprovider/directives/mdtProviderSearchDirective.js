angular.module('app.loggedIn.mdtprovider.search.directive', []).directive('mdtproviderSearch', function(mdtProviderService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '=',
		},
		templateUrl: 'modules/mdtprovider/directives/templates/search.html',
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
						{type: 'text', name: 'Provider_types_name', value:''},
						{type: 'text', name: 'Isenable', value:''},
						{type: 'text', name: 'Created_by', value:''}
					],
					select: [
						'Provider_types_name', 'Isenable', 'Created_by'
					]
				}
			}//end init
			var loadList = function(){
				mdtProviderService.search(scope.params).then(function(response){
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