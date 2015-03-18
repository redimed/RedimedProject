angular.module("app.loggedIn.staff.service", [])

    .factory("StaffService", function(Restangular){
        var service = {};
        var api = Restangular.all("api");

        service.addAllTask = function(allTask,info){
            var addAllTask = api.all('staff/addAllTask');
            return addAllTask.post({allTask:allTask,info:info});
        }

        service.getAllTaskAMonth = function(search){
            var getAllTaskAMonth = api.all('staff/getAllTaskAMonth');
            return getAllTaskAMonth.post({search:search});
        }

        service.editTask = function(task){
            var editTask = api.all('staff/editTask');
            return editTask.post({allTask:task});
        }

        service.getDepartmentLocation = function(){
            var getDepartmentLocation = api.one('staff/getDepartmentLocation');
            return getDepartmentLocation.get();
        }

        service.checkFirstTaskWeek = function(info){
            var checkFirstTaskWeek = api.all('staff/checkFirstTaskWeek');
            return checkFirstTaskWeek.post({info:info});
        }

        service.checkTaskWeek = function(info){
            var checkTaskWeek = api.all('staff/checkTaskWeek');
            return checkTaskWeek.post({info:info});
        }

        service.getTaskList = function(){
            return api.one('staff/task/getList').get();
        }

        service.showWeek = function(){
            var startDate;
            var endDate;
            var checkMonth = api.all('staff/checkMonth');
            var array = [];
            var selectCurrentWeek = function () {
                window.setTimeout(function () {
                    $('.ui-weekpicker').find('.ui-datepicker-current-day a').addClass('ui-state-active').removeClass('ui-state-default');
                }, 1);
            }

            var setDates = function (input) {
                var $input = $(input);
                var date = $input.datepicker('getDate');
                array = checkMonth.post({month:date.getMonth(),year: date.getFullYear()});
                console.log(array);
                var firstDay = $input.datepicker( "option", "firstDay");
                $input.datepicker( "option", "dateFormat", "dd-mm-yy" );
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
                beforeShow: function () {
                    $('#ui-datepicker-div').addClass('ui-weekpicker');
                    selectCurrentWeek();
                },
                onClose: function () {
                    $('#ui-datepicker-div').removeClass('ui-weekpicker');
                },
                showOtherMonths: true,
                selectOtherMonths: true,
                onSelect: function (dateText, inst) {
                    setDates(this);
                    selectCurrentWeek();
                    $(this).change();
                },
                beforeShowDay: function (date) {
                    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                    var cssClass = '';
                    if (date >= startDate && date <= endDate)
                        cssClass = 'ui-datepicker-current-day';
                    return [array.indexOf(string) == -1, cssClass];
                },
                onChangeMonthYear: function (year, month, inst) {
                    selectCurrentWeek();
                    alert(month);
                }
            });

            setDates('.week-picker');

            var $calendarTR = $('.ui-weekpicker .ui-datepicker-calendar tr');
            $calendarTR.live('mousemove', function () {
                $(this).find('td a').addClass('ui-state-hover');
            });
            $calendarTR.live('mouseleave', function () {
                $(this).find('td a').removeClass('ui-state-hover');
            });
        }

        return service;
    })