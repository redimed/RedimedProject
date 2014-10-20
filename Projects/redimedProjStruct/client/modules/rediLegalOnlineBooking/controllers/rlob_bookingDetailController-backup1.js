angular.module('app.loggedIn.rlob.bookingDetail.controller',[])
.controller("rlob_bookingDetailController", function ($scope, $http, $stateParams,locationService, $cookieStore, FileUploader) {
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

    //----------------------------------------------
    //Lay toan bo location
    $scope.locations=locationService.allSync();
    if($scope.locations.length<=0)
    {
        $http({
            method:"GET",
            url:"/api/rlob/redimedsites/list"
        })
            .success(function(data) {

                for(var i=0;i<data.length;i++)
                {
                    $scope.locations.push(data[i]);
                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
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
        var address = $scope.selectedBooking.Site_addr;
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

    $http({
        method: "POST",
        url: "/api/rlob/rl_bookings/get-booking-by-id",
        data: {bookingId: $stateParams.bookingId,userId:$scope.loginInfo.id}
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

    //GO TO BOOKING DETAIL
    $scope.goToBookingDetail = function (l) {
//        $state.go("loggedIn.rlob_booking_list.detail", {'bookingId':l.BOOKING_ID});

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

});