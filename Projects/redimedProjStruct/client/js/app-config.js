/**
 * Created by meditech on 8/27/2014.
 */
 
app.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/customers', {controller: "cusListController", templateUrl: '/sub/helloWorld/list.html'})
        .when("/customers/add",{controller:"cusAddController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/customers/edit/:id",{controller:"cusEditController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/home",{controller:"homeController"})
    $locationProvider.html5Mode(true)
});
