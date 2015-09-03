angular.module("app.loggedIn.staff.service", [])

.factory("StaffService", function(Restangular, MIN_TO_DEC) {
    var service = {};
    var api = Restangular.all("api");

    service.AddAllTask = function(allTaskPost, infoPost) {
        var addAllTask = api.all('staff/addAllTask');
        return addAllTask.post({
            allTask: allTaskPost,
            info: infoPost
        });
    };
    service.GetAllTaskAMonth = function(searchPost) {
        var getAllTaskAMonth = api.all('staff/getAllTaskAMonth');
        return getAllTaskAMonth.post({
            search: searchPost
        });
    };
    service.SubmitOnView = function(infoPost) {
        var SubmitOnView = api.all('staff/SubmitOnView');
        return SubmitOnView.post({
            info: infoPost
        });
    };

    service.EditTask = function(task, infoPost) {
        var editTask = api.all('staff/editTask');
        return editTask.post({
            allTask: task,
            info: infoPost
        });
    };
    service.CheckTimeInLieu = function(infoPost) {
        var CheckTimeInLieu = api.all('staff/checktime');
        return CheckTimeInLieu.post({
            info: infoPost
        });
    };

    service.GetTask = function(idWeekPost) {
        var getTask = api.all('staff/getTask');
        return getTask.post({
            idWeek: idWeekPost
        });
    };

    service.GetDepartmentLocationActivity = function() {
        var getDepartmentLocation = api.one('staff/getDepartmentLocation');
        return getDepartmentLocation.get();
    };

    service.CheckFirstTaskWeek = function(infoPost) {
        var checkFirstTaskWeek = api.all('staff/checkFirstTaskWeek');
        return checkFirstTaskWeek.post({
            info: infoPost
        });
    };

    service.CheckTaskWeek = function(infoPost) {
        var checkTaskWeek = api.all('staff/checkTaskWeek');
        return checkTaskWeek.post({
            info: infoPost
        });
    };

    service.ShowEdit = function(infoPost) {
        var showEdit = api.all('staff/showEdit');
        return showEdit.post({
            info: infoPost
        });
    };

    service.ShowDetailDate = function(infoPost) {
        var showDetailDate = api.all('staff/showDetailDate');
        return showDetailDate.post({
            info: infoPost
        });
    };

    service.SetTaskList = function() {
        return api.one('staff/task/getList').get();
    };

    service.LoadContract = function(USER_ID) {
        var LoadContract = api.all("staff/get-contract");
        return LoadContract.post({
            ID: USER_ID
        });
    };

    //thanh
    service.ConvertShowToFull = function(time_charge) {
        if (time_charge !== undefined && time_charge !== null && !(isNaN(time_charge)) && time_charge !== 0 && time_charge.length !== 0) {
            var hours = 0;
            var minutes = 0;
            hours = parseInt(time_charge.toString().substring(0, time_charge.toString().length - 2));
            minutes = parseInt(time_charge.toString().substring(time_charge.toString().length - 2, time_charge.toString().length));
            return (parseInt(hours * 60) + parseInt(minutes));
        } else {
            return 0;
        }
    };

    service.ConvertFromFullToShow = function(time_charge) {
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

    service.GetFortMatTimeCharge = function(time_charge) {
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

    service.ShowWeek = function(userID) {
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
                $input.datepicker("option", "dateFormat", "dd/mm/yy");
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
            };
            var dateRunTimeSheet = new Date('2015-03-30'); //SET DATE TO RUN TIMESHEET
            $('.week-picker').datepicker({
                beforeShow: function() {
                    $('#ui-datepicker-div').addClass('ui-weekpicker');
                    selectCurrentWeek();
                },
                onClose: function() {
                    $('#ui-datepicker-div').removeClass('ui-weekpicker');
                },

                minDate: dateRunTimeSheet,
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
