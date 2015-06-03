angular.module('starter.injury.controller', ['ngCordova'])

    .controller('InjuryController', function($scope, $state, $filter, $stateParams,
                                             InjuryServices, $cordovaCamera, $ionicPopup, localStorageService,
                                             $cordovaFile, $ionicModal, ConfigService, $ionicSlideBoxDelegate,
                                             $ionicLoading, $compile, $timeout, $rootScope, HOST_CONFIG, $document, $ionicSideMenuDelegate,
                                             $cordovaDialogs, $ionicPlatform, $cordovaFileTransfer){

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
        }];

        var i = 0;
        var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/im/upload";
        var checkNonemerg = localStorageService.get("checkNonemer");
        var userInfoLS = localStorageService.get("userInfo");

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
            description:'',
            userId:userInfoLS.id,
            infoMaps:{}
        };


        //INPUT DATE ANDROID VER == 4.3
        $scope.clickDate = function() {
            var options = {
                date: new Date(),
                mode: 'date'
            };
            if(ionic.Platform.isAndroid() && ionic.Platform.version() == '4.3') {
                datePicker.show(options, function(date){
                    $scope.worker.DOB = date;
                    $scope.worker.DOB = $filter('date')($scope.worker.DOB, 'yyyy-MM-dd');
                });
            }
        }

        //CONFIG MODAL TAKE PHOTO AND SELECT GALLERRY
        $ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/imageDetail.html', function(modal) {
            $scope.InjuryImgControllerModal = modal;
        },{
            scope: $scope,
            animation: 'slide-in-up',
            hardwareBackButtonClose: false
        });

        //CONFIG MODAL DETAIL PICTURE
        //$ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/modalPicture.html', function(modal) {
        //    $scope.pictureModal = modal;
        //},{
        //    scope: $scope,
        //    animation: 'slide-in-up'
        //});

        //VALID NEXT FORM DESCRIPTION INJURY (TAKE PHOTO)
        $scope.nextform = function(info) {
            $scope.isSubmit = true;
            if(info.$invalid || $scope.isFailMobile == true || $scope.isFailEmail == true) {
                $scope.popupMessage = { message: "Please check your information!" };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [
                        { text: "Ok" }
                    ]
                });
            }
            else {
                $scope.worker.injury_date = new Date();
                $state.go('app.injury.desInjury');
            }
        }

        var scopeReset = angular.copy($scope.worker);

        //FUNCTION FOR BUTTON RESET LEFT-TOP
        $scope.resetFormInjury = function() {
            $scope.popupMessage = { message: "You'll try again input all field!"};
            $ionicPopup.show({
                templateUrl: "modules/popup/PopUpConfirm.html",
                scope: $scope,
                buttons: [

                    {
                        text: "Ok",
                        type: 'button button-assertive',
                        onTap: function(e) {
                            $scope.isSubmit = false;
                            $scope.isFailMobile = false;
                            $scope.isFailEmail = false;
                            $scope.isSubmitdesc = false;
                            $scope.worker = angular.copy(scopeReset);
                            $scope.isShow = true;
                            $scope.imgURI = [];
                            $scope.iconLoadingMobile = false;
                            $scope.iconSuccessMobile = false;
                            $scope.iconErrorMobile = false;

                            $scope.iconSuccessMail = false;
                            $scope.iconErrorMail = false;
                            localStorageService.remove('patientID_select');
                            localStorageService.remove('mode');
                            //$scope.isShow = !$scope.isShow;
                        }
                    },
                    { text: "Cancel" }
                ]
            });
        }

        //FUNCTION RESET FIELD FOR CALL.
        function resetField() {
            $scope.isSubmit = false;
            $scope.isFailMobile = false;
            $scope.isFailEmail = false;
            $scope.isSubmitdesc = false;
            $scope.worker = angular.copy(scopeReset);
            $scope.isShow = true;
            //$scope.isShow = !$scope.isShow;
        }

        //SELECT A ROW WORKER WHEN WRITE
        $scope.selectWorker = function (id) {
            $scope.isShow = !$scope.isShow;
            $scope.isFailMobile = false;
            $scope.isFailEmail = false;
            InjuryServices.getPatientID(id).then(function (data) {
                $scope.worker = data;
                $scope.worker.DOB = new Date($scope.worker.DOB);
                $scope.temp1 = angular.copy($scope.worker);
                localStorageService.set('patientID_select', $scope.worker.Patient_id);
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
                $scope.worker.DOB = new Date(injuryinfoLS.info.DOB);
                $scope.worker.injury_date = new Date();
                $scope.imgURI = injuryinfoLS.dataImage;
                localStorageService.remove("checkNonemer");
                localStorageService.remove("injuryInfo");
                $scope.temp1 = angular.copy($scope.worker);
                $scope.isShow = !$scope.isShow;
            }
            if(InjuryServices.getInjuryInfo.Worker){
                $scope.worker = InjuryServices.getInjuryInfo.Worker;
            }
        };

        //SHOW MODAL IMAGE DETAIL
        $scope.selectImg = function(selected) {
            $scope.imageObj.selected = selected.id;
            $scope.InjuryImgControllerModal.show();
        };

        $scope.hideModal = function() {
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
                $ionicPopup.show({
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
        };

        //UPLOAD IMAGE FUNCTION
        function uploadFile(server, img, params) {
            var trustHosts = true;
            var filePath = img.split(/[?]/)[0];

            var options =  new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = Number(new Date()) + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;
            console.log(img.substr(img.lastIndexOf('/')+1));

            $cordovaFileTransfer.upload(server, filePath, options, true)
                .then(function(result) {
                    if (typeof params !== 'undefined') {
                        InjuryServices.uploadImg(params.injury_id, params.injury_part, params.description);
                        console.log("Upload success " + result);
                    }
                }, function(err) {
                    console.log(err);
                    console.log("Upload Failed " + err);
                    return;
                }, function (progress) {
                });
        }


        //CHECK VALID MOBILE AND EMAIL
        $scope.checkField = function (isMobile) {
            if(isMobile)
            {
                $scope.iconLoadingMobile = true;
                if($scope.worker.Mobile == '' || typeof $scope.worker.Mobile == 'undefined') {
                    $timeout(function(){
                        $scope.iconLoadingMobile = false;
                        $scope.iconSuccessMobile = false;
                        $scope.iconErrorMobile = false;
                    }, 0.1 * 1000);
                } else {
                    InjuryServices.checkMobile($scope.worker.Mobile).then(function(data){
                        $scope.iconSuccessMobile = false;
                        $scope.iconErrorMobile = false;
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
                            $timeout(function(){
                                $scope.iconLoadingMobile = false;
                                if($scope.isFailMobile){
                                    $scope.iconLoadingMobile = false;
                                    $scope.iconErrorMobile = true;
                                } else {
                                    $scope.iconSuccessMobile = true;
                                }
                            }, 2 * 1000);
                        }
                    })
                }
            }
            else
            {
                InjuryServices.checkEmail($scope.worker.Email).then(function (data) {
                    if(typeof $scope.worker.Email == 'undefined') {
                        $scope.iconLoadingMail = true;
                        $scope.iconSuccessMail = false;
                        $scope.iconErrorMail = false;
                        $timeout(function(){
                            $scope.iconLoadingMail = false;
                            $scope.iconSuccessMail = false;
                        }, 10 * 1000);
                    } else {
                        if (data.status == 'success')
                        {
                            $scope.iconLoadingMail = false;
                            if (data.data.length == 0) {
                                $scope.iconSuccessMail = true;
                                $scope.isFailEmail = false;
                            }
                            else {
                                $scope.iconErrorMail = true;
                                $scope.isFailEmail = true;
                            }
                        }
                    }
                })
            }
        }


        //SUBMIT EMERGENCY AND NON-EMERGENCY
        $scope.showConfirm = function(desc, isClick) {
            if(isClick)
            {
                $scope.infopatient = [];

                $scope.isSubmitdesc = true;
                if (desc.$invalid)
                {
                    $scope.popupMessage = { message:"Please Check Your Information!" };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope
                    })
                }
                else
                {
                    if($scope.imgURI.length > 0) {
                        $state.go('app.injury.desInjurySuccess');
                        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];
                        $scope.infopatient.background = colors[Math.floor(Math.random() * colors.length)];
                        $scope.infopatient.letter = String($scope.worker.First_name).substr(0,1).toUpperCase();
                    }
                    else
                    {
                        $scope.gender = {};
                        $scope.popUpemergency = true;
                        $scope.popupMessage = { message:"You need take photo. Are you sure you want go to model?" };
                        var confirmPopup = $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpConfirm.html",
                            scope: $scope,
                            buttons:
                                [
                                    {   text: "Ok",
                                        type: "button button-assertive",
                                        onTap: function(e) {
                                            if (!$scope.gender.sex) {
                                                e.preventDefault();
                                                alert('Please choose gender!');
                                            } else {
                                                return $scope.gender.sex;
                                            }
                                            $scope.popUpemergency = false;
                                        }
                                    },
                                    {
                                        text: "Cancel",
                                        onTap: function(e) {
                                            $scope.popUpemergency = false;
                                        }
                                    },
                                ]
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $state.go('app.model',{linkGender:$scope.gender.sex});
                                InjuryServices.getInjuryInfo.Worker = $scope.worker;
                            }
                        });
                    }
                }
            }
            else
            {
                $scope.isSubmitdesc = true;
                if (desc.$invalid)
                {
                    $ionicPopup.alert({
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
                        $scope.popupMessage = { message:"You should take photo, before leaving here!" };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpConfirm.html",
                            scope: $scope,
                            buttons: [
                                {
                                    text: "Yes, I do",
                                    type: "button button-assertive",
                                    onTap: function(e) {
                                        $scope.takePicture();
                                    }
                                },
                                {
                                    text: "Cancel",
                                    onTap: function(e) {
                                        NonEmergency();
                                    }
                                }
                            ]
                        });
                    }
                }
            }
        };

        function getInforImg(){
            $scope.items = InjuryServices.getInjuryInfo.Model;
            for(var part in $scope.items) {
                if ($scope.items[part].length !== 0) {
                    for(var i = 0; i < $scope.items[part].length; i++){
                        console.log("Inside: " + part);
                        console.log($scope.items[part][i]);
                    }
                };
            }
        }

        //SUBMIT END INSERT INJURY LAST
        $scope.submitInjuryAll = function () {
            $scope.messageLoading = {message: "Waiting..."};
            $ionicLoading.show({
                templateUrl: "modules/loadingTemplate.html",
                animation: 'fade-in',
                scope: $scope,
                maxWidth: 500,
                showDelay: 0
            });
            InjuryServices.insertInjury($scope.worker, localStorageService.get('userInfo').id).then(function(data) {
                $timeout(function () {
                    if(data.status == 'success')
                    {
                        $scope.items = InjuryServices.getInjuryInfo.Model;
                        $ionicLoading.hide();
                        for(var part in $scope.items) {
                            for(var i = 0 ; i < $scope.items[part].length; i++)
                            {
                                var params = {
                                    injury_id: data.injury_id,
                                    injury_part: part,
                                    description: $scope.items[part][i].des
                                };
                                uploadFile(serverUpload, $scope.items[part][i].sourceImg, params);
                            }
                        }
                        $scope.popupMessage = { message: "Success insert injury!" };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpSuccess.html",
                            scope: $scope,
                            buttons: [
                                {
                                    text: "Ok",
                                    onTap: function(e) {
                                        $scope.imgURI = [];
                                        resetField();
                                        $state.go('app.injury.info', {reload: true});
                                    }
                                }
                            ]
                        });
                    }
                    else {
                        $ionicLoading.hide();
                        $scope.popupMessage = { message: "Please check your information!" };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpError.html",
                            scope: $scope,
                            buttons: [
                                { text: "Ok" }
                            ]
                        });
                        //var alertPopup = $ionicPopup.alert({
                        //    title: 'Insert Failed',
                        //    template: 'Please check information!'
                        //});
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

        $scope.ad = {};
        $scope.sc = {showAddress: function(ad){

            $scope.location = ad;
            $scope.worker.infoMaps = ad;
            console.log('SHOW ADDRESS',  $scope.worker.infoMaps)

        }};

        function formCtrl($scope){
            $scope.onSubmit = function(){
                alert("form submitted");
            }
        }

        $scope.location =  $scope.ad;

        $scope.goBluetoothState = function() {
            if($scope.worker.Patient_id > -1) {
                $state.go('app.mainBluetooth', null, {reload: true});
            }
            else {
                $scope.popupMessage = { message: "Please select patient, before using Bluetooth." };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [
                        { text: "Ok" }
                    ]
                });
            }
        }


        //get all injury by company view history
        $scope.getInjuryByCompany = function(){
            InjuryServices.getInjuryByCompany(userInfoLS.company_id).then(function (result){
                if(result.status == "success")
                {
                    $scope.historyCompany = result.data;
                    //console.log($scope.historyCompany)

                }
            });
        }
        $scope.historyDetail = [];
        //detail history injury by injury_id
        $scope.detailInjury = function(injury_id){
            InjuryServices.getInjuryById(injury_id).then(function(result){
                //get injury by id 
                if(result.status == "success"){
                    $scope.historyDetail.detail = result.data[0];

                    console.log($scope.historyDetail.detail)
                }
            })

            $state.go('app.injury.historyDetail');
        }

        $scope.backToHistory = function(){
            $scope.historyDetail = [];
            $state.go('app.injury.historyInjury');
        }

        $scope.getInjuryByCompany();
    })

    .directive("mdtMap", function($http, $ionicLoading, $timeout){
        return {
            restrict: "A",
            replace: "true",
            scope:{
                address: '=',
                lo:'=',
                ad:'=',
                sc: '='
            },
            link: function(scope, element, attrs){
                var id = "#"+attrs.id;
                var geo ;
                scope.messageLoading = {message: "Acquiring the current location..."};
                $ionicLoading.show({
                    templateUrl: "modules/loadingTemplate.html",
                    animation: 'fade-in',
                    scope: scope,
                    maxWidth: 500,
                    showDelay: 0
                });
                var map = new GMaps({
                    el: id,
                    lat: -32.280625,
                    lng: 115.736246,
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
                //get location
                var location =  function(){
                    scope.messageLoading = {message: "Acquiring the current location..."};
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: scope,
                        maxWidth: 500,
                        showDelay: 0
                    });
                    $timeout(function(){
                        $ionicLoading.hide();

                    },3000)
                    GMaps.geolocate({
                        success: function(position) {

                            map.setCenter(position.coords.latitude, position.coords.longitude);
                            geo = position;
                            map.removeMarkers();
                            map.addMarker({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                            //get format address by lat and long
                            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+ position.coords.longitude+'&sensor=true').then(function(data){

                                scope.ad.lat = position.coords.latitude;
                                scope.ad.lng = position.coords.longitude;
                                scope.ad.format_address =  data.data.results[0].formatted_address;
                                scope.sc.showAddress(scope.ad);
                                $timeout(function(){
                                    $ionicLoading.hide();
                                },3000)

                            });
                        },
                        error: function(error) {
                            alert('Geolocation failed: '+error.message);
                            $ionicLoading.hide();
                        },
                        not_supported: function() {
                            alert("Your browser does not support geolocation");
                            $ionicLoading.hide();
                        }

                    });
                };
                location();
                //call againt location reload map
                map.addControl({
                    position:'right_center',
                    content:'<i class="fa fa-crosshairs fa-3x" style="color:black;"></i>',

                    events:{
                        click: function(){
                            location();
                        }
                    }
                });
                var ad= function(){
                    scope.messageLoading = {message: "Waiting..."};
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: scope,
                        maxWidth: 500,
                        showDelay: 0
                    });

                    GMaps.geocode({
                        address:scope.address.formatted_address,
                        callback: function(results, status){
                            if(status=='OK'){
                                var latlng = results[0].geometry.location;
                                map.setCenter(latlng.lat(), latlng.lng());
                                map.removeMarkers();
                                map.addMarker({
                                    lat: latlng.lat(),
                                    lng: latlng.lng()
                                });
                                scope.ad.lat = latlng.lat();
                                scope.ad.lng = latlng.lng();
                                scope.ad.format_address =  scope.address.formatted_address;

                                scope.sc.showAddress(scope.ad);
                                $timeout(function(){
                                    $ionicLoading.hide();
                                    //alert(JSON.stringify(scope.ad.lat))
                                },3000)
                            }else{
                                $ionicLoading.hide();
                            }
                        }
                    });
                };
                scope.$watch('lo',function(newval, oldval){
                    if(newval==true){
                        scope.lo = false;
                        ad();
                    }
                })
            }
        }
    })

    .directive("companyMap", function($state, InjuryServices, localStorageService, $ionicLoading){
        return {
            restrict: "A",
            replace: "true",
            scope:{

            },
            link: function(scope, element, attrs){
                var id = "#"+attrs.id;
                var userinfo = localStorageService.get("userInfo");
                var map = new GMaps({
                    el: id,
                    lat: -32.280625,
                    lng: 115.736246,
                    zoomControl : true,
                    zoomControlOpt: {
                        style : 'SMALL',
                        position: 'TOP_LEFT'
                    },
                    panControl : true,
                    streetViewControl : true,
                    mapTypeControl: true,
                    overviewMapControl: true
                });
                var getWokerbyIdCompany = function() {
                    /**
                     * get user injury in company
                     */
                    InjuryServices.getInjuryByCompany(userinfo.company_id).then(function (result){

                        if(result.status == "success")
                        {

                            scope.lstPatient = result.data;
                            location();
                        }
                    });
                };
                getWokerbyIdCompany();

                var location =  function(){
                    map.removeMarkers();
                    scope.messageLoading = {message: "Waiting..."};
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: scope,
                        maxWidth: 500,
                        showDelay: 0
                    });
                    GMaps.geolocate({
                        success: function(position) {

                            if(position.coords.latitude != null){
                                $ionicLoading.hide();
                                map.setCenter(position.coords.latitude, position.coords.longitude);
                                map.addMarker({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    icon:'img/icon/ambulance.png'
                                });
                            }else{
                                $setTimeout(function() {
                                    $ionicLoading.hide();
                                    alert("Geolocation Fail please check device open location");
                                }, 3000);
                            }

                            angular.forEach(scope.lstPatient,function(item){
                                if(item.latitude != null){
                                    // $ionicLoading.hide();
                                    var contentSring = ''
                                    map.addMarker({
                                        lat: item.latitude,
                                        lng: item.longitude,
                                        infoWindow: {
                                            content: contentSring
                                        },
                                        click: function(){
                                        }
                                    });
                                }

                            });

                            // $ionicLoading.hide();
                        },
                        error: function(error) {
                            alert('Geolocation failed: '+error.message);
                        },
                        not_supported: function() {
                            alert("Your browser does not support geolocation");
                        }
                    });
                };
                map.addControl({
                    position:'RIGHT_CENTER',
                    content:'<a class="btn-floating btn-small  black"><i class="fa fa-crosshairs fa-2x"></i></a>',
                    events:{
                        click: function(){
                            getWokerbyIdCompany();
                        }
                    }
                });
            }
        };
    })

    .directive('tabmari', function() {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var jqueryElm = $(elm[0]);
                $(jqueryElm).tabs()
            }
        };
    })

    .directive("diModal", function( $state){
        return {
            restrict: "A",
            replace: "true",
            scope:{

            },
            link: function(scope, element, attrs){
                var id = "#"+attrs.id;
            }
        }
    })

