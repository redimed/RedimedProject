angular.module('app.loggedIn.patient.problem')
.controller('ProblemListController',function($scope, $stateParams, ConfigService){
	$scope.problem_panel={};

	var selectedID = null;
	console.log('this is patient id',$stateParams);
	$scope.problem = {
		select:0,
		scope: $scope.problem_panel,
		options: {
			api:'api/erm/v2/problem/search',
			method: 'post',
			scope: $scope.problem_panel,
			columns:[
                {field: 'Problem_id', is_hide: true},
                {field: 'Notes', label: 'Problem description'},
                {field: 'From_date', label: 'From', type:'custom', fn:function(item){
                    return ConfigService.getCommonDateDefault(item.From_date);
                }},
                {field: 'To_date', label: 'To', type:'custom', fn:function(item){
                    return ConfigService.getCommonDateDefault(item.To_date);
                }},

            ],
            search: {
               Patient_id: $stateParams.patient_id
            },

            use_filters: true,
            filters:{
            	Notes: {type: 'text'},
            },
            use_actions: true,
            actions: [              
                {
                    class: 'fa fa-info', title: 'Edit',
                    callback: function(item){
                        console.log('this is selected item',item)
                            $scope.problem.id = item.Problem_id;
                            $scope.problemEditForm.open();
                    }
                },
            ],
		}
	};

	$scope.problemAddForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.problem_panel.reload();
                $scope.problemAddForm.close();
        }
    }

    $scope.problemEditForm = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function (response) {
            if (response.status == 'success')
                $scope.problem_panel.reload();
                $scope.problemEditForm.close();
        }
    }
});