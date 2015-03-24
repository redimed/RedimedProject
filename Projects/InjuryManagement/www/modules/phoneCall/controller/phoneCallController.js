angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,
                                                 $rootScope, $timeout, $ionicModal,
                                                 $stateParams, signaling, UserService) {


        var from = localStorageService.get('fromState');
        $scope.userInfo = localStorageService.get('userInfo');
        $scope.apiKey = $stateParams.apiKey;
        $scope.sessionID = $stateParams.sessionID;
        $scope.tokenID = $stateParams.tokenID;
        $scope.isCaller = ($stateParams.isCaller == 'true') ? true : false;
        $scope.isAccept = false;
        var params = {};
        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }
        $scope.contactNameJson = [];
        $scope.mic = false;
        $scope.camera = false;

        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];
        var src = "/android_asset/www/phone_calling.mp3";
        var media = null;
        var loop = function (status) {
            if (status === Media.MEDIA_STOPPED) {
                media.play();
            }
            else if (status === Media.MEDIA_PAUSED) {
                media.pause();
            }
        };

        UserService.getUserInfo($stateParams.callUser).then( function(data) {
            $scope.contactNameJson.contactName = data.user_name;
            $scope.contactNameJson.background = colors[Math.floor(Math.random() * colors.length)];
            $scope.contactNameJson.letter = String(data.user_name).substr(0,1).toUpperCase();
            if(data.img == null) {
                $scope.avatarCaller = 'img/avatar.png'
            } else {
                $scope.avatarCaller = data.img
            }
        })

        if ($scope.isCaller) {
            media = new Media(src, null, null, loop);
            media.play();

            var publisherProperties =
            {
                insertMode: "append",
                resolution: '1280x720',
                width: window.outerWidth / 10,
                height: window.outerHeight / 10
            };
            var publisher = TB.initPublisher('selfVideo', publisherProperties);

            var session = TB.initSession($scope.apiKey, $scope.sessionID);
            session.on({
                'streamCreated': function (event) {
                    session.subscribe(event.stream, "callerVideo", {
                        insertMode: "append",
                        resolution: "1280x720",
                        width: '100%',
                        height: '100%'
                    });
                }
            });
            session.connect($scope.tokenID, function (error) {
                console.log('connect error ', error);
                if (error) {
                    console.log(error.message);
                }
                else {
                    session.publish(publisher);
                    signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {
                        type: 'call',
                        sessionId: $scope.sessionID
                    });
                }
            });
        }
        else {
            if ($scope.apiKey != null || $scope.tokenID != null || $scope.sessionID != null) {

                var publisherProperties =
                {
                    insertMode: "append",
                    resolution: '1280x720',
                    width: window.outerWidth/10,
                    height: window.outerHeight/10
                };

                publisher = TB.initPublisher('selfVideo', publisherProperties);

                session = TB.initSession($scope.apiKey, $scope.sessionID);
                session.on({
                    'streamCreated': function (event) {
                        session.subscribe(event.stream, "callerVideo", {
                            insertMode: "append",
                            resolution: "1280x720",
                            width: '100%',
                            height: '100%'
                        });
                    }
                });
                session.connect($scope.tokenID, function (error) {
                    if (error) {
                        console.log(error.message);
                    }
                    else {
                        session.publish(publisher);
                        signaling.emit("sendMessage", $scope.userInfo.id, $stateParams.callUser, {type: 'answer'});
                    }
                });
            }
        }




        $scope.micToogle = function() {
            $scope.mic = !$scope.mic;

            if($scope.mic){
                publisher.publishAudio(false);
            }
            else {
                publisher.publishAudio(true);
            }
        }

        $scope.videoToogle = function() {
            $scope.camera = !$scope.camera;

            if($scope.camera){
                publisher.publishVideo(false);
            }
            else {
                publisher.publishVideo(true);
            }
        }

        $scope.cancelCall = function (offMedia) {
            publisher.destroy();
            signaling.emit('sendMessage', localStorageService.get('userInfo').id, $stateParams.callUser, {type: 'cancel'});
            $state.go(from.fromState.name, params, {location: "replace"}, {reload: true});
            if (offMedia) {
                media.pause();
            }
        }


        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function onMessageReceive (fromId, fromUsername, message) {
            switch (message.type) {
                case 'answer':
                    media.pause();
                    $scope.isAccept = true;
                    break;
                case 'ignore':
                    publisher.destroy();
                    media.pause();
                    session.unpublish(publisher);
                    publisher = null;
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
                case 'cancel':
                    publisher.destroy();
                    $state.go(from.fromState.name,params,{location: "replace"}, {reload: true});
                    break;
            }
        }

        signaling.on('messageReceived', onMessageReceive);

        $scope.$on("$stateChangeSuccess", function() {
            document.addEventListener('backbutton', function(){
                if($state.is("app.phoneCall")) {
                    $scope.cancelCall();
                }
            });
            if($state.is("app.phoneCall")) {
                
            }
        });
    })
