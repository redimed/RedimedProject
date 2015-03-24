angular.module("app.loggedIn.TimeSheet.Filter", [])
    .filter('customHours', function(MIN_TO_DEC) {
        return function(time_charge) {
            if (time_charge !== undefined && time_charge !== null) {
                var hours = parseInt(time_charge);
                var n = time_charge.toString().indexOf(".");
                var minutes = 0;
                if (n !== -1) {
                    minutes = time_charge.toString().substr(n + 1, 2);
                    if (minutes > 10) {
                        minutes = parseFloat(minutes / 100);
                    } else if (minutes > 1) {
                        minutes = parseFloat(minutes / 10);
                    }
                    var checkFind = false;
                    var minuteAdd = 0;
                    //find firts
                    angular.forEach(MIN_TO_DEC, function(value) {
                        if (value.dec == minutes) {
                            minutes = value.min;
                            checkFind = true;
                        }
                    });
                    //end find first

                    //call again if not found
                    if (checkFind === false) {
                        minutes = minutes - 0.01;
                        ++minuteAdd;
                        angular.forEach(MIN_TO_DEC, function(value) {
                            if (value.dec == minutes) {
                                minutes = value.min;
                                checkFind = true;
                            }
                        });
                    }
                    if (checkFind === 0) {
                        minutes = 0;
                    }
                    //end call
                    minutes = minutes + minuteAdd;
                    if (parseInt(hours) < 10) {
                        hours = '0' + hours.toString();
                    }
                    if (parseInt(minutes) < 10) {
                        minutes = '0' + minutes.toString();
                    }

                    var returnValue = hours + ':' + minutes;
                    return (returnValue.substr(0, 5));
                } else {
                    if (parseInt(hours) < 10) {
                        hours = '0' + hours + ':00';
                    } else {
                        hours += ':00';
                    }
                    return (hours.substr(0, 5));
                }

            } else {
                return "00:00";
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
