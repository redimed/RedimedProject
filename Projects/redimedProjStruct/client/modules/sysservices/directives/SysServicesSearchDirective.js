angular.module('app.loggedIn.sysservices.search.directive', []).directive('sysservicesSearch', function(SysServicesService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
            isLoad: "="
		},
		templateUrl: 'modules/sysservices/directives/templates/search.html',
		link: function(scope, element, attrs){
            scope.$watch('isLoad',function(newIsLoad){
                console.log('changed');
                if(newIsLoad===true){
                    init();
                    loadList();
                    scope.isLoad=false;
                }
            });
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
						{type: 'text', name: 'SERVICE_COLOR', value:''},
					],
					select: [
						'SERVICE_ID', 'FEE_TYPE_ID', 'SERVICE_NAME', 'DESCRIPTION', 'SERVICE_COLOR', 'Isenable'
					]
				}
			}//end init
			var loadList = function(){
				SysServicesService.search(scope.params).then(function(response){
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