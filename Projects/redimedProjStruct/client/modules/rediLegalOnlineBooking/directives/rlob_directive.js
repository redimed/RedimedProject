/**
 * Created by tannv.dts@gmail.com on 9/29/2014.
 */

angular.module("app.loggedIn.rlob.directive", [])
.directive('noticeRepeatFinish', function() {
    return function(scope, element, attrs) {
//        angular.element(element).css('color','blue');
        if (scope.$last){
            scope.collapseAll();
//            window.alert("im the last!");
        }
    };
})

.directive('mytable', ['$timeout',
    function($timeout) {
        return {
            restrict: 'E',
            template: '<table width="100%" class="table table-hover table-striped" id="sample_editable_1">' +
                '<thead><tr style="border-color: white"><th></th><th></th><th></th><th></th>' +
                '<th></th></tr><tr style="background-color: #585858; color: white"><th>ClaimNo</th><th>Surname</th><th>Type</th><th>' +
                'Booking Date</th><th>Appointment Date</th></tr></thead>' +
                '<tr ng-repeat="booking in data"><td>{{booking.CLAIM_NO}}</td><td>{{booking.WRK_SURNAME}}</td><td>{{booking.Rl_TYPE_NAME}}</td>' +
                '<td>{{parseDate(booking.BOOKING_DATE)}}</td>' +
                '<td>{{parseDate(booking.APPOINTMENT_DATE)}}</td>' +
                '</tr></table>',
            controller : "rlob_bookingListController",
            link: function(scope, element, attrs, ctr) {
                $timeout(function() {
                    TableEditable.init();
                    var initPickers = function () {

                        //init date pickers
                        $('.date-picker').datepicker({
                            rtl: Metronic.isRTL(),
                            autoclose: true,
                            format: 'dd/mm/yyyy'
                        });

                    }
                    initPickers();
                }, 0)
            }
        }

    }
])

/**
 * Directive show dialog
 * dialogClass: style class cua dialog
 * header: tieu de cua dialog
 * status: trang thai cua dialog
 * msg: thong tin hien thi
 * tannv.dts@gmail.com
 */
.directive('rlobDialog', function() {
    return {
        restrict: 'E',
        transclude:true,
        scope: {
            dialogClass:   '@',
            header:     '=',
            status:     '=',
            msg:        '='
        },
        templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_dialog_template.html'
    };
})


/***
 * compoent hien thi sort tren table
 * fileName:
 */
.directive('rlobOrderBy', function() {
    return {
        restrict: 'E',
        transclude:true,
        required:['^ngModel'],
        scope: {
            fieldName:  '@',
            rlobModel:    '=',
            startupDirect: '@',
            currentFieldSort:    '='
        },
        templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_orderby_template.html',
        controller: function ($scope)
        {
            $scope.direct=angular.copy($scope.startupDirect);
            $scope.changeDirect=function(direct,fieldName)
            {
                $scope.currentFieldSort=angular.copy(fieldName);
                $scope.direct=direct;
                $scope.rlobModel=$scope.fieldName+" "+$scope.direct;
            }
        }
    };
});




