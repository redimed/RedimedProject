/**
 * Created by meditech on 8/27/2014.
 */
 
app.config(function($routeProvider, $locationProvider, $httpProvider) {



    $routeProvider
        .when("/home",{controller:"homeController",template:" "})
    $locationProvider.html5Mode(true)
});


