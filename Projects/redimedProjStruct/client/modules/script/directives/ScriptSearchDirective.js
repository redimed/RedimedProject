angular.module('app.loggedIn.script.search.directive', []).directive('scriptSearch', function(ScriptService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '=',
		},
		templateUrl: 'modules/script/directives/templates/search.html',
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
						{type: 'text', name: 'Patient_id', value:''},
						{type: 'text', name: 'CAL_ID', value:''},
						{type: 'text', name: 'prescriber', value:''}
					],
					select: [
						'Patient_id', 'CAL_ID', 'prescriber'
					]
				}
			}//end init
			var loadList = function(){
				ScriptService.search(scope.params).then(function(response){
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