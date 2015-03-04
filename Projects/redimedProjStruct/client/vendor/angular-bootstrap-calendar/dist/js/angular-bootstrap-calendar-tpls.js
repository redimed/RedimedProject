
angular.module('app.loggedIn.staff.calendar.directive')
  .constant('moment', window.moment);

'use strict';

'use strict';

/**
 * @ngdoc service
 * @name angularBootstrapCalendarApp.calendarHelper
 * @description
 * # calendarHelper
 * Service in the angularBootstrapCalendarApp.
 */
angular.module('app.loggedIn.staff.calendar.directive')
    .service('calendarHelper', function calendarHelper($filter, moment) {

        var self = this;

        function isISOWeekBasedOnLocale() {
            return moment().startOf('week').day() === 1;
        }

        function isISOWeek(userValue) {
            //If a manual override has been set in the directive, use that
            if (angular.isDefined(userValue)) return userValue;
            //Otherwise fallback to the locale
            return isISOWeekBasedOnLocale();
        }

        this.getMonthNames = function(short) {

            var format = short ? 'MMM' : 'MMMM';

            var months = [];
            for (var i = 0; i <= 11; i++) {
                months.push($filter('date')(new Date(2014, i), format));
            }

            return months;

        };

        this.getWeekDayNames = function(short, useISOWeek) {

            var format = short ? 'EEE' : 'EEEE';

            var weekdays = [];
            var startDay = isISOWeek(useISOWeek) ? 22 : 21;
            for (var i = 0; i <= 6; i++) {
                weekdays.push($filter('date')(new Date(2014, 8, startDay + i), format));
            }
            return weekdays;

        };

        this.eventIsInPeriod = function(eventStart, eventEnd, periodStart, periodEnd) {

            return (
                moment(eventStart).isAfter(moment(periodStart)) &&
                moment(eventStart).isBefore(moment(periodEnd))
                ) || (
                moment(eventEnd).isAfter(moment(periodStart)) &&
                moment(eventEnd).isBefore(moment(periodEnd))
                ) || (
                moment(eventStart).isBefore(moment(periodStart)) &&
                moment(eventEnd).isAfter(moment(periodEnd))
                ) || (
                moment(eventStart).isSame(moment(periodStart))
                ) || (
                moment(eventEnd).isSame(moment(periodEnd))
                );

        };

        this.getMonthView = function(events, currentDay, useISOWeek) {
                var dateOffset = isISOWeek(useISOWeek) ? 1 : 0;
                function getWeekDayIndex() {
                    var day = startOfMonth.day() - dateOffset;
                    if (day < 0) day = 6;
                    return day;
                }
            if(events){
                var dayArr = [];
                var grid = [];
                dayArr.push(moment(currentDay).subtract(1, 'month').toDate());
                dayArr.push(currentDay);
                dayArr.push(moment(currentDay).add(1, 'month').toDate());

                for(var j = 0; j < dayArr.length; j++){
                    var startOfMonth = moment(dayArr[j]).startOf('month');
                    var numberOfDaysInMonth = moment(dayArr[j]).endOf('month').date();

                    grid[j] = [];
                    var buildRow = new Array(7);
                    var eventsWithIds = events.map(function(event, index) {
                        event.$id = index;
                        return event;
                    });

                    for (var i = 1; i <= numberOfDaysInMonth; i++) {

                        if (i == 1) {
                            var weekdayIndex = getWeekDayIndex(startOfMonth);
                            var prefillMonth = startOfMonth.clone();
                            while (weekdayIndex > 0) {
                                weekdayIndex--;
                                prefillMonth = prefillMonth.subtract(1, 'day');
                                buildRow[weekdayIndex] = {
                                    label: prefillMonth.date(),
                                    date: prefillMonth.clone(),
                                    inMonth: false,
                                    events: []
                                };
                            }
                        }

                        buildRow[getWeekDayIndex(startOfMonth)] = {
                            label: startOfMonth.date(),
                            inMonth: true,
                            isToday: moment().startOf('day').isSame(startOfMonth),
                            date: startOfMonth.clone(),
                            events: eventsWithIds.filter(function(event) {
                                return self.eventIsInPeriod(event.date, event.date, startOfMonth.clone().startOf('day'), startOfMonth.clone().endOf('day'));
                            })
                        };

                        if (i == numberOfDaysInMonth) {
                            var weekdayIndex = getWeekDayIndex(startOfMonth);
                            var postfillMonth = startOfMonth.clone();
                            while (weekdayIndex < 6) {
                                weekdayIndex++;
                                postfillMonth = postfillMonth.add(1, 'day');
                                buildRow[weekdayIndex] = {
                                    label: postfillMonth.date(),
                                    date: postfillMonth.clone(),
                                    inMonth: false,
                                    events: []
                                };
                            }
                        }

                        if (getWeekDayIndex(startOfMonth) === 6 || i == numberOfDaysInMonth) {
                            grid[j].push(buildRow);
                            buildRow = new Array(7);
                        }

                        startOfMonth = startOfMonth.add(1, 'day');

                    }
                }
            }
            return grid;

        };

        this.getWeekView = function(currentDay, useISOWeek) {
            var dateOffset = isISOWeek(useISOWeek) ? 1 : 0;
            var columns = new Array(7);
            var weekDays = self.getWeekDayNames(true, useISOWeek);
            var currentWeekDayIndex = currentDay.getDay();
            var beginningOfWeek, endOfWeek;

            for (var i = currentWeekDayIndex; i >= 0; i--) {
                var date = moment(currentDay).subtract(currentWeekDayIndex - i, 'days').add(dateOffset, 'day').toDate();
                columns[i] = {
                    weekDay: weekDays[i],
                    day: $filter('date')(date, 'd'),
                    date: $filter('date')(date, 'd MMM'),
                    dateChosen: date,
                    isToday: moment(date).startOf('day').isSame(moment().startOf('day'))
                };
                if (i == 0) {
                    beginningOfWeek = date;
                } else if (i == 6) {
                    endOfWeek = date;
                }
            }

            for (var i = currentWeekDayIndex + 1; i < 7; i++) {
                var date = moment(currentDay).add(i - currentWeekDayIndex, 'days').add(dateOffset, 'day').toDate();
                columns[i] = {
                    weekDay: weekDays[i],
                    day: $filter('date')(date, 'd'),
                    date: $filter('date')(date, 'd MMM'),
                    dateChosen: date,
                    isToday: moment(date).startOf('day').isSame(moment().startOf('day'))
                };
                if (i == 0) {
                    beginningOfWeek = date;
                } else if (i == 6) {
                    endOfWeek = date;
                }
            }

            endOfWeek = moment(endOfWeek).endOf('day').toDate();
            beginningOfWeek = moment(beginningOfWeek).startOf('day').toDate();
            return {columns: columns,startWeek: beginningOfWeek, endWeek: endOfWeek};

        };

        this.toggleEventBreakdown = function(view, rowIndex, cellIndex) {

            var openEvents = [];

            if (view[rowIndex][cellIndex].events.length > 0) {

                var isCellOpened = view[rowIndex][cellIndex].isOpened;

                view = view.map(function(row) {
                    row.isOpened = false;
                    return row.map(function(cell) {
                        cell.isOpened = false;
                        return cell;
                    });
                });

                view[rowIndex][cellIndex].isOpened = !isCellOpened;
                view[rowIndex].isOpened = !isCellOpened;
                openEvents = view[rowIndex][cellIndex].events;
            }

            return {view: view, openEvents: openEvents};

        };

    });


'use strict';


angular.module('app.loggedIn.staff.calendar.directive')
    .filter('truncateEventTitle', function() {

        return function(string, length, boxHeight) {
            if (!string) return '';

            //Only truncate if if actually needs truncating
            if (string.length >= length && string.length / 20 > boxHeight / 30) {
                return string.substr(0, length) + '...';
            } else {
                return string;
            }
        };

    });