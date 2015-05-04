angular.module('app.loggedIn.mdtdoctor.search.directive', []).directive('mdtdoctorSearch', function(mdtDoctorService, toastr,$modal){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
			isClose: '@'
		},
		templateUrl: 'modules/mdtdoctor/directives/templates/search.html',
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
						limit: 30,
						offset: 0,
						current_page: 1,
						max_size: 3
					},
					filters: [
						{type: 'text', name: 'NAME', value:''},
						{type: 'text', name: 'Email', value:''},
						{type: 'text', name: 'Phone', value:''},
						{type: 'text', name: 'Isenable', value:'1'}
					],
					select: [
						'doctor_id', 'NAME', 'Email', 'Phone', 'CLINICAL_DEPT_ID'
					]
				}

				if(scope.isClose){
                	scope.closePopup();
                }
			}//end init
			var loadList = function(){
				mdtDoctorService.search(scope.params).then(function(response){
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
			scope.addDoctor = function(){
				var modalInstance = $modal.open({
					templateUrl: 'AddDoctorDialog',
					size: 'lg',
					controller: function($scope, $modalInstance){
						$scope.params_doctor = {
		                    permission: {
		                        create: true,
		                        edit: false
		                    }
		                }
		                $scope.itemUpdate = false;

		                $scope.$watch('itemUpdate', function(item){
		                	if(item === true)
		                		$modalInstance.close('success');
		                }) 
					}
				})
				.result.then(function(response){  	
			    })
			}
			scope.refresh = function(){
				loadList();
			}

		}//end link
	}//end return
})