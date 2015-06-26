/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.loggedIn.calling")
    .controller("callController", function($timeout,$scope,$document,$modalStack,$interval,$location,$rootScope, OTSession, $state,$modal, $cookieStore,toastr,$window,socket,UserService, $stateParams){
        var audio = new Audio('theme/assets/phone_calling.mp3');
        var toSt= $cookieStore.get('toState');

        var params = {};

        var apiKey = $stateParams.apiKey;
        var sessionId = $stateParams.sessionId;
        var token = $stateParams.token;
        $scope.newwin = null;

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
        $scope.showBluetooth = false;
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
            var deviceUpdated = function() {
                if (!$scope.showBluetooth) {
                  $scope.$apply(function() {
                    $scope.mouseMove = true; 
                  });
                }
            };
            $scope.$on('otWhiteboardUpdate', whiteboardUpdated);
            $scope.$on('medicalDeviceUpdate', deviceUpdated);
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

                $modalStack.dismissAll();
            }
            if(message.type === 'ignore')
            {
                toastr.info(fromUser + " Has Ignored The Call!");
                if($scope.streams.length == 0)
                {
                    audio.pause();
                    disconnect();
                }
                else
                    $modalStack.dismissAll();
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

        function disconnect() {
            if($scope.streams.length == 0)
            {
                socket.emit("sendMessage",$scope.userInfo.id,$stateParams.callUser,{type:'cancel'});

                window.close();
                
                if (($scope.newwin != null) || (!$scope.newwin.closed))
                    $scope.newwin.close();
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
                        {
                            window.close();

                            if (($scope.newwin != null) || (!$scope.newwin.closed))
                                $scope.newwin.close();
                        }
                    });
                })
            }
        }

        var signalError = function (err) {
              if (err) {
                TB.error(err);
              }
            };

        $scope.cancelCall = function(){
            swal({
                title: "Are you sure want to cancel the call?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                audio.pause();
                disconnect();
            });
        }

        if (OTSession.session) 
        {
            OTSession.session.on({
                'signal:cancelCall': function (event) {
                    toastr.info(event.data + " Has Left The Call!");
                    
                    $timeout(function(){
                        if($scope.streams.length == 0)
                        {
                            window.close();
                            if (($scope.newwin != null) || (!$scope.newwin.closed))
                                $scope.newwin.close();
                        }
                    }, 1.5 * 1000);
                    
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

        
        function popup(url) 
        {
             params  = 'width='+screen.width;
             params += ', height='+screen.height;
             params += ', left='+ 0;
             params += ', top='+0;
             params += ', fullscreen=yes';

            if (($scope.newwin == null) || ($scope.newwin.closed))
            {
                $scope.newwin=window.open(url,'RedimedWhiteboard', params);
                $scope.newwin.focus();
            }

            if($scope.newwin != null && !$scope.newwin.closed)
                window.open('','RedimedWhiteboard','');
            return false;
        }

        $scope.toggleWhiteboard = function() {
            // $scope.showWhiteboard = !$scope.showWhiteboard;
            // if($scope.showWhiteboard)
            //     $scope.isDrag = false;

            // $scope.whiteboardUnread = false;
            // setTimeout(function() {
            //   $scope.$emit('otLayout');
            // }, 10);

            popup($state.href('whiteboard',{apiKey:apiKey,sessionId:sessionId,token: token,patientId:$scope.patientId}));
        };

        $scope.toggleBluetooth = function(){
            $scope.showBluetooth = !$scope.showBluetooth;

            setTimeout(function() {
              $scope.$emit('otLayout');
            }, 10);
        }
        
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

        $scope.addPeople = function(){
            if($scope.isCaller && !$scope.isAccept)
                toastr.warning("Please Wait For Calling Person First!")
            else
            {
                if($scope.streams.length < 2)
                {
                    var modalInstance = $modal.open({
                        templateUrl: 'modules/makeCall/views/dialogs/invitePeople.html',
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

    .controller("whiteboardController",function($scope,OTSession,$stateParams,$window){
        var apiKey = $stateParams.apiKey;
        var sessionId = $stateParams.sessionId;
        var token = $stateParams.token;
        $scope.patientId = $stateParams.patientId;
        $scope.mouseMove = false;
        $scope.connected = false;
        $scope.session = null;

        if ($scope.session) {
            $scope.session.disconnect();
        }

        OTSession.init(apiKey, sessionId, token, function (err, session) {
            $scope.session = session;
            var connectDisconnect = function (connected) {
              $scope.$apply(function () {
                  $scope.connected = connected;
              });
            };
            if ((session.is && session.is('connected')) || session.connected) connectDisconnect(true);
            $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true));
            $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false));
            var whiteboardUpdated = function() {
              $scope.$apply(function() {
                $scope.mouseMove = true; 
              });
            };
            $scope.$on('otWhiteboardUpdate', whiteboardUpdated);
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
    })

    .directive('medicalDevice', function(OTSession,$window,Restangular,socket){
        return {
            restrict: 'E',
            scope: {
                callSession: '='
            },
            templateUrl: 'modules/makeCall/views/medicalDevice.html',
            link: function(scope, element, attrs){
                scope.onlineDevice = null;
                scope.onlineData = null;
                scope.session = null;

                if(scope.callSession)
                    scope.session = scope.callSession;
                else
                    scope.session = OTSession.session;

                var signalError = function (err) {
                  if (err) {
                    TB.error(err);
                  }
                  else
                    console.log("success");
                };

                socket.on('getMeasureData',function(rs){
                    if(rs.info){
                        var data = angular.copy(rs.info);
                        delete data['deviceType'];
                        delete data['rawData'];

                        scope.$apply(function(){
                            scope.onlineDevice = rs.info.deviceType;
                            scope.onlineData = data;
                        })

                        var signal = {
                            type: 'bluetooth_data',
                            data: rs.info
                        };
                        scope.session.signal(signal, signalError);
                    }
                })

                if (scope.session) {
                    scope.session.on({
                        'signal:bluetooth_data': function (event) {
                            if (event.from.connectionId !== scope.session.connection.connectionId) {
                                var info = event.data;
                                if(info)
                                {
                                    var rs = angular.copy(info);
                                    delete rs['deviceType'];
                                    delete rs['rawData'];

                                    scope.$apply(function(){
                                        scope.onlineDevice = info.deviceType;
                                        scope.onlineData = rs;
                                    })

                                }
                                scope.$emit('medicalDeviceUpdate');
                            }
                        }
                    });
                }
            }
        };
    });