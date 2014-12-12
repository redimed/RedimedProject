angular.module('app.loggedIn.mdtdept.search.directive', []).directive('mdtdeptSearch', function(mdtDeptService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/mdtdept/directives/templates/search.html',
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
						{type: 'text', name: 'CLINICAL_DEPT_NAME', value:''},
						{type: 'text', name: 'ISENABLE', value:''},
						{type: 'text', name: 'Created_by', value:''}
					],
					select: [
						'CLINICAL_DEPT_NAME', 'ISENABLE', 'Created_by'
					]
				}
			}//end init
			var loadList = function(){
				mdtDeptService.search(scope.params).then(function(response){
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