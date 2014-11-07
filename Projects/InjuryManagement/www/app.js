// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('starter', ['ionic'])
//
//    .run(function($ionicPlatform) {
//      $ionicPlatform.ready(function() {
//        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//        // for form inputs)
//        if(window.cordova && window.cordova.plugins.Keyboard) {
//          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//        }
//        if(window.StatusBar) {
//          StatusBar.styleDefault();
//        }
//      });
//    })
//
//    .controller('myCtrl', ['$scope', function($scope){
//
//        $scope.show_section = false;
//
//        $scope.section_click = function($event) {
//            $scope.show_section = !$scope.show_section
//        };
//    }]);


var app = angular.module('ionicApp', ['ionic'])

app.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($rootScope) {
        return {
            request: function(config) {
                $rootScope.$broadcast('loading:show')
                return config
            },
            response: function(response) {
                $rootScope.$broadcast('loading:hide')
                return response
            }
        }
    })
})

app.run(function($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: 'foo'})
    })

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide()
    })
})

app.controller('MainCtrl', function($http, $ionicLoading) {
    var _this = this

    $http.jsonp('http://api.openbeerdatabase.com/v1/breweries.json?callback=JSON_CALLBACK').then(function(result) {
        _this.breweries = result.data.breweries
    })
})
