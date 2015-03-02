angular.module('app.loggedIn.mdtrecall.search.directive', []).directive('mdtrecallSearch', function(mdtRecallService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/mdtrecall/directives/templates/search.html',
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
						{type: 'text', name: 'patient_id', value:''},
						{type: 'text', name: 'notes', value:''},
						{type: 'text', name: 'transaction_date', value:''}
					],
					select: [
						'patient_id', 'notes', 'transaction_date'
					]
				}
			}//end init
			var loadList = function(){
				mdtRecallService.search(scope.params).then(function(response){
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