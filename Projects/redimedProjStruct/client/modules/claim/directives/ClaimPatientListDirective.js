angular.module('app.loggedIn.claim.directives.patientList', [])

.controller('ClaimPatientRemoveDialog', function($scope, $modalInstance, list){
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	$scope.ok = function(){
		$modalInstance.close(list);
	}
})

.controller('ClaimPatientEditDialog', function($scope, $modalInstance, $stateParams, list){
	$scope.claim = {
		Claim_id: list.Claim_id,
		Patient_id: $stateParams.patientId,
		success: false
	}

	$scope.$watch('claim.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})

.directive('claimPatientList', function(ClaimModel, $modal, toastr, $stateParams){
	return {
		restrict: 'EA',
		scope:{
			reload: '=',
			limit: '=',
			patientId: '=',
			calId: '=',
			withoutPatient: '@',
			permission: '@',
			onRowClick: '&',
			addSuccess: '='
		},
		templateUrl: 'modules/claim/directives/templates/patientList.html',
		link: function(scope, elem, attrs){
			if(typeof scope.permission === 'undefined'){
				scope.action = {
					edit: true,
					remove: true,
					add: true
				}
			}else{
				scope.action = scope.$eval(scope.permission);
			}

			var search = {
				page: 1,
				limit: scope.limit,
				offset: 0,
				max_size: 5,
				Claim_no: '',
				Claim_date: 'desc',
				Injury_name: '',
				Injury_date: 'asc',
				Patient_id: scope.patientId
			}

			var load = function(){
				var postData = angular.copy(scope.claim.search);

				if(typeof scope.withoutPatient !== 'undefined' && scope.withoutPatient){
					ClaimModel.listNoFollowPatient(postData)
					.then(function(response){
						scope.claim.list = response.data;
						scope.claim.count = response.count;
					}, function(error){})
				}else{
					ClaimModel.listFollowPatient(postData)
					.then(function(response){
						scope.claim.list = response.data;
						scope.claim.count = response.count;
					}, function(error){})
				}
			}

			var onPage = function(page){
				scope.claim.search.offset = (page-1)*scope.claim.search.limit;
				scope.claim.load();
			}

			var onSearch = function(){
				scope.claim.load();
				scope.claim.search.page = 1;
			}

			var onOrderBy = function(option){
				switch(option.field){
					case 'Claim_date':
						scope.claim.search.Claim_date = option.order;
						break;
					case 'Injury_date':
						scope.claim.search.Injury_date = option.order;
						break;
				}

				scope.claim.load();
			}

			var remove = function(list){
				$modal.open({
					templateUrl: 'dialogClaimRemove',
					controller: 'ClaimPatientRemoveDialog',
					size: 'sm',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(list){
					ClaimModel.remove(list)
					.then(function(response){
						toastr.success('Deleted Successfully');
						scope.claim.load();
					}, function(error){})
				})
			}

			var edit = function(list){
				$modal.open({
					templateUrl: 'dialogClaimEdit',
					controller: 'ClaimPatientEditDialog',
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
						scope.claim.load();
					}
				})
			}

			var add = function(){
				$modal.open({
					templateUrl: 'claimAdd',
					controller: function($scope, $modalInstance, patientId, calId){
						$scope.claim = {
							Patient_id: patientId,
							CAL_ID: calId,
							success: false
						}

						$scope.$watch('claim.success', function(success){
							if(success)
								$modalInstance.close('success');
						})
					},
					size: 'lg',
					resolve: {
						patientId: function(){
							return scope.patientId;
						},
						calId: function(){
							return scope.calId;
						}
					}
				})
				.result.then(function(success){
					if(success === 'success'){
						toastr.success('Add Successfully');
						scope.addSuccess = true;
					}
				})
			}

			scope.claim = {
				dialog: {
					add: function(){
						add();
					},
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
			scope.claim.load();

			scope.$watch('reload', function(reload){
				scope.claim.search = angular.copy(search);
				if(reload) scope.claim.load();
			})
		}
	}
})//END Claim List