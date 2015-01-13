angular.module('app.loggedIn.mdtappointment.search.directive', []).directive('mdtappointmentSearch', function(mdtAppointmentService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/mdtappointment/directives/templates/search.html',
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
						{type: 'text', name: 'DOCTOR_ID', value:''},
						{type: 'text', name: 'SITE_ID', value:''},
						{type: 'text', name: 'FROM_TIME', value:''}
					],
					select: [
						'DOCTOR_ID', 'SITE_ID', 'FROM_TIME'
					]
				}
			}//end init
			var loadList = function(){
				mdtAppointmentService.search(scope.params).then(function(response){
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