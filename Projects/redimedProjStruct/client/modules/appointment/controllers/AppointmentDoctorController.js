angular.module('app.loggedIn.appointment.controllers.doctor', [])

.controller('AppointmentDoctorController', function($scope, $state, $stateParams, $cookieStore, OutreferralModel, AppointmentModel, ConfigService){
	var load = function(option){
		option.datepicker = ConfigService.convertToDB(option.datepicker);

		AppointmentModel.detailLoad(option)
		.then(function(response){
			$scope.appointment.list = response.data;

			console.log($scope.appointment.list);
		})
	}


	$scope.appointment = {
		pre: {
			name: null,
			datepicker: null
		},
		list: [],
		load: function(option){
			load(option);
		}
	}

	if($cookieStore.get('appointment')){
		var data = $cookieStore.get('appointment');

		$scope.appointment.pre.datepicker = data.datepicker;

		OutreferralModel.DotorFromUserId($stateParams.doctorId)
		.then(function(response){
			$scope.appointment.pre.name = response.data[0].NAME;
		}, function(error){})

		$scope.appointment.load({site_id: data.site_id, datepicker: data.datepicker, doctor_id: $stateParams.doctorId});
	}

})