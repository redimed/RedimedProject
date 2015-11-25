angular.module("starter.menu.controller", []).controller("menuController", function($scope, $rootScope, localStorageService, $state, UserService, $ionicPopover, SecurityService, $ionicPopup, $cordovaDialogs, $ionicLoading, $timeout, $cordovaMedia, phoneCallService, signaling, $cordovaGeolocation, $interval, $ionicPlatform, DriverServices, $ionicModal, $cordovaPush, HOST_CONFIG, $cordovaToast) {
    signaling.removeAllListeners();
    var userInfo = localStorageService.get("userInfo");
    //get userinfo from localstorege
    $scope.userInfo = localStorageService.get("userInfo");
    $scope.Injurymenu = [];
    $scope.userName = userInfo.user_name;
    $scope.selectedMenu = null;
    var lat = 0;
    var long = 0;
    var stopInterval;
    var mediaSource = null;
    //get sound
    var src = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/sound/receive";
    var media = null;
    var hideTimeoutLoadingLogout = false;
    $scope.getAvatar = function() {
        if (userInfo.UserType.user_type == "Patient") {
            var sourceUserImg = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/users/image/" + userInfo.id
            $scope.avatarUpload = sourceUserImg;
            console.log($scope.avatarUpload);
        }
    };
    $scope.getAvatar();
    //download pdf
    $scope.download = function(pdf, id) {
        var firstArr = "http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/firstWA/" + id;
        var progress = "http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/progressWA/" + id;
        var finalWa = "http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/finalWA/" + id;
        var general = "http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/general/" + id;
        if (pdf && id) {
            switch (pdf) {
                case 'firt':
                    $scope.viewPDF(firstArr, id);
                    break;
                case 'final':
                    $scope.viewPDF(finalWa, id);
                    break;
                case 'general':
                    $scope.viewPDF(general, id);
                    break;
                case 'progress':
                    $scope.viewPDF(progress, id);
                    break;
            }
        };
    };
    //function download and view pdf
    $scope.viewPDF = function(link, id) {
        console.log(link);
        console.log(id);
        $ionicLoading.show({
            template: 'Loading...'
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            fs.root.getDirectory("ExampleProject", {
                create: true
            }, function(dirEntry) {
                dirEntry.getFile(id + ".pdf", {
                    create: true,
                    exclusive: false
                }, function gotFileEntry(fe) {
                    var p = fe.toURL();
                    fe.remove();
                    ft = new FileTransfer();
                    ft.download(encodeURI(link), p, function(entry) {
                        $ionicLoading.hide();
                        $scope.imgFile = entry.toURL();
                        console.log($scope.imgFile)
                        var ref = window.open($scope.imgFile, '_system', 'location=yes');
                        window.open($scope.imgFile, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
                    }, function(error) {
                        $ionicLoading.hide();
                        alert("Download Error Source -> " + error.source);
                    }, false, null);
                }, function() {
                    $ionicLoading.hide();
                    console.log("Get file failed");
                });
            });
        }, function() {
            $ionicLoading.hide();
            console.log("Request for filesystem failed");
        });
    };
    //end download pdf
    var loop = function(status) {
        if (status === Media.MEDIA_STOPPED) {
            media.play();
        } else if (status === Media.MEDIA_PAUSED) {
            media.pause();
            media = null;
        }
    };
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        mediaSource = new Media("https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/im/notification");
    };
    signaling.on('disconnect', function() {
        console.log('===disconnect===');
        localStorageService.clearAll();
        $state.go("security.login", null, { location: "replace", reload: true });
        signaling.removeAllListeners();
        $cordovaToast.showLongTop("Disconnected from server. Please login again");
    });
    signaling.on('connect', function() {
        console.log('===connect=======');
        if (localStorageService.get("userInfo") != null) {
            signaling.emit('reconnected', localStorageService.get("userInfo").id);
        }
    });
    signaling.on('reconnect', function() {
        console.log("onResume function()");
        if (localStorageService.get("userInfo") != null) {
            signaling.emit('reconnected', localStorageService.get("userInfo").id);
        }
    })
    signaling.on('reconnect_failed', function() {
        localStorageService.clearAll();
        $state.go("security.login", null, {
            location: "replace",
            reload: true
        });
        signaling.removeAllListeners();
        $cordovaToast.showLongTop("Disconnected from server. Please login again");
    })
    $scope.checknotificationSocket = false;
    signaling.on('online', function(userlist) {
        $scope.$apply(function() {
            $scope.contacts = userlist;
            for (var i = 0; i < $scope.contacts.length; i++) {
                $scope.contacts[i].letter = String($scope.contacts[i].username).substr(0, 1).toUpperCase();
            }
        })
    });
    UserService.getUserInfo(userInfo.id).then(function(data) {
        $scope.img = data.img;
    });
    $scope.userInfoLS = [];
    //decentralization menu by user_type
    var loadMenu = function() {
        if (userInfo.UserType.user_type == "Patient") {
            var menuPatient = [];
            UserService.getPatientMenu().then(function(response) {
                angular.forEach(response, function(menu) {
                    if (menu.Description == "Submit Injury") menu.Definition = "app.injury.desInjury";
                })
                var evens = _.remove(response, function(n) {
                    return n.Description !== "Add Worker" && n.Description !== "Worker List";
                });
                renderMenu(evens);
            })
        } else {
            UserService.menu(userInfo.id).then(function(response) {
                var evens = _.remove(response, function(n) {
                    return n.Description !== "Consultation History";
                });
                renderMenu(evens);
            });
        }
    }
    //function render menu by user
    var renderMenu = function(response) {
        var i = 0;
        angular.forEach(response, function(menu) {
            if (menu.Parent_Id === -1) $scope.Injurymenu.push({
                "parent": {
                    "name": menu.Description,
                    "definition": menu.Definition,
                    "menu_id": menu.Menu_Id,
                    "childs": []
                }
            });
            else {
                var j = 0;
                angular.forEach($scope.Injurymenu, function(lmenu) {
                    if (lmenu.parent.menu_id === menu.Parent_Id) {
                        $scope.Injurymenu[j].parent.childs.push({
                            "name": menu.Description,
                            "definition": menu.Definition,
                            "id": menu.Menu_Id
                        });
                    }
                    j++;
                })
            }
            i++;
        });
    }
    loadMenu();
    $scope.$on('$destroy', function() {
        $interval.cancel(stopInterval);
        stopInterval = undefined;
    });
    //function logout app
    $scope.logoutApp = function() {
        document.addEventListener("deviceready", function() {
            if (ionic.Platform.isAndroid()) {
                $scope.userInfoLS.push({
                    platform: ionic.Platform.platform(),
                    info: userInfo,
                    token: SecurityService.getandroidToken()
                });
            } else if (ionic.Platform.isIOS()) {
                $scope.userInfoLS.push({
                    platform: ionic.Platform.platform(),
                    info: userInfo,
                    token: SecurityService.getIosToken()
                });
            }
        });
        $scope.popupMessage = {
            message: "Do you want log out?"
        };
        $ionicPopup.show({
            templateUrl: 'modules/popup/PopUpConfirm.html',
            scope: $scope,
            buttons: [{
                text: "Yes, I do!",
                onTap: function(e) {
                    if ($scope.userInfoLS.length > 0) {
                        signaling.emit('logout', userInfo.user_name, userInfo.id, userInfo.UserType.user_type, $scope.userInfoLS);
                        $ionicLoading.show({
                            templateUrl: "modules/loadingTemplate.html",
                            animation: 'fade-in',
                            scope: $scope,
                            maxWidth: 500,
                            showDelay: 0
                        });
                        signaling.on('logoutSuccess', function() {
                            hideTimeoutLoadingLogout = true;
                            signaling.removeAllListeners();
                            localStorageService.clearAll();
                            $state.go("security.login", null, { reload: true });
                            $ionicLoading.hide();
                            $interval.cancel(stopInterval);
                            stopInterval = undefined;
                        });
                        $timeout(function() {
                            console.log('----stopInterval----', stopInterval);
                            if (!hideTimeoutLoadingLogout) {
                                $ionicLoading.hide();
                            }
                        }, 5 * 1000);
                    } else {
                        alert("You are using app on browser.");
                    }
                }
            }, {
                text: "Cancel",
                type: 'btn-cancel-popUp'
            }]
        })
    };

    $scope.readNFC = function() {
        $state.go('app.NFC', null, {
            reload: true
        })
    };

    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function() {
            document.getElementById('autocomplete').blur();
        });
    };

    function getLocation() {
        console.log('--- getLocation func ---');
        var posOptions = {
            maximumAge: 0,
            timeout: 20000,
            enableHighAccuracy: true
        };
        function onSuccess(position) {
            var driverLocation = [];
            lat = position.coords.latitude
            long = position.coords.longitude
            driverLocation.push({
                id: localStorageService.get("userInfo").id,
                latitude: lat,
                longitude: long,
                userName: localStorageService.get("userInfo").user_name,
                userType: localStorageService.get("userInfo").UserType.user_type
            });
            signaling.emit('location', driverLocation);
        }
        function onError(error) {
            console.log("on Error getCurrentPosition", JSON.stringify(error));
            navigator.geolocation.getCurrentPosition(onSuccess, onError, posOptions);
            switch (error.code) {
                case 1:
                    $interval.cancel(stopInterval);
                    stopInterval = undefined;
                    if (ionic.Platform.isAndroid()) {
                        alert("Could not get the current position. Either GPS signals are weak or GPS has been switched off");
                        window.plugins.SettingOpener.Open("ACTION_LOCATION_SOURCE_SETTINGS");
                    } else if(ionic.Platform.isIOS()) {
                        console.log("Could not get the current position. Either GPS signals are weak or GPS has been switched off");
                    }
                    break;
                default :
                    console.log("on Error getCurrentPosition", JSON.stringify(error));
                    break;
            }
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError, posOptions);
    };

    $scope.infoState = function() {
        $state.go('app.profile');
    };

    $scope.makeCall = function(id) {
        signaling.emit("generateSession", userInfo.id);
        signaling.on("generateSessionSuccess", function(opentokRoom) {
            var apikey = opentokRoom.apiKey;
            var sessionid = opentokRoom.sessionId;
            var token = opentokRoom.token;
            $state.go('app.phoneCall', {
                callUser: id,
                apiKey: apikey,
                sessionID: sessionid,
                tokenID: token,
                isCaller: true
            }, {
                reload: true
            });
        });
    };

    $ionicModal.fromTemplateUrl('modules/phoneCall/views/modal/receivePhone.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $scope.modalreceivePhone = modal;
    });
    signaling.removeListener('messageReceived');
    signaling.on('messageReceived', function(fromId, fromUsername, message) {
        localStorageService.set('fromId', fromId);
        localStorageService.set('fromUsername', fromUsername);
        localStorageService.set('message', message);
        UserService.getUserInfo(fromId).then(function(data) {
            if (data.img == null) {
                $scope.avatarCaller = 'img/avatar.png';
            } else {
                $scope.avatarCaller = data.img;
            }
            $scope.fromUsername = fromUsername;
        });
        switch (message.type) {
            case 'call':
                media = new Media(src, null, null, loop);
                media.play();
                $scope.modalreceivePhone.show();
                $scope.acceptCall = function() {
                    media.pause();
                    $scope.modalreceivePhone.hide();
                    $state.go('app.phoneCall', {
                        callUser: fromId,
                        apiKey: message.apiKey,
                        sessionID: message.sessionId,
                        tokenID: message.token,
                        isCaller: false
                    }, {
                        reload: true
                    });
                }
                $scope.ignoreCall = function() {
                    $scope.modalreceivePhone.hide();
                    media.pause();
                    signaling.emit('sendMessage', localStorageService.get('userInfo').id, fromId, {
                        type: 'ignore'
                    });
                }
                break;
            case 'cancel':
                media.pause();
                $scope.modalreceivePhone.hide();
                break;
        }
    });

    signaling.on('forceLogout', function() {
        $interval.cancel(stopInterval);
        stopInterval = undefined;
        localStorageService.clearAll();
        $state.go("security.login", null, {
            reload: true
        });
        $ionicPopup.show({
            template: '<div class="sweetAlert">' +
            '<div class="iconPopup error animateErrorIcon" style="border-color: #e50000;">' +
            '<span class="x-mark animateXMark">' +
            '<span class="line left" style="background-color: #e50000"></span>' +
            '<span class="line right" style="background-color: #e50000"></span>' +
            '</span>' + '</div>' + '</div>' + '<div class="wrap-mes-popup">' +
            '<h2 style="color: #ffffff">Error...</h2>' +
            '<div style="background-color: #ffffff; width: 100%; padding: 10px 0 10px 0;">' +
            '<span>Some is logged into your account!</span>' +
            '</div>' +
            '</div>',
            buttons: [{
                text: 'OK',
            }]
        });
    });

    function initLocationDriver() {
        if (localStorageService.get("userInfo") != null) {
            if (localStorageService.get("userInfo").UserType.user_type == 'Driver') {
                getLocation();
                $timeout(function() {
                    stopInterval = $interval(function() {
                        if(typeof stopInterval !== 'undefined') {
                            getLocation();
                            console.log('---stopInterval inside $interval---', stopInterval);
                        }
                    }, 30 * 1000);
                }, 30 * 1000);
            }
        }
    };

    initLocationDriver();

    $scope.$on("$stateChangeSuccess", function() {
        document.addEventListener('backbutton', function() {
            if ($state.is("app.injury.info") || $state.is("app.driver.list")) {
                if (!$scope.modalreceivePhone.isShown()) {
                    navigator.app.exitApp();
                }
            }
        });
    });

    document.addEventListener("resume", initLocationDriver, false);

})