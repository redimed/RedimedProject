angular.module("app.loggedIn.staff.service", [])

.factory("StaffService", function(Restangular) {
    var service = {};
    var api = Restangular.all("api");

    service.addAllTask = function(allTask, info) {
        var addAllTask = api.all('staff/addAllTask');
        return addAllTask.post({
            allTask: allTask,
            info: info
        });
    }

    service.getAllTaskAMonth = function(search) {
        var getAllTaskAMonth = api.all('staff/getAllTaskAMonth');
        return getAllTaskAMonth.post({
            search: search
        });
    }

    service.editTask = function(task,info) {
        var editTask = api.all('staff/editTask');
        return editTask.post({allTask: task,info:info});
    }

    service.getTask = function(idWeek) {
        var getTask = api.all('staff/getTask');
        return getTask.post({
            idWeek: idWeek
        });
    }

    service.getDepartmentLocation = function() {
        var getDepartmentLocation = api.one('staff/getDepartmentLocation');
        return getDepartmentLocation.get();
    }

    service.checkFirstTaskWeek = function(info) {
        var checkFirstTaskWeek = api.all('staff/checkFirstTaskWeek');
        return checkFirstTaskWeek.post({
            info: info
        });
    }

    service.checkTaskWeek = function(info) {
        var checkTaskWeek = api.all('staff/checkTaskWeek');
        return checkTaskWeek.post({
            info: info
        });
    }

    service.showEdit = function(info) {
        var showEdit = api.all('staff/showEdit');
        return showEdit.post({
            info: info
        });
    }

    service.showDetailDate = function(info) {
        var showDetailDate = api.all('staff/showDetailDate');
        return showDetailDate.post({
            info: info
        });
    }

    service.getTaskList = function() {
        return api.one('staff/task/getList').get();
    }

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
    }

    service.getFortMatTimeCharge = function(time_charge) {
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
                return result.substring(0, 5);
            }
        } else return time_charge;
    }

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
                temp = new Date(data.date);
                monthTemp = temp.getMonth() * 1 + 1;
                if (monthTemp < 10)
                    monthTemp = '0' + monthTemp;
                array.push(temp.getFullYear() + '-' + monthTemp + '-' + temp.getDate());
            })
            var selectCurrentWeek = function() {
                window.setTimeout(function() {
                    $('.ui-weekpicker').find('.ui-datepicker-current-day a').addClass('ui-state-active').removeClass('ui-state-default');
                }, 1);
            }

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
                    endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment + 6);
                    $input.datepicker("setDate", startDate);
                }
            }

            $('.week-picker').datepicker({
                beforeShow: function() {
                    $('#ui-datepicker-div').addClass('ui-weekpicker');
                    selectCurrentWeek();
                },
                onClose: function() {
                    $('#ui-datepicker-div').removeClass('ui-weekpicker');
                },
                minDate: array[0],
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


    }

    return service;
})
