angular.module("app.loggedIn.staff.task.controller", [])
    .controller("ViewTaskController", function($rootScope,$scope,$filter,$state,toastr, $modal, moment, StaffService, ConfigService){

        $(document).ready(function () {
            $('#calOne').jCal({
                day: new Date(),
                days: 7,
                showMonths: 3,
                forceWeek: true, // force full week selection
                dayOffset: 1, // start week on Monday
                dow: ['Mon', 'Tue', 'Wed', 'Thi', 'Fri', 'Sat', 'Sun'],
                dCheck: function (day) {
                    return 'day';
                },
                callback: function (day, days) {
                    $('#calOneResult').append('<div style="clear:both; font-size:7pt;">' + days + ' days starting ' +
                        ( day.getMonth() + 1 ) + '/' + day.getDate() + '/' + day.getFullYear() + '</div>');
                    return true;
                }
            });
        });
    })