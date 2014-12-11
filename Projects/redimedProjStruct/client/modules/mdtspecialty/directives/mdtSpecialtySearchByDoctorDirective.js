angular.module('app.loggedIn.mdtspecialty.search_by_doctor.directive', [])
.directive('mdtspecialtySearchbydoctor', function(mdtDoctorService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
			options: "=",
			doctor: '=',
			count: '='
		},
		templateUrl: 'modules/mdtspecialty/directives/templates/searchByDoctor.html',
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
						{type: 'text', name: 'Specialties_name', value:''},
						{type: 'select', name: 'RL_TYPE_ID', value: ''},
						{type: 'text', name: 'cln_specialties.Isenable', value: 1}
					],
					doctor_id: 0
				}
			}//end init

			scope.$watch("doctor", function(newDoctor){
				if(typeof newDoctor.doctor_id !== 'undefined'){
					init();
					scope.params.doctor_id = newDoctor.doctor_id;
					loadList();
				}
			})
			var loadList = function(){
				mdtDoctorService.specialities(scope.params).then(function(response){
            		scope.list = response;
            		scope.count = response.count;
        		}, function(error){
            		console.log(error);
        		})
			}
			
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