angular.module("app.loggedIn.im.bluetooth.controller",[])
    .controller("BluetoothController",function($scope,$filter,$state,InjuryManagementService,UserService,toastr,socket,$stateParams,$cookieStore){
		$scope.patient_id = $stateParams.patient_id;
		InjuryManagementService.getMedicalDevices().then(function(rs){
			if(rs.status == "success")
			{
				// console.log(rs.data);
			}
		})



    })