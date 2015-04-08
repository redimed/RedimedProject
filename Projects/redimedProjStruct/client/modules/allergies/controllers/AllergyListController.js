angular.module('app.loggedIn.allergy.list.controller',[

])

.controller('AllergyListController', function($scope,$stateParams){
	$scope.allergy_panel={};
    console.log('this is patient_id', $stateParams.patient_id);

	var selectedID = null;

	$scope.allergy = {
		select:0,
		scope: $scope.patient_panel,
		options: {
			// api:'api/erm/v2/allergy/search',
			method: 'post',
			scope: $scope.allergy_panel,
			columns:[
                {field: 'allergy_id', is_hide: true},
                {field: 'allergy_name', label: 'Allergy Name'},
            ],
            use_filters: true,
            filters:{
            	allergy_name: {type: 'text'},
            },
            use_actions: true,
            actions: [              
                {
                    class: 'fa fa-info', title: 'Edit',
                    callback: function(item){
                        console.log('this is selected item',item)
                            $scope.allergy.id = item.allergy_id;
                            $scope.allergyEditForm.open();
                    }
                },
            ],
		}
	}

    if($stateParams.patient_id){
        $scope.allergy.options.api = 'api/erm/v2/allergy/search_patient_allergy';
        $scope.allergy.options.search = {
            Patient_id:$stateParams.patient_id
        }
    }
    else{
        $scope.allergy.options.api = 'api/erm/v2/allergy/search';
    }

	$scope.allergyAddForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.allergy_panel.reload();
                $scope.allergyAddForm.close();
        }
    }

    $scope.allergyEditForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.allergy_panel.reload();
                $scope.allergyEditForm.close();
        }
    }
});