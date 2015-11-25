angular.module('starter.security.rlobNonEmergency.controller', []).controller('rlobNonEmergencyController', function($scope, $state, SecurityService, $ionicLoading, $ionicPopup, $filter, $cordovaDatePicker, $ionicModal, $ionicPopup, $timeout, $filter, $cordovaDatePicker, $cordovaKeyboard, $cordovaAppVersion, localStorageService, $http) {
    $ionicLoading.hide();
    $scope.currentDate = new Date();
    //check local storage if have data set data to form
    if (localStorageService.get("NONEMERGENCY") !== null) {
        $scope.non = {};
        $scope.data = localStorageService.get("NONEMERGENCY");
        $scope.non.FIRSTNAME = $scope.data.FIRSTNAME;
        $scope.non.LASTNAME = $scope.data.LASTNAME;
        $scope.non.GENDER = $scope.data.GENDER;
        $scope.non.DOB = new Date($scope.data.DOB);
        $scope.non.EMAIL = $scope.data.EMAIL;
        $scope.non.CONTACT_NO = $scope.data.CONTACT_NO;
        $scope.non.MEDICARE_NO = $scope.data.MEDICARE_NO;
        $scope.non.MEDICARE_REF = $scope.data.MEDICARE_REF;
        $scope.non.INJURY = $scope.data.INJURY;
        $scope.non.REMEMBER_PATIENTS = $scope.data.REMEMBER_PATIENTS;
        $scope.non.RECEIVE_REDIMED = $scope.data.ECEIVE_REDIMED;
    } else {
        $scope.non = {};
    }
    // next form and check data
    $scope.next = function(FormNonEmergency) {
        if (!FormNonEmergency.$invalid) {
            $state.go('security.rlobNonEmergency.rlobBookingDetail');
            console.log($scope.non);
        } else {
            if (FormNonEmergency.$error.required) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Please Check ' + FormNonEmergency.$error.required[0].$name
                });
            } else if (FormNonEmergency.$valid == false) {
               
                 if (FormNonEmergency.$error.date !== undefined) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'Date is valid please Check your date!'
                    });
                }else if(FormNonEmergency.$error.email !== undefined){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'Email is valid please Check your email!'
                    });
                }
            }
        }
    }
    $scope.selectedFilter = {
        locationSelected: {},
        rltypeSelected: {},
        clnSpecialitySelected: {},
        doctorSelected: {},
        date: ''
    };
    $scope.selectedFilter.date = new Date();
    $scope.$watch("selectedFilter.date", function(newDate, oldDate) {
        $scope.updateAppoinmentsList();
        $scope.getDoctorsFilter();
        $scope.getLocationsFilter();
    })
    $scope.getLocationsFilter = function() {
        console.log($scope.selectedFilter.date)
        SecurityService.getLocationsFilter($scope.selectedFilter.date,$scope.non.serviceID).then(function(data) {
            $scope.locationsFilter = data.data;
            console.log('------------------------Location', data)
        }, function(data) {
            console.log(data);
        })
    }
    $scope.getLocationsFilter();
    $scope.getSpecialitiesFilter = function() {
        SecurityService.getRlSpecialtiesFilter().then(function(data) {
            if (data.status == 'success') $scope.specialitiesFilter = data.data;
        }, function(err) {
            console.log('error');
        })
    }
    $scope.getSpecialitiesFilter();
    $scope.doctorsFilter = [];
    $scope.getDoctorsFilter = function() {
        SecurityService.getDoctorsFilter($scope.selectedFilter.date,$scope.non.serviceID).then(function(data) {
            if (data.status == 'success') $scope.doctorsFilter = data.data;
        }, function(err) {
            console.log('error');
        })
    };
    $scope.getDoctorsFilter();
    //Show LIst appoinment
    $scope.updateAppoinmentsList = function() {
        console.log('---------------------------serviceID',$scope.non.serviceID)
        var specialityId = $scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_id ? $scope.selectedFilter.clnSpecialitySelected.Specialties_id : '%';
        var doctorId = $scope.selectedFilter.doctorSelected && $scope.selectedFilter.doctorSelected.doctor_id ? $scope.selectedFilter.doctorSelected.doctor_id : '%';
        var locationId = $scope.selectedFilter.locationSelected && $scope.selectedFilter.locationSelected.id ? $scope.selectedFilter.locationSelected.id : '%';
        console.log(locationId);
        var fromTime = $filter('date')($scope.selectedFilter.date, "yyyy-MM-dd");
        SecurityService.getApointmentCalendar(specialityId, doctorId, locationId, fromTime,$scope.non.serviceID).then(function(data) {
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
    $scope.selectAppointmentCalendar = function(appointment, DOCTOR_NAME, SITE_NAME) {
        $scope.non.DOCTOR = DOCTOR_NAME;
        $scope.non.DATE = appointment.FROM_TIME;
        $scope.non.LOCATION = SITE_NAME;
        $scope.non.TIME = appointment.APPOINTMENT_TIME;
        $scope.non.CAL_ID = appointment.CAL_ID;
        $state.go('security.rlobNonEmergency.NEInfo');
    }
    //submit booking 
    $scope.booking = function() {
        if ($scope.non.REMEMBER_PATIENTS == 1) {
            localStorageService.set("NONEMERGENCY", $scope.non);
        } else {
            localStorageService.remove("NONEMERGENCY");
        }
         var networkState = navigator.connection.type;
            if(networkState=="none"){
                    alert("Please check network");
            }else{
                SecurityService.insertNonEmergency($scope.non).then(function(result) {
                    console.log(result.status);
                    if (result.status == 'success') {
                        $state.go("security.rlobNonEmergency.rlobNonEmergencySuccess");
                    } else 
                    {
                        var alertPopup = $ionicPopup.alert({
                                title: 'Alert',
                                template: result.message
                            });
                    }
                })
            }
    }
    //choose booking type
    $scope.chooseBookingType = function(type,id) {
         $scope.non.serviceID = id;
        if (type == "GP" || type == "Physio" || type == "HandTherapy") {
            $scope.non.BookingType = type;
            $scope.non.serviceID = id;
            $scope.updateAppoinmentsList();
            $scope.getDoctorsFilter();
            $scope.getLocationsFilter();
            $state.go('security.rlobNonEmergency.rlobBooking');
        } else {
            $scope.showPopup()
        }
    };
    $scope.specialist = [{
        text: "Plastic",
        value: "Plastic"
    }, {
        text: "Ortho",
        value: "Ortho"
    }, {
        text: "Hand",
        value: "Hand"
    }];
    $scope.showPopup = function() {
        $scope.data = {}
            // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<ion-radio ng-repeat="item in specialist" ng-value="item.value" ng-model="data.wifi">{{ item.text }}</ion-radio>',
            title: 'Specialist',
            subTitle: 'Please Choose Specialist Type',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Select</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.wifi) {
                        e.preventDefault();
                    } else {
                        return $scope.data.wifi;
                    }
                }
            }]
        });
        myPopup.then(function(res) {
            if (typeof res !== "undefined") {
                $scope.non.BookingType = res;
                $scope.updateAppoinmentsList();
                $scope.getDoctorsFilter();
                $scope.getLocationsFilter();
                $state.go('security.rlobNonEmergency.rlobBooking');
            } else {
                console.log("undefined")
            }
        });
    };
    $scope.getDatePicker = function() {
        // $cordovaKeyboard.close()
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            // minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        document.addEventListener("deviceready", function() {
            if (device.version <= '4.3') {
                $cordovaDatePicker.show(options).then(function(date) {
                    $scope.selectedFilter.date = new Date(date);
                    console.log($scope.selectedFilter.date)
                });
            }
            console.log($scope.selectedFilter.date)
        }, false);
    }
    //button back home
    $scope.backtohome = function() {
        $scope.non = "";
        $state.go("security.login")
    }
    //button back booking
    $scope.backToBooking = function() {
        $scope.updateAppoinmentsList();
        $scope.getDoctorsFilter();
        $scope.getLocationsFilter();
        $state.go('security.rlobNonEmergency.rlobBooking');
    }
})