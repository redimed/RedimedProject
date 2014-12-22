angular.module("app.loggedIn.patient.claim.list.controller", [
	
])

.controller("ClaimListController", function($scope, $stateParams, ClaimService, toastr){
	//DECLARE
	var idClaimDetailAdd = "#PopupClaimDetailAdd";

	$scope.claim_params = {
		permission: {
			edit: false
		},
		Patient_id: $stateParams.patient_id
	};
	$scope.list = {};

	$scope.$watch("claim", function(newClaim){
		if(typeof newClaim !== 'undefined'){
			loadList();
			angular.element(idClaimDetailAdd).fadeOut();
		}
	});

	$scope.params = {
		pagination: {
			limit: 10,
			offset: 0,
			current_page: 1,
			max_size: 5
		},
		filters: [
			{type: 'select', name: 'Patient_id', value: $stateParams.patient_id},
			{type: 'select', name: 'Claim_no', value: ''},
			{type: 'text', name: 'Injury_name', value:''},
			{type: 'text', name: 'Location', value: ''}
		],
		select: ['Claim_id', 'Patient_id', 'Claim_no', 'Injury_name', 'Location']
	}//END DECLARE

	var loadList = function(){
		ClaimService.search($scope.params).then(function(response){
			if(response.status==='success'){
				$scope.list = response;
			}
		}, function(error){
			console.log("Error Server");
		})
	}

	loadList();

	$scope.refreshList = function(){
		loadList();
	}

	$scope.setPage = function(){
		$scope.params.pagination.offset = (scope.params.pagination.current_page-1)*scope.params.pagination.limit;
		loadList();
	}

    $scope.openPopup = function (option) {
        if (option.type === 'add') {
            angular.element(idClaimDetailAdd).fadeIn();
        }
    }

    $scope.clickRow = function (claimData) {
        if ($scope.claim_params.permission.edit !== true)
            $scope.claim_params = {
                permission: {
                    edit: true,
                    Claim_id: claimData.row.Claim_id
                },
            };
        angular.element(idClaimDetailAdd).fadeIn();

    }

    $scope.$watch('claim_params.permission.edit', function (editMode) {
        if (editMode !== true) {
            loadList();
        }
    });
})