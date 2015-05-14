/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])
    .controller("callController", function($timeout,$scope,$document,$modalStack,$interval,$location,$rootScope, OTSession, $state,$modal, $cookieStore,toastr,$window,socket,UserService, $stateParams){
        var audio = new Audio('theme/assets/phone_calling.mp3');
        var toSt= $cookieStore.get('toState');

        var params = {};

        var apiKey = $stateParams.apiKey;
        var sessionId = $stateParams.sessionId;
        var token = $stateParams.token;

        $scope.session = null;

        $scope.streams = OTSession.streams;
        $scope.connections = OTSession.connections;

        $scope.userInfo = null;
        $scope.callUserInfo = null;

        $scope.patientId = ($stateParams.patientId != null || $stateParams.patientId != undefined) ?  $stateParams.patientId : null;
        $scope.isCaller = ($stateParams.isCaller == 1 || $stateParams.isCaller == '1') ? true : false;

        $scope.isAccept = false;

        UserService.getUserInfo($stateParams.callUser).then(function(data){
            data.img = "theme/assets/icon.png";
            $scope.callUserInfo = data;
        })

        $scope.$on('onUnload', function (e) {
            audio.pause();
            socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
            disconnect();
        });

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

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
            if($scope.isCaller)
            {
                audio.loop = true;
                audio.play();
                socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'call',sessionId: sessionId});
            }
            else{
                socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'answer'});
            }
        });
        
        $scope.publishing = true;

        function cancelListenerHandler(){
            console.log("Remove Success");
        }

        socket.removeListener('messageReceived', cancelListenerHandler());

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type === 'answer')
            {
                audio.pause();
                $scope.isAccept = true;

                console.log($scope.streams);

                if($scope.isCaller)
                    $cookieStore.put('callInfo',{isCalling: true, callUser: fromId})

                $modalStack.dismissAll();
            }
            if(message.type === 'ignore')
            {
                if($scope.streams.length == 0)
                {
                    audio.pause();
                    toastr.info(fromUser + " Has Ignored The Call!");
                    disconnect();
                }
                else
                {
                    toastr.info(fromUser + " Has Ignored The Call!");
                    $modalStack.dismissAll();
                }
            }
            if(message.type === 'cancel')
            {
                audio.pause();
                toastr.info(fromUser + " Has Left The Call!");
                disconnect();
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
                $scope.session.disconnect();

            if(typeof $cookieStore.get("callInfo") !== undefined)
                $cookieStore.remove("callInfo");

            window.close();
        }

        var signalError = function (err) {
              if (err) {
                TB.error(err);
              }
            };

        $scope.cancelCall = function(){
            audio.pause();
            
            swal({
                title: "Are you sure want to cancel the call?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                if($scope.streams.length == 0)
                {
                    socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});
                    disconnect();
                }
                else
                {
                    UserService.getUserInfo($scope.userInfo.id).then(function(data){
                        var signal = {
                            type: 'cancelCall',
                            data: data.user_name
                        };
                        OTSession.session.signal(signal, function(err){
                            if (err)
                                TB.error(err);
                            else
                                disconnect();
                        });
                    })
                    
                }
            });
        }

        if (OTSession.session) 
        {
            OTSession.session.on({
                'signal:cancel': function (event) {
                    console.log(event);
                    toastr.info(JSON.parse(event.data).username + " Has Left The Call!");
                }
            })
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
                            },
                            patientId: function(){
                                return $scope.patientId;
                            }
                        },
                        controller: function($scope,UserService,$modalInstance,toastr,socket,userInfo,sessionId,OTSession,patientId){

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
                                socket.emit("sendMessage",userInfo.id,u.id,{type:'call',sessionId: sessionId, patientId: patientId});
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