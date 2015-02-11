'use strict';

/**
 * @ngdoc directive
 * @name angularBootstrapCalendarApp.directive:mwlCalendarWeek
 * @description
 * # mwlCalendarWeek
 */
angular.module('app.loggedIn.staff.calendar.directive')
  .directive('mwlCalendarWeek', function($sce, moment, calendarHelper) {
    return {
      templateUrl: 'modules/staff/directives/templates/week.html',
      restrict: 'EA',
      require: '^mwlCalendar',
      scope: {
        events: '=calendarEvents',
        currentDay: '=calendarCurrentDay',
        eventAddClick: '=calendarAddEventClick',
        addEventHtml: '=calendarAddEventHtml',
        eventClick: '=calendarEventClick',
        useIsoWeek: '=calendarUseIsoWeek'
      },
      controller: 'StaffWeekController',
      link: function postLink(scope, element, attrs, calendarCtrl) {

        scope.$sce = $sce;

        calendarCtrl.titleFunctions.week = function(currentDay) {
          return 'Week ' + moment(currentDay).week() + ' of ' + moment(currentDay).isoWeekYear();
        };

        function updateView() {
            var tomorrow = new Date(scope.currentDay);
            tomorrow.setDate(scope.currentDay.getDate()+7);
          scope.view = calendarHelper.getWeekView(scope.events, tomorrow, scope.useIsoWeek);
        }

        scope.backMonth = function(){
            calendarCtrl.changeView('month',scope.currentDay);
        };

        scope.drillDown = function(day) {
          calendarCtrl.changeView('day', moment(scope.currentDay).clone().date(day).toDate());
        };

        scope.$watch('currentDay', updateView);
        scope.$watch('events', updateView, true);

      }
    };
  });
