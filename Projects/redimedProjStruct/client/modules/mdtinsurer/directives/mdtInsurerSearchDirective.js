angular.module('app.loggedIn.mdtinsurer.search.directive', []).directive('mdtinsurerSearch', function(mdtInsurerService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
			isClose: "@"
		},
		templateUrl: 'modules/mdtinsurer/directives/templates/search.html',
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
						{type: 'text', name: 'insurer_name', value:''},
						{type: 'text', name: 'address', value:''},
						{type: 'text', name: 'suburb', value:''}
					],
					select: [
						'insurer_name', 'address', 'suburb'
					]
				}
			}//end init

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			var loadList = function(){
				mdtInsurerService.search(scope.params).then(function(response){
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