angular.module("app.security.redirect.controller",[
])
.controller('SecurityRedirectController',function($scope, $state,$location,socket, $stateParams, $location, $cookieStore, SecurityService, UserService){
	var userId = $stateParams.userId;
	var patient_id = $stateParams.patient_id;

	// var fromMobile = ($location.search().fromMobile == 'true') ? true : false;

	UserService.getUserInfo(userId).then(function(data){
		if(data) {
			
			delete data.img;
			$cookieStore.put("userInfo", data);
             
            socket.emit("mobileConnect",data.id);

			$state.go('loggedIn.patient.appointment', {cal_id: 0, patient_id: patient_id})
			
		}
	})

});
