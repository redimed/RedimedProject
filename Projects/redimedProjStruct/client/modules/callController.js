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
        $scope.isShareScreen = false;

        var publisher = null;
        var session = null;

        var audio = new Audio('theme/assets/phone_calling.mp3');

        var from = $cookieStore.get('fromState');
        var params = {};

        var apiKey = null;
        var sessionId = null;
        var token = null;

        OT.registerScreenSharingExtension("chrome","hmnclpodollafcbbkkpfjoiekajobbbg");


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
            $scope.isShareScreen = !$scope.isShareScreen;
            if($scope.isShareScreen)
            {
                OT.checkScreenSharingCapability(function(response) {
                  //response.extensionInstalled = true;
                  response.extensionRequired = true
                  console.log("extension required: " + response.extensionRequired)
                  console.log("extension installed: " + response.extensionInstalled);
                  console.log("extension supported: " + response.supported)

                  if(!response.supported || response.extensionRegistered === false) {
                        alert.log("This Browser does not support screen sharing")
                  } 
                  else if(response.extensionInstalled == false) 
                  {
                    // prompt to install the extension
                    // Please help I'm stuck here. My page is loaded via HTTPS & OT.js is loaded via HTTPS as well
                        console.log("Prompt to install screen share extension")
                  } 
                  else 
                  {
                        publisher = null;
                        var publisherProperties = {};
                        publisherProperties.maxResolution = { width: 1920, height: 1080 };
                        publisherProperties.videoSource = 'screen';
                        publisher = OT.initPublisher('selfVideo',
                                      publisherProperties,
                                      function(error) {
                                        if (error) {
                                          console.log(error.message);
                                        } else {
                                          session.publish(publisher, function(error) {
                                            if (error) {
                                             console.log(error.message);
                                            }
                                          });
                                        }
                                      }
                                    );
                  }
                })   
            }
            else
            {
                publisher = null;

                var publisherProperties = {};
                    publisherProperties.maxResolution = { width: 1920, height: 1080 };
                    publisherProperties.insertMode = 'append';
                    publisher = OT.initPublisher('selfVideo',
                                  publisherProperties,
                                  function(error) {
                                    if (error) {
                                      console.log(error.message);
                                    } else {
                                      session.publish(publisher, function(error) {
                                        if (error) {
                                         console.log(error.message);
                                        }
                                      });
                                    }
                                  }
                                );
            }
             
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
                publisher.destroy();
                session.unpublish(publisher);
                session.disconnect();
            }
            publisher = null;
            session = null;

            socket.removeAllListeners();
        }

    })
