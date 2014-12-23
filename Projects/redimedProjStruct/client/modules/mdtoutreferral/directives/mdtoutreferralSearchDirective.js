angular.module('app.loggedIn.mdtoutreferral.search.directive', []).directive('mdtoutreferralSearch', function(mdtoutreferralService, toastr, ConfigService){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/mdtoutreferral/directives/templates/search.html',
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
						{type: 'text', name: 'date_issued', value:''},
						{type: 'text', name: 'date_started', value:''},
						{type: 'text', name: 'duration', value:''}
					],
					select: [
						'id','date_issued', 'date_started', 'expire_date', 'duration'
					]
				}
			}//end init
			var loadList = function(){
				mdtoutreferralService.search(scope.params).then(function(response){
					if(response.status==='error') toastr.error('Cannot get Seacrh', 'Error')
					scope.list = response;
					for(var i = 0; i < scope.list.data.length; i++){
						scope.list.data[i].date_issued_map = ConfigService.getCommonDateDefault(scope.list.data[i].date_issued);
						scope.list.data[i].expire_date_map = ConfigService.getCommonDateDefault(scope.list.data[i].expire_date);
					}
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