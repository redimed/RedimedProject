angular.module("app.loggedIn.doctor")
.controller("DoctorItemsCatController", function($scope, $cookieStore, DoctorService, toastr){

	// FUNCTION PROCESS CATEGORY
	$scope.validateCat = function(cat){
		return (cat.POPULAR_CODE.trim() != '') && (cat.POPULAR_NAME.trim() != '');
	}
	
	$scope.resetNewCat = function(){
		$scope.isNewCat = false;
		$scope.newCatObj = angular.copy($scope.newCat);
	}

	$scope.setNewCat = function(){
		$scope.isNewCat = true;
	}

	$scope.saveNewCat = function(){
		if(!$scope.validateCat($scope.newCatObj)){
			toastr.error('Please Fill All Information !!!', "Error");
			return;
		}
		
		DoctorService.insertItemHeader($scope.doctorInfo.CLINICAL_DEPT_ID, $scope.newCatObj).then(function(data){
			console.log(data);
			if(data.status == 'success'){
				$scope.newCatObj.POPULAR_HEADER_ID = data.header_id;
				$scope.list_cat.push($scope.newCatObj);
				$scope.resetNewCat();
				toastr.success('Insert Successfully !!!', "Success");
			}
		});
	}
	// END NEW CAT
	
	$scope.saveEditCat = function() {
		if(!$scope.validateCat($scope.editCatObj)){
			toastr.error('Please Fill All Information !!!', "Error");
			return;
		}
		
		DoctorService.updateItemHeader($scope.editCatObj).then(function(data){
			console.log(data);
			if(data.status == 'success'){
				toastr.success('Update Successfully !!!', "Success");
				$scope.list_cat[$scope.editIndex] = angular.copy($scope.editCatObj);
				$scope.isEditCat = false;
			} else {
				toastr.error(data.message, "Error");
			}
		});
	}
	
	$scope.setEditCat = function(index) {
		var item = $scope.list_cat[index];
		$scope.editIndex = index;
		$scope.editCatObj = angular.copy(item);
		$scope.editCatObj.ISENABLE += '';
		$scope.isEditCat = true;
	}
	
	// END EDIT CAT
	
	$scope.setDeleteCat = function(item, index){
		var x = confirm("Do you really want to delete ?");
		if(!x) return;
		
		DoctorService.deleteItemHeader($scope.doctorInfo.CLINICAL_DEPT_ID, item.POPULAR_HEADER_ID ).then(function(data){
			console.log(data);
			if(data.status == 'success'){
				toastr.success('Delete Successfully !!!', "Success");
				$scope.list_cat.splice(index, 1);
			} else {
				toastr.error(data.message, "Error");
			}
		});
		
	};
	// END DELETE CAT
	
	var init  = function(){
		$scope.doctorInfo = $cookieStore.get('doctorInfo');

		DoctorService.getItemHeader($scope.doctorInfo.CLINICAL_DEPT_ID).then(function(data){
			console.log(data);
			$scope.list_cat = data;
		});
		
		// NEW CAT - TEMPLATE 
		$scope.newCat = {
			POPULAR_CODE: '',
			POPULAR_NAME: '',
			ISENABLE: '1',
		}
		$scope.isEditCat = false;
		$scope.resetNewCat();
	};
	
	init();



})