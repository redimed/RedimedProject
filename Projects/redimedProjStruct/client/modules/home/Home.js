angular.module("app.loggedIn.home",[
    "app.loggedIn.home.controller"
])

.config(function($stateProvider){
    $stateProvider

    .state("loggedIn.home", {
        url: "/home",
        templateUrl: "modules/home/views/home.html",
        controller: "HomeController"
    })
})