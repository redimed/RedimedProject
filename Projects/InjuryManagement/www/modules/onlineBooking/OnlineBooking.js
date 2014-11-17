angular.module('starter.booking',[
        'starter.booking.services',
    'starter.booking.rlobChooseAppointmentCalendar.controller'
])
.config(function($stateProvider){
            $stateProvider
                .state('app.chooseAppointmentCalendar',{
                        url:"/chooseAppointmentCalendar",
                        views:{
                                'menuContent':{
                                        templateUrl:"modules/onlineBooking/views/rlob_choose_appointment_calendar_template.html",
                                        controller:'rlobChooseAppointmentCalendarController'
                                }
                        }
                })
    })

