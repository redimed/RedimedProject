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
                    check: input.length > 150,
                    value: input.substring(0, 150)
                });
            } else return "";
        };
    })
    .filter('readMoreSelected', function() {
        return function(input) {
            if (input !== undefined && input !== null && input !== "") {
                return ({
                    check: input.length > 35,
                    value: input.substring(0, 35)
                });
            } else return "";
        };
    })
    .filter('readMoreUpload', function() {
        return function(input) {
            if (input !== undefined && input !== null && input !== "") {
                return ({
                    check: input.length > 15,
                    value: input.substring(0, 10) + "..." + input.substr(input.length - 5, input.length - 1)
                });
            } else return "";
        };
    });
