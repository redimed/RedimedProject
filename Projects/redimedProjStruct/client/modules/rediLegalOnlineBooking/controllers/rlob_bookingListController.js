/**
 * Created by meditech on 9/15/2014.
 */

angular.module('app.loggedIn.rlob.list.controller',[])
.controller("rlob_bookingListController", function ($scope, $http, $state, locationService, $cookieStore, FileUploader) {
            //CONFIG
            var getDate = function (date) {
                var res = date.split("/");
                return res[2] + "-" + res[1] + "-" + res[0];
            }


            //---------------------------------------------------------------
            //HANDLE UPLOAD FILES
            //Upload File
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

            $scope.rows = [
                {"code": 10},
                {"code": 20},
                {"code": 50},
                {"code": 500}
            ];
            //END CONFIG
            $scope.getLocationAddress2 = function (id)
            {
                return locationService.getLocationById(id).Site_addr;
            }

            //----------------------------------------------

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
                var address = $scope.getLocationAddress2($scope.selectedBooking.SITE_ID);
                geocoder.geocode({'address': address}, function (results, status) {
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

            $scope.loginInfo = $cookieStore.get('userInfo');
            //GO TO BOOKING DETAIL
            $scope.goToBookingDetail = function (l) {
                //        $state.go("loggedIn.rlob_booking_list.detail", {'bookingId':l.BOOKING_ID});
                $http({
                    method: "POST",
                    url: "/api/rlob/rl_bookings/get-booking-by-id",
                    data: {bookingId: l.BOOKING_ID,userId:$scope.loginInfo.id}
                }).success(function (data) {
                    if (data.status == 'success')
                    {
                        $scope.selectedBooking = data.data;
                        console.log($scope.selectedBooking);
                        $("#view-detail-booking-dialog").modal({show: true, backdrop: 'static'});

                        codeAddress();
                        getFilesUpload();

                        uploader.formData.push({booking_id: $scope.selectedBooking.BOOKING_ID,
                                                company_id: $scope.loginInfo.company_id,
                                                worker_name: $scope.selectedBooking.WRK_SURNAME,
                                                isClientDownLoad: 0}
                        );
                    }
                    else
                    {
                        alert("data not exist!");
                    }
                })
                .error(function (data) {
                    console.log("error");
                });
            }
            //END GO TO BOOKING DETAIL

            //OPEN MODAL
            $scope.openModal = function (id) {
                angular.element("#" + id).fadeIn();
            }

            $scope.closeModal = function (id) {
                angular.element("#" + id).fadeOut();
            }

            $scope.saveModal = function (id) {
                angular.element("#" + id).fadeOut();
                $scope.loadList();
            }
            //END OPEN MODAL

            //CHANGE PAGE
            $scope.setPage = function () {
                $scope.search.offset = ($scope.search.currentPage - 1) * $scope.search.limit;
                $scope.loadList();
            }
            //END CHANGE PAGE

            //SEARCH FUNCTION
            $scope.search_map = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    ASS_ID:$scope.loginInfo.id,
                    CLAIM_NO: "",
                    ASS_SURNAME: "",
                    RL_TYPE_ID: "",
                    DATE: {
                        BOOKING_DATE: {
                            from: null,
                            to: null,
                            from_map: null,
                            to_map: null
                        },
                        APPOINTMENT_DATE: {
                            from: null,
                            to: null,
                            from_map: null,
                            to_map: null
                        }
                    }
                },
                ORDER_BY: "APPOINTMENT_DATE DESC"
            }

            $scope.search = angular.copy($scope.search_map);
            //END SEARCH FUNCTION

            //LOAD SEARCH
            $scope.list = [];

            $scope.reset = function () {
                $scope.search = angular.copy($scope.search_map);
                $scope.loadList();
            }

            $scope.loadList = function () {
                if ($scope.search.data.DATE.BOOKING_DATE.from !== null && $scope.search.data.DATE.BOOKING_DATE.to !== null) {
                    $scope.search.data.DATE.BOOKING_DATE.from_map = getDate($scope.search.data.DATE.BOOKING_DATE.from);
                    $scope.search.data.DATE.BOOKING_DATE.to_map = getDate($scope.search.data.DATE.BOOKING_DATE.to);
                }

                if ($scope.search.data.DATE.APPOINTMENT_DATE.from !== null && $scope.search.data.DATE.APPOINTMENT_DATE.to !== null) {
                    $scope.search.data.DATE.APPOINTMENT_DATE.from_map = getDate($scope.search.data.DATE.APPOINTMENT_DATE.from);
                    $scope.search.data.DATE.APPOINTMENT_DATE.to_map = getDate($scope.search.data.DATE.APPOINTMENT_DATE.to);
                }



                $http.post("/api/rlob/rl_bookings/list", {search: $scope.search}).then(function (response) {
                    $scope.list = response.data;
                    var i = 0;
                    angular.forEach($scope.list.results, function (l) {
                        $scope.list.results[i].BOOKING_DATE = moment($scope.list.results[i].BOOKING_DATE).format("DD/MM/YYYY");
                        $scope.list.results[i].APPOINMENT_DATE = moment($scope.list.results[i].APPOINMENT_DATE).format("DD/MM/YYYY");
                        i++;
                    })
                })
            }
            //END LOAD SEARCH


            $scope.loadList();

            //Sort function
            //tannv.dts@gmail.com
            //------------------------------------------------------
            /***
             * Sort
             * @param field
             * @param direct
             */
            $scope.sortDirect = "NO_SORT";
            $scope.sortable = {
                'APPOINTMENT_DATE': 'DESC',
                'BOOKING_DATE': 'NO_SORT'
            }
            $scope.currentFieldSort="APPOINTMENT_DATE";
            $scope.sortBy=function()
            {
                //alert($scope.search.ORDER_BY);
                $scope.loadList();
            }
        });


//
//app.directive('mytable', ['$timeout',
//    function($timeout) {
//        return {
//            restrict: 'E',
//            template: '<table width="100%" class="table table-hover table-striped" id="sample_editable_1">' +
//                '<thead><tr style="border-color: white"><th></th><th></th><th></th><th></th>' +
//                '<th></th></tr><tr style="background-color: #585858; color: white"><th>ClaimNo</th><th>Surname</th><th>Type</th><th>' +
//                'Booking Date</th><th>Appointment Date</th></tr></thead>' +
//                '<tr ng-repeat="booking in data"><td>{{booking.CLAIM_NO}}</td><td>{{booking.WRK_SURNAME}}</td><td>{{booking.Rl_TYPE_NAME}}</td>' +
//                '<td>{{parseDate(booking.BOOKING_DATE)}}</td>' +
//                '<td>{{parseDate(booking.APPOINTMENT_DATE)}}</td>' +
//                '</tr></table>',
//            controller : "rlob_bookingListController",
//            link: function(scope, element, attrs, ctr) {
//                $timeout(function() {
//                    TableEditable.init();
//                    var initPickers = function () {
//
//                        //init date pickers
//                        $('.date-picker').datepicker({
//                            rtl: Metronic.isRTL(),
//                            autoclose: true,
//                            format: 'dd/mm/yyyy'
//                        });
//
//                    }
//                    initPickers();
//                }, 0)
//            }
//        }
//    }
//]);
