/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($scope,callModal,$document,$interval,$location,$rootScope, OTSession, $state,$modal, $cookieStore,toastr,$window,socket,UserService, callUserInfo, callUser, isCaller, opentokInfo){
        var audio = new Audio('theme/assets/phone_calling.mp3');
        var toSt= $cookieStore.get('toState');

        var params = {};

        var apiKey = null;
        var sessionId = null;
        var token = null;

        $scope.session = null;

        $scope.userInfo = null;
        $scope.callUserInfo = callUserInfo;
        $scope.isCaller = isCaller;
        $scope.isAccept = false;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        $scope.isMinimize = false;

        $scope.streams = OTSession.streams;
        $scope.sharingMyScreen = false;
        $scope.publishing = false;
        $scope.screenBig = true;
        $scope.screenShareSupported = false;
        $scope.isAndroid = /Android/g.test(navigator.userAgent);
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

        if($cookieStore.get('userInfo') == null || typeof $cookieStore.get('userInfo') == 'undefined')
            disconnect();
        else
            $scope.userInfo = $cookieStore.get('userInfo');

        $scope.isDrag = true;
        $scope.maximizeWindow = function(){
            $scope.isMinimize = !$scope.isMinimize;

            if($scope.isMinimize)
            {
                $scope.showWhiteboard = false;
            }
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
            }
            if(message.type === 'ignore')
            {
                if($scope.streams.length == 1)
                    toastr.error("Call Have Been Rejected!");
                else
                {
                    audio.pause();
                    toastr.error("Call Have Been Rejected!");
                    disconnect();
                }
            }
            if(message.type === 'cancel')
            {

                if($scope.streams.length == 1)
                    toastr.error("Someone Has Left The Call!");
                else
                {
                    audio.pause();
                    toastr.error("Call Have Been Cancelled!");
                    disconnect();
                }
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
            $state.transitionTo(toSt.toState.name,toSt.toParams,{reload: true});
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
            if($scope.connected)
            {
                $scope.showWhiteboard = !$scope.showWhiteboard;
                $scope.whiteboardUnread = false;
                setTimeout(function() {
                  $scope.$emit('otLayout');
                }, 10);
            }
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
            if($scope.streams.length < 2)
            {
                var modalInstance = $modal.open({
                    templateUrl: 'common/views/dialog/invitePeople.html',
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false,
                    controller: function($scope,UserService,$modalInstance,toastr,socket){
                        UserService.getOnlineUsers().then(function(rs){
                            $scope.onlineUsers = rs.data;
                        })

                        $scope.callUser = function(u){
                            $modalInstance.close({type:'call',data:u});
                        }

                        $scope.cancelClick = function(){
                            $modalInstance.close({type:'cancel'});
                        }
                    }
                })

                modalInstance.result.then(function(rs){
                    if(rs.type == 'call')
                    {
                        socket.emit("sendMessage",$scope.userInfo.id,rs.data.id,{type:'call',sessionId: sessionId});
                        OTSession.session.signal({
                            type: 'callGroup',
                            data: {groupCall: true, name:rs.data.fullName}
                        });

                    }
                })
            }
            else
                toastr.warning('Can Only Make A Group Call With 3 People!');
            
        }

        if (OTSession.session) {
            OTSession.session.on({
                'signal:callGroup': function (event) {
                    if (event.from.connectionId !== OTSession.session.connection.connectionId) {
                        if(groupCall)
                            $scope.isCallGroup = true;
                    }
                }
            });
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
        });
    })