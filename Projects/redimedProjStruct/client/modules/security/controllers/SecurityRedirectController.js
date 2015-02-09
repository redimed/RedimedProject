angular.module("app.security.redirect.controller",[
])
.controller('SecurityRedirectController',function($scope, $state, $stateParams, $location, $cookieStore, SecurityService){
	var socket = $stateParams.socket;
	var patient_id = $stateParams.patient_id;
	SecurityService.getSocket(socket).then(function(response){
		console.log(response)
		if(response.status == 'success') {
			var info = response.data[0];
			delete info.img;
			if(info) {
				$cookieStore.put("userInfo", info);
				$state.go('loggedIn.patient.appointment', {cal_id: 0, patient_id: patient_id})
			}
		}
	})

});
