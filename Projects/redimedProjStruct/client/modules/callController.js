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

        var fromMobile = $location.search().fromMobile;

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

                var apiKey = opentokRoom.apiKey;
                var sessionId = opentokRoom.sessionId;
                var token = opentokRoom.token;

                var publisherProperties = 
                {
                    resolution: '1280x720',
                    insertMode: "append"
                };

                publisher = OT.initPublisher('selfVideo',publisherProperties);

                session = OT.initSession( apiKey, sessionId ); 
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

                var publisherProperties = 
                {
                    resolution: '1280x720',
                    insertMode: "append"
                };

                publisher = OT.initPublisher('selfVideo',publisherProperties);

                session = OT.initSession( info.apiKey, info.sessionId ); 
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
                session.connect(info.token, function(error) {
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

        $scope.cancelCall = function(){
            audio.pause();
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            disconnect();
            
            if(typeof from !== 'undefined')
                $state.go(from.fromState.name,params,{location: "replace", reload: true});

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
            }
            publisher = null;

            socket.removeAllListeners();
        }

    })
