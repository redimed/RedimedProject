angular.module('app.loggedIn.systitle.search.directive', []).directive('systitleSearch', function(sysTitleService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '=',
		},
		templateUrl: 'modules/systitle/directives/templates/search.html',
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
						{type: 'text', name: 'name', value:''},
						{type: 'text', name: 'Isenable', value:''},
						{type: 'text', name: 'Created_by', value:''}
					],
					select: [
						'name', 'Isenable', 'Created_by'
					]
				}
			}//end init
			var loadList = function(){
				sysTitleService.search(scope.params).then(function(response){
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