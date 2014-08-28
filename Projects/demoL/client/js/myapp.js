var app = angular.module("myApp", ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {templateUrl: '/partials/login.html',controller: LoginController})
        //.when('/user', {controller: ViewController, templateUrl: '/partials/view.html'})
        .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
})