var app = angular.module('starter', ['ionic'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
          if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          }
          if(window.StatusBar) {
            StatusBar.styleDefault();
          }
        });
    })
    //.directive('onValidSubmit', ['$parse', '$timeout', function($parse) {
    //    return {
    //        require: '^form',
    //        restrict: 'A',
    //        link: function(scope, element, attrs, form) {
    //            form.$submitted = false;
    //            var fn = $parse(attrs.onValidSubmit);
    //            element.on('submit', function(event) {
    //                scope.$apply(function() {
    //                    element.addClass('ng-submitted');
    //                    form.$submitted = true;
    //                    if (form.$valid) {
    //                        if (typeof fn === 'function') {
    //                            fn(scope, {$event: event});
    //                        }
    //                    }
    //                });
    //            });
    //        }
    //    }
    //}])
    //.directive('validated', ['$parse', function($parse) {
    //    return {
    //        restrict: 'AEC',
    //        require: '^form',
    //        link: function(scope, element, attrs, form) {
    //            var inputs = element.find("*");
    //            for(var i = 0; i < inputs.length; i++) {
    //                (function(input){
    //                    var attributes = input.attributes;
    //                    if (attributes.getNamedItem('name') != void 0) {
    //                        var field = form[attributes.name.value];
    //                        if (field != void 0) {
    //                            scope.$watch(function() {
    //                                return form.$submitted + "_" + field.$valid;
    //                            }, function() {
    //                                if (form.$submitted != true) return;
    //                                var inp = angular.element(input);
    //                                if (inp.hasClass('ng-invalid')) {
    //                                    element.removeClass('has-success');
    //                                    element.addClass('has-error');
    //                                } else {
    //                                    element.removeClass('has-error').addClass('has-success');
    //                                }
    //                            });
    //                        }
    //                    }
    //                })(inputs[i]);
    //            }
    //        }
    //    }
    //}])

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('intro', {
                url: '/',
                templateUrl: 'templates/intro.html',
                controller: 'IntroCtrl'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise("/");

    })

    .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

        // Called to navigate to the main app
        $scope.startApp = function() {
            $state.go('main');
        };
        $scope.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    })

    .controller('MainCtrl', function($scope, $state) {
        console.log('MainCtrl');

        $scope.toIntro = function(){
            $state.go('intro');
        }
    });
