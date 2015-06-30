angular.module("app.loggedIn.doctor.itemsearch.directive", [])

.directive("itemSearch", function($filter, PatientService, OutsideReferralModel, ReceptionistService, toastr){
	var arrGetBy = $filter('arrGetBy');

	return {
		restrict: "EA",
		scope: {
			list: "=",
			extra: "=",
            appt: '='
		},
		template: '<my-data-table options="data_options" rowclass="set_row_class" rowclick="row_click">',
		controller: function($scope){
			$scope.data_options = {
                api: 'api/erm/v2/items/search',
                method: 'post',
                columns: [
                    {field: 'ITEM_ID', is_hide: true},
                    {field: 'ITEM_CODE', label: 'Item Code'},
                    {field: 'ITEM_NAME', label: 'Item Name'},    
                    {field: 'ITEM_TYPE', label: 'Type'},        
                ],
                use_filters: true,
                filters: {
		            ITEM_CODE: {type: 'text'},
		            ITEM_NAME: {type: 'text'},
		            ITEM_TYPE: {type: 'text'},
		        },
            };


            $scope.set_row_class = function(item) {
            	var t_item = arrGetBy($scope.list, 'ITEM_ID', item.ITEM_ID);
        		if (t_item)
        			 return 'success';

        		var t_item = arrGetBy($scope.extra, 'ITEM_ID', item.ITEM_ID);
        		if (t_item)
        			 return 'success';
            }

            $scope.row_click = function(item) {
            	if($scope.extra === undefined || $scope.extra === null) return;
        		var t_item = arrGetBy($scope.extra, 'ITEM_ID', item.ITEM_ID);
        		if(t_item) return; 

        		var t_item = arrGetBy($scope.list, 'ITEM_ID', item.ITEM_ID);
        		if(t_item) return; 

        		item.QUANTITY = 1;
        		item.checked = '1';
        		item.chosen = true;
        		$scope.extra.push(item);


                ReceptionistService.itemFeeAppt($scope.appt.SERVICE_ID, [item.ITEM_ID]).then(function(response){
                    var list_fee = response.list;
                    var t_item = arrGetBy(list_fee, 'CLN_ITEM_ID', item.ITEM_ID);

                    if(t_item) {
                        item.PRICE = t_item.SCHEDULE_FEE;
                        item.disable_fee = true;
                    } else {
                        item.PRICE = 0;
                        item.disable_fee = false;
                    }

                    
                }, function(err){
                    console.log(err);
                });
            }

		}
	}
});