angular.module('app.loggedIn.sysstate.search.directive', []).directive('sysstateSearch', function(sysStateService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/sysstate/directives/templates/search.html',
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
						{type: 'text', name: 'State', value:''},
						{type: 'text', name: 'Country_name', value:''},
						{type: 'text', name: 'Isenable', value:''}
					],
					select: [
						'State', 'Country_name', 'Isenable'
					]
				}
			}//end init
			var loadList = function(){
				sysStateService.search(scope.params).then(function(response){
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