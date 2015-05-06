/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($timeout,$scope,callModal,$document,$modalStack,$interval,$location,$rootScope, OTSession, $state,$modal, $cookieStore,toastr,$window,socket,UserService, callUserInfo, callUser, isCaller, opentokInfo){
        var audio = new Audio('theme/assets/phone_calling.mp3');
        var toSt= $cookieStore.get('toState');

        var params = {};

        var apiKey = null;
        var sessionId = null;
        var token = null;

        $scope.session = null;

        $scope.streams = OTSession.streams;
        $scope.connections = OTSession.connections;

        $scope.userInfo = null;
        $scope.callUserInfo = callUserInfo;
        $scope.isCaller = isCaller;
        $scope.isAccept = false;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        $scope.isMinimize = false;

        $scope.sharingMyScreen = false;
        $scope.publishing = false;
        $scope.screenBig = true;
        $scope.screenShareSupported = false;
        $scope.connected = false;
        $scope.screenShareFailed = null;
        $scope.mouseMove = false;
        $scope.selectingScreenSource = false;
        $scope.promptToInstall = false;
        $scope.showWhiteboard = false;
        $scope.whiteboardUnread = false;

        OT.registerScreenSharingExtension('chrome', 'pkakgggplhfilfbailbaibljfpalofjn');
        OT.checkScreenSharingCapability(function(response) {
            $scope.screenShareSupported = response.supported && response.extensionRegistered !== false;
            $scope.$apply();
        });

        $scope.screenPublisherProps = {
            name: "screen",
            style:{nameDisplayMode:"off"},
            publishAudio: false,
            maxResolution: {width:1920, height:1080},
            videoSource: 'screen'
        };

        $scope.facePublisherProps = {
            name: 'face',
            width: '100%',
            height: '100%',
            style: {
              nameDisplayMode: 'off'
            },
            resolution: '1280x720',
            frameRate: 30
        };

        $scope.notMine = function(stream) {
            return stream.connection.connectionId !== $scope.session.connection.connectionId;
        };

        if($cookieStore.get('userInfo') == null || typeof $cookieStore.get('userInfo') == 'undefined')
            disconnect();
        else
            $scope.userInfo = $cookieStore.get('userInfo');

        $scope.isDrag = false;
        $scope.maximizeWindow = function(){
            $scope.isMinimize = !$scope.isMinimize;
            $scope.isDrag = !$scope.isDrag;
            if($scope.isMinimize)
                $scope.showWhiteboard = false;
        };

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
                    var whiteboardUpdated = function() {
                        if (!$scope.showWhiteboard && !$scope.whiteboardUnread) {
                          $scope.$apply(function() {
                            $scope.whiteboardUnread = true;
                            $scope.mouseMove = true; 
                          });
                        }
                    };
                    $scope.$on('otWhiteboardUpdate', whiteboardUpdated);
                    socket.emit("sendMessage",$scope.userInfo.id,callUser,{type:'call',sessionId: sessionId});
                });
                
                $scope.publishing = true;
                               
            })
        }
        else
        {
            if(opentokInfo != null)
            {
                var info = opentokInfo;

                apiKey = info.apiKey;
                sessionId = info.sessionId;
                token = info.token;

                if ($scope.session) {
                    $scope.session.disconnect();
                }

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
                    
                    var whiteboardUpdated = function() {
                        if (!$scope.showWhiteboard && !$scope.whiteboardUnread) {
                          $scope.$apply(function() {
                            $scope.whiteboardUnread = true;
                            $scope.mouseMove = true; 
                          });
                        }
                    };
                    $scope.$on('otWhiteboardUpdate', whiteboardUpdated);
                    
                    socket.emit("sendMessage",$scope.userInfo.id,callUser,{type:'answer'});
                });
                $scope.publishing = true;
                
            }
        }

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type === 'answer')
            {
                audio.pause();
                $scope.isAccept = true;

                if($scope.isCaller)
                    $cookieStore.put('callInfo',{isCalling: true, callUser: fromId})

                $modalStack.dismissAll();
            }
            if(message.type === 'ignore')
            {
                audio.pause();
                toastr.info(fromUser + " Has Ignored The Call!");
                $modalStack.dismissAll();

                $timeout(function(){
                    if($scope.streams.length == 0)
                        disconnect();
                }, 1 * 1000);
            }
            if(message.type === 'cancel')
            {
                audio.pause();
                toastr.info(fromUser + " Has Left The Call!");
                $modalStack.dismissAll();

                // $scope.$watch('connections',function(val){
                //     console.log(val);
                //     if(val.length == 1)
                //         disconnect();
                // })

                // $scope.$apply(function(){
                //     if($scope.connections.length == 1)
                //         disconnect();
                // })

                $timeout(function(){
                    if($scope.streams.length == 0)
                        disconnect();
                }, 1 * 1000);

            }

        })

        $scope.muteAudio = function(){
            $scope.isAudioMuted = !$scope.isAudioMuted;
        }

        $scope.muteVideo = function(){
            $scope.isVideoMuted = !$scope.isVideoMuted;
        }

        var disconnect = function() {
            if($scope.session != null)
            {
                $scope.session.disconnect();
                $scope.session.on('sessionDisconnected', function () {
                    callModal.deactivate();
                });
            }
            else
                callModal.deactivate();

            if(typeof $cookieStore.get("callInfo") !== undefined)
                $cookieStore.remove("callInfo");

            socket.removeAllListeners();
            $state.go(toSt.toState.name,toSt.toParams,{reload: true});

        }

        $scope.cancelCall = function(){
            audio.pause();
            socket.emit("sendMessage",$scope.userInfo.id,callUser,{type:'cancel'});
            disconnect();
        }

        $scope.installScreenshareExtension = function () {
              chrome.webstore.install('https://chrome.google.com/webstore/detail/pkakgggplhfilfbailbaibljfpalofjn', function () {
                console.log('successfully installed');
              }, function () {
                console.error('failed to install', arguments);
              });
        };

        $scope.toggleWhiteboard = function() {
            $scope.showWhiteboard = !$scope.showWhiteboard;
            if($scope.showWhiteboard)
                $scope.isDrag = false;

            $scope.whiteboardUnread = false;
            setTimeout(function() {
              $scope.$emit('otLayout');
            }, 10);
        };
        
        $scope.toggleShareScreen = function() {
            if($scope.connected)
            {
                if (!$scope.sharingMyScreen && !$scope.selectingScreenSource) {
                  $scope.selectingScreenSource = true;
                  $scope.screenShareFailed = null;

                  OT.checkScreenSharingCapability(function(response) {
                    if (!response.supported || response.extensionRegistered === false) {
                      $scope.screenShareSupported = false;
                      $scope.selectingScreenSource = false;
                    } else if (response.extensionInstalled === false) {
                      $scope.promptToInstall = true;
                      $scope.selectingScreenSource = false;
                    } else {
                      $scope.sharingMyScreen = true;
                      $scope.selectingScreenSource = false;
                    }
                    $scope.$apply();
                  });
                } else if ($scope.sharingMyScreen) {
                  $scope.sharingMyScreen = false;
                }
            }
        };

        $scope.isCallGroup = false;

        $scope.addPeople = function(){
            if($scope.isCaller && !$scope.isAccept)
                toastr.warning("Please Wait For Calling Person First!")
            else
            {
                if($scope.streams.length < 2)
                {
                    var modalInstance = $modal.open({
                        templateUrl: 'common/views/dialog/invitePeople.html',
                        size: 'sm',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            userInfo: function(){
                                return $scope.userInfo;
                            },
                            sessionId: function(){
                                return sessionId;
                            },
                            OTSession: function(){
                                return OTSession;
                            }
                        },
                        controller: function($scope,UserService,$modalInstance,toastr,socket,userInfo,sessionId,OTSession){

                            $scope.isMakeCall = false;
                            $scope.callUser = null;
                            $scope.userInfo = userInfo;
                            UserService.getOnlineUsers().then(function(rs){
                                $scope.onlineUsers = rs.data;
                            })

                            $scope.cancelCall = function(){
                                socket.emit("sendMessage",userInfo.id,$scope.callUser.id,{type:'cancel'});
                                $modalInstance.close({type:'cancel'});
                            }

                            $scope.callUser = function(u){
                                $scope.isMakeCall = true;
                                $scope.callUser = u;
                                socket.emit("sendMessage",userInfo.id,u.id,{type:'call',sessionId: sessionId});
                            }

                            $scope.cancelClick = function(){
                                $modalInstance.close({type:'cancel'});
                            }
                        }
                    })

                }
                else
                    toastr.warning('Can Only Make A Group Call With 3 People!');
            }

        }

        
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

        $scope.$on('otStreamDestroyed', function(event) {
            if (event.targetScope.publisher.id === 'screenPublisher') {
              $scope.$apply(function() {
                $scope.sharingMyScreen = false;
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
          disconnect();
        });
    })