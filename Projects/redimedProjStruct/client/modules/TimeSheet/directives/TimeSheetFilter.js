angular.module("app.loggedIn.TimeSheet.Filter", [])
    .filter('customHours', function() {
        return function(time_charge) {
            if (isNaN(time_charge) === false) {
                if (time_charge === 0 || time_charge === undefined || time_charge === null) {
                    return "00:00";
                } else {
                    var hour = parseInt(time_charge);
                    var minute = (time_charge - hour) * 60;
                    if (hour < 10) {
                        hour = "0" + hour;
                    }
                    if (minute < 10) {
                        minute = "0" + minute;
                    }
                    var result = hour + ":" + minute;
                    return result;
                }
            } else return time_charge;

        };
    })
    .filter('getDate', function() {
        return function(input) {
            var DateInput = new Date(input.toString());
            return DateInput.getDate();
        };
    });
