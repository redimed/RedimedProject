/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($scope,$document,$location,$rootScope, OTSession, $state,$modal, $cookieStore,toastr,$window,socket,$location,$stateParams,UserService){
        socket.removeAllListeners();

        var audio = new Audio('theme/assets/phone_calling.mp3');
        var from = $cookieStore.get('fromState');
        var params = {};

        var apiKey = null;
        var sessionId = null;
        var token = null;

        var publisher = null;
        $scope.session = null;

        $scope.userInfo = null;
        $scope.callUserInfo = $stateParams.callUserInfo;
        $scope.isCaller = $stateParams.isCaller;
        $scope.isAccept = false;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        $scope.streams = OTSession.streams;
        $scope.sharingMyScreen = false;
        $scope.publishing = false;
        $scope.screenBig = true;
        $scope.screenShareSupported = !!navigator.webkitGetUserMedia;
        $scope.isAndroid = /Android/g.test(navigator.userAgent);
        $scope.connected = false;
        $scope.screenShareFailed = null;
        $scope.mouseMove = false;
        $scope.leaving = false;
        $scope.selectingScreenSource = false;
        $scope.promptToInstall = false;

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

        $scope.facePublisherProps = {
            name:'face',
            width: '100%',
            height: '100%',
            style: {
                nameDisplayMode: 'off'
            },
            resolution: '1280x720',
            frameRate: 30
        }


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
                if ($scope.session) {
                    $scope.session.disconnect();
                }

                apiKey = opentokRoom.apiKey;
                sessionId = opentokRoom.sessionId;
                token = opentokRoom.token;

                OTSession.init(apiKey, sessionId, token, function (err, session) {
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
                });

                $scope.publishing = true;
                socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'call',sessionId: sessionId});               
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

                OTSession.init(apiKey, sessionId, token, function (err, session) {
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
                });

                $scope.publishing = true;
                socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'answer'});
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
            $scope.session.disconnect();
            $scope.session.on('sessionDisconnected', function () {
                socket.removeAllListeners();
            });

            // if (publisher) {
            //     publisher.destroy();
            //     session.unpublish(publisher);
            //     // session.disconnect();
            // }
            // publisher = null;
            // session = null;
        }

        $scope.cancelCall = function(){
            audio.pause();
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            disconnect();
            
            if(typeof from !== 'undefined')
                $state.go(from.fromState.name,params,{location: "replace", reload: true});

        }

        $scope.installScreenshareExtension = function () {
              chrome.webstore.install('https://chrome.google.com/webstore/detail/pkakgggplhfilfbailbaibljfpalofjn', function () {
                console.log('successfully installed');
              }, function () {
                console.error('failed to install', arguments);
              });
        };

        
        $scope.toggleShareScreen = function() {
            console.log("a");
            if (!$scope.sharingMyScreen && !$scope.selectingScreenSource) {
                console.log("b");
              $scope.selectingScreenSource = true;
              $scope.screenShareFailed = null;
              
              var screenSharing = OTChromeScreenSharingExtensionHelper('pkakgggplhfilfbailbaibljfpalofjn');
              screenSharing.isAvailable(function (extensionIsAvailable) {
                if (extensionIsAvailable) {
                    console.log("c");
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
                    console.log("d");
                  $scope.$apply(function () {
                    $scope.promptToInstall = true;
                    $scope.selectingScreenSource = false;
                  });
                }
              });
            } else if ($scope.sharingMyScreen) {
                console.log("e");
              $scope.sharingMyScreen = false;
            }
        };

        
         $scope.$on("changeSize", function (event) {
            if (event.targetScope.stream.oth_large === undefined) {
                event.targetScope.stream.oth_large = event.targetScope.stream.name !== "screen";
            } else {
                event.targetScope.stream.oth_large = !event.targetScope.stream.oth_large;
            }
            setTimeout(function () {
                event.targetScope.$emit("otLayout");
            }, 10);
        });
        
        $scope.$on("changeScreenSize", function (event) {
            $scope.screenBig = !$scope.screenBig;
            setTimeout(function () {
                event.targetScope.$emit("otLayout");
            }, 10);
        });
        
        $scope.$on("otPublisherError", function (event, error, publisher) {
            if (publisher.id === 'screenPublisher') {
                $scope.$apply(function () {
                    $scope.screenShareFailed = error.message;
                    $scope.toggleShareScreen();
                });
            }
        });

        var mouseMoveTimeout;
        var mouseMoved = function (event) {
            if (!$scope.mouseMove) {
                $scope.$apply(function () {
                    $scope.mouseMove = true;
                });
            }
            if (mouseMoveTimeout) {
                clearTimeout(mouseMoveTimeout);
            }
            mouseMoveTimeout = setTimeout(function () {
                $scope.$apply(function () {
                    $scope.mouseMove = false;
                });
            }, 5000);
        };
        $window.addEventListener("mousemove", mouseMoved);
        $window.addEventListener("touchstart", mouseMoved);
        $document.context.body.addEventListener("orientationchange", function () {
          $scope.$emit("otLayout");
        });

        $scope.$on('$destroy', function () {
          if ($scope.session && $scope.connected) {
              $scope.session.disconnect();
              $scope.connected = false;
          }
          $scope.session = null;
        });


        

    })
