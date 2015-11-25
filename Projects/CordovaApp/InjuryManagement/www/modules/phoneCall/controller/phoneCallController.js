angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,
                                                 $rootScope, $timeout, $ionicModal,
                                                 $stateParams, signaling, UserService, $ionicSideMenuDelegate,
                                                 phoneCallService, $ionicModal, $cordovaFileTransfer,
                                                 $cordovaFile, HOST_CONFIG, $cordovaToast) {

        var session;
        var publisher;
        var publisherProperties;
        $scope.userInfo = localStorageService.get('userInfo');

        $scope.apiKey = $stateParams.apiKey;
        $scope.sessionID = $stateParams.sessionID;
        $scope.tokenID = $stateParams.tokenID;

        $scope.isCaller = ($stateParams.isCaller == 'true') ? true : false; // convert string to bool for receive phone call
        $scope.isAccept = false;

        $scope.mic = false;  // set off micro default true is on
        $scope.camera = false; // set off camera default true is on

        $scope.isImage = false; // variable set current image share screen state
        $scope.blueTooth = null; // variable set current medical device state

        $scope.controllerbtn = true; // set list button when calling hide/show (default show)

        $scope.imgObj = []; // array image receive from doctor
        $scope.imgDetail = []; // set information image from imgObj array
        $scope.idImgShareScreen = 0;
        $scope.imgCount = null;
        $scope.btnShowlstImg = true; // toggle list image share right phone call

        // set roll back current route before move
        var from = localStorageService.get('fromState');
        var params = {};
        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }

        // validate type image
        var regex = "(.*/)*.+\\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP)$";
        var patternFileType = new RegExp(regex);

        $scope.subscriberArr = []; // WARNING: contain multiple subscriber, maximum 2 subscriber and required
        var divName;

        $ionicSideMenuDelegate.canDragContent(false); // set not drag left or right menu

        // TODO receive call from doctor, don't check isCaller = true, because not advantage call from mobile, only receive call from mobile

        //Description: using isCaller check for receive call or calling to
        //Input: + apiKey: room a call
        //Output:
        if(!$scope.isCaller) {
            window.plugins.insomnia.keepAwake(); // not turn off light screen
            if ($scope.apiKey != null || $scope.tokenID != null || $scope.sessionID != null) {
                $scope.isAccept = true;
                if(ionic.Platform.isIPad()) {
                    publisherProperties =
                    {
                        width: 164,
                        height: 123,
                        name: localStorageService.get('userInfo').user_name,
                        nameDisplayMode: "on"
                    };
                } else if(ionic.Platform.isAndroid()) {
                    publisherProperties =
                    {
                        width: 60,
                        height: 46,
                        name: localStorageService.get('userInfo').user_name,
                        nameDisplayMode: "on"
                    };
                }
                publisher = TB.initPublisher('selfVideo', publisherProperties);
                session = TB.initSession($scope.apiKey, $scope.sessionID);
                session.on({
                    'streamCreated': function (e) {
                        if(e.stream.connection.connectionId == session.connection.connectionId){
                            return;
                        }
                        var divCaller = document.createElement('div');
                        divCaller.setAttribute('id', 'stream' + e.stream.streamId);
                        divCaller.setAttribute('ng-hide', "isImage || blueTooth");
                        divCaller.setAttribute("style", "display: table-cell; z-index: -1 !important;");
                        document.getElementById("callerVideo").appendChild(divCaller);
                        divName = document.createElement("div");
                        divName.setAttribute("style", "left: 0px; right: 0px;");
                        divName.className += 'divNameCalling';
                        divName.appendChild(document.createTextNode(e.stream.name));
                        document.getElementById("stream"+ e.stream.streamId).appendChild(divName);
                        $scope.subscriber = session.subscribe(e.stream, divCaller.id, {
                            insertMode: "append",
                            resolution: "1280x720",
                            width: 264,
                            height: 198
                        });
                        $scope.subscriberArr.push(e.stream);
                        TB.updateViews();
                        if($scope.subscriberArr.length == 2) {
                            var x = document.getElementsByClassName("divNameCalling");
                            var i;
                            for (i = 0; i < x.length; i++) {
                                x[i].removeAttribute("style");
                            }
                        }
                    },
                    'signal:shareImage': function(event) {
                        getImage(JSON.parse(event.data).id);
                    },
                    'streamDestroyed': function(e) {
                        $scope.subscriberArr.splice($scope.subscriberArr.indexOf(e.stream), 1);
                    },
                    'signal:cancelCall': function(event) {
                        $timeout(function() {
                            if($scope.subscriberArr != 0) {
                                $cordovaToast.showShortTop(event.data + " had left call");
                            }
                        }, 3 * 1000);
                        divName.setAttribute("style", "left: 0; right: 0;");
                    }
                });
                session.connect($scope.tokenID, function (error) {
                    if (error) {
                        console.log(error.message);
                    }
                    else {
                        session.publish(publisher);
                        signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type: 'answer'});
                        localStorageService.set('callUser', $stateParams.callUser);
                    }
                });
            }
        }

        $scope.micToggle = function() {
            $scope.mic = !$scope.mic;
            if($scope.mic){
                publisher.publishAudio(false);
            }
            else {
                publisher.publishAudio(true);
            }
        }

        $scope.videoToggle = function() {
            $scope.camera = !$scope.camera;

            if($scope.camera){
                publisher.publishVideo(false);
            }
            else {
                publisher.publishVideo(true);
            }
        }

        $scope.imageShareToggle = function() {
            $scope.isImage = !$scope.isImage;
            $scope.blueTooth = false;
            if($scope.isImage) {
                $scope.imgCount = null;

                $scope.subscriber.subscribeToVideo(false);
                TB.updateViews();

                $timeout(function(){
                    $scope.subscriber.subscribeToVideo(false);
                    TB.updateViews();
                }, 0.5 * 1000);

            } else {
                $scope.subscriber.subscribeToVideo(true);
                TB.updateViews();
                $timeout(function(){
                    $scope.subscriber.subscribeToVideo(true);
                    TB.updateViews();
                }, 0.5 * 1000);
            }
        }

        $scope.medicalDeviceToggle = function() {
            if(ionic.Platform.isAndroid()) {
                document.addEventListener("deviceready", function() {
                    bluetooth.enable();
                })
                $scope.blueTooth = !$scope.blueTooth;
                $scope.isImage= false;
                if($scope.blueTooth) {

                    $scope.subscriber.subscribeToVideo(false);
                    TB.updateViews();

                    $timeout(function(){
                        $scope.subscriber.subscribeToVideo(false);
                        TB.updateViews();
                    }, 0.5 * 1000);

                } else {
                    $scope.subscriber.subscribeToVideo(true);
                    TB.updateViews();
                    $timeout(function(){
                        $scope.subscriber.subscribeToVideo(true);
                        TB.updateViews();
                    }, 0.5 * 1000);
                }
            } else {
                $cordovaToast.showShortTop("Sorry platform not support");
            }
        }

        window.addEventListener("orientationchange", function() {
            if($scope.isImage) {
                $scope.controllerbtn = false;
                $scope.subscriber.subscribeToVideo(false);
                TB.updateViews();
                $timeout(function(){
                    $scope.subscriber.subscribeToVideo(false);
                    TB.updateViews();
                }, 0.5 * 1000);
            } else {
                if($scope.subscriber != null) {
                    $scope.subscriber.subscribeToVideo(true);
                    TB.updateViews();
                    $timeout(function(){
                        $scope.subscriber.subscribeToVideo(true);
                        TB.updateViews();
                    }, 0.5 * 1000);
                }
            }
        }, false);

        $scope.cancelCall = function () {
            screen.unlockOrientation();
            var signalPhone = {
                type: 'cancelCall',
                data: localStorageService.get('userInfo').user_name
            }
            $scope.subscriber = null;
            session.signal(signalPhone, function(err) {
                console.log(err);
            })
            session.disconnect();
            localStorageService.remove('callUser');
            $state.go(from.fromState.name, params, {location: "replace"});
        }

        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function onMessageReceive (fromId, fromUsername, message) {
            switch (message.type) {
                case 'answer':
                    $scope.isAccept = true;
                    break;
                case 'ignore':
                    screen.unlockOrientation();
                    session.disconnect();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
                case 'cancel':
                    window.plugins.insomnia.allowSleepAgain();
                    screen.unlockOrientation();
                    session.disconnect();
                    localStorageService.remove('callUser');
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
            }
        }


        function getImage(id) {
            $scope.isFileShare = false;
            phoneCallService.getImageShareScreen(id).then(function(result) {
                if(result.status.toLowerCase() == 'success'){
                    console.log(result.data);
                    $scope.imgObj.push({
                        id: $scope.idImgShareScreen++,
                        src: result.data
                    });
                    $scope.imgDetail.src = result.data;
                    $scope.btnShowlstImg = false;
                    if(!$scope.isImage) {
                        $scope.imgCount++;
                    }
                }
            })
        }

        function getFile(id, fileName) {
            $scope.isFileShare = true;
            $scope.fileImgSrc = null;
            $scope.fileData = null;

            var url = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/download/" + id;
            $scope.filename = fileName;
            var targetPath = cordova.file.externalRootDirectory + 'InjuryManagement/' + $scope.filename;
            var trustHosts = true;
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function (result) {
                    console.log('download success', result);
                    $scope.btnShowlstImg = true;
                    if(patternFileType.test(result.name)) {
                        $scope.fileImg = true;
                        console.log('true imgFile');
                        $cordovaFile.readAsText(cordova.file.externalRootDirectory + 'InjuryManagement/', $scope.filename)
                            .then(function (result) {
                                convertImgToBase64URL(cordova.file.externalRootDirectory + 'InjuryManagement/' + $scope.filename, function(base64Img){
                                    console.log(base64Img);
                                    $scope.fileImgSrc = base64Img;
                                });
                            }, function (error) {
                                console.log('error readAsText', error);
                            });
                    } else {
                        $scope.fileImg = false;
                        console.log('false not imgFile');
                        $cordovaFile.readAsText(cordova.file.externalRootDirectory + 'InjuryManagement/', $scope.filename)
                            .then(function (result) {
                                $scope.fileData = result;
                                console.log('success ', result);
                            }, function (error) {
                                console.log('error ', error);
                            });
                    }
                }, function (err) {
                    console.log('Error', err);
                }, function (progress) {
                    $timeout(function () {
                        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                        console.log($scope.downloadProgress);
                    })
                });
        }

        $scope.selectImg = function(imgSrc) {
            $scope.isFileShare = null;
            $scope.imgDetail.src = imgSrc.src;
            $scope.imgDetail.id = imgSrc.id;
        }

        $scope.toggleListImage = function() {
            $scope.btnShowlstImg = !$scope.btnShowlstImg;
        };

        $scope.actionControlButton = function() {
            $scope.controllerbtn = !$scope.controllerbtn;
        }

        signaling.on('messageReceived', onMessageReceive);

        signaling.on('receiveImage', getImage);

        signaling.on('receiveFile', getFile);

        $scope.$on("$stateChangeSuccess", function() {
            document.addEventListener('backbutton', function(){
                if($state.is("app.phoneCall")) {
                    $scope.cancelCall();
                }
            });
        });

        function convertImgToBase64URL(url, callback, outputFormat){
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function(){
                var dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
                img.src = url;
        }
    })
