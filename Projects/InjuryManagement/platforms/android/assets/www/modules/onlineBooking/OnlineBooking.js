angular.module('starter.booking',[
        'starter.booking.services',
    'starter.booking.rlobChooseAppointmentCalendar.controller',
    'starter.booking.rlobDetailBooking.controller'
])
.config(function($stateProvider){
            $stateProvider
                .state('app.chooseAppointmentCalendar',{
                    url:"/chooseAppointmentCalendar/:Patient_id",
                    views:{
                        'menuContent':{
                            templateUrl:"modules/onlineBooking/views/rlob_choose_appointment_calendar_template.html",
                            controller:'rlobChooseAppointmentCalendarController'
                        }
                    }
                })
                .state('app.detailBooking', {
                    url:"/DetailBooking/:PatientID",
                    views:{
                        'menuContent':{
                            templateUrl:"modules/onlineBooking/views/rlob_info_booking.html",
                            controller:'rlobDetailBookingController'
                        }
                    }
                })
    })

