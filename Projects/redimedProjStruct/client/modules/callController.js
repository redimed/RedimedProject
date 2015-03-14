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
        $scope.isShareScreen = true;

        $scope.sharingMyScreen = false;
        $scope.selectingScreenSource = false;
        $scope.screenShareFailed = null;
        $scope.promptToInstall = false;
        $scope.screenShareSupported = !!navigator.webkitGetUserMedia;

        $scope.screenPublisherProps = {
            name: "screen",
            style:{nameDisplayMode:"off"},
            publishAudio: false,
            constraints: {
                video: {
                    mandatory: {
                        maxWidth: 1920,
                        maxHeight: 1080
                    },
                    optional: []
                },
                audio: false
            },
            mirror: false,
            width: screen.width,
            height: screen.height,
            aspectRatio: screen.width / screen.height
        };

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

        $scope.installScreenshareExtension = function () {
              chrome.webstore.install('https://chrome.google.com/webstore/detail/gbmgefccigbfiilkihnomgkmpedbojco', function () {
                console.log('successfully installed');
              }, function () {
                console.error('failed to install', arguments);
              });
        };

        $scope.shareScreen = function(){
            if(navigator.userAgent.toLowerCase().indexOf("chrome") != -1)
            {
                
                if($scope.isShareScreen)
                {
                    OT.registerScreenSharingExtension("chrome","gbmgefccigbfiilkihnomgkmpedbojco");

                    OT.checkScreenSharingCapability(function(response) {
                        console.log(response);
                      //response.extensionInstalled = true;
                      response.extensionRequired = true

                      if(!response.supported) {
                            alert("This Browser does not support screen sharing")
                      } 
                      else if(response.supported && !response.extensionInstalled) 
                      {
                            var modalInstance = $modal.open({
                                templateUrl: './common/views/dialog/confirmExtension.html',
                                size: 'md',
                                controller: function($scope, $modalInstance){
                                    
                                    $scope.cancelClick = function(){
                                        $modalInstance.close();
                                    };

                                }
                                
                            })
                      } 
                      else 
                      {
                            
                            if(publisher)
                                session.unpublish(publisher);
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
                                              $scope.isShareScreen = !$scope.isShareScreen;
                                            }
                                          }
                                        );
                      }
                    })   
                }
                else
                {

                    var publisherProperties = {};
                        publisherProperties.maxResolution = { width: 1920, height: 1080 };
                        // publisherProperties.videoSource = 'camera';
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
                                          $scope.isShareScreen = !$scope.isShareScreen;
                                        }
                                      }
                                    );
                        
                    
                }
            }
            else
            {
                alert("This browser does not support screen sharing");
            }  
        }

        $scope.toggleShareScreen = function() {
            if (!$scope.sharingMyScreen && !$scope.selectingScreenSource) {
              $scope.selectingScreenSource = true;
              $scope.screenShareFailed = null;
              
              var screenSharing = OTChromeScreenSharingExtensionHelper('gbmgefccigbfiilkihnomgkmpedbojco');
              screenSharing.isAvailable(function (extensionIsAvailable) {
                if (extensionIsAvailable) {
                  screenSharing.getVideoSource(function(error, source) {
                    $scope.$apply(function () {
                      if (error) {
                        // either the extension is not available or the user clicked cancel
                        $scope.screenShareFailed = error.message;
                      } else {
                        $scope.screenPublisherProps.videoSource = source;
                        $scope.screenPublisherProps.constraints.video.mandatory.chromeMediaSource = 'desktop';
                        $scope.screenPublisherProps.constraints.video.mandatory.chromeMediaSourceId = source.deviceId;
                        
                        $scope.sharingMyScreen = true;
                      }
                      $scope.selectingScreenSource = false;
                    });
                  });
                } else {
                  $scope.$apply(function () {
                    $scope.promptToInstall = true;
                    $scope.selectingScreenSource = false;
                  });
                }
              });
            } else if ($scope.sharingMyScreen) {
              $scope.sharingMyScreen = false;
            }
        };

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
                // session.disconnect();
            }
            publisher = null;
            session = null;

            socket.removeAllListeners();
        }

    })
