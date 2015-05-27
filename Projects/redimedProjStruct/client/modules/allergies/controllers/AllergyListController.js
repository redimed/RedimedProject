angular.module('app.loggedIn.allergy.list.controller',[

])

.controller('AllergyListController', function($scope,$stateParams, AllergyService, toastr){
	$scope.allergy_panel={};
    console.log('this is patient_id', $stateParams.patient_id);
    if($stateParams.patient_id) $scope.showAddExisted=true;
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
            actionsIsEnable: {
                show:true,
                setEnable:function(item){
                    item.isEnable=0;
                    console.log(item);
                    AllergyService.update(item).then(function(data){
                        if (data.status = "success") {
                            $scope.setListAllergy();
                            $scope.allergy_panel.reload();
                        };
                    })
                }
            },
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

    $scope.allergySub = angular.copy($scope.allergy);

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
                $scope.setListAllergy();
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
                $scope.setListAllergy();
                $scope.allergy_panel.reload();
                $scope.allergyEditForm.close();
        }
    }

    $scope.patientAllergyForm = {
        is_show: false,
        open: function () {
            $scope.allergySub.options.use_actions = false;
            $scope.allergySub.options.columns = [
                {field: 'allergy_id', is_hide: true},
                {field: 'allergy_name', label: 'Allergy name'},
                {field: 'Creation_date', label: 'Created date'}
            ],
            $scope.allergySub.options.api = 'api/erm/v2/allergy/search_remain_allergy';
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.allergy_panel.reload();
                $scope.patientAllergyForm.close();
        }
    }

    $scope.allergySelected = function(item){
        console.log('this is selected item',item);
         var postData = {
            allergy_id: item.allergy_id,
            patient_id: $stateParams.patient_id
        };
        AllergyService.insertPatientAllergy(postData).then(function(response2){
            if(response2.status === 'success'){
                toastr.success('Allergy applied to patient', 'Successfully');
                $scope.setListAllergy();
                $scope.patientAllergyForm.close();
                $scope.allergy_panel.reload();
            }
            else toastr.error('Fail to apply allergy to patient', 'Error');
        })
    }
});