/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($scope,$location,$rootScope, $state,$modal, $cookieStore,toastr,$window,socket,$location,$stateParams,UserService){
        socket.removeAllListeners();

        $scope.userInfo = null;
        $scope.callUserInfo = $stateParams.callUserInfo;
        $scope.isCaller = $stateParams.isCaller;
        $scope.isAccept = false;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        var publisher = null;
        var session = null;

        var audio = new Audio('theme/assets/phone_calling.mp3');

        var from = $cookieStore.get('fromState');
        var params = {};

        var apiKey = null;
        var sessionId = null;
        var token = null;


        if($cookieStore.get('userInfo') == null || typeof $cookieStore.get('userInfo') == 'undefined')
            $state.go('security.login',null,{location: "replace"});
        else
        {
            $scope.userInfo = $cookieStore.get('userInfo');
        }

        if(typeof from !== 'undefined')
        {
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
        }


        if($scope.isCaller)
        {   

            audio.loop = true;
            audio.play();

            socket.emit("generateSession",$scope.userInfo.id);

            socket.on("generateSessionSuccess",function(opentokRoom){

                apiKey = opentokRoom.apiKey;
                sessionId = opentokRoom.sessionId;
                token = opentokRoom.token;

                var publisherProperties = {};
                publisherProperties.maxResolution = { width: 1920, height: 1080 };
                publisherProperties.insertMode = 'append';
                // publisherProperties.videoSource = 'screen';

                publisher = OT.initPublisher('selfVideo',publisherProperties);

                session = OT.initSession( apiKey, sessionId ); 
                session.on({
                    'streamCreated': function( event ){
                        session.subscribe( event.stream, "callerVideo",{
                            insertMode: "append",
                            maxResolution:{ width: 1920, height: 1080 },
                            width: '100%',
                            height: '100%'
                        });
                    }
                });
                session.connect(token, function(error) {
                    if (error) 
                    {
                        console.log(error.message);
                    } 
                    else 
                    {
                        session.publish( publisher );
                        socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'call',sessionId: sessionId});
                    }
                });
               
            })
        }
        else
        {
            if($stateParams.opentokInfo != null)
            {
                var info = $stateParams.opentokInfo;

                apiKey = info.apiKey;
                sessionId = info.sessionId;
                token = info.token;

                var publisherProperties = {};
                publisherProperties.maxResolution = { width: 1920, height: 1080 };
                publisherProperties.insertMode = 'append';
                // publisherProperties.videoSource = 'screen';

                publisher = OT.initPublisher('selfVideo',publisherProperties);

                session = OT.initSession( apiKey, sessionId ); 
                session.on({
                    'streamCreated': function( event ){
                        session.subscribe( event.stream, "callerVideo",{
                            insertMode: "append",
                            maxResolution:{ width: 1920, height: 1080 },
                            width: '100%',
                            height: '100%'
                        });
                    }
                });
                session.connect(token, function(error) {
                    if (error) 
                    {
                        console.log(error.message);
                    } 
                    else 
                    {
                        session.publish( publisher );
                        socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'answer'})
                    }
                });
            }

        }

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type === 'answer')
            {
                audio.pause();
                $scope.isAccept = true;
            }
            if(message.type === 'ignore')
            {
                audio.pause();
                toastr.error("Call Have Been Rejected!");
                disconnect();

                if(typeof from !== 'undefined')
                    $state.go(from.fromState.name,params,{location: "replace", reload: true});
            }
            if(message.type === 'cancel')
            {
                audio.pause();
                toastr.error("Call Have Been Cancelled!");
                disconnect();
                
                if(typeof from !== 'undefined')
                    $state.go(from.fromState.name,params,{location: "replace", reload: true});

            }

        })

        socket.on("receiveArchive",function(info){
            console.log(info);
        })

        $scope.cancelCall = function(){
            audio.pause();
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            disconnect();
            
            if(typeof from !== 'undefined')
                $state.go(from.fromState.name,params,{location: "replace", reload: true});

        }

        $scope.shareScreen = function(){
            OT.checkScreenSharingCapability(function(response) {
              if(response.supported) {
                console.log("supported");

                // var publisherProperties = {};
                // publisherProperties.maxResolution = { width: 1920, height: 1080 };
                // publisherProperties.videoSource = 'screen';
                // publisherProperties.fitMode = 'contain';

                // OT.initPublisher('screen-preview',
                //   publisherProperties,
                //   function(error) {
                //     if (error) {
                //       // Look at error.message to see what went wrong.
                //     } else {
                //       session.publish(publisher, function(error) {
                //         if (error) {
                //          // Look error.message to see what went wrong.
                //         }
                //       });
                //     }
                //   }
                // );

              }else {
                console.log("not supported");
              }
            });
        }

        $scope.recordVideo = function(){
            console.log("record");
            socket.emit("sendArchive",{type:"start", sessionId: sessionId, userId: $scope.userInfo.id});
        }

        $scope.muteAudio = function(){
            $scope.isAudioMuted = !$scope.isAudioMuted;
            if($scope.isAudioMuted)
                publisher.publishAudio(false);
            else
                publisher.publishAudio(true);
        }

        $scope.muteVideo = function(){
            $scope.isVideoMuted = !$scope.isVideoMuted;
            if($scope.isVideoMuted)
                publisher.publishVideo(false);
            else
                publisher.publishVideo(true);
        }

        var disconnect = function() {
            if (publisher) {
                session.unpublish(publisher);
                session.disconnect();
            }
            publisher = null;
            session = null;

            socket.removeAllListeners();
        }

    })
