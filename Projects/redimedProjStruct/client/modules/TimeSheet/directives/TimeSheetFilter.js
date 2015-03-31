angular.module("app.loggedIn.TimeSheet.Filter", [])
    .filter('customHours', function(MIN_TO_DEC) {
        return function(time_charge) {
            if (time_charge !== undefined && time_charge !== null && time_charge !== 0) {
                var hours = parseInt(time_charge / 60);
                var minutes = parseInt(time_charge % 60);
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                return hours + ':' + minutes;
            } else {
                return "-";
            }

        };
    })
    .filter('getDate', function() {
        return function(input) {
            var DateInput = new Date(input.toString());
            return DateInput.getDay();
        };
    })
    .filter('readMore', function() {
        return function(input) {
            if (input !== undefined && input !== null && input !== "") {
                return ({
                    check: input.length > 195,
                    value: input.substring(0, 195)
                });
            } else return "";
        };
    })
    .filter('readMoreSelected', function() {
        return function(input) {
            if (input !== undefined && input !== null && input !== "") {
                return ({
                    check: input.length > 80,
                    value: input.substring(0, 80)
                });
            } else return "";
        };
    });

//thanh
// service.covertTimeCharge = function(time_charge) {
//     if (time_charge !== undefined && time_charge !== null && (!isNaN(time_charge))) {
//         var hours = parseInt(time_charge.substring(0, 2));
//         var minutes = parseInt(time_charge.substring(2, 4));
//         angular.forEach(MIN_TO_DEC, function(value) {
//             if (value.min == minutes) {
//                 hours += value.dec;
//             }
//         });
//         return hours;
//     }
// };

// service.unCovertTimeCharge = function(time_charge) {
//     if (time_charge !== undefined && time_charge !== null && (!isNaN(time_charge))) {
//         hours = parseInt(time_charge.toString());
//         var minutes = time_charge.toString().substring(3, time_charge.toString().length);
//         minutes = (minutes / 100);
//         angular.forEach(MIN_TO_DEC, function(value) {
//             if (value.dec == minutes) {
//                 minutes = parseInt(value.min);
//             }
//         });
//         if (hours < 10) {
//             hours = '0' + hours;
//         }
//         if (minutes < 10) {
//             minutes = '0' + minutes;
//         }
//         var returnValue = hours.toString() + minutes.toString();
//         return returnValue.substring(0, 5);
//     }
// };
//end thanh
