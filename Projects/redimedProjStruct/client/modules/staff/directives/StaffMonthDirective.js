'use strict';

/**
 * @ngdoc directive
 * @name angularBootstrapCalendarApp.directive:mwlCalendarMonth
 * @description
 * # mwlCalendarMonth
 */
angular.module('app.loggedIn.staff.calendar.directive')
  .directive('mwlCalendarMonth', function ($sce, $timeout, calendarHelper) {
    return {
      templateUrl: 'modules/staff/directives/templates/month.html',
      restrict: 'EA',
      require: '^mwlCalendar',
      scope: {
        events: '=calendarEvents',
        currentDay: '=calendarCurrentDay',
        eventClick: '=calendarEventClick',
        autoOpen: '=calendarAutoOpen',
        useIsoWeek: '=calendarUseIsoWeek'
      },
      controller: 'StaffMonthController',
      link: function postLink(scope, element, attrs, calendarCtrl) {

        var firstRun = false;
          var test;

        scope.$sce = $sce;

        calendarCtrl.titleFunctions.month = function(currentDay) {
          return moment(currentDay).format('MMMM YYYY');
        };

        function updateView() {
          scope.view=calendarHelper.getMonthView(scope.events, scope.currentDay, scope.useIsoWeek);
          //Auto open the calendar to the current day if set
          if (scope.autoOpen && !firstRun) {
            scope.view.forEach(function(week, rowIndex) {
              week.forEach(function(day, cellIndex) {
                if (day.inMonth && moment(scope.currentDay).startOf('day').isSame(day.date.startOf('day'))) {
                  scope.dayClicked(rowIndex, cellIndex);
                  $timeout(function() {
                    firstRun = false;
                  });
                }
              });
            });
          }

        }

        scope.$watch('currentDay', updateView);
        scope.$watch('events', updateView, true);

        scope.weekDays = calendarHelper.getWeekDayNames(true, scope.useIsoWeek);

        scope.dayClicked = function(rowIndex, cellIndex) {
          var handler = calendarHelper.toggleEventBreakdown(scope.view, rowIndex, cellIndex);
          scope.view = handler.view;
          scope.openEvents = handler.openEvents;
        };

        scope.drillDown = function(day) {
          calendarCtrl.changeView('day', moment(scope.currentDay).clone().date(day).toDate());
        };

        scope.highlightEvent = function(event, shouldAddClass) {

          scope.view = scope.view.map(function(week) {

            week.isOpened = false;

            return week.map(function(day) {

              delete day.highlightClass;
              day.isOpened = false;

              if (shouldAddClass) {
                var dayContainsEvent = day.events.filter(function(e) {
                  return e.$id == event.$id;
                }).length > 0;

                if (dayContainsEvent) {
                  day.highlightClass = 'day-highlight dh-event-' + event.type;
                }
              }

              return day;

            });

          });

        };

      }
    };
  });
