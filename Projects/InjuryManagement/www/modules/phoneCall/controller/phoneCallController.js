angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,
                                                 $rootScope, $timeout, $ionicModal,
                                                 $stateParams, signaling, UserService) {

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
        })


        if($scope.isCaller)
        {
            // AudioToggle.setAudioMode(AudioToggle.SPEAKER);
            // media = new Media(src, null, null, loop);
            // media.play();

            var publisherProperties =
            {
                resolution: '1280x720',
                insertMode: "append"
            };

            var publisher = TB.initPublisher('selfVideo', publisherProperties);
            var session = TB.initSession( $scope.apiKey, $scope.sessionID );
            session.on({
                'streamCreated': function( event ){
                    session.subscribe( event.stream, "callerVideo",{
                        insertMode: "append",
                        resolution: "1280x720",
                        width: '100%',
                        height: '100%'
                    });
                }
            });
            session.connect($scope.tokenID, function(error) {
                console.log('connect error ', error);
                if (error)
                {
                    console.log(error.message);
                }
                else
                {
                    session.publish( publisher );
                    signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type:'call', sessionId: $scope.sessionID});
                    TB.updateViews()
                }
            });
        }
        else
        {
            if($scope.apiKey != null || $scope.tokenID != null || $scope.sessionID != null)
            {
                console.log('$scope.apiKey ', $scope.apiKey, '$scope.tokenID ', $scope.tokenID, '$scope.sessionID ', $scope.sessionID);

                var publisherProperties =
                {
                    resolution: '1280x720',
                    insertMode: "append"
                };

                publisher = TB.initPublisher('selfVideo',publisherProperties);

                session = TB.initSession( $scope.apiKey, $scope.sessionID );
                session.on({
                    'streamCreated': function( event ){
                        session.subscribe( event.stream, "callerVideo",{
                            insertMode: "append",
                            resolution: "1280x720",
                            width: '100%',
                            height: '100%'
                        });
                    }
                });
                session.connect($scope.tokenID, function(error) {
                    if (error)
                    {
                        console.log(error.message);
                    }
                    else
                    {
                        session.publish( publisher );
                        signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type:'answer'});
                        TB.updateViews()
                    }
                });
            }
        }

        $scope.micToogle = function() {
            $scope.mic = !$scope.mic;

            if($scope.mic){
                publisher.publishAudio(false);
            }
            else {
                publisher.publishAudio(true);
            }
        }

        $scope.videoToogle = function() {
            $scope.camera = !$scope.camera;
            if($scope.camera){
                publisher.publishVideo(false);
            }
            else {
                publisher.publishVideo(true);
            }
        }

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
        };

        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function onMessageReceive (fromId, fromUser, message) {
            switch (message.type) {
                case 'answer':
                    // media.pause();
                    $scope.isAccept = true;
                    break;
                case 'ignore':
                    // media.pause();
                    session.unpublish(publisher);
                    publisher = null;
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
                case 'cancel':
                    publisher.publishAudio(false);
                    publisher.publishVideo(false);
                    session.unpublish(publisher);
                    publisher = null;
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
            }
        }

        signaling.on('messageReceived', onMessageReceive);


        //function performCall(easyRtcId) {
        //    easyrtc.hangupAll();
        //    var acceptedCB = function(accepted, easyrtcid) {
        //    };
        //    var successCB = function() {
        //        console.log("Success","Call Success!");
        //    };
        //    var failureCB = function(errCode, errMsg) {
        //        console.log("Error",errMsg);
        //    };
        //
        //    easyrtc.call(easyRtcId, successCB, failureCB, acceptedCB);
        //}
        //
        //function init() {
        //    var connectSuccess = function(rtcId) {
        //        if ($scope.isCaller == true) {
        //            signaling.emit("sendMessage", localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'call'});
        //            AudioToggle.setAudioMode(AudioToggle.SPEAKER);
        //            media = new Media(src, null, null, loop);
        //            media.play();
        //        }
        //        if($scope.isCaller == false) {
        //            signaling.emit("sendMessage", localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'answer',rtcId: rtcId})
        //        }
        //
        //    }
        //    var connectFailure = function(errorCode, errText) {
        //        console.log("===RTC Connect Error====== " + errText);
        //        easyrtc.showError(errorCode, errText);
        //    }
        //
        //    easyrtc.dontAddCloseButtons();
        //    easyrtc.easyApp("easyrtc.audioVideo",'selfVideo',['callerVideo'], connectSuccess, connectFailure);
        //}
        //
        //var disconnect = function() {
        //    easyrtc.hangupAll();
        //    easyrtc.closeLocalStream();
        //    easyrtc.disconnect();
        //}
        //
        //init();

        //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        //
        //var constraints = {video: true};
        //
        //function successCallback(localMediaStream) {
        //    window.stream = localMediaStream; // stream available to console
        //    var video = document.querySelector("video");
        //    video.src = window.URL.createObjectURL(localMediaStream);
        //    video.play();
        //}
        //
        //function errorCallback(error){
        //    console.log("navigator.getUserMedia error: ", error);
        //}
        //
        //navigator.getUserMedia(constraints, successCallback, errorCallback);

    })
