angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,
                                                 $rootScope, $timeout, $ionicModal,
                                                 $stateParams, signaling, UserService, OTSession) {


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

        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];
        var src = "/android_asset/www/phone_calling.mp3";
        var media = null;
        var loop = function (status) {
            // if (status === Media.MEDIA_STOPPED) {
            //     media.play();
            // }
            // else if (status === Media.MEDIA_PAUSED) {
            //     media.pause();
            // }
        };

        UserService.getUserInfo($stateParams.callUser).then( function(data) {
            $scope.contactNameJson.contactName = data.user_name;
            $scope.contactNameJson.background = colors[Math.floor(Math.random() * colors.length)];
            $scope.contactNameJson.letter = String(data.user_name).substr(0,1).toUpperCase();
            if(data.img == null) {
                $scope.avatarCaller = 'img/avatar.png'
            } else {
                $scope.avatarCaller = data.img
            }
        })

        document.addEventListener("deviceready", onDeviceReady, false);


        $scope.streams = OTSession.streams;

        function onDeviceReady() {
            if ($scope.isCaller) {
                media = new Media(src, null, null, loop);
                media.play();

                //var publisherProperties =
                //{
                //    insertMode: "append",
                //    resolution: '1280x720',
                //    width: window.outerWidth/10,
                //    height: window.outerHeight/10
                //};
                //var publisher = TB.initPublisher('selfVideo', publisherProperties);
                //
                //var session = TB.initSession( $scope.apiKey, $scope.sessionID );
                //session.on({
                //    'streamCreated': function( event ){
                //        session.subscribe( event.stream, "callerVideo",{
                //            insertMode: "append",
                //            resolution: "1280x720",
                //            width: '100%',
                //            height: '100%'
                //        });
                //    }
                //});
                //session.connect($scope.tokenID, function(error) {
                //    console.log('connect error ', error);
                //    if (error)
                //    {
                //        console.log(error.message);
                //    }
                //    else
                //    {
                //        session.publish( publisher );
                //        signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type:'call', sessionId: $scope.sessionID});
                //    }
                //});

                OTSession.init($scope.apiKey, $scope.sessionID, $scope.tokenID, function (err, session) {
                    if (err) {
                        console.log('init error ', err.message);
                    } else {
                        $scope.session = session;
                        var connectDisconnect = function (connected) {
                            $scope.$apply(function () {
                                $scope.connected = connected;
                                if (!connected) $scope.publishing = false;
                            });
                        };
                        if ((session.is && session.is('connected')) || session.connected) connectDisconnect(true);
                        $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true));
                        $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false));
        // if($scope.isCaller)
        // {
        //     // AudioToggle.setAudioMode(AudioToggle.SPEAKER);
        //     // media = new Media(src, null, null, loop);
        //     // media.play();

        //     var publisherProperties =
        //     {
        //         resolution: '1280x720',
        //         insertMode: "append"
        //     };

        //     var publisher = TB.initPublisher('selfVideo', publisherProperties);
        //     var session = TB.initSession( $scope.apiKey, $scope.sessionID );
        //     session.on({
        //         'streamCreated': function( event ){
        //             session.subscribe( event.stream, "callerVideo",{
        //                 insertMode: "append",
        //                 resolution: "1280x720",
        //                 width: '100%',
        //                 height: '100%'
        //             });
        //         }
        //     });
        //     session.connect($scope.tokenID, function(error) {
        //         console.log('connect error ', error);
        //         if (error)
        //         {
        //             console.log(error.message);
        //         }
        //         else
        //         {
        //             session.publish( publisher );
        //             signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type:'call', sessionId: $scope.sessionID});
        //             TB.updateViews()
        //         }
        //     });
        // }
        // else
        // {
        //     if($scope.apiKey != null || $scope.tokenID != null || $scope.sessionID != null)
        //     {
        //         console.log('$scope.apiKey ', $scope.apiKey, '$scope.tokenID ', $scope.tokenID, '$scope.sessionID ', $scope.sessionID);

        //         var publisherProperties =
        //         {
        //             resolution: '1280x720',
        //             insertMode: "append"
        //         };

        //         publisher = TB.initPublisher('selfVideo',publisherProperties);

        //         session = TB.initSession( $scope.apiKey, $scope.sessionID );
        //         session.on({
        //             'streamCreated': function( event ){
        //                 session.subscribe( event.stream, "callerVideo",{
        //                     insertMode: "append",
        //                     resolution: "1280x720",
        //                     width: '100%',
        //                     height: '100%'
        //                 });
                    }
                    TB.updateViews();
                });
                $scope.publishing = true;
                signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {
                    type: 'call',
                    sessionId: $scope.sessionID
                });

            }
            else {
                if ($scope.apiKey != null || $scope.tokenID != null || $scope.sessionID != null) {

                    if ($scope.session) {
                        $scope.session.disconnect();
                    }

                    OTSession.init($scope.apiKey, $scope.sessionID, $scope.tokenID, function (err, session) {
                        $scope.session = session;
                        var connectDisconnect = function (connected) {
                            $scope.$apply(function () {
                                $scope.connected = connected;
                                if (!connected) $scope.publishing = false;
                            });
                        };
                        if ((session.is && session.is('connected')) || session.connected) connectDisconnect(true);
                        $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true));
                        $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false));
                        TB.updateViews();
                    });

                    $scope.publishing = true;
                    signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type: 'answer'});

                    //var publisherProperties =
                    //{
                    //    insertMode: "append",
                    //    resolution: '1280x720',
                    //    width: window.outerWidth/10,
                    //    height: window.outerHeight/10
                    //};
                    //
                    //publisher = TB.initPublisher('selfVideo', publisherProperties);
                    //
                    //session = TB.initSession($scope.apiKey, $scope.sessionID);
                    //session.on({
                    //    'streamCreated': function (event) {
                    //        session.subscribe(event.stream, "callerVideo", {
                    //            insertMode: "append",
                    //            resolution: "1280x720",
                    //            width: '100%',
                    //            height: '100%'
                    //        });
                    //    }
                    //});
                    //session.connect($scope.tokenID, function (error) {
                    //    if (error) {
                    //        console.log(error.message);
                    //    }
                    //    else {
                    //        session.publish(publisher);
                    //        signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type: 'answer'});
                    //    }
                    //});
                }
            }
        }



        $scope.micToogle = function() {
            $scope.mic = !$scope.mic;

            //if($scope.mic){
            //    publisher.publishAudio(false);
            //}
            //else {
            //    publisher.publishAudio(true);
            //}
        }

        $scope.videoToogle = function() {
            $scope.camera = !$scope.camera;

            //if($scope.camera){
            //    publisher.publishVideo(false);
            //}
            //else {
            //    publisher.publishVideo(true);
            //}
        }

<<<<<<< HEAD
        $scope.cancelCall = function (offMedia) {
            //publisher.destroy();
            disconnect();
            signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'cancel'});
            $state.go(from.fromState.name, params, {location: "replace"}, {reload: true});
            if(offMedia) {
                media.pause();
            }
=======
        $scope.cancelCall = function () {
            publisher.publishAudio(false);
            publisher.publishVideo(false);
            // if(offMedia || publisher) {
            //     media.pause();
            //     session.unpublish(publisher);
            //     signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'cancel'});
            //     $state.go(from.fromState.name, params, {location: "replace"}, {reload: true});
            // }
            // else {
            //     session.unpublish(publisher);
            //     signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, { type: 'cancel' });
            //     $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
            // }
            session.unpublish(publisher);
            signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, { type: 'cancel' });
            $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
            publisher = null;
            signaling.removeAllListeners();
>>>>>>> af7f5a0e15dcd6bd881de30dece2e34f12e0827a
        };

        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function onMessageReceive (fromId, fromUsername, message) {
            switch (message.type) {
                case 'answer':
                    // media.pause();
                    $scope.isAccept = true;
                    break;
                case 'ignore':
<<<<<<< HEAD
                    media.pause();
                    disconnect();
                    //publisher.destroy();
=======
                    // media.pause();
                    session.unpublish(publisher);
                    publisher = null;
>>>>>>> af7f5a0e15dcd6bd881de30dece2e34f12e0827a
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
                case 'cancel':
                    disconnect();
                    //publisher.destroy();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
            }
        }

        signaling.on('messageReceived', onMessageReceive);

        $scope.$on("$stateChangeSuccess", function() {
            document.addEventListener('backbutton', function(){
                if($state.is("app.phoneCall")) {
                    $scope.cancelCall();
                }
            });
        });

        $scope.facePublisherProps = {
            name:'face',
            width: 150,
            height: 100,
            style: {
                nameDisplayMode: 'off'
            },
            resolution: '1280x720'
            //frameRate: 30
        }

        var disconnect = function() {
            $scope.session.disconnect();
            $scope.session.on('sessionDisconnected', function () {
                signaling.removeAllListeners();
            });
        }

    })
