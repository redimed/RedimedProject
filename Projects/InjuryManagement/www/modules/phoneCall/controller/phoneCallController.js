angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,
                                                 $rootScope, $timeout, $ionicModal,
                                                 $stateParams, signaling, UserService, $ionicSideMenuDelegate, phoneCallService, $ionicModal) {


        var from = localStorageService.get('fromState');
        $scope.userInfo = localStorageService.get('userInfo');
        $scope.apiKey = $stateParams.apiKey;
        $scope.sessionID = $stateParams.sessionID;
        $scope.tokenID = $stateParams.tokenID;
        $scope.isCaller = ($stateParams.isCaller == 'true') ? true : false;
        $scope.isAccept = false;
        var params = {};
        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }
        $scope.contactNameJson = [];
        $scope.mic = false;
        $scope.camera = false;
        $scope.isImage = false;
        $scope.controllerbtn = true;
        $scope.imgObj = [];
        $scope.imgDetail = [];
        $scope.idImgShareScreen = 0;
        $scope.imgCount = null;
        $scope.btnShowlstImg = true;
        $scope.blueTooth = false;

        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];
        var src = "/android_asset/www/phone_calling.mp3";
        var media = null;
        var loop = function (status) {
            if (status === Media.MEDIA_STOPPED) {
                media.play();
            }
            else if (status === Media.MEDIA_PAUSED) {
                media.pause();
            }
        };
        media = new Media(src, null, null, loop);

        $ionicSideMenuDelegate.canDragContent(false);

        UserService.getUserInfo($stateParams.callUser).then( function(data) {
            $scope.contactNameJson.contactName = data.user_name;
            $scope.contactNameJson.background = colors[Math.floor(Math.random() * colors.length)];
            $scope.contactNameJson.letter = String(data.user_name).substr(0,1).toUpperCase();
            if(data.img == null) {
                $scope.avatarCaller = 'img/avatar.png'
            } else {
                $scope.avatarCaller = data.img
            }
        });

        //$scope.streams = OTSession.streams;
        if ($scope.isCaller) {
            media.play();

            var publisherProperties =
            {
                insertMode: "append",
                resolution: '1280x720',
                width: window.outerWidth / 10,
                height: window.outerHeight / 10
            };
            var publisher = TB.initPublisher('selfVideo', publisherProperties);

            var session = TB.initSession($scope.apiKey, $scope.sessionID);
            session.on({
                'streamCreated': function (event) {
                    $scope.subscriber = session.subscribe(event.stream, "callerVideo", {
                        insertMode: "append",
                        resolution: "1280x720",
                        width: '100%',
                        height: '100%'
                    });
                }
            });
            session.connect($scope.tokenID, function (error) {
                console.log('connect error ', error);
                if (error) {
                    console.log(error.message);
                }
                else {
                    session.publish(publisher);
                    signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {
                        type: 'call',
                        sessionId: $scope.sessionID
                    });
                }
            });

            //OTSession.init($scope.apiKey, $scope.sessionID, $scope.tokenID, function (err, session) {
            //    $scope.session = session;
            //    var connectDisconnect = function (connected) {
            //        $scope.$apply(function () {
            //            $scope.connected = connected;
            //            if (!connected) $scope.publishing = false;
            //        });
            //    };
            //    if ((session.is && session.is('connected')) || session.connected) connectDisconnect(true);
            //    $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true));
            //    $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false));
            //});
            //
            //$scope.publishing = true;
            //signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {
            //    type: 'call',
            //    sessionId: $scope.sessionID
            //});
        }
        else {
            if ($scope.apiKey != null || $scope.tokenID != null || $scope.sessionID != null) {

                $scope.isAccept = true;

                var publisherProperties =
                {
                    insertMode: "append",
                    resolution: '1280x720',
                    width: window.outerWidth/10,
                    height: window.outerHeight/10
                };

                publisher = TB.initPublisher('selfVideo', publisherProperties);

                session = TB.initSession($scope.apiKey, $scope.sessionID);
                session.on({
                    'streamCreated': function (event) {
                        $scope.subscriber = session.subscribe(event.stream, "callerVideo", {
                            insertMode: "append",
                            resolution: "1280x720",
                            width: '100%',
                            height: '100%'
                        });
                    }
                });
                session.connect($scope.tokenID, function (error) {
                    if (error) {
                        console.log(error.message);
                    }
                    else {
                        session.publish(publisher);
                        signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type: 'answer'});
                    }
                });

                //OTSession.init($scope.apiKey, $scope.sessionID, $scope.tokenID, function (err, session) {
                //    $scope.session = session;
                //    var connectDisconnect = function (connected) {
                //        $scope.$apply(function () {
                //            $scope.connected = connected;
                //            if (!connected) $scope.publishing = false;
                //        });
                //    };
                //    if ((session.is && session.is('connected')) || session.connected) connectDisconnect(true);
                //    $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true));
                //    $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false));
                //});
                //
                //$scope.publishing = true;
                //signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type: 'answer'});
            }
        }

        $scope.facePublisherProps = {
            name:'face',
            width: window.outerWidth / 10,
            height: window.outerHeight / 10,
            style: {
                nameDisplayMode: 'off'
            },
            resolution: '1280x720',
            frameRate: 30
        }

        $scope.subscriberProps = {
            name:'face',
            width: window.outerWidth / 2,
            height: window.outerHeight,
            style: {
                nameDisplayMode: 'off'
            },
            resolution: '1280x720',
            frameRate: 30
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
                $scope.controllerbtn = false;
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
            $scope.blueTooth = !$scope.blueTooth;
            $scope.isImage= false;
            if($scope.blueTooth) {
                $scope.controllerbtn = false;
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
                $scope.subscriber.subscribeToVideo(true);
                TB.updateViews();
                $timeout(function(){
                    $scope.subscriber.subscribeToVideo(true);
                    TB.updateViews();
                }, 0.5 * 1000);
            }
        }, false);

        $scope.cancelCall = function (offMedia) {
            screen.unlockOrientation();
            //disconnect();
            publisher.destroy();
            signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'cancel'});
            $state.go(from.fromState.name, params, {location: "replace"}, {reload: true});
            if (offMedia) {
                media.pause();
            }
        }

        var disconnect = function() {
            $scope.session.disconnect();
            $scope.session.on('sessionDisconnected', function () {
                signaling.removeAllListeners();
            });
        }

        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function onMessageReceive (fromId, fromUsername, message) {
            switch (message.type) {
                case 'answer':
                    media.pause();
                    $scope.isAccept = true;
                    break;
                case 'ignore':
                    //disconnect();
                    media.pause();
                    publisher.destroy();
                    screen.unlockOrientation();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
                case 'cancel':
                    //disconnect();
                    publisher.destroy();
                    screen.unlockOrientation();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
            }
        }

        function getImage(id) {
            phoneCallService.getImageShareScreen(id).then(function(result) {
                if(result.status.toLowerCase() == 'success'){
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

        $timeout(function(){
            if($scope.isImage) {
                if($scope.controllerbtn) {
                    $scope.controllerbtn = false;
                }
            }
        }, 3 * 1000)

        $scope.selectImg = function(imgSrc) {
            $scope.imgDetail.src = imgSrc.src;
            $scope.imgDetail.id = imgSrc.id;
        }

        $scope.toggleListImage = function() {
            $scope.btnShowlstImg = !$scope.btnShowlstImg;
        };

        $scope.actionControlButton = function() {
            console.log('actionControlButton');
            $scope.controllerbtn = !$scope.controllerbtn;
        }

        signaling.on('messageReceived', onMessageReceive);

        signaling.on('receiveImage', getImage);

        $scope.$on("$stateChangeSuccess", function() {
            document.addEventListener('backbutton', function(){
                if($state.is("app.phoneCall")) {
                    $scope.cancelCall();
                }
            });
        });
    })
