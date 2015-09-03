angular.module('app.loggedIn.corres.list.directive', [])
.directive('listCor', function(ConsultationService, ConfigService, $modal, $filter, $stateParams, $state, toastr){
	return {
		restrict: 'EA',
		templateUrl: 'modules/consultation/directives/template_cor/list.html',
		scope: {
			options: '='
		},
		link: function(scope, ele, attrs){


			// information
			var search = {
				page: 1,
				limit: 20,
				offset: 0,
				max_size: 5,
				PATIENT_ID: $stateParams.patient_id,
				CAL_ID: $stateParams.cal_id
			}

			// Load data
			var load = function(){

				ConsultationService.getListCor(search)
				.then(function(response){
					scope.cor.list = response.data;
					scope.cor.list.Date = ConfigService.convertToDate_F(response.data.Date);
					scope.cor.count = response.count;
				}, function(error){})

			}

			// Paging
			scope.setPage = function (page) {
				scope.cor.search.offset = (page-1)*scope.cor.search.limit;
				scope.cor.load();
			}


			// Dialog add or update
			scope.Action = function(type, index){

				if(type == 'new'){

					var modalInstance = $modal.open({
				         templateUrl: 'CorAdd',
				         controller: 'CorrespondenceAddController'
			        })
			        .result.then(function(response){
			        	scope.cor.load();
			        })
				}
				
				if(type == 'update'){
					console.log('sdjkds ', index);
					var modalInstance = $modal.open({
				         templateUrl: 'CorEdit',
				         controller: 'CorrespondenceEditController',
				         resolve: {
							id: function(){
								return index;
							}
						}
			        })
			        .result.then(function(response){
			        	scope.cor.load();
			        })
				}

			}

			scope.cor = {
				search: search,
				load: function(){ load(); },
				loading: false,
				list: [],
				count: 0,
				errors: []
			}
			scope.cor.load();
		}
	}
})