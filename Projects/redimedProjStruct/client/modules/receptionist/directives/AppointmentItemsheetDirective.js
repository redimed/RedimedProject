angular.module("app.loggedIn.receptionist.itemsheet.directive", [])

.directive("itemsheet", function($filter, localStorageService, ReceptionistService, toastr, DoctorService){
var arrGetBy = $filter('arrGetBy');

return {
	restrict: "EA",
	templateUrl: "modules/receptionist/directives/templates/itemsheet.html",
	scope: {
		data: "=",
		options: "=",
		reloadpage: "="
	},
	controller: function($scope){
		$scope.list_appt_item = {};
		var active_item = function () {		
			// TRAVEL APPT ITEM
			for (var i = 0; i < $scope.list_appt_item.length; ++i) {
				var appt_item = $scope.list_appt_item [i];
				// CHECK EXISTS IN DEPT ITEMS 
				var t_item = arrGetBy($scope.list_dept_item, 'ITEM_ID', appt_item.ITEM_ID);
				if(t_item){
					t_item.checked = '1';
					t_item.inserted = true;
					t_item.appt_item_id = appt_item.appt_item_id;
					t_item.QUANTITY = appt_item.QUANTITY ? appt_item.QUANTITY : 1;
					continue;
				} 
				
				// CHECK EXISTS IN EXTRA ITEMS (just insert) 
				t_item = arrGetBy($scope.extra_list, 'ITEM_ID', appt_item.ITEM_ID);
				if(t_item) {
					t_item.chosen = false;	
					t_item.appt_item_id = appt_item.appt_item_id;
					t_item.QUANTITY = appt_item.QUANTITY ? appt_item.QUANTITY : 1;
				} else {
					// INSERT APP appt_item INTO extra list 
					appt_item.checked = '1';
					appt_item.chosen = false;
					$scope.extra_list.push(appt_item);
				}
			}
			
			
			// TRAVEL EXTRA ITEM 
			for(var i = 0; i < $scope.extra_list.length; ++i) {
				var extra_item = $scope.extra_list [i];
				var t_item = arrGetBy($scope.list_dept_item, 'ITEM_ID', extra_item.ITEM_ID);
				if(t_item) {
					$scope.extra_list.splice(i, 1);
				}
			}

		     $scope.item_list =  DoctorService.catItemDept($scope.list_dept_item); //item_cat($scope.list_dept_item);
		     delete $scope.list_dept_item;
		     delete $scope.list_appt_item;
		 };
		var init = function(){
		 	var extra_list = localStorageService.get('itemsTempList');

		 	if( extra_list ) {
		 		$scope.extra_list = extra_list;
		 		localStorageService.remove('itemsTempList');
		 	} else {
		 		$scope.extra_list = [];
		 	}

			DoctorService.getById($scope.appt.DOCTOR_ID).then(function(response) {
				$scope.appt.dept_id = response.CLINICAL_DEPT_ID;
				return 	DoctorService.getItemByDept($scope.appt.dept_id);
			}).then(function (data) {
		 		$scope.list_dept_item = data;
		 		return  DoctorService.getItemAppt($scope.appt.CAL_ID);
		 	}).then(function (data) {
		 		$scope.list_appt_item = data;
		 		active_item();
		 	}, function(err){
		 		console.error(err);
		 		toastr.error('Error, please Refresh Page !!!', "Error");
		 	});
		 }



		 /*
		 *	Search item
		 */

		$scope.openItemSearch = function(){
		 	$scope.show_search_item = true;
		}

		$scope.closeItemSearch =function(){
		 	$scope.show_search_item = false;
		}	


		$scope.saveItemsheet = function () {
			var insert_list = [];
			var update_list = [];
			var delete_list = [];
		
	        var chosen_id_list = [];
			
			// TRAVEL CAT
	        for (var key in $scope.item_list) {
	            var cat = $scope.item_list[key];
				// TRAVEL ITEM IN CAT
	            for (var key2 in cat.list) {
	                var item = cat.list[key2];
					if ( item.inserted ) { // item insert
						if (item.checked == '1'){
							update_list.push({
								appt_item_id: item.appt_item_id,
								QUANTITY: item.QUANTITY,
							});
						} else {
							delete_list.push(item.ITEM_ID); // just push item_id for API
						}
					} else if (item.checked == '1'){
						insert_list.push({
							CLN_ITEM_ID: item.ITEM_ID,
							QUANTITY: item.QUANTITY,
						});
					} 
	                
	            }
	        }
			
			// TRAVEL EXTRA LIST 
			for(var i =0, len = $scope.extra_list.length; i < len; ++i){
				var item = $scope.extra_list[i];
				var t  = {
					CLN_ITEM_ID: item.ITEM_ID,
					QUANTITY: item.QUANTITY,
				};
				
				if( item.chosen && item.checked == '1') { // item just add 
					insert_list.push({
						CLN_ITEM_ID: item.ITEM_ID,
						QUANTITY: item.QUANTITY,
					});
				} else if (item.checked == '1'){
					update_list.push({
						appt_item_id: item.appt_item_id,
						QUANTITY: item.QUANTITY
					});
				} else {
					delete_list.push(item.ITEM_ID);
				}
			}
			
			submitItemSheet(insert_list, update_list, delete_list);
	    }
	
		var submitItemSheet = function(insert_list, update_list, delete_list){
						
			console.log('INSERT LIST ', insert_list);
			console.log('UPDATE LIST ', update_list);
			console.log('DELETE LIST ', delete_list);
			
			var cal_id = $scope.appt.CAL_ID;
			var is_insert = (insert_list.length == 0), 
				is_delete = (delete_list.length == 0), 
				is_update = (update_list.length == 0);
	        if (!is_insert){
				DoctorService.insertItemAppt(cal_id, insert_list).then(function(data){
					//console.log('INSERT ITEMS RESULT :', data);
					is_insert = true;
					if(is_delete && is_update){
						$scope.reloadpage();
						toastr.success('Save Successfully!!!', "Success");
					}
				});
			} 
			if (!is_delete){
				DoctorService.deleteItemAppt(cal_id, delete_list).then(function(data){
					//console.log('INSERT ITEMS RESULT :', data);
					is_delete = true;
					if(is_insert && is_update){
						$scope.reloadpage();
						toastr.success('Save Successfully!!!', "Success");
					}
				});	
			} 
			if (!is_update){
				DoctorService.updateItemAppt(cal_id, update_list).then(function(data){
					//console.log('INSERT ITEMS RESULT :', data);
					is_update = true;
					if(is_delete && is_insert){
						$scope.reloadpage();
						toastr.success('Save Successfully!!!', "Success");
					}
				});	
			} 
			
		}

		 ReceptionistService.apptDetail($scope.data.CAL_ID).then(function(response){
		 	if(response.status === 'success') {
		 		console.log(response.data)
		 		$scope.appt = response.data;
		 		init();
				// $scope.list_appt_item = response.data.items;
			}
		})
	}
}
});