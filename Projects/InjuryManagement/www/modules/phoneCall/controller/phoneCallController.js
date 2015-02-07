angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,
                                                 $rootScope, $timeout, $ionicModal,
                                                 $stateParams, signaling, UserService) {

        var from = localStorageService.get('fromState');
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
            if (status === Media.MEDIA_STOPPED) {
                media.play();
            }
            else if (status === Media.MEDIA_PAUSED) {
                media.pause();
            }
        };

        UserService.getUserInfo($stateParams.callUser).then( function(data) {
            $scope.contactNameJson.contactName = data.user_name;
            $scope.contactNameJson.background = colors[Math.floor(Math.random() * colors.length)];
            $scope.contactNameJson.letter = String(data.user_name).substr(0,1).toUpperCase();
        })

        $scope.micToogle = function() {
            $scope.mic = !$scope.mic;

            if($scope.mic){
                easyrtc.enableMicrophone(false);
            }
            else {
                easyrtc.enableMicrophone(true);
            }
        }

        $scope.videoToogle = function() {
            $scope.camera = !$scope.camera;

            if($scope.camera){
                easyrtc.enableCamera(false);
            }
            else {
                easyrtc.enableCamera(true);
            }
        }

        $scope.cancelCall = function (offMedia) {
            if(offMedia) {
                media.pause()
                disconnect();
                signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'cancel'});
                $state.go(from.fromState.name, params, {location: "replace"}, {reload: true});
            }
            else {
                disconnect();
                signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, { type: 'cancel' });
                $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
            }
        };

        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function onMessageReceive (fromId, fromUser, message) {
            switch (message.type) {
                case 'answer':
                    media.pause();
                    performCall(message.rtcId);
                    $scope.isAccept = true;
                    break;
                case 'ignore':
                    media.pause();
                    disconnect();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
                case 'cancel':
                    disconnect();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
            }
        }

        signaling.on('messageReceived', onMessageReceive);


        function performCall(easyRtcId) {
            easyrtc.hangupAll();
            var acceptedCB = function(accepted, easyrtcid) {
            };
            var successCB = function() {
                console.log("Success","Call Success!");
            };
            var failureCB = function(errCode, errMsg) {
                console.log("Error",errMsg);
            };

            easyrtc.call(easyRtcId, successCB, failureCB, acceptedCB);
        }

        function init() {
            var connectSuccess = function(rtcId) {
                if ($scope.isCaller == true) {
                    signaling.emit("sendMessage", localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'call'});
                    AudioToggle.setAudioMode(AudioToggle.SPEAKER);
                    media = new Media(src, null, null, loop);
                    media.play();
                }
                if($scope.isCaller == false) {
                    signaling.emit("sendMessage", localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'answer',rtcId: rtcId})
                }

            }
            var connectFailure = function(errorCode, errText) {
                console.log("===RTC Connect Error====== " + errText);
                easyrtc.showError(errorCode, errText);
            }

            easyrtc.dontAddCloseButtons();
            easyrtc.easyApp("easyrtc.audioVideo",'selfVideo',['callerVideo'], connectSuccess, connectFailure);
        }

        var disconnect = function() {
            easyrtc.hangupAll();
            easyrtc.closeLocalStream();
            easyrtc.disconnect();
        }

        init();
    })
