angular.module('app.loggedIn.mdtoutdoctor.search.directive', []).directive('mdtoutdoctorSearch', function(mdtOutdoctorService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
			isClose: '@'
		},
		templateUrl: 'modules/mdtoutdoctor/directives/templates/search.html',
		link: function(scope, element, attrs){
			//POPUP
			scope.closePopup = function(){
				angular.element("#"+scope.isClose).fadeOut();
			}
			//END POPUP

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
						{type: 'text', name: 'provider_no', value:''},
						{type: 'text', name: 'name', value:''},
						{type: 'text', name: 'address', value:''}
					],
					select: [
						'doctor_id', 'provider_no', 'name', 'address'
					]
				}

				if(scope.isClose){
                	scope.closePopup();
                }
			}//end init
			var loadList = function(){
				mdtOutdoctorService.search(scope.params).then(function(response){
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