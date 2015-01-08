angular.module('app.loggedIn.mdtclaim.search.directive', []).directive('mdtclaimSearch', function(mdtClaimService, toastr){
	return {
		restrict: 'EA',
		scope: {
			patientId: '=',
			clickRow: '&',
			isClose: '@'
		},
		templateUrl: 'modules/mdtclaim/directives/templates/search.html',
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
						/*{type: 'text', name: 'Patient_id', value: scope.patientId},*/
						{type: 'text', name: 'Injury_name', value:''},
						{type: 'text', name: 'Location', value:''}
					],
					select: [
						'Claim_id', 'Patient_id', 'Injury_name', 'Location'
					]
				}
			}//end init
			var loadList = function(){
				mdtClaimService.search(scope.params).then(function(response){
					if(response.status==='error') toastr.error('Cannot get Seacrh', 'Error')
					scope.list = response;
				})
			}

			scope.$watch('patientId', function(newPatientId, oldPatientId){
				if(typeof newPatientId !== 'undefined'){
					init();
					loadList();
				}
			})

			scope.setPage = function(){
				scope.params.pagination.offset = (scope.params.pagination.current_page-1)*scope.params.pagination.limit;
				loadList();
			}

			scope.refresh = function(){
				loadList();
			}
		}//end link
	}//end return
})