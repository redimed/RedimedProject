
angular.module('app.loggedIn.rlob')
.controller("rlob_specialtiesController", function ($scope,rlobService,toastr) {

	$scope.setListSpecialties = function(){
		rlobService.getListSpecialties().then(function(data){
			if (data.status == 'success') {
				$scope.listSpecialties = data.data;
				// console.log($scope.listSpecialties);
			};
		})
	}
	$scope.setListSpecialtiesType = function(){
		rlobService.getlistRlType().then(function(data){
			if (data.status == 'success') {
				$scope.listSpecialtiesType = data.data;
			};
		})
	}
	$scope.setListSpecialties();
	$scope.showPopupAddNewSpecialties = function(){
		$scope.specialtiesName = null;
		$scope.specialtiesType = null;
		$scope.setListSpecialtiesType();
		$("#rlob-specialties-insert-popup").modal({show:true,backdrop:'static'});
	}
	$scope.insertSpecialties = function(specialtiesName,specialtiesType){
		rlobService.insertSpecialties(specialtiesName,specialtiesType).then(function(data){
			if (data.status == 'success') {
				$scope.setListSpecialties();
				$("#rlob-specialties-insert-popup").modal('hide');
                toastr.success("Insert Success!","Success");
			};
			if (data.status == 'fail') {
				$("#rlob-specialties-insert-popup").modal('hide');
                toastr.error("Insert Failed!","Error");
			};
		})
	}
	$scope.showPopupEditSpecialties = function(specialties){
		$scope.specialtiesId = specialties.Specialties_id;
		$scope.specialtiesName = specialties.Specialties_name;
		$scope.specialtiesType = specialties.RL_TYPE_ID;
		$scope.enable = specialties.Isenable;
		$scope.setListSpecialtiesType();
		$("#rlob-specialties-edit-popup").modal({show:true,backdrop:'static'});
	}
	$scope.updateSpecialties = function(specialtiesId,specialtiesName,specialtiesType,enable){
		// alert(specialtiesId);
		// alert(specialtiesName);
		// alert(specialtiesType);
		// alert(enable);
		rlobService.updateSpecialties(specialtiesId,specialtiesName,specialtiesType,enable).then(function(data){
			if (data.status == 'success') {
				$scope.setListSpecialties();
				$("#rlob-specialties-edit-popup").modal('hide');
                toastr.success("Update Success!","Success");
			};
			if (data.status == 'fail') {
				$("#rlob-specialties-edit-popup").modal('hide');
                toastr.error("Update Failed!","Error");
			};
		})
	}
});


