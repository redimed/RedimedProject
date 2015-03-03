angular.module("app.loggedIn.patient.recall.controller", [])


.controller("PatientRecallController", function($scope, $state,  $stateParams, $cookieStore, PatientService, DoctorService, ConfigService){
	
	var patient_id = $stateParams.patient_id;
	var recall_panel = {};

	$scope.recall_opt = {
		api:'api/erm/v2/patients/recall_search',
		scope: recall_panel,
        method:'post',
        columns:[
            {field: 'recall_id', is_hide: true},
            {field: 'notes', label: 'Document Name'},
            {field: 'recall_period', label: 'Period', type:'custom', fn:function(item){
                if(item.recall_period <= 1) return  item.recall_period + ' month';
                return  item.recall_period + ' months';
            }},
            {field: 'remind_before', label: 'Remind Before', type:'custom', fn:function(item){
                if(item.remind_before <= 1) return  item.remind_before + ' month';
                return  item.remind_before + ' months';
            }},
            {field: 'recall_date', label: 'Recall Date', type:'custom', fn:function(item){
                if(!item.recall_date) return '';
                return ConfigService.getCommonDateDefault(item.recall_date);
            }},
            {field: 'transaction_date', label: 'Created Date', type:'custom', fn:function(item){
                if(!item.transaction_date) return '';
                return ConfigService.getCommonDateDefault(item.transaction_date);
            }},   
        ],
        search: { patient_id: patient_id },
        use_actions: true,
        actions: [
            {
                class: 'fa fa-calendar', title: 'Book Calendar',
                callback: function(item){
                	$state.go('loggedIn.receptionist.appointment');

                }
            },
        ]
	}


	var userInfo = $cookieStore.get('userInfo');

	 //PARAMS
    $scope.params_add = {
        permission: {
            create: true,
            edit: false
        },
        patient_id : patient_id,
        created_by: userInfo.id
    }

    $scope.params_edit = {
        permission: {
            create: false,
            edit: true
        },
        id: 0,
        last_updated_by: userInfo.id
    }

	$scope.addForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
        }, 
        close: function(){
            this.is_show = false;
        }
    }

    $scope.actionSuccess = function(){
    	$scope.addForm.close();
    	$scope.editForm.close();
    	recall_panel.reload();
    }

    $scope.editForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
        }, 
        close: function(){
            this.is_show = false;
        }, 
    }


});