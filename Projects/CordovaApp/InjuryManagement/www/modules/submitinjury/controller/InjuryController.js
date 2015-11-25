angular.module('starter.injury.controller', ['ngCordova']).controller('InjuryController', function($scope, $state, $filter, $stateParams, InjuryServices, $cordovaCamera, $ionicPopup, localStorageService, $cordovaFile, $ionicModal, ConfigService, $ionicSlideBoxDelegate, $ionicLoading, $compile, $timeout, $rootScope, HOST_CONFIG, $ionicSideMenuDelegate, $ionicPopover, $cordovaFileTransfer, signaling, $ionicActionSheet) {
        $scope.searchKey = {
            searchFirstName: '',
            searchSurname: ''
        }
        $scope.isSubmit = false;
        $scope.isShow = true;
        $scope.imgURI = [];
        $scope.isSubmitdesc = false;
        $scope.isClick = null;
        $scope.list = [];
        $scope.templist = [];
        $scope.isShowImg = true;
        $scope.isFailMobile = false;
        $scope.isFailEmail = false;
        $scope.isMobile = null;
        $scope.goAddworker = true;
        $scope.imageObj = {};
        $scope.hide = [{
            bars: true
        }];
        $scope.descEditURI = {
            desc: ''
        };
        $scope.infobackup = {
        };
        $scope.$on('someEvent', function(event, data) {
            $scope.flag = true;
            console.log($scope.flag);
            console.log("---------asdasda",data);
            $scope.sourceUserImg = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/users/image/" + data.id ;
            console.log($scope.sourceUserImg);
            $scope.infobackup = data;
            $scope.$apply();
        });
        var i = 0;
        var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/im/upload";
        var checkNonemerg = localStorageService.get("checkNonemer");
        var userInfoLS = localStorageService.get("userInfo");
        $scope.userType = userInfoLS.UserType.user_type;
        console.log("---------",$scope.userType);

        $scope.toogleMenu = function() {
                $ionicSideMenuDelegate.toggleLeft();
            }
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
            injury_date: new Date(),
            description: '',
            userId: userInfoLS.id,
            infoMaps: {},
            signature: '',
            signEmpty: ''
        };
        //INPUT DATE ANDROID VER == 4.3
        $scope.clickDate = function() {
            var options = {
                date: new Date(),
                mode: 'date'
            };
            if (ionic.Platform.isAndroid() && ionic.Platform.version() == '4.3') {
                datePicker.show(options, function(date) {
                    $scope.worker.DOB = date;
                    $scope.worker.DOB = $filter('date')($scope.worker.DOB, 'yyyy-MM-dd');
                });
            }
        };
        //CONFIG MODAL TAKE PHOTO AND SELECT GALLERRY
        $ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/imageDetail.html', function(modal) {
            $scope.InjuryImgControllerModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up',
            hardwareBackButtonClose: false
        });
        //VALID NEXT FORM DESCRIPTION INJURY (TAKE PHOTO)
        $scope.nextform = function(info) {
            $scope.isSubmit = true;
            console.log($scope.worker);
            if($scope.worker.Patient_id !== -1){
                $scope.worker.injury_date = new Date();
                $state.go('app.injury.desInjury');
            }else{
                $scope.popupMessage = {
                        message: "Please choose Patient!"
                    };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [{
                            text: "Ok"
                        }]
                    });
            }
        };
        var scopeReset = angular.copy($scope.worker);
        //BUTTON RESET ALL FIELD SUBMIT INJURY
        $scope.resetFormInjury = function() {
                $scope.popupMessage = {
                    message: "You'll try again input all field!"
                };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpConfirm.html",
                    scope: $scope,
                    buttons: [{
                        text: "Ok",
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
                    }, {
                        text: "Cancel",
                        type: 'btn-cancel-popUp'
                    }]
                });
            }
            //FUNCTION RESET FIELD.
        function resetField() {
            $scope.isSubmit = false;
            $scope.isFailMobile = false;
            $scope.isFailEmail = false;
            $scope.isSubmitdesc = false;
            $scope.worker = angular.copy(scopeReset);
            $scope.isShow = true;
            //$scope.isShow = !$scope.isShow;
        }
        $scope.resetFieldPatient = function() {
                $scope.popupMessage = {
                    message: "You'll try again input all field!"
                };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpConfirm.html",
                    scope: $scope,
                    buttons: [{
                        text: "Ok",
                        onTap: function(e) {
                            $scope.isSubmitdesc = false;
                            $scope.worker.injury_description = '';
                            $scope.imgURI = []
                        }
                    }, {
                        text: "Cancel",
                        type: 'btn-cancel-popUp'
                    }]
                });
            }
            //SELECT WORKER LIST
        $scope.selectWorker = function(id) {
            $scope.searchKey.searchFirstName = '';
            $scope.searchKey.searchSurname = '';
            $scope.isShow = false;
            $scope.isFailMobile = false;
            $scope.isFailEmail = false;
            InjuryServices.getPatientID(id).then(function(data) {
                $scope.worker = data;
                if (data.avatar == null || data.avatar == "") {
                    $scope.worker.avatar = "img/avatar.png";
                } else {
                    $scope.worker.avatar = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/" + data.avatar;
                }
                $scope.worker.DOB = new Date($scope.worker.DOB);
                $scope.temp1 = angular.copy($scope.worker);
                localStorageService.set('patientID_select', $scope.worker.Patient_id);
            })
        };
        //INIT FORM
        function initForm() {
            InjuryServices.searchWorker(userInfoLS.company_id).then(function(data) {
                if (data.status != 'success') {
                    return;
                } else {
                    $scope.list = data.rs;
                }
            });
            $scope.sexIndex = ConfigService.sex_option();
            $scope.titleIndex = ConfigService.title_option();
            if (checkNonemerg) {
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
            if (userInfoLS.UserType.user_type == "Patient") {
                $scope.user_type = "Patient";
                InjuryServices.getPatientByUser(userInfoLS.id).then(function(results) {
                    if (results.status == "success") {
                        $scope.worker.Title = results.data.Title;
                        $scope.worker.First_name = results.data.First_name;
                        $scope.worker.Middle_name = results.data.Middle_name;
                        $scope.worker.Sur_name = results.data.Sur_name;
                        $scope.worker.Mobile = results.data.Mobile;
                        $scope.worker.Sex = results.data.Sex;
                        $scope.worker.DOB = results.data.DOB;
                        $scope.worker.Address1 = results.data.Address1;
                        $scope.worker.Patient_id = results.data.Patient_id;
                        $scope.worker.Email = results.data.Email;
                        $scope.worker.user_type = "Patient"
                    }
                })
            }
            if ($state.params.workeradd == "worker") {
                $scope.worker.Title = ConfigService.workerData.Title;
                $scope.worker.First_name = ConfigService.workerData.First_name;
                $scope.worker.Middle_name = ConfigService.workerData.Middle_name;
                $scope.worker.Sur_name = ConfigService.workerData.Sur_name;
                $scope.worker.Mobile = ConfigService.workerData.Mobile;
                $scope.worker.Sex = ConfigService.workerData.Sex;
                $scope.worker.DOB = ConfigService.workerData.DOB;
                $scope.worker.Address1 = ConfigService.workerData.Address1;
                $scope.worker.Patient_id = ConfigService.workerData.Patient_id;
                $scope.worker.Email = ConfigService.workerData.Email;
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
        $scope.modalImage = function() {
                $scope.pictureModal.show();
            }
            //TAKE PHOTO WITH CAMERA
        $scope.takePicture = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                popoverOptions: CameraPopoverOptions,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
            };
            //select multiple photo
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.popUpDesInjury = true;
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpConfirm.html",
                    scope: $scope,
                    buttons: [{
                        text: 'Cancel',
                        type: 'btn-cancel-popUp',
                        onTap: function() {
                            $scope.popUpDesInjury = false;
                        }
                    }, {
                        text: 'Save',
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
                            $scope.popUpDesInjury = false;
                        }
                    }, ]
                });
            });
        };
        //CHECK VALID MOBILE AND EMAIL
        $scope.checkField = function(isMobile) {
                if (isMobile) {
                    $scope.iconLoadingMobile = true;
                    if ($scope.worker.Mobile == '' || typeof $scope.worker.Mobile == 'undefined') {
                        $timeout(function() {
                            $scope.iconLoadingMobile = false;
                            $scope.iconSuccessMobile = false;
                            $scope.iconErrorMobile = false;
                        }, 0.1 * 1000);
                    } else {
                        InjuryServices.checkMobile($scope.worker.Mobile).then(function(data) {
                            $scope.iconSuccessMobile = false;
                            $scope.iconErrorMobile = false;
                            if (data.status == 'success') {
                                if (data.count == 0) {
                                    $scope.isFailMobile = false;
                                } else {
                                    $scope.isFailMobile = true;
                                }
                                $timeout(function() {
                                    $scope.iconLoadingMobile = false;
                                    if ($scope.isFailMobile) {
                                        $scope.iconLoadingMobile = false;
                                        $scope.iconErrorMobile = true;
                                    } else {
                                        $scope.iconSuccessMobile = true;
                                    }
                                }, 2 * 1000);
                            }
                        })
                    }
                } else {
                    InjuryServices.checkEmail($scope.worker.Email).then(function(data) {
                        if (typeof $scope.worker.Email == 'undefined') {
                            $scope.iconLoadingMail = true;
                            $scope.iconSuccessMail = false;
                            $scope.iconErrorMail = false;
                            $timeout(function() {
                                $scope.iconLoadingMail = false;
                                $scope.iconSuccessMail = false;
                            }, 10 * 1000);
                        } else {
                            if (data.status == 'success') {
                                $scope.iconLoadingMail = false;
                                if (data.data.length == 0) {
                                    $scope.iconSuccessMail = true;
                                    $scope.isFailEmail = false;
                                } else {
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
            if (userInfoLS.UserType.user_type == "Patient") {
                var sourceUserImg = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/users/image/" + userInfoLS.id
                $scope.worker.avatar = sourceUserImg;
            }
            if (isClick) {
                $scope.infopatient = [];
                $scope.isSubmitdesc = true;
                if (desc.$invalid) {
                    $scope.popupMessage = {
                        message: "Please Check Your Information!"
                    };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [{
                            text: "Ok"
                        }]
                    })
                } else {
                    if ($scope.imgURI.length > 0) {
                        $state.go('app.injury.desInjurySuccess');
                        var colors = ['#FF5E3A', '#FF9500', '#FFDB4C', '#87FC70', '#52EDC7', '#1AD6FD', '#C644FC', '#898C90'];
                        $scope.infopatient.background = colors[Math.floor(Math.random() * colors.length)];
                        $scope.infopatient.letter = String($scope.worker.First_name).substr(0, 1).toUpperCase();
                    } else {
                        InjuryServices.checkInjury($scope.worker.Patient_id).then(function(results) {
                            console.log(results);
                            if (results.status == "success") {
                                $scope.gender = {};
                                $scope.popUpemergency = true;
                                $scope.popupMessage = {
                                    message: "Do you want take photo?"
                                };
                                $ionicPopup.show({
                                    templateUrl: "modules/popup/PopUpConfirm.html",
                                    scope: $scope,
                                    buttons: [{
                                        text: "Ok",
                                        onTap: function(e) {
                                            $scope.takePicture();
                                            $scope.popUpemergency = false;
                                        }
                                    }, {
                                        text: "Cancel",
                                        type: 'btn-cancel-popUp',
                                        onTap: function(e) {
                                            $scope.popUpemergency = false;
                                            $state.go('app.injury.desInjurySuccess');
                                        }
                                    }, ]
                                });
                            } else {
                                $scope.popupMessage = {
                                    message: "Patient has been submitted injury today!"
                                };
                                $ionicPopup.show({
                                    templateUrl: "modules/popup/PopUpError.html",
                                    scope: $scope,
                                    buttons: [{
                                        text: "Ok"
                                    }]
                                })
                            }
                        })
                    }
                }
            } else {
                $scope.isSubmitdesc = true;
                if (desc.$invalid) {
                    $scope.popupMessage = {
                        message: "Please Check Your Information!"
                    };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [{
                            text: "Ok"
                        }]
                    });
                } else {
                    if ($scope.imgURI.length > 0) {
                        NonEmergency();
                    } else {
                        $scope.popupMessage = {
                            message: "You should take photo, before leaving here!"
                        };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpConfirm.html",
                            scope: $scope,
                            buttons: [{
                                text: "Yes, I do",
                                onTap: function(e) {
                                    $scope.takePicture();
                                }
                            }, {
                                text: "Cancel",
                                type: 'btn-cancel-popUp',
                                onTap: function(e) {
                                    NonEmergency();
                                }
                            }]
                        });
                    }
                }
            }
        };
        //UPLOAD IMAGE FUNCTION
        function uploadFile(server, img, params) {
            var win = function(r) {
                console.log("Upload Success " + JSON.stringify(r));
            }
            var fail = function(error) {
                console.log("Upload Failed " + JSON.stringify(error));
            }
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.params = params;
            var ft = new FileTransfer();
            ft.upload(img, encodeURI(server), win, fail, options, true);
        }
        //SUBMIT END INSERT INJURY LAST
        $scope.submitInjuryAll = function() {
                $scope.messageLoading = {
                    message: "Waiting..."
                };
                $ionicLoading.show({
                    templateUrl: "modules/loadingTemplate.html",
                    animation: 'fade-in',
                    scope: $scope,
                    maxWidth: 500,
                    showDelay: 0
                });
                //console.log($scope.worker.signature);
                console.log($scope.worker.signEmpty);
                if ($scope.worker.signature == '') {
                    $ionicLoading.hide();
                    alert("check signature");
                } else {
                    if ($scope.worker.signEmpty == false) {
                    InjuryServices.insertInjury($scope.worker, localStorageService.get('userInfo').id).then(function(data) {
                        $timeout(function() {
                            if (data.status == 'success') {
                                signaling.emit('notifyReceptionist');
                                for (var i = 0; i < $scope.imgURI.length; i++) {
                                    var params = {
                                        injury_id: data.injury_id,
                                        description: $scope.imgURI[i].desc
                                    };
                                    uploadFile(serverUpload, $scope.imgURI[i].image, params);
                                }
                                $ionicLoading.hide();
                                $scope.popupMessage = {
                                    message: "Success insert injury!"
                                };
                                $ionicPopup.show({
                                    templateUrl: "modules/popup/PopUpSuccess.html",
                                    scope: $scope,
                                    buttons: [{
                                        text: "Ok",
                                        onTap: function(e) {
                                            $scope.imgURI = [];
                                            if (userInfoLS.UserType.user_type == "Patient") {
                                                $scope.worker.injury_description = '';
                                                $scope.isSubmitdesc = false;
                                                $scope.imgURI = []
                                                $state.go('app.injury.desInjury');
                                            } else {
                                                resetField();
                                                $state.go('app.injury.info', {
                                                    reload: true
                                                });
                                            }
                                        }
                                    }]
                                });
                            } else {
                                $ionicLoading.hide();
                                $scope.popupMessage = {
                                    message: "Please check your information!"
                                };
                                $ionicPopup.show({
                                    templateUrl: "modules/popup/PopUpError.html",
                                    scope: $scope,
                                    buttons: [{
                                        text: "Ok"
                                    }]
                                });
                            }
                        }, 1 * 1000);
                    })
                    }else{
                        $ionicLoading.hide();
                        alert("check signature");
                    }
                }
            }
            //CHECK NON-EMERGENCY CHANGE FORM
        function NonEmergency() {
            $scope.infoInjury = {
                info: $scope.worker,
                dataImage: $scope.imgURI
            };
            localStorageService.set("injuryInfo", $scope.infoInjury);
            if (userInfoLS.UserType.user_type == "Patient") {
                $state.go('app.chooseAppointmentCalendar', {
                    Patient_id: $scope.worker.Patient_id
                });
            } else {
                if ($scope.worker.Patient_id == -1) {
                    localStorageService.set("checkNonemer", $scope.goAddworker);
                    $state.go('app.worker.add');
                } else {
                    $state.go('app.chooseAppointmentCalendar', {
                        Patient_id: $scope.worker.Patient_id
                    });
                }
            }
        }
        initForm();
        $scope.ad = {};
        $scope.sc = {
            showAddress: function(ad) {
                $scope.location = ad;
                $scope.worker.infoMaps = ad;
            }
        };

        function formCtrl($scope) {
            $scope.onSubmit = function() {
                alert("form submitted");
            }
        }
        $scope.location = $scope.ad;
        $scope.goBluetoothState = function() {
                if (ionic.Platform.isAndroid()) {
                    if ($scope.worker.Patient_id > -1) {
                        $state.go('app.mainBluetooth', null, {
                            reload: true
                        });
                    } else {
                        $scope.popupMessage = {
                            message: "Please select patient, before using Bluetooth."
                        };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpError.html",
                            scope: $scope,
                            buttons: [{
                                text: "Ok"
                            }]
                        });
                    }
                } else {
                    $scope.popupMessage = {
                        message: "Sorry application not support platform"
                    };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [{
                            text: "Ok"
                        }]
                    });
                }
            }
            //Search patient  by First name or Surname
        $scope.searchPatient = function(type, input) {
                $scope.isShow = true;
                switch (type) {
                    case 0:
                        $scope.result_row_firstname = $filter('filter')($scope.list, {
                            First_name: input
                        });
                        break;
                    case 1:
                        $scope.result_row_surname = $filter('filter')($scope.list, {
                            Sur_name: input
                        });
                        break;
                }
            }
            //Show action Sheet
        $scope.showActionSheet = function(objImg) {
            $ionicActionSheet.show({
                buttons: [{
                    text: 'Edit Description'
                }],
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                buttonClicked: function(index) {
                    $scope.descEditURI.desc = objImg.desc;
                    $ionicPopup.show({
                        template: '<div class="sweetAlert">' + '<div class="iconPopup warning" style="border-color: dodgerblue;">' + '<span class="body" style="background-color: dodgerblue;"></span>' + '<span class="dot" style="background-color: dodgerblue;"></span>' + '</div>' + '</div>' + '<div class="wrap-mes-popup">' + '<h3 style="color: #ffffff">Description for picture?</h3>' + '<textarea rows="10" type="text" placeholder="Please use description for picture." ng-model="descEditURI.desc" style="line-height: 1.37em; padding: 10px;"></textarea>' + '</div>',
                        scope: $scope,
                        buttons: [{
                            text: "Ok",
                            onTap: function() {
                                for (var i = 0; i < $scope.imgURI.length; i++) {
                                    console.log($scope.imgURI[i].id + "----" + objImg.id)
                                    if ($scope.imgURI[i].id == objImg.id) {
                                        console.log($scope.descEditURI)
                                        $scope.imgURI[i].desc = $scope.descEditURI.desc;
                                    }
                                }
                            }
                        }]
                    });
                    return true;
                },
                destructiveButtonClicked: function() {
                    var idImgObj = objImg.id
                    var a = _.filter($scope.imgURI, {
                        'id': idImgObj
                    });
                    var b = _($scope.imgURI).difference(a).reject(function(x) {
                        return _.where(a, {
                            'id': x.idImgObj
                        }).length;
                    }).value();
                    $scope.imgURI = b;
                    return true;
                }
            });
        }
    })
    //Directiove Google map get Location 
    .directive("mdtMap", function($http, $ionicLoading, $timeout) {
        return {
            restrict: "A",
            replace: "true",
            scope: {
                address: '=',
                lo: '=',
                ad: '=',
                sc: '='
            },
            link: function(scope, element, attrs) {
                var id = "#" + attrs.id;
                var geo;
                scope.messageLoading = {
                    message: "Acquiring the current location..."
                };
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
                    zoomControl: true,
                    zoomControlOpt: {
                        style: 'SMALL',
                        position: 'TOP_LEFT'
                    },
                    panControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    overviewMapControl: false
                });
                //get location
                var location = function() {
                    scope.messageLoading = {
                        message: "Acquiring the current location..."
                    };
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: scope,
                        maxWidth: 500,
                        showDelay: 0
                    });
                    $timeout(function() {
                        $ionicLoading.hide();
                    }, 3000)
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
                            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true').then(function(data) {
                                scope.ad.lat = position.coords.latitude;
                                scope.ad.lng = position.coords.longitude;
                                scope.ad.format_address = data.data.results[0].formatted_address;
                                scope.sc.showAddress(scope.ad);
                                $timeout(function() {
                                    $ionicLoading.hide();
                                }, 3000)
                            });
                        },
                        error: function(error) {
                            alert('Geolocation failed: ' + error.message);
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
                    position: 'right_center',
                    content: '<i class="icon ion-android-locate" style="color: black;font-size:30px"></i>',
                    events: {
                        click: function() {
                            location();
                        }
                    }
                });
                var ad = function() {
                    scope.messageLoading = {
                        message: "Waiting..."
                    };
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: scope,
                        maxWidth: 500,
                        showDelay: 0
                    });
                    GMaps.geocode({
                        address: scope.address,
                        callback: function(results, status) {
                            if (status == 'OK') {
                                var latlng = results[0].geometry.location;
                                map.setCenter(latlng.lat(), latlng.lng());
                                map.removeMarkers();
                                map.addMarker({
                                    lat: latlng.lat(),
                                    lng: latlng.lng()
                                });
                                scope.ad.lat = latlng.lat();
                                scope.ad.lng = latlng.lng();
                                scope.ad.format_address = scope.address;
                                scope.sc.showAddress(scope.ad);
                                $timeout(function() {
                                    $ionicLoading.hide();
                                    //alert(JSON.stringify(scope.ad.lat))
                                }, 3000)
                            } else {
                                $ionicLoading.hide();
                            }
                        }
                    });
                };
                scope.$watch('lo', function(newval, oldval) {
                    if (newval == true) {
                        scope.lo = false;
                        ad();
                    }
                })
            }
        }
    }).directive("companyMap", function($state, InjuryServices, localStorageService, $ionicLoading, signaling) {
        return {
            restrict: "A",
            replace: "true",
            scope: {},
            link: function(scope, element, attrs) {
                var id = "#" + attrs.id;
                var driverArr = [];
                var patientArr = [];
                var markers = [];
                var PatientPickup = [];
                var directionsDisplay;
                var userinfo = localStorageService.get("userInfo");
                var chicago = new google.maps.LatLng(-32.280625, 115.736246);
                var mapOptions = {
                    zoom: 12,
                    center: chicago
                };

                function CompanyMaps() {
                    directionsDisplay = new google.maps.DirectionsRenderer();
                    var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
                    directionsDisplay.setMap(map);

                    function geolocate() {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position) {
                                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                map.setCenter(pos);
                            });
                        }
                    }
                    geolocate();
                    if (userinfo.UserType.user_type == 'Company') {
                        InjuryServices.getInjuryByCompany(userinfo.company_id).then(function(result) {
                            if (result.status == "success") {
                                scope.allInjury = result.data;
                                scope.AllPatient = _.remove(scope.allInjury, function(n) {
                                    return n.STATUS !== 'Done' && n.STATUS !== 'Picked';
                                });
                                location();
                            }
                        });
                    } else {
                        InjuryServices.getPatientByUser(userinfo.id).then(function(data) {
                            scope.patient = data;
                            location();
                        })
                    }
                    signaling.removeListener('driverLocation');
                    signaling.on('driverLocation', function(result) {
                        scope.lstPatient = result;
                        setAllMap(null);
                        location();
                        console.log("socket")
                    })

                    function setAllMap(map) {
                        for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(map);
                        }
                        markers = [];
                    }
                    var IconBlue = new google.maps.MarkerImage("img/map-makers/icon-blue.png", null, null, null, new google.maps.Size(60, 60));
                    var IconRed = new google.maps.MarkerImage("img/map-makers/icon-red.png", null, null, null, new google.maps.Size(60, 60));
                    var ambulance = new google.maps.MarkerImage("img/icon/ambulance.png", null, null, null, new google.maps.Size(60, 60));
                    var dirRenderer = new google.maps.DirectionsRenderer({
                        map: map
                    });
                    var location = function() {
                        var directionsService = new google.maps.DirectionsService();
                        dirRenderer.setMap(null);
                        // directionsDisplay.setMap(null);
                        var directionRenderers = [];
                        if (userinfo.UserType.user_type == 'Company') {
                            angular.forEach(scope.AllPatient, function(all) {
                                angular.forEach(scope.lstPatient, function(driver) {
                                    var data = _.findIndex(driver.patientList, {
                                        'company_id': all.company_id,
                                        'patient_id': all.patient_id
                                    });
                                    if (data !== -1) {
                                        var CheckNewPatient = _.findIndex(PatientPickup, all);
                                        if (CheckNewPatient == -1) {
                                            PatientPickup.push(all);
                                        }
                                        var start = new google.maps.LatLng(driver.latitude, driver.longitude);
                                        var end = new google.maps.LatLng(all.latitude, all.longitude);
                                        var request = {
                                            origin: start,
                                            destination: end,
                                            travelMode: google.maps.TravelMode.DRIVING
                                        };
                                        directionsService.route(request, function(response, status) {
                                            if (status == google.maps.DirectionsStatus.OK) {
                                                // remove default maker
                                                dirRenderer.setMap(map);
                                                dirRenderer.setOptions({
                                                    suppressMarkers: true,
                                                    preserveViewport: true
                                                });
                                                dirRenderer.setDirections(response);
                                                directionRenderers.push(dirRenderer);
                                                var leg = response.routes[0].legs[0];
                                                makeMarker(leg.start_location, ambulance, driver.userName);
                                                var contentString = '<div id="content">' + '<div id="siteNotice">' + '</div>' + '<h4 id="firstHeading" class="firstHeading">' + all.Title + '' + all.First_name + '' + all.Sur_name + '</h4>' + '<div id="bodyContent">' + 'Duration:' + response.routes[0].legs[0].duration.text + '<br/> Distance:' + response.routes[0].legs[0].distance.text + '</div>';
                                                makeMarker(leg.end_location, IconBlue, contentString);
                                            }
                                        });
                                    } else {}
                                })
                            })
                            var arr = _.filter(scope.AllPatient, function(obj) {
                                return !_.findWhere(PatientPickup, obj);
                            });
                            if (arr.length > 0) {
                                angular.forEach(arr, function(makerRed) {
                                    var position = new google.maps.LatLng(makerRed.latitude, makerRed.longitude);
                                    var contentString = '<div id="content">' + '<div id="siteNotice">' + '</div>' + '<span id="firstHeading" class="firstHeading">' + makerRed.Title + '' + makerRed.First_name + '' + makerRed.Sur_name + '</span>' + '<div id="bodyContent"></div>';
                                    makeMarker(position, IconRed, contentString);
                                })
                            }

                            function makeMarker(position, icon, title) {
                                var marker = new google.maps.Marker({
                                    position: position,
                                    map: map,
                                    icon: icon
                                });
                                markers.push(marker);
                                var infowindow = new google.maps.InfoWindow({
                                    content: title
                                });
                                google.maps.event.addListener(marker, 'click', function() {
                                    infowindow.open(map, marker);
                                });
                            }
                        } else {
                            angular.forEach(scope.lstPatient, function(driver) {
                                var data = _.findIndex(driver.patientList, {
                                    'patient_id': scope.patient.data.Patient_id
                                });
                                if (data !== -1) {
                                    var start = new google.maps.LatLng(driver.latitude, driver.longitude);
                                    var end = new google.maps.LatLng(driver.patientList[data].latitude, driver.patientList[data].longitude);
                                    var request = {
                                        origin: start,
                                        destination: end,
                                        travelMode: google.maps.TravelMode.DRIVING
                                    };
                                    directionsService.route(request, function(response, status) {
                                        if (status == google.maps.DirectionsStatus.OK) {
                                            // var dirRenderer = new google.maps.DirectionsRenderer({
                                            //     map: map
                                            // });
                                            // remove default maker
                                            dirRenderer.setMap(map);
                                            dirRenderer.setOptions({
                                                suppressMarkers: true
                                            });
                                            dirRenderer.setDirections(response);
                                            directionRenderers.push(dirRenderer);
                                            var leg = response.routes[0].legs[0];
                                            var dataBackup = {
                                                username:driver.userName,
                                                id:driver.id,
                                                duration:response.routes[0].legs[0].duration.text,
                                                distance:response.routes[0].legs[0].distance.text
                                            }
                                            scope.$emit('someEvent', dataBackup);
                                           
                                            markeMarker(leg.start_location, ambulance, driver.userName);
                                            var contentString = "<button class='btnMarker'>" + response.routes[0].legs[0].duration.text + "</button>";
                                            var Blue = new google.maps.MarkerImage("img/map-makers/icon-blue.png", null, null, null, new google.maps.Size(30, 30));
                                            makeMarker(leg.end_location, Blue, contentString);
                                        }
                                    });

                                    function markeMarker(position, icon, title) {
                                        var marker = new google.maps.Marker({
                                            position: position,
                                            map: map,
                                            icon: icon,
                                        });
                                        markers.push(marker);
                                    }

                                    function makeMarker(position, icon, title) {
                                        var marker = new MarkerWithLabel({
                                            position: position,
                                            map: map,
                                            icon: icon,
                                            labelContent: title,
                                            labelAnchor: new google.maps.Point(25, 70),
                                            labelInBackground: false
                                        });
                                        markers.push(marker);
                                        // var infowindow = new google.maps.InfoWindow({
                                        //     content: title
                                        // });
                                        // google.maps.event.addListener(marker, 'click', function() {
                                        //     infowindow.open(map, marker);
                                        // });
                                    }
                                } else {
                                    console.log("Not driver");
                                }
                            })
                        }
                    };
                };
                CompanyMaps();
            }
        };
    }).directive('tabmari', function() {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var jqueryElm = $(elm[0]);
                $(jqueryElm).tabs()
            }
        };
    }).directive("diModal", function($state) {
        return {
            restrict: "A",
            replace: "true",
            scope: {},
            link: function(scope, element, attrs) {
                var id = "#" + attrs.id;
            }
        }
    }).directive('drawing', function() {
        return {
            restrict: 'EA',
            replace: "true",
            scope: {
                data: '=',
                empty: '='
            },
            templateUrl: "modules/submitinjury/views/modal/DrawingCanvas.html",
            link: function($scope, elm, attrs) {
                var canvas = document.getElementById('signatureCanvas');
                var signaturePad = new SignaturePad(canvas);
                $scope.clearCanvas = function() {
                    signaturePad.clear();
                }
                $scope.saveCanvas = function() {
                    var sigImg = signaturePad.toDataURL();
                    $scope.signature = sigImg;
                    $scope.data = sigImg;
                    // var checkEmpty = signaturePad.isEmpty();
                    $scope.empty = signaturePad.isEmpty();
                    //console.log($scope.signEmpty);
                }
            }
        };
    })