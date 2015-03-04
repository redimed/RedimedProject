'use strict';

/**
 * @ngdoc directive
 * @name angularBootstrapCalendarApp.directive:mwlCalendar
 * @description
 * # mwlCalendar
 */
angular.module('app.loggedIn.staff.calendar.directive',[])
  .directive('mwlCalendar', function (moment, calendarHelper) {
    return {
      templateUrl: 'modules/staff/directives/templates/main.html',
      restrict: 'EA',
      scope: {
        events: '=calendarEvents',
        view: '=calendarView',
        viewWeek: '=calendarViewWeek',
        currentDay: '=calendarCurrentDay',
        preDay: '=calendarPreDay',
        nextDay: '=calendarNextDay',
        control: '=calendarControl',
        eventClick: '&calendarEventClick',
        autoOpen: '=calendarAutoOpen',
        useIsoWeek: '=calendarUseIsoWeek'
      },
      controller: function($scope) {

        var self = this;
          $scope.useIsoWeek = true;
        this.titleFunctions = {};

          var arr=[];

        this.changeView = function(view, newDay) {
          $scope.view = view;
          $scope.currentDay = newDay;
        };

        $scope.control = $scope.control || {};

        $scope.control.prev = function() {
          $scope.currentDay = moment($scope.currentDay).subtract(3, 'month').toDate();
          $scope.preDay = moment($scope.preDay).subtract(3, 'month').toDate();
          $scope.nextDay = moment($scope.nextDay).subtract(3, 'month').toDate();
        };

        $scope.control.next = function() {
          $scope.currentDay = moment($scope.currentDay).add(3, 'month').toDate();
            $scope.preDay = moment($scope.preDay).add(3, 'month').toDate();
            $scope.nextDay = moment($scope.nextDay).add(3, 'month').toDate();
        };

        $scope.control.getTitle = function(day) {
          if (!self.titleFunctions[$scope.view]) return '';
          return self.titleFunctions[$scope.view](day);
        };

      }
    };
  });
