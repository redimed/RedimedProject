/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($scope,$rootScope, $state, $cookieStore,toastr,$window,socket,$location,$stateParams,UserService){
        socket.removeAllListeners();

        $scope.userInfo = null;
        $scope.callUserInfo = null;
        $scope.isCaller = $stateParams.isCaller;
        $scope.isAccept = false;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        if($scope.isCaller){
            var audio = new Audio('theme/assets/phone_calling.mp3');
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
            $state.go('security.login');
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
                $state.go(from.fromState.name,params,{location: "replace"});

        }else
        {
            UserService.getUserInfo($stateParams.callUser).then(function(data){
                $scope.callUserInfo = data;
            })
        }

        $scope.cancelCall = function(){
            audio.pause();
            disconnect();
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            $state.go(from.fromState.name,params,{location: "replace"});
        }

        $scope.muteAudio = function(){
            $scope.isAudioMuted = !$scope.isAudioMuted;
        }

        $scope.muteVideo = function(){
            $scope.isVideoMuted = !$scope.isVideoMuted;
        }

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type == 'answer')
            {
                audio.pause();
                if(message.rtcId){
                    performCall(message.rtcId);
                }
            }
            if(message.type == 'ignore')
            {
                audio.pause();
                console.log("=======Ignore=======");
                toastr.error('Error',"Call Have Been Rejected!");
                disconnect();
                $state.go(from.fromState.name,params,{location: "replace"});
            }
            if(message.type == 'cancel')
            {
                audio.pause();
                console.log("=======Cancel=======");
                toastr.error('Error',"Call Have Been Cancel!");
                disconnect();
                $state.go(from.fromState.name,params,{location: "replace"});
            }

        })

        function performCall(easyRtcId) {
            easyrtc.hangupAll();
            var acceptedCB = function(accepted, easyrtcid) {
                };
            var successCB = function(to) {
                $scope.isAccept = true;
                toastr.success("Success","Call Success!");
            };
            var failureCB = function(errCode, errMsg) {
                toastr.error("Error",errMsg);
            };

            easyrtc.call(easyRtcId, successCB, failureCB, acceptedCB);
        }

        function init(){
            var connectSuccess = function(rtcId) {
                if($scope.isCaller == true)
                    socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'call'});
                if($scope.isCaller == false)
                {
                    socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'answer',rtcId:rtcId})
                }

            }
            var connectFailure = function(errorCode, errText) {
                console.log("===RTC Connect Error====");
                easyrtc.showError(errorCode, message);
            }

            easyrtc.easyApp("easyrtc.audioVideo",'selfVideo',['callerVideo'], connectSuccess, connectFailure);
        }
        init();

    })
