/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.calling")
    .controller("callControllerApiRTC", function($timeout,$scope,$document,$modalStack,$interval,$location,$rootScope, $state,$modal, $cookieStore,toastr,$window,socket,UserService, $stateParams){
        var audio = new Audio('theme/assets/phone_calling.mp3');
        var apiKey = $stateParams.apiKey;
        $scope.newwin = null;
        $scope.userInfo = null;
        $scope.callUserInfo = null;
        $scope.patientId = ($stateParams.patientId != null || $stateParams.patientId != undefined) ?  $stateParams.patientId : null;
        $scope.isCaller = ($stateParams.isCaller == 1 || $stateParams.isCaller == '1') ? true : false;
        $scope.isAccept = false;

        UserService.getUserInfo($stateParams.callUser).then(function(data){
            data.img = "theme/assets/icon.png";
            $scope.callUserInfo = data;
        })
        
        $scope.userInfo = $cookieStore.get('userInfo');

        // handler function for media errors
        function userMediaErrorHandler(e) {
            console.log('userMediaErrorHandler');
            console.log(e);
        }

        // handler function for handling the remote user hanging up
        function remoteHangupHandler(e) {
            console.log('remoteHangupHandler');
            console.log(e.detail.reason);
        }

        // handler function for when the local user hangs up
        function hangupHandler(e) {
            console.log('hangupHandler');
            console.log(e.detail.reason);
        }

        function incomingCallHandler(e) {
            console.log("========Incoming Call=========");
            audio.pause();
            $scope.isAccept = true;
        }

        function callAttemptHandler(e) {
            alert('Id :' + e.detail.callerId + 'is trying to reach you')
        }

        function errorHandler(e){
            console.log("errorHandler");
            console.log(e);
        }

        // callback when ApiRTC is ready
        function sessionReadyHandler(e) {
            apiRTC.addEventListener("incomingCall", incomingCallHandler);
            apiRTC.addEventListener("userMediaError", userMediaErrorHandler);
            apiRTC.addEventListener("callAttempt", callAttemptHandler);
            apiRTC.addEventListener("hangup", hangupHandler);
            apiRTC.addEventListener("error", errorHandler);

            var webRTCClient = apiCC.session.createWebRTCClient({
                localVideo : "myLocalVideo",
                minilocalVideo : "myMiniVideo",
                remoteVideo : "myRemoteVideo",
                status : "status"
            });

            if($scope.isCaller)
            {
                audio.loop = true;
                audio.play();
                socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'call',apiKey: $stateParams.apiKey ,clientId: webRTCClient.webRTCClient.clientId});
            }
            else
            {
                if($stateParams.clientId)
                    webRTCClient.call($stateParams.clientId)
            }
        }
        
        // initialise ApiRTC
        apiRTC.init({
            apiKey : $stateParams.apiKey,
            appId : 'RedimedApp',
            onReady : sessionReadyHandler
        });

        socket.removeListener('messageReceived');

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type === 'ignore')
            {
                audio.pause();
                toastr.info(fromUser + " Has Ignored The Call!");
                disconnect();
            }
            if(message.type === 'cancel')
            {
                audio.pause();
                toastr.info(fromUser + " Has Left The Call!");
                disconnect();
            }
        })

        function disconnect() {
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            window.close();
            if (($scope.newwin != null) || (!$scope.newwin.closed))
                $scope.newwin.close();
        }
        

    })