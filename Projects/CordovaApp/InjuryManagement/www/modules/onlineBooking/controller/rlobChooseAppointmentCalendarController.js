angular.module('starter.booking.rlobChooseAppointmentCalendar.controller', []).controller('rlobChooseAppointmentCalendarController', function($filter, $scope, $stateParams, localStorageService, OnlineBookingService, $state, $timeout, $ionicLoading) {
    $scope.loginInfo = localStorageService.get('userInfo');
    $scope.patientID = $stateParams.Patient_id;
    $scope.selectedFilter = {
        locationSelected: {},
        rltypeSelected: {},
        clnSpecialitySelected: {},
        doctorSelected: {},
        date: ''
    };
    $scope.backdescInjury = function() {
        localStorageService.set("checkNonemer", true);
        $state.go('app.injury.desInjury');
    }
    $scope.selectedFilter.date = new Date();
    $scope.$watch("selectedFilter.date", function(newDate, oldDate) {
        $scope.updateAppoinmentsList();
        $scope.getDoctorsFilter();
        $scope.getLocationsFilter();
    })
    $scope.getLocationsFilter = function() {
        console.log($scope.selectedFilter.date)
        OnlineBookingService.getLocationsFilter($scope.selectedFilter.date).then(function(data) {
            $scope.locationsFilter = data.data;
            console.log('------------------------Location', data)
        }, function(data) {
            console.log(data);
        })
    }
    $scope.getLocationsFilter();
    $scope.getSpecialitiesFilter = function() {
        OnlineBookingService.getRlSpecialtiesFilter().then(function(data) {
            if (data.status == 'success') $scope.specialitiesFilter = data.data;
        }, function(err) {
            console.log('error');
        })
    }
    $scope.getSpecialitiesFilter();
    $scope.doctorsFilter = [];
    $scope.getDoctorsFilter = function() {
        OnlineBookingService.getDoctorsFilter($scope.selectedFilter.date).then(function(data) {
            if (data.status == 'success') $scope.doctorsFilter = data.data;
        }, function(err) {
            console.log('error');
        })
    };
    $scope.getDoctorsFilter();
    //Show LIst
    $scope.updateAppoinmentsList = function() {
        var specialityId = $scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_id ? $scope.selectedFilter.clnSpecialitySelected.Specialties_id : '%';
        var doctorId = $scope.selectedFilter.doctorSelected && $scope.selectedFilter.doctorSelected.doctor_id ? $scope.selectedFilter.doctorSelected.doctor_id : '%';
        var locationId = $scope.selectedFilter.locationSelected && $scope.selectedFilter.locationSelected.id ? $scope.selectedFilter.locationSelected.id : '%';
        console.log(locationId);
        var fromTime = $filter('date')($scope.selectedFilter.date, "yyyy-MM-dd");
        OnlineBookingService.getApointmentCalendar(specialityId, doctorId, locationId, fromTime).then(function(data) {
            var temp = {
                DOCTOR_ITEMS: []
            };
            for (var i = 0; i < data.length; i++) {
                if (!temp[data[i].DOCTOR_ID]) {
                    temp[data[i].DOCTOR_ID] = {
                        LOCATION_ITEMS: []
                    };
                    temp.DOCTOR_ITEMS.push({
                        DOCTOR_ID: data[i].DOCTOR_ID,
                        DOCTOR_NAME: data[i].NAME
                    });
                }
                if (!temp[data[i].DOCTOR_ID][data[i].SITE_ID]) {
                    temp[data[i].DOCTOR_ID][data[i].SITE_ID] = {
                        APPOINTMENT_ITEMS: []
                    };
                    temp[data[i].DOCTOR_ID].LOCATION_ITEMS.push({
                        SITE_ID: data[i].SITE_ID,
                        SITE_NAME: data[i].Site_name
                    });
                }
                if (!temp[data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID]) {
                    temp[data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID] = {};
                    temp[data[i].DOCTOR_ID][data[i].SITE_ID].APPOINTMENT_ITEMS.push({
                        CAL_ID: data[i].CAL_ID,
                        APPOINTMENT_TIME: data[i].appointment_time,
                        FROM_TIME: data[i].FROM_TIME,
                        DOCTOR_ID: data[i].DOCTOR_ID,
                        SITE_ID: data[i].SITE_ID,
                        DOCTOR_NAME: data[i].NAME,
                        SITE_NAME: data[i].Site_name
                    });
                }
            }
            var arr = [];
            for (var i = 0; i < temp.DOCTOR_ITEMS.length; i++) {
                var doctor_item = temp.DOCTOR_ITEMS[i];
                doctor_item.LOCATION_ITEMS = [];
                for (var j = 0; j < temp[doctor_item.DOCTOR_ID].LOCATION_ITEMS.length; j++) {
                    var location_item = temp[doctor_item.DOCTOR_ID].LOCATION_ITEMS[j];
                    location_item.APPOINTMENT_ITEMS = [];
                    doctor_item.LOCATION_ITEMS.push(location_item);
                    for (var k = 0; k < temp[doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS.length; k++) {
                        var appointment_item = temp[doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS[k];
                        location_item.APPOINTMENT_ITEMS.push(appointment_item);
                    }
                }
                arr.push(doctor_item);
            }
            $scope.appointmentsFilter = arr;
        }, function(data) {
            console.log("error");
        })
    };
    $scope.updateAppoinmentsList();
    $scope.selectAppointmentCalendar = function(appointmentCalendar, DID, LID) {
        $ionicLoading.show({
            template: "<div class='icon ion-ios7-reloading'></div>" + "<br />" + "<span>Waiting...</span>",
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var info = {
            CAL_ID: appointmentCalendar.CAL_ID,
            APPOINTMENT_TIME: appointmentCalendar.APPOINTMENT_TIME,
            FROM_TIME: appointmentCalendar.FROM_TIME,
            DOCTOR_ID: appointmentCalendar.DOCTOR_ID,
            SITE_ID: appointmentCalendar.SITE_ID,
            DOCTOR_NAME: DID,
            LOCATION_NAME: LID,
            PatientID: $scope.patientID
        };
        OnlineBookingService.getInfoLocation(appointmentCalendar.SITE_ID).then(function(data) {
            info.Address = data.Site_addr;
            // OnlineBookingService.infoBooking = info;
            localStorageService.set("selectedBooking", info);
        });
        $timeout(function() {
            $ionicLoading.hide();
            $state.go('app.detailBooking');
        }, 500)
    };
})
