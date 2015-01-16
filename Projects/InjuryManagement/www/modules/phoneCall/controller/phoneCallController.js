angular.module('starter.phoneCall.controller',[])

    .controller('phoneCallController', function ($scope, $state, localStorageService,  $rootScope, $timeout, $ionicModal, $stateParams, signaling, $cordovaMedia) {

        var duplicateMessages = [];
        $scope.callInProgress = false;

        $scope.isCalling = $stateParams.isCalling === 'true';
        $scope.contactName = $stateParams.contactName;


        $scope.contacts = {};
        $scope.hideFromContactList = [$scope.contactName];
        $scope.muted = false;


        var src = "/android_asset/www/phone_calling.mp3";
        var media = null;
        media = new Media(src);

        function call(isInitiator, contactName) {
            console.log(new Date().toString() + ': calling to ' + contactName + ', isInitiator: ' + isInitiator);

            var config = {
                isInitiator: isInitiator,
                turn: {
                    host: 'turn:ec2-54-149-226-250.us-west-2.compute.amazonaws.com:3478',
                    username: 'root',
                    password: 'root'
                },
                streams: {
                    audio: true,
                    video: true
                },
                prefercodec:"G722"
            };

            var session = new cordova.plugins.phonertc.Session(config);

            console.log(session);
            session.on('sendMessage', function (data) {
                signaling.emit('sendMessage', contactName, {
                    type: 'phonertc_handshake',
                    data: JSON.stringify(data)
                });
            });

            session.on('answer', function () {
                console.log('Answered!');
            });

            session.on('disconnect', function () {
                if ($scope.contacts[contactName]) {
                    delete $scope.contacts[contactName];
                }
                if (Object.keys($scope.contacts).length === 0) {
                    signaling.emit('sendMessage', contactName, { type: 'ignore' });
                    if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                    {
                        $state.go('app.driver.list');
                    } else {
                        $state.go('app.injury.info');
                    }
                }
            });

            session.call();

            $scope.contacts[contactName] = session;
        }

        if ($scope.isCalling) {
            media.play();
            signaling.emit('sendMessage', $stateParams.contactName, { type: 'call' });
        }

        if(!$scope.isCalling && $scope.contactName != '') {
            if ($scope.callInProgress) { return; }
            $scope.callInProgress = true;
            $timeout($scope.updateVideoPosition, 1000);

            call(false, $stateParams.contactName);

            setTimeout(function () {
                console.log('sending answer');
                signaling.emit('sendMessage', $stateParams.contactName, { type: 'answer' });
            }, 1500);
        }

        //$scope.mute = function() {
        //    session.streams.audio = false;
        //    $scope.contacts.renegotiate();
        //}


        $scope.ignore = function () {
            media.stop();
            var contactNames = Object.keys($scope.contacts);
            if (contactNames.length > 0) {
                $scope.contacts[contactNames[0]].disconnect();
            } else {
                signaling.emit('sendMessage', $stateParams.contactName, { type: 'ignore' });
                if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                {
                    $state.go('app.driver.list', {reload: true});
                } else {
                    $state.go('app.injury.info', {reload: true});
                }
            }
        };

        $scope.end = function () {
            Object.keys($scope.contacts).forEach(function (contact) {
                $scope.contacts[contact].close();
                delete $scope.contacts[contact];
            });
        };

        $scope.updateVideoPosition = function () {
            $rootScope.$broadcast('videoView.updatePosition');
        };

        //$scope.addContact = function (newContact) {
        //    $scope.hideFromContactList.push(newContact);
        //    signaling.emit('sendMessage', newContact, { type: 'call' });
        //
        //    cordova.plugins.phonertc.showVideoView();
        //    $scope.selectContactModal.hide();
        //};
        //
        //$scope.hideCurrentUsers = function () {
        //    return function (item) {
        //        return $scope.hideFromContactList.indexOf(item) === -1;
        //    };
        //};
        //
        //$scope.toggleMute = function () {
        //    $scope.muted = !$scope.muted;
        //
        //    Object.keys($scope.contacts).forEach(function (contact) {
        //        var session = $scope.contacts[contact];
        //        session.streams.audio = !$scope.muted;
        //        session.renegotiate();
        //    });
        //};

        function onMessageReceive (name, message) {
            switch (message.type) {
                case 'answer':
                    media.stop();
                    $scope.$apply(function () {
                        $scope.callInProgress = true;
                        $timeout($scope.updateVideoPosition, 1000);
                    });

                    var existingContacts = Object.keys($scope.contacts);
                    if (existingContacts.length !== 0) {
                        signaling.emit('sendMessage', name, {
                            type: 'add_to_group',
                            contacts: existingContacts,
                            isInitiator: false
                        });
                    }

                    call(true, name);
                    break;

                case 'ignore':
                    media.stop();
                    var len = Object.keys($scope.contacts).length;
                    if (len > 0) {
                        if ($scope.contacts[name]) {
                            $scope.contacts[name].close();
                            delete $scope.contacts[name];
                        }

                        var i = $scope.hideFromContactList.indexOf(name);
                        if (i > -1) {
                            $scope.hideFromContactList.splice(i, 1);
                        }

                        if (Object.keys($scope.contacts).length === 0) {
                            if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                            {
                                $state.go('app.driver.list', {reload: true});
                            } else {
                                $state.go('app.injury.info', {reload: true});
                            }
                        }
                    } else {
                        if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                        {
                            $state.go('app.driver.list', {reload: true});
                        } else {
                            $state.go('app.injury.info', {reload: true});
                        }
                    }

                    break;

                case 'phonertc_handshake':
                    if (duplicateMessages.indexOf(message.data) === -1) {
                        $scope.contacts[name].receiveMessage(JSON.parse(message.data));
                        duplicateMessages.push(message.data);
                    }

                    break;

                case 'add_to_group':
                    message.contacts.forEach(function (contact) {
                        $scope.hideFromContactList.push(contact);
                        call(message.isInitiator, contact);

                        if (!message.isInitiator) {
                            $timeout(function () {
                                signaling.emit('sendMessage', contact, {
                                    type: 'add_to_group',
                                    isInitiator: true
                                });
                            }, 1500);
                        }
                    });

                    break;
            }
        }

        signaling.on('messageReceived', onMessageReceive);

        $scope.$on('$destroy', function() {
            signaling.removeListener('messageReceived', onMessageReceive);
        });

        function doOnOrientationChange()
        {
            switch(window.orientation)
            {
                case -90:
                case 90:
                    var widthWindow = $(window).width()+"px";
                    $('.video-container').width(widthWindow);
                    $('.video-container').height(widthWindow);
                    break;
                default:
                    var widthWindow = $(window).width()+"px"
                    $('.video-container').width(widthWindow);
                    $('.video-container').height(widthWindow);
                    break;
            }
        }

        window.addEventListener('orientationchange', doOnOrientationChange);

        doOnOrientationChange();
    })
