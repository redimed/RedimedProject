angular.module('app.loggedIn.outreferral.directives.patientList', [])

.controller('OutreferralPatientRemoveDialog', function($scope, $modalInstance, list){
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	$scope.ok = function(){
		$modalInstance.close(list);
	}
})

.controller('OutreferralPatientEditDialog', function($scope, $modalInstance, $stateParams, list){
	$scope.outreferral = {
		id: list.id,
		patient_id: list.patient_id,
		success: false
	}

	$scope.$watch('outreferral.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})

.directive('outreferralPatientList', function(OutreferralModel, $modal, toastr, $stateParams){
	return {
		restrict: 'EA',
		scope:{
			reload: '=',
			limit: '=',
			patientId: '=',
			withoutPatient: '@',
			permission: '@',
			onRowClick: '&'
		},
		templateUrl: 'modules/outreferral/directives/templates/patientList.html',
		link: function(scope, elem, attrs){
			if(typeof scope.permission === 'undefined'){
				scope.action = {
					edit: true,
					remove: true
				}
			}else{
				scope.action = scope.$eval(scope.permission);
			}

			var search = {
				page: 1,
				limit: scope.limit,
				offset: 0,
				max_size: 5,
				patient_id: scope.patientId
			}

			var load = function(){
				var postData = angular.copy(scope.outreferral.search);

				if(typeof scope.withoutPatient !== 'undefined' && scope.withoutPatient){
					OutreferralModel.listNoFollowPatient(postData)
					.then(function(response){
						scope.outreferral.list = response.data;
						scope.outreferral.count = response.count;
					}, function(error){})
				}else{
					OutreferralModel.listFollowPatient(postData)
					.then(function(response){
						scope.outreferral.list = response.data;
						scope.outreferral.count = response.count;
					}, function(error){})
				}
			}

			var onPage = function(page){
				scope.outreferral.search.offset = (page-1)*scope.outreferral.search.limit;
				scope.outreferral.load();
			}

			var onSearch = function(){
				scope.outreferral.load();
				scope.outreferral.search.page = 1;
			}

			var onOrderBy = function(option){
				switch(option.field){
					case 'Claim_date':
						scope.outreferral.search.Claim_date = option.order;
						break;
					case 'Injury_date':
						scope.outreferral.search.Injury_date = option.order;
						break;
				}

				scope.outreferral.load();
			}

			var remove = function(list){
				$modal.open({
					templateUrl: 'dialogOutreferralRemove',
					controller: 'OutreferralPatientRemoveDialog',
					size: 'sm',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(list){
					OutreferralModel.remove(list)
					.then(function(response){
						toastr.success('Deleted Successfully');
						scope.outreferral.load();
					}, function(error){})
				})
			}

			var edit = function(list){
				$modal.open({
					templateUrl: 'dialogOutreferralEdit',
					controller: 'OutreferralPatientEditDialog',
					size: 'lg',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(response){
					if(response === 'success'){
						toastr.success('Edit Successfully');
						scope.outreferral.load();
					}
				})
			}

			scope.outreferral = {
				dialog: {
					remove: function(list){
						remove(list);
					},
					edit: function(list){
						edit(list);
					}
				},
				load: function(){ load(); },
				list: [],
				count: 0,
				search: angular.copy(search),
				onPage: function(page){ onPage(page); },
				onSearch: function(){ onSearch(); },
				onOrderBy: function(option){ onOrderBy(option); }
			}

			//INIT
			scope.outreferral.load();

			scope.$watch('reload', function(reload){
				scope.outreferral.search = angular.copy(search);
				if(reload) scope.outreferral.load();
			})
		}
	}
})//END Claim List