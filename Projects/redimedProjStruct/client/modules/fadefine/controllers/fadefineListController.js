angular.module('app.loggedIn.fadefine.list.controller', [])
.controller('FaDefineListController', function($scope, $state, FaDefineService, toastr){
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
                        console.log('this is selected item',item);
                        $state.go('loggedIn.fadefine.detail',{action:'edit', headerId: item.FA_ID});
                        
                    }
                },
                {
                    class: 'fa fa-remove', title: 'Remove',
                    callback: function(item){
                        FaDefineService.deleteFa(item.FA_ID).then(function(result){
                            if(result.status==='success'){
                                toastr.success('Delete functional assessment definition successfully!','Delete successfully!');
                                $scope.fa_panel.reload();
                            }
                            else toastr.error('Delete functional assessment definition failed','Delete failed!');
                        })
                    }
                }
            ],
		}
	}
});