angular.module("app.loggedIn.TimeSheet.Filter", [])
    .filter('customHours', function(MIN_TO_DEC) {
        return function(time_charge) {
            if (time_charge !== undefined && time_charge !== null && (!isNaN(time_charge))) {
                hours = parseInt(time_charge);
                var n = time_charge.toString().indexOf(".");
                if (n !== -1) {
                    var minutes = time_charge.toString().substr(n + 1, 3);
                    if (minutes > 10) {
                        minutes = parseFloat(minutes / 100);
                    } else if (minutes > 1) {
                        minutes = parseFloat(minutes / 10);
                    }
                    angular.forEach(MIN_TO_DEC, function(value) {
                        if (value.dec == minutes) {
                            minutes = parseInt(value.min);

                        }
                    });
                    if (parseInt(hours) < 10) {
                        hours = '0' + hours;
                    }
                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    var returnValue = hours + ':' + minutes + '0000';
                    return returnValue.substring(0, 5);
                } else {
                    if (parseInt(hours) < 10) {
                        hours = '0' + hours;
                    }
                    var returnValue = hours + ':' + '0000';
                    return returnValue.substring(0, 5);
                }
            }

        };
    })
    .filter('getDate', function() {
        return function(input) {
            var DateInput = new Date(input.toString());
            return DateInput.getDate();
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
                    check: input.length > 120,
                    value: input.substring(0, 120)
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
