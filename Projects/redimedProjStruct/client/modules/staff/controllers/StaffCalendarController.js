angular.module("app.loggedIn.staff.calendar.controller", [])

    .controller("StaffCalendarController", function($rootScope,$scope, $modal, moment){
        var currentYear = moment().year();
        var currentMonth = moment().month();

        $scope.events = [
            {
                title: 'Event 1',
                type: 'warning',
                starts_at: new Date(currentYear,currentMonth,25,8,30),
                ends_at: new Date(currentYear,currentMonth,25,9,30)
            },
            {
                title: 'Event 2',
                type: 'info',
                starts_at: new Date(currentYear,currentMonth,19,7,30),
                ends_at: new Date(currentYear,currentMonth,25,9,30)
            }
        ];

        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();

        function showModal(action, event) {
            $modal.open({
                templateUrl: 'modules/staff/directives/templates/addModal.html',
                controller: function($scope, $modalInstance) {
                    $scope.$modalInstance = $modalInstance;
                    $scope.action = action;
                    $scope.event = event;
                }
            });
        }

        $scope.eventClicked = function(event) {
            showModal('Clicked', event);
        };

        $scope.eventEdited = function(event) {
            showModal('Edited', event);
        };

        $scope.eventDeleted = function(event) {
            showModal('Deleted', event);
        };

        $scope.setCalendarToToday = function() {
            $scope.calendarDay = new Date();
        };

        $scope.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();

            event[field] = !event[field];
        };
    })