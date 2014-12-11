angular.module('app.loggedIn.sysservice.search.directive', []).directive('sysserviceSearch', function(sysServiceService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/sysservice/directives/templates/search.html',
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
						{type: 'text', name: 'SERVICE_NAME', value:''},
						{type: 'text', name: 'DESCRIPTION', value:''},
						{type: 'text', name: 'Isenable', value:''}
					],
					select: [
						'SERVICE_NAME', 'DESCRIPTION', 'Isenable'
					]
				}
			}//end init
			var loadList = function(){
				sysServiceService.search(scope.params).then(function(response){
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