/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($scope,$rootScope, $state,$modal, $cookieStore,toastr,$window,socket,$location,$stateParams,UserService){
        socket.removeAllListeners();

        $scope.userInfo = null;
        $scope.callUserInfo = $stateParams.callUserInfo;
        $scope.isCaller = $stateParams.isCaller;
        $scope.isAccept = false;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        var audio = new Audio('theme/assets/phone_calling.mp3');

        if($scope.isCaller){
            audio.loop = true;
            audio.play();
        }

        var from = $cookieStore.get('fromState');
        var params = {};

        var disconnect = function() {
            easyrtc.hangupAll();
            easyrtc.closeLocalStream();
            easyrtc.disconnect();

            socket.removeAllListeners();
        }

        if($cookieStore.get('userInfo') == null || typeof $cookieStore.get('userInfo') == 'undefined')
            $state.go('security.login',null,{location: "replace"});
        else
        {
            $scope.userInfo = $cookieStore.get('userInfo');
        }

        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }

        if($stateParams.callUser == null || typeof $stateParams === 'undefined')
        {
                disconnect();
                $state.go(from.fromState.name,params,{location: "replace",reload: true});

        }

        $scope.cancelCall = function(){
            audio.pause();
            disconnect();
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            $state.go(from.fromState.name,params,{location: "replace", reload: true});
        }

        $scope.muteAudio = function(){
            $scope.isAudioMuted = !$scope.isAudioMuted;
            if($scope.isAudioMuted)
                easyrtc.enableMicrophone(false);
            else
                easyrtc.enableMicrophone(true)
        }

        $scope.muteVideo = function(){
            $scope.isVideoMuted = !$scope.isVideoMuted;
            if($scope.isVideoMuted)
                easyrtc.enableCamera(false);
            else
                easyrtc.enableCamera(true)
        }

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type === 'answer')
            {
                audio.pause();
                $scope.isAccept = true;
                if(message.rtcId){
                    performCall(message.rtcId);
                }
            }
            if(message.type === 'ignore')
            {
                audio.pause();
                toastr.error("Call Have Been Rejected!");
                disconnect();
                $state.go(from.fromState.name,params,{location: "replace", reload: true});
            }
            if(message.type === 'cancel')
            {
                audio.pause();
                toastr.error("Call Have Been Cancelled!");
                disconnect();
                $state.go(from.fromState.name,params,{location: "replace", reload: true});

            }

        })

        function performCall(easyRtcId) {
            easyrtc.hangupAll();
            var acceptedCB = function(accepted, easyrtcid) {
                };
            var successCB = function(to) {
                console.log("Call Success: ",to);
            };
            var failureCB = function(errCode, errMsg) {
                toastr.error(errMsg);
                disconnect();
                $state.go(from.fromState.name,params,{location: "replace", reload: true});
            };

            easyrtc.call(easyRtcId, successCB, failureCB, acceptedCB);
        }



        function init(){
            var connectSuccess = function(rtcId) {

                if($scope.isCaller == true)
                    socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'call'});
                if($scope.isCaller == false){
                    socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'answer',rtcId:rtcId})
                }

            }
            var connectFailure = function(errorCode, errText) {
                easyrtc.showError(errorCode, errText);
            }

            easyrtc.dontAddCloseButtons(true);
            easyrtc.easyApp("easyrtc.audioVideo",'selfVideo',['callerVideo'], connectSuccess, connectFailure);
        }
        init();

    })
