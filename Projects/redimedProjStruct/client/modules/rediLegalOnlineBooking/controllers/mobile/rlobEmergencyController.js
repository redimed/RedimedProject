angular.module("app.sponsor1.emergency.controller",[])
.controller('rlobEmergencyController',function($scope,FileUploader,rlobService,toastr){
	// alert('aaaaaaaaa');
       // $scope.showSelectPicture = function(){
       // 		angular.element('#choose').click();
       // }
        // $scope.medicareno = null;
        // $scope.medicareref = null;
       $scope.geoLocation = function(){
            window.navigator.geolocation.getCurrentPosition(function(position) {
                $scope.$apply(function() {
                    $scope.Lng = position.coords.longitude;
                    $scope.Lat = position.coords.latitude;
                    // console.log(position.coords);
                    console.log($scope.Lat);
                    console.log($scope.Lng);
                    map.setCenter($scope.Lat, $scope.Lng);
                    map.addMarker({
                        lat: $scope.Lat,
                        lng: $scope.Lng,
                        icon: 'http://www.icon100.com/up/4144/32/102-map-marker.png'
                    });
                    angular.element('#map').css('opacity','1');
                    angular.element('#dob-confix').css('margin-top','0px');
                });
            }, function(error) {
                alert(error);
            });
        }
       var uploader = $scope.uploader = new FileUploader();
       console.log($scope.uploader);
       //HANDLE UPLOAD FILES
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/rlob/sponsor/upload'
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
            // console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            // console.info('onAfterAddingFile', fileItem);
        };

        uploader.onAfterAddingAll = function (addedFileItems) {
            // console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            // console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            // console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            // console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            // console.info('onCompleteAll');
        };

         $scope.scrollTo= function(el, offeset)
        {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            },0);
        };

        console.info('uploader', uploader);
        $scope.insertEmergency = function(){
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.FormEmergency.$valid) {
            	$scope.info = {
                    FIRSTNAME:$scope.fristname,
                    LASTNAME:$scope.lastname,
                    GENDER:$scope.gender,
                    DOB:moment($scope.dob).format('YYYY/MM/DD'),
                    ADD:$scope.address,
                    CONTACT_NO:$scope.contactus,
                    MEDICARE_NO:$scope.medicareno,
                    MEDICARE_REF:$scope.medicareref,
                    TYPE_NAME:rlobConstant.sponsorType.emergency,
                    LONGITUDE:$scope.Lng,
                    LATITUDE:$scope.Lat,
                    INJURY:$scope.injury
                }
                // $scope.info.LONGITUDE != -77.028333
                // console.log($scope.info);
                rlobService.insertEmergency($scope.info).then(function(data){
                    if (data.status == 'success') {
                        // console.log(data.data);
                        toastr.success("Booking Success!","Success");
                        for (var i = 0; i < uploader.queue.length; i++) 
                        {
                            var item=uploader.queue[i];
                            item.formData[i]={};
                            item.formData[i].sponsor_id=data.data;
                        };
                        uploader.uploadAll();
                        // console.log(uploader);
                        angular.element('#form-config').css('display','none');
                        angular.element('#data-success').css('display','block');
                        $scope.scrollTo($(".logo"));
                    }else{
                        toastr.error("Booking Failed!","Error");
                    };
                })
            }
        }
        // $scope.geoLocation();
        $scope.Lat = -12.043333;
        $scope.Lng = -77.028333;
        var map = new GMaps({
            div:'#map',
            lat: $scope.Lat,
            lng: $scope.Lng
        })
        map.addMarker({
            icon: 'http://www.icon100.com/up/4144/32/102-map-marker.png',
            lat: $scope.Lat,
            lng: $scope.Lng,
        });
        $scope.updateMap=function()
        {
            GMaps.geocode({
            address: $scope.address,
                callback: function(results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        map.setCenter(latlng.lat(), latlng.lng());
                        $scope.Lat = latlng.lat();
                        $scope.Lng = latlng.lng();
                        console.log($scope.Lat);
                        console.log($scope.Lng);
                        map.addMarker({
                            lat: $scope.Lat,
                            lng: $scope.Lng,
                            icon: 'http://www.icon100.com/up/4144/32/102-map-marker.png',
                            infoWindow: {
                                content: '<p>'+$scope.address+'</p>'
                            }
                        });
                        // angular.element('#map1').css('opacity','1');
                        angular.element('#map').css('opacity','1');
                        angular.element('#dob-confix').css('margin-top','0px');
                    }
                }
            });
        }
        $scope.setColorMedicareRef = function(){
            if ($scope.medicareref != null && $scope.medicareref != '') {
                $('#medicareref-confix').addClass('color-label');
            }else{
                $('#medicareref-confix').removeClass('color-label');
            }
        }
        $scope.setColorMedicareNo = function(){
            if ($scope.medicareno != null && $scope.medicareno != '') {
                $('#medicareno-confix').addClass('color-label');
            }else{
                $('#medicareno-confix').removeClass('color-label');
            }
        }
})