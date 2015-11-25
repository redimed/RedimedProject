angular.module('starter.security.register.controller', []).controller('securityRegisterController', function($scope, $state, $timeout, SecurityService, ConfigService, $ionicPopup, WorkerServices, $filter, HOST_CONFIG, $cordovaCamera, $ionicLoading) {
    $scope.titleIndex = ConfigService.title_option();
    $scope.sexIndex = ConfigService.sex_option();

    $scope.userInfo = {};
    $scope.patientInfo = {};

    $scope.place = { value: '' }
    $scope.isValidUsername = false; // check username exist show layout

    var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/users/uploadAvatar"; // api upload avatar patient to server
    var selectOptionUpload = 0; // take photo from camera or library

    WorkerServices.listAccType().then(function(data) {
        if (data.status != 'success') {
            alert('error');
            return;
        }
        $scope.accTypeIndex = data.list;
    });

    WorkerServices.listPrvFund().then(function(data) {
        if (data.status != 'success') {
            alert('error');
            return;
        }
        $scope.fundIndex = data.list;
    })

    $scope.$watch('patientInfo.Address1', function(newval) {
        if ($scope.patientInfo && $scope.patientInfo.Address1 && newval) {
            $scope.change();
        }
    })

    // Description: Split string address from autocomplete input set for field State and Country
    // Input: + A string of address
    // Output: + State and Country
    $scope.change = function() {
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };
        var string = $scope.patientInfo.Address1;
        var arr = string.split(",");
        var trim = _.map(arr, _.trim);
        var place = $scope.place.value;
        if (trim.length == 4) {
            switch (trim[2]) {
                case "Northern Territory":
                    $scope.patientInfo.State = "NT";
                    break;
                case "Queensland":
                    $scope.patientInfo.State = "QLD";
                    break;
                case "Victoria":
                    $scope.patientInfo.State = "VIC";
                    break;
                case "New South Wales":
                    $scope.patientInfo.State = "NSW";
                    break;
                case "South Australia":
                    $scope.patientInfo.State = "SA";
                    break;
                case "Western Australia":
                    $scope.patientInfo.State = "WA";
                    break;
                case "Tasmania":
                    $scope.patientInfo.State = "TAS";
                    break;
                default:
                    break;
            }
            $scope.patientInfo.Surburb = trim[1];
            $scope.patientInfo.Country = trim[3];
        }
        else{
            $scope.patientInfo.Surburb = '';
            $scope.patientInfo.Country = 'Australia';
            $scope.patientInfo.State = '';
        }
    }

    // Description: Insert a user with role patient to database
    // Input: + $scope.userInfo: information user this is JSON object
    //        + $scope.patientInfo: information patient
    // Output: Messeage to user
    $scope.submitRegister = function() {
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
        $scope.patientInfo.First_name = _.capitalize($scope.patientInfo.First_name);
        $scope.patientInfo.Sur_name = _.capitalize($scope.patientInfo.Sur_name);
        $scope.patientInfo.Middle_name = _.capitalize($scope.patientInfo.Middle_name);
        $scope.userInfo.DOB = $scope.patientInfo.DOB;
        var fullname = [];
        fullname.push($scope.patientInfo.First_name, $scope.patientInfo.Sur_name, $scope.patientInfo.Middle_name);
        $scope.userInfo.Booking_Person = fullname.join(' ');
        $scope.userInfo.Contact_number = $scope.patientInfo.Mobile;
        $scope.userInfo.Contact_email = $scope.patientInfo.Email;
        SecurityService.signup($scope.userInfo, $scope.patientInfo).then(function(res) {
            if (res.status.toLowerCase() == 'success') {
                $ionicLoading.hide();
                var paramsUpload = {
                    userID: res.userId
                };
                if (typeof $scope.avatarUpload !== "undefined") {
                    console.log("upload")
                    uploadFile(serverUpload, $scope.avatarUpload, paramsUpload);
                }
                $scope.popupMessage = {
                    message: "Register success!"
                };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpSuccess.html",
                    scope: $scope,
                    buttons: [{
                        text: "Ok",
                        onTap: function() {
                            $state.go('security.login', null, {
                                reload: true
                            });
                        }
                    }]
                });
            } else {
                $scope.popupMessage = {
                    message: "Register failed! Please try again"
                };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [{
                        text: "Ok"
                    }]
                });
            }
        })
    };

    $scope.changeDOBworker = function() {
        var today = new Date().getFullYear();
        if ($scope.patientInfo.DOB.split("-")[0] >= today.toString() || $scope.patientInfo.DOB == '') {
            $scope.dateError = true;
        } else {
            $scope.dateError = false;
        }
    };

    $scope.checkUsername = function() {
        if (typeof $scope.userInfo.user_name !== 'undefined') {
            SecurityService.checkUserName($scope.userInfo.user_name).then(function(res) {
                if (res.length === 1) {
                    $scope.isValidUsername = true;
                } else {
                    $scope.isValidUsername = false;
                }
            })
        }
    };

    $scope.checkValidate = function(registerForm) {
        if (!registerForm.$invalid) {
            var mobile = $scope.patientInfo.Mobile;
            if (mobile.length < 10) {
                $scope.popupMessage = {
                    message: 'Enter Phone number length equal 10'
                };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [{
                        text: "Ok"
                    }]
                });
            } else {
                if (registerForm.$name == "registerForm1") {
                    $state.go("security.register.info2");
                } else if (registerForm.$name == "registerForm2") {
                    $state.go("security.register.info3");
                }
            }
        } else {
            if (registerForm.$error.required) {
                $scope.popupMessage = {
                    message: 'Please Check ' + registerForm.$error.required[0].$name
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
    };

    $scope.selectOption = function() {
        $scope.popupMessage = {
            message: "Using camera or take photo?"
        };
        $ionicPopup.show({
            templateUrl: "modules/popup/PopUpConfirm.html",
            scope: $scope,
            buttons: [{
                text: "Camera",
                onTap: function() {
                    selectOptionUpload = 1;
                    takePhotoUpload(selectOptionUpload);
                }
            }, {
                text: "Photo Library",
                onTap: function() {
                    selectOptionUpload = 2;
                    takePhotoUpload(selectOptionUpload);
                }
            }]
        });
    };

    function takePhotoUpload(params) {
        if (params == 1) {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                popoverOptions: CameraPopoverOptions,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.avatarUpload = imageData;
            });
        } else if (params == 2) {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                popoverOptions: CameraPopoverOptions,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.avatarUpload = imageData;
            });
        }
    };

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

    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function() {
            document.getElementById('autocomplete').blur();
        });
    };

    $scope.usernameClick = function() {
        $scope.isValidUsername = false;
    }
})
    .directive('googleplace', function() {
    return {
        require: 'ngModel',
        restrict: "A",
        scope: {
            Place: '=place'
        },
        link: function(scope, element, attrs, model) {
            var componentForm = {
                street_number: '',
                route: '',
                locality: '',
                administrative_area_level_1: '',
                country: '',
                postal_code: ''
            };
            var options = {
                types: [],
                componentRestrictions: {
                    country: 'au'
                }
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.Place = scope.gPlace.getPlace();
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
})
