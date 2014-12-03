angular.module('starter.injury.add.controller', ['ngCordova'])

    .controller('InjuryAddController', function($scope, $state, $filter, $stateParams,
                                                InjuryServices, $cordovaCamera, $ionicPopup, localStorageService,
                                                $cordovaFile, $ionicModal, ConfigService, $ionicSlideBoxDelegate, $cordovaGeolocation,
                                                $ionicLoading, $compile, $timeout, $cordovaStatusbar){
        $scope.isSubmit = false;
        $scope.isShow = true;
        $scope.imgURI = [];
        $scope.isSubmitdesc = false;
        $scope.isClick = null;
        $scope.list = [];
        $scope.isShowImg = true;
        $scope.isFailMobile = false;
        $scope.isFailEmail = false;
        $scope.isMobile = null;
        $scope.goAddworker = true;
        $scope.imageObj = {};
        $scope.hide = [{
            bars: true
        }]
        var notification = localStorageService.get("notificationLS");

        console.log(notification);

        //INIT OBJECT WORKER FOR FORM
        $scope.worker = {
            Patient_id: -1,
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Address1: '',
            DOB: '',
            Sex: '',
            Mobile: '',
            Email: '',
            injury_description: '',
            injury_date: '',
            description:''
        };

        $scope.clickDate = function() {
            var options = {
                date: new Date(),
                mode: 'date'
            };

            if(ionic.Platform.isAndroid() && ionic.Platform.version() < '4.4') {
                datePicker.show(options, function(date){
                    $scope.worker.DOB = date;
                    $scope.worker.DOB = $filter('date')(new Date($scope.worker.DOB),'yyyy-MM-dd');
                });
            }
        }

        var i = 0;
        var ipUpload = "testapp.redimed.com.au";
        var serverUpload = "http://"+ipUpload+":3000/api/im/upload";
        var checkNonemerg = localStorageService.get("checkNonemer");
        var userInfoLS = localStorageService.get("userInfo");

        //CONFIG MODAL
        $ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/imageDetail.html', function(modal) {
            $scope.InjuryImgControllerModal = modal;
        },{
            scope: $scope,
            animation: 'slide-in-up'
        });
        $ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/modalPicture.html', function(modal) {
            $scope.pictureModal = modal;
        },{
            scope: $scope,
            animation: 'slide-in-up'
        });

        //VALID NEXT FORM DESCRIPTION INJURY (TAKE PHOTO)
        $scope.nextform = function(info) {
            $scope.isSubmit = true;
            if(info.$invalid || $scope.isFailMobile == true || $scope.isFailEmail == true) {
                var alertValid = $ionicPopup.alert({
                    title: "Can't next form",
                    template: 'Please Check Your Information!'
                });
            }
            else {
                $state.go('app.injury.desinjury');
                $scope.worker.injury_date = $filter('date')(new Date(), "yyyy-MM-dd");
            }
        }

        var scopeReset = angular.copy($scope.worker);

        //FUNCTION FOR BUTTON RESET LEFT-TOP
        $scope.resetFormInjury = function() {
            var popUpconfirm = $ionicPopup.confirm ({
                title: 'Reset',
                template: 'You will try again input all field !'
            });
            popUpconfirm.then(function(res) {
                if(res)
                {
                    $scope.isSubmit = false;
                    $scope.isFailMobile = false;
                    $scope.isFailEmail = false;
                    $scope.isSubmitdesc = false;
                    $scope.worker = angular.copy(scopeReset);
                    $scope.isShow = true;
                    //$scope.isShow = !$scope.isShow;
                }
            })
        }

        //FUNCTION RESET FIELD FOR CALL.
        function resetField() {
            $scope.isSubmit = false;
            $scope.isFailMobile = false;
            $scope.isFailEmail = false;
            $scope.isSubmitdesc = false;
            $scope.worker = angular.copy(scopeReset);
            $scope.isShow = !$scope.isShow;
        }

        //SELECT A ROW WORKER WHEN WRITE
        $scope.selectWorker = function (id) {
            $scope.isShow = !$scope.isShow;
            $scope.isFailMobile = false;
            $scope.isFailEmail = false;
            InjuryServices.getPatientID(id).then(function (data) {
                $scope.worker = data;
                $scope.worker.DOB = $filter('date')(new Date($scope.worker.DOB),'yyyy-MM-dd');
                $scope.temp1 = angular.copy($scope.worker);
            })
        };

        //INIT FORM
        function initForm() {
            InjuryServices.searchWorker(userInfoLS.company_id).then(function (data) {
                if (data.status != 'success') {
                    alert('error init search');
                    return;
                }
                else {
                    $scope.list = data.rs;
                }
            });
            $scope.sexIndex = ConfigService.sex_option();
            $scope.titleIndex = ConfigService.title_option();
            if(checkNonemerg)
            {
                var injuryinfoLS = localStorageService.get("injuryInfo");
                $scope.worker = injuryinfoLS.info;
                $scope.imgURI = injuryinfoLS.dataImage;
                localStorageService.remove("checkNonemer");
                localStorageService.remove("injuryInfo");
                $scope.temp1 = angular.copy($scope.worker);
                $scope.isShow = !$scope.isShow;
            }
            else{
                //alert('checkNonemerg equal false');
            }
        };

        //SHOW MODAL IMAGE DETAIL
        $scope.selectImg = function(selected) {
            $cordovaStatusbar.hide();
            $scope.imageObj.selected = selected.id;
            $scope.InjuryImgControllerModal.show();
        };
        $scope.hideModal = function() {
            $cordovaStatusbar.show();
            $scope.hide.bars = false;
            $scope.InjuryImgControllerModal.hide();
        };

        $scope.modalImage = function () {
            $scope.pictureModal.show();
        }

        //TAKE PHOTO WITH CAMERA
        $scope.takePicture = function() {
            var options = {
                quality : 50,
                destinationType : Camera.DestinationType.FILE_URI,
                popoverOptions: CameraPopoverOptions,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
                saveToPhotoAlbum: false
            };
            //select multiple photo
            //phonegap plugin add https://github.com/wymsee/cordova-imagePicker.git
            //cordova plugin add https://github.com/wymsee/cordova-imagePicker.git
            //window.imagePicker.getPictures(
            //    function(results) {
            //        for (var i = 0; i < results.length; i++) {
            //            console.log('Image URI: ' + results[i]);
            //        }
            //    }, function (error) {
            //        console.log('Error: ' + error);
            //    }, {
            //        maximumImagesCount: 10,
            //        width: 80
            //    }
            //);
            $cordovaCamera.getPicture(options).then(function(imageData) {
                var myPopup = $ionicPopup.show({
                    template: '<textarea rows="5" type="text" ng-model="worker.description">',
                    title: 'Description for picture',
                    subTitle: 'Please use description picture',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                if (!$scope.worker.description) {
                                    $scope.imgURI.push({
                                        id: i++,
                                        image: imageData,
                                        desc: ''
                                    })

                                } else {
                                    $scope.imgURI.push({
                                        id: i++,
                                        image: imageData,
                                        desc: $scope.worker.description
                                    })
                                }
                                $scope.worker.description = '';
                            }
                        },
                    ]
                });
            });
            //    , function(err) {
            //    alert(err);
            //});
        };

        //UPLOAD IMAGE FUNCTION
        function uploadFile(img, server, params) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(img, server, function(r) {
                console.log("Upload success " + r);
            }, function(error) {
                console.log("Upload Failed " + error);
            }, options);
        }

        //CHECK VALID MOBILE AND EMAIL
        $scope.Checkfield = function (isMobile) {
            if(isMobile)
            {
                InjuryServices.checkMobile($scope.worker.Mobile).then(function(data) {
                    if(data.status == 'success')
                    {
                        if(data.count == 0)
                        {
                            $scope.isFailMobile = false;
                        }
                        else
                        {
                            $scope.isFailMobile = true;
                        }
                    }
                })
            }
            else
            {
                InjuryServices.checkEmail($scope.worker.Email).then(function (data) {
                    if (data.status == 'success') {
                        if (data.count == 0) {
                            $scope.isFailEmail = false;
                        }
                        else {
                            $scope.isFailEmail = true;
                        }
                    }

                })
            }
        }


        //SUBMIT EMERGENCY AND NON-EMERGENCY
        $scope.showConfirm = function(desc, click) {
            if(click)
            {
                $scope.isSubmitdesc = true;
                if (desc.$invalid && isClick)
                {
                    var alertPopup = $ionicPopup.alert({
                        title: "Error",
                        template: 'Please Check Your Information!'
                    });
                }
                else
                {
                    if($scope.imgURI.length > 0) {
                        $state.go('app.injury.desinjurySuccess');
                    }
                    else
                    {
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'You need take photo',
                            template: 'Are you sure you want to take photo?'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.takePicture();
                            }
                        });
                    }
                }
            }
            else
            {
                $scope.isSubmitdesc = true;
                if (desc.$invalid && isClick)
                {
                    var alertPopup = $ionicPopup.alert({
                        title: "Error",
                        template: 'Please Check Your Information!'
                    });
                }
                else{
                    if($scope.imgURI.length > 0) {
                        NonEmergency();
                    }
                    else
                    {
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'You need take photo',
                            template: 'Are you sure you want to take photo?'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.takePicture();
                            }
                            else {
                                NonEmergency();
                            }
                        });
                    }

                }
            }
        };

        //SUBMIT END INSERT INJURY LAST
        $scope.submitInjuryAll = function () {
            InjuryServices.insertInjury($scope.worker).then(function(data) {
                $ionicLoading.show({
                    template: "<div class='icon ion-ios7-reloading'></div>"+
                    "<br />"+
                    "<span>Waiting...</span>",
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $timeout(function () {
                    if(data.status == 'success')
                    {
                        for(var i = 0 ; i < $scope.imgURI.length; i++)
                        {
                            var params = {
                                injury_id: data.injury_id,
                                description: $scope.imgURI[i].desc
                            };
                            uploadFile($scope.imgURI[i].image,serverUpload,params);
                        }
                        var alertPopup = $ionicPopup.alert({
                            title: 'Insert Successfully',
                            template: 'We have added Injury..'
                        });
                        alertPopup.then(function (res){
                            if(res){
                                $state.go('app.injury.info');
                                $scope.imgURI = [];
                                resetField();
                            }
                        });
                        $ionicLoading.hide();
                    }
                    else {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Insert Failed',
                            template: 'Please check information!'
                        });
                    }
                }, 1000);

            })
        }


        //CHECK NON-EMERGENCY CHANGE FORM
        function NonEmergency() {
            $scope.infoInjury = {
                info: $scope.worker,
                dataImage: $scope.imgURI
            };
            alert(JSON.stringify($scope.infoInjury));
            localStorageService.set("injuryInfo", $scope.infoInjury);

            if($scope.worker.Patient_id == -1)
            {
                localStorageService.set("checkNonemer", $scope.goAddworker);
                $state.go('app.worker.add');
            }
            else
            {
                $state.go('app.chooseAppointmentCalendar',{Patient_id: $scope.worker.Patient_id});
            }
        }
        initForm();


        $scope.isCollapsed = false;
        //maps
        //Google map
        $scope.testMap = function(){

            new GMaps({
                div: '#map',
                lat: -12.043333,
                lng: -77.028333
            });
        }

        $scope.tabs = [{
            title: 'Information',
            url: 'info.html'
        }, {
            title: 'Injury',
            url: 'iDesc.html'
        }];

        $scope.currentTab = 'info.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        }

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        }

    })

    .directive("mdtMap", function(){
        return {
            restrict: "A",
            replace: "true",
            scope:{
                address: '='
            },
            link: function(scope, element, attrs){
                var id = "#"+attrs.id;

                alert(scope.address);
                var map = new GMaps({
                    el: id,
                    lat: -12.043333,
                    lng: -77.028333,
                    zoomControl : true,
                    zoomControlOpt: {
                        style : 'SMALL',
                        position: 'TOP_LEFT'
                    },
                    panControl : false,
                    streetViewControl : false,
                    mapTypeControl: false,
                    overviewMapControl: false
                });

                GMaps.geolocate({
                    success: function(position) {
                        map.setCenter(position.coords.latitude, position.coords.longitude);
                        alert(position);
                        map.addMarker({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            title: 'Lima',
                            click: function(e) {
                                alert('You clicked in this marker');
                            }
                        });

                    },
                    error: function(error) {
                        alert('Geolocation failed: '+error.message);
                    },
                    not_supported: function() {
                        alert("Your browser does not support geolocation");
                    }
                    //,
                    //always: function() {
                    //    alert("done");
                    //}
                });


                var ad= function(){
                    GMaps.geocode({
                        address:scope.address ,
                        callback: function(results, status){
                            if(status=='OK'){
                                var latlng = results[0].geometry.location;
                                map.setCenter(latlng.lat(), latlng.lng());

                                map.addMarker({
                                    lat: latlng.lat(),
                                    lng: latlng.lng()
                                });
                            }
                        }
                    });
                }

                scope.$watch('address',function(newadd,oldadd){
                    if(typeof newadd!== undefined){

                        scope.address = newadd;

                        ad();
                    }
                })



            }
        }
    });

//.directive('noDragRight', ['$ionicGesture', function($ionicGesture) {
//
//    return {
//        restrict: 'A',
//        link: function($scope, $element, $attr) {
//
//            $ionicGesture.on('dragright', function(e) {
//                e.gesture.srcEvent.preventDefault();
//            }, $element);
//        }
//    }
//}])

//CONTROLLER TEMP FOR MODAL SHOW DETAIL PICTURE
//.controller('InjuryImgControllerModal', function($scope){
//    $scope.hideModal = function() {
//        $scope.InjuryImgControllerModal.hide();
//    };
//})
