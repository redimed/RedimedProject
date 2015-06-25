angular.module('app.loggedIn.fadefine.list.controller', [])
.controller('FaDefineListController', function($scope, $state, FaDefineService, toastr){
	$scope.fa_panel={};

	var selectedID = null;

    $scope.clickRow = function(item){
        $state.go('loggedIn.fadefine.detail',{action:'edit', headerId: item.FA_ID});
    }

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
                {label: 'Status', type:'status', 
                    isEnable: function(item){
                        return item.ISENABLE;
                    },
                    disableFn: function($event, item){
                        $event.stopPropagation();
                        console.log('run here 1');
                        FaDefineService.changeFaStt(0,item.FA_ID).then(function(res){
                            if(res.status==='success') $scope.fa_panel.reload();
                        })
                    },
                    enableFn: function($event, item){
                        $event.stopPropagation();
                        console.log('run here 2');
                        FaDefineService.changeFaStt(1,item.FA_ID).then(function(res){
                            if(res.status==='success') $scope.fa_panel.reload();
                        })
                    }
                },
                {type:'button', btnlabel:'Clone to new definition', btnclass:'fa fa-files-o',
                    btnfn:function(item){
                        $state.go('loggedIn.fadefine.detail',{action:'add', headerId: item.FA_ID});
                    }
                }
            ],

            use_filters: true,
            filters:{
            	TYPE: {type: 'text'},
            	FA_NAME: {type: 'text'}
            },
            // use_actions: false,
            // actions: [              
            //     {
            //         class: 'fa fa-info', title: 'Edit',
            //         callback: function(item){
            //             console.log('this is selected item',item);
            //             $state.go('loggedIn.fadefine.detail',{action:'edit', headerId: item.FA_ID});
                        
            //         }
            //     },
            //     {
            //         class: 'fa fa-remove', title: 'Remove',
            //         callback: function(item){
            //             FaDefineService.deleteFa(item.FA_ID).then(function(result){
            //                 if(result.status==='success'){
            //                     toastr.success('Delete functional assessment definition successfully!','Delete successfully!');
            //                     $scope.fa_panel.reload();
            //                 }
            //                 else toastr.error('Delete functional assessment definition failed','Delete failed!');
            //             })
            //         }
            //     },
            //     {
            //         class:'fa fa-files-o', title:'Clone to new definition',
            //         callback: function(item){
            //             $state.go('loggedIn.fadefine.detail',{action:'add', headerId: item.FA_ID});
            //         }
            //     }
            // ],
		}
	}


    $scope.newDefine = function(){
        $state.go('loggedIn.fadefine.detail',{action:'add', headerId:0})
    }

});