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
})

    .directive('rlobBookingDetail', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:  '='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_booking_detail_template.html',
            controller: function ($scope)
            {
                //Google map
                var geocoder;
                var map;
                geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(-34.397, 150.644);
                var mapOptions = {
                    zoom: 16,
                    center: latlng
                }
                map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                function codeAddress() {
                    var address=$scope.selectedBooking.Site_addr;
                    geocoder.geocode( { 'address': address}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            map.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                }

                $scope.$watch("selectedBooking", function(newValue, oldValue){
                    codeAddress();
                });
            }
        };
    })

    .directive('rlobDocuments', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:  '='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_documents.html',
            controller: function ($scope,$http,$cookieStore, FileUploader)
            {
                $scope.loginInfo = $cookieStore.get('userInfo');
                //---------------------------------------------------------------
                //HANDLE UPLOAD FILES
                var uploader = $scope.uploader = new FileUploader({
                    url: '/api/rlob/rl_booking_files/upload'
                });
                // FILTERS
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < 10;
                    }
                });
                // CALLBACKS
                uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                };
                uploader.onAfterAddingFile = function (fileItem) {
                    console.info('onAfterAddingFile', fileItem);
                };
                uploader.onAfterAddingAll = function (addedFileItems) {
                    console.info('onAfterAddingAll', addedFileItems);
                };
                uploader.onBeforeUploadItem = function (item) {
                    console.info('onBeforeUploadItem', item);
                };
                uploader.onProgressItem = function (fileItem, progress) {
                    console.info('onProgressItem', fileItem, progress);
                };
                uploader.onProgressAll = function (progress) {
                    console.info('onProgressAll', progress);
                };
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    console.info('onSuccessItem', fileItem, response, status, headers);
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                };
                uploader.onCancelItem = function (fileItem, response, status, headers) {
                    console.info('onCancelItem', fileItem, response, status, headers);
                };
                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };
                uploader.onCompleteAll = function () {
                    console.info('onCompleteAll');
                };

                console.info('uploader', uploader);

                //---------------------------------------------------------------

                function getFilesUpload() {
                    $http({
                        method: "GET",
                        url: "/api/rlob/rl_bookings/admin/get-files-by-booking-id",
                        params: {bookingId: $scope.selectedBooking.BOOKING_ID}
                    }).success(function (data) {
                        if (data.status == 'success') {
                            $scope.files = data.data;
                        }
                    });
                }

                $scope.$watch("selectedBooking", function(newValue, oldValue){
                    //codeAddress();
                    getFilesUpload();
                    uploader.formData.push({booking_id: $scope.selectedBooking.BOOKING_ID,
                        company_id: $scope.loginInfo.company_id,
                        worker_name: $scope.selectedBooking.WRK_SURNAME,
                        isClientDownLoad: 0}
                    );
                });

            }
        };
    })



