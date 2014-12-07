angular.module("app.loggedIn.department.list.controller",[
])
.controller("DepartmentListController", function($scope, $state, $filter, DepartmentService, toastr){
	var arrGetBy = $filter('arrGetBy');

	
	$scope.header_panel = {};
    $scope.dept_panel = {};
    /*
	*	DEPARTMENT FUNCTION
	*/
	$scope.department = {
		select: 0,
		class: function(item) {
			return {
				danger : (item.ISENABLE == 0),
				selected: (item.CLINICAL_DEPT_ID == $scope.department.select),
			}
		}, 
		options:  {
			scope: $scope.dept_panel,
            api: 'api/erm/v2/dept/search',
            method: 'post',
            columns: [
                {field: 'CLINICAL_DEPT_ID', is_hide: true},
                {field: 'CLINICAL_DEPT_NAME', label: 'Department name'},
                {field: 'ISENABLE', is_hide: true, label: 'Is Enable', type: 'checkbox'},        
            ],
            use_actions: true, 
            actions: [          	
            	{
            		class: 'fa fa-check', title: 'Show',
            		callback: function(item){
						$scope.department.select = item.CLINICAL_DEPT_ID;
						$scope.invheader.show(item.CLINICAL_DEPT_ID);
					}
				},
				{class: 'fa fa-pencil', title: 'Edit'},
            	{class: 'fa fa-check', title: 'Enable'},
            	{class: 'fa fa-times', title: 'Disable'},
            ],
        }
	};

	/*
	*	DEPENDENCE HEADER 
	*/
	$scope.invheader = {
		show: function(dept_id){
			$scope.invheader.options.search =  {CLINICAL_DEPT_ID: dept_id} ;
        	$scope.header_panel.reload();
        	$scope.searchHeader.select_list = []; // reset 
		},
		class: function(item){
		    if(item.just_add) return 'info';
		},
		options: {
			scope: $scope.header_panel,
            api: 'api/erm/v2/dept/dept_header',
            method: 'post',
            columns: [
                {field: 'POPULAR_HEADER_ID', is_hide: true},
                {field: 'POPULAR_CODE', label: 'Popular Code', width:"20%"},
                {field: 'POPULAR_NAME', label: 'Popular Name'},          
            ],
            use_filters: true,
            search: {CLINICAL_DEPT_ID: 0} ,
            not_load: true,
            static: true,
            use_actions: true, 
            actions: [
            	{class: 'fa fa-check', title: 'Enable'},
            	{
            		class: 'fa fa-times', 
            		title: 'Disable',
            		callback: function(item){
						console.log(item)
					}
            	},
            ],

        }
	}

	/*
	*	SEARCH HEADER 
	*/
	$scope.searchHeader = {
		is_show: false,
		select_list: [],
		class: function(item){
			var t_item = arrGetBy($scope.header_panel.data.items, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);  
	        if(t_item) return 'success';

	        var t_item = arrGetBy($scope.searchHeader.select_list, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
	        if(t_item) return 'info';
		},
		click: function(item) {
			var t_item = arrGetBy($scope.header_panel.data.items, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
	        if(t_item) return;
	        var t_item = arrGetBy($scope.searchHeader.select_list, 'POPULAR_HEADER_ID', item.POPULAR_HEADER_ID);
	        if(t_item) return;

	        item.just_add = true;
	        $scope.searchHeader.select_list.push(item);
	        $scope.header_panel.data.more_items.push(item);
	        console.log($scope.header_panel.data)
		},
        open: function(){
            this.is_show = true;
        },
        close: function() {
            this.is_show = false;
        },
        save: function(){
            DepartmentService.saveDeptHeaders($scope.department.select, $scope.searchHeader.select_list).then(function(response){
                if(response.status === 'success') {
                    toastr.success('Save Successfully!!!', "Success");
                    $scope.reloadpage();
                }
            });
        },
        options: {
        	api: 'api/erm/v2/items/header_search',
            method: 'post',
            columns: [
                {field: 'POPULAR_HEADER_ID', is_hide: true},
                {field: 'POPULAR_CODE', label: 'Code'},
                {field: 'POPULAR_NAME', label: 'Name'},    
                {field: 'ISENABLE', label: 'Is enable'},        
            ],
        }
	}

  
})