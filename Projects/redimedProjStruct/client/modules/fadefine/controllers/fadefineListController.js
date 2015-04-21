angular.module('app.loggedIn.fadefine.list.controller', [])
.controller('FaDefineListController', function($scope){
	$scope.fa_panel={};

	var selectedID = null;

	$scope.fa = {
		select:0,
		scope: $scope.fa_panel,
		options: {
			api:'api/erm/v2/fa/search',
			method: 'post',
			scope: $scope.fa_panel,
			columns:[
                {field: 'FA_ID', is_hide: true},
                {field: 'TYPE', label: 'Type'},
                {field: 'FA_NAME', label: 'Name'},
            ],

            use_filters: true,
            filters:{
            	TYPE: {type: 'text'},
            	FA_NAME: {type: 'text'}
            },
            use_actions: true,
            actions: [              
                {
                    class: 'fa fa-info', title: 'Edit',
                    callback: function(item){
                        console.log('this is selected item',item)
                            // $scope.medicine.id = item.medicine_id;
                            // $scope.medicineEditForm.open();
                    }
                },
            ],
		}
	}
});