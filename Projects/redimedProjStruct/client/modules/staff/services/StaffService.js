angular.module("app.loggedIn.staff.service", [])

.factory("StaffService", function(Restangular, MIN_TO_DEC) {
    var service = {};
    var api = Restangular.all("api");

    service.addAllTask = function(allTask, info) {
        var addAllTask = api.all('staff/addAllTask');
        return addAllTask.post({
            allTask: allTask,
            info: info
        });
    };
    service.getAllTaskAMonth = function(search) {
        var getAllTaskAMonth = api.all('staff/getAllTaskAMonth');
        return getAllTaskAMonth.post({
            search: search
        });
    };
    service.SubmitOnView = function(idweek, status) {
        var SubmitOnView = api.all('staff/SubmitOnView');
        return SubmitOnView.post({
            idWeek: idweek,
            status: status
        });
    };

    service.editTask = function(task, info) {
        var editTask = api.all('staff/editTask');
        return editTask.post({
            allTask: task,
            info: info
        });
    };
    service.checkTimeInLieu = function(weekNo, USER_ID) {
        var checkTimeInLieu = api.all('staff/checktime');
        return checkTimeInLieu.post({
            weekNo: weekNo,
            USER_ID: USER_ID
        });
    };

    service.getTask = function(idWeek) {
        var getTask = api.all('staff/getTask');
        return getTask.post({
            idWeek: idWeek
        });
    };

    service.getDepartmentLocation = function() {
        var getDepartmentLocation = api.one('staff/getDepartmentLocation');
        return getDepartmentLocation.get();
    };

    service.checkFirstTaskWeek = function(info) {
        var checkFirstTaskWeek = api.all('staff/checkFirstTaskWeek');
        return checkFirstTaskWeek.post({
            info: info
        });
    };

    service.checkTaskWeek = function(info) {
        var checkTaskWeek = api.all('staff/checkTaskWeek');
        return checkTaskWeek.post({
            info: info
        });
    };

    service.showEdit = function(info) {
        var showEdit = api.all('staff/showEdit');
        return showEdit.post({
            info: info
        });
    };

    service.showDetailDate = function(info) {
        var showDetailDate = api.all('staff/showDetailDate');
        return showDetailDate.post({
            info: info
        });
    };

    service.getTaskList = function() {
        return api.one('staff/task/getList').get();
    };

    service.LoadContract = function(USER_ID) {
        var LoadContract = api.all("staff/get-contract");
        return LoadContract.post({
            ID: USER_ID
        });
    };

    service.getFortMatTimeTemp = function(time_charge) {
        if (time_charge) {
            var hourInLieu = parseInt(time_charge.substring(0, 2));
            if (time_charge.length == 4) {
                var minuteInLieu = parseInt(time_charge.substring(2, 4));
            } else {
                var minuteInLieu = parseInt(time_charge.substring(3, 5));
            }
            return hourInLieu + (minuteInLieu / 60);
        } else {
            return 0;
        }
    };

    //thanh
    service.covertTimeCharge = function(time_charge) {
        if (time_charge !== undefined && time_charge !== null) {
            var hours = parseInt(time_charge.toString().substring(0, 2));
            var minutes = parseInt(time_charge.toString().substring(2, 4));
            angular.forEach(MIN_TO_DEC, function(value) {
                if (value.min == minutes) {
                    hours = parseFloat(hours) + parseFloat(value.dec);
                }
            });
            return hours.toFixed(2);
        } else {
            return 0;
        }
    };
    service.convertFromFullToShow = function(time_charge) {
        if (time_charge !== undefined && time_charge !== null) {
            var hours = parseInt(time_charge / 60);
            var minutes = parseInt(time_charge % 60);
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours.toString() + minutes.toString();
        }
    };

    service.convertTimeSave = function(time_charge) {
        if (time_charge !== undefined && time_charge !== null) {
            var hours = parseInt(time_charge / 60);
            var minutes = (time_charge % 60);
            angular.forEach(MIN_TO_DEC, function(value) {
                if (value.min == minutes) {
                    hours = parseFloat(hours) + parseFloat(value.dec);
                }
            });
            return hours.toFixed(2);
        } else return 0;
    };

    //FORMAT FULLMINUTE
    service.fortMatFullTime = function(time) {
        if (time !== undefined && time !== null) {
            var hours = parseInt(time);
            var minutes = parseFloat(time - hours).toFixed(2);
            //CONVERT
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
            if (checkFind === false && minutes > 0.00) {
                minutes = minutes - 0.01;
                ++minuteAdd;
                angular.forEach(MIN_TO_DEC, function(value) {
                    if (value.dec == minutes) {
                        minutes = value.min;
                        checkFind = true;
                    }
                });
            }
            if (checkFind === false) {
                minutes = 0;
            }
            //end call
            minutes = minutes + minuteAdd;
            //END CONVERT
            return ((hours * 60) + minutes);
        } else {
            return 0;
        }
    };
    //END

    service.unCovertTimeCharge = function(time_charge) {
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

                var returnValue = hours + '' + minutes;
                return returnValue;
            } else {
                if (parseInt(hours) < 10) {
                    hours = '0' + hours + '00';
                } else {
                    hours += '00';
                }
                return hours;
            }

        } else {
            return "0000";
        }
    };
    //end thanh

    service.getFortMatTimeCharge = function(time_charge) {
        if (time_charge !== undefined && time_charge !== null && time_charge !== 0) {
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
            return "-";
        }

    };

    service.showWeek = function(userID) {
        var startDate;
        var endDate;
        var checkMonth = api.all('staff/checkMonth');
        var array = [],
            info = {},
            temp,
            now = new Date(),
            monthTemp;

        info.userID = userID;

        var date = new Date();
        info.month = date.getMonth();
        info.year = date.getFullYear();
        checkMonth.post({
            info: info
        }).then(function(response) {
            angular.forEach(response['tasks'], function(data) {
                var temp = new Date(data.date);
                var monthTemp = temp.getMonth() * 1 + 1;
                var tempDate = temp.getDate();
                if (tempDate < 10) {
                    tempDate = '0' + tempDate;
                }

                if (monthTemp < 10) {
                    monthTemp = '0' + monthTemp;
                }

                array.push(temp.getFullYear() + '-' + monthTemp + '-' + tempDate);
            });
            var selectCurrentWeek = function() {
                window.setTimeout(function() {
                    $('.ui-weekpicker').find('.ui-datepicker-current-day a').addClass('ui-state-active').removeClass('ui-state-default');
                }, 1);
            };

            var setDates = function(input) {
                var $input = $(input);
                var date = $input.datepicker('getDate');
                var firstDay = $input.datepicker("option", "firstDay");
                $input.datepicker("option", "dateFormat", "dd-mm-yy");
                $input.datepicker('option', 'firstDay', 1);
                if (date !== null) {
                    var dayAdjustment = date.getDay() - firstDay;
                    if (dayAdjustment < 0) {
                        dayAdjustment += 7;
                    }
                    startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment);
                    console.log(startDate);
                    endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment + 6);
                    $input.datepicker("setDate", startDate);
                }
            };

            $('.week-picker').datepicker({
                beforeShow: function() {
                    $('#ui-datepicker-div').addClass('ui-weekpicker');
                    selectCurrentWeek();
                },
                onClose: function() {
                    $('#ui-datepicker-div').removeClass('ui-weekpicker');
                },
                // minDate: array[0],
                showOtherMonths: true,
                selectOtherMonths: true,
                onSelect: function(dateText, inst) {
                    setDates(this);
                    selectCurrentWeek();
                    $(this).change();
                },
                beforeShowDay: function(date) {
                    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                    var cssClass = '';
                    if (date >= startDate && date <= endDate)
                        cssClass = 'ui-datepicker-current-day';
                    return [array.indexOf(string) == -1, cssClass];
                },
                onChangeMonthYear: function(year, month, inst) {
                    selectCurrentWeek();
                }
            });

            setDates('.week-picker');

            var $calendarTR = $('.ui-weekpicker .ui-datepicker-calendar tr');
            $calendarTR.live('mousemove', function() {
                $(this).find('td a').addClass('ui-state-hover');
            });
            $calendarTR.live('mouseleave', function() {
                $(this).find('td a').removeClass('ui-state-hover');
            });
        });

    };

    return service;
});
