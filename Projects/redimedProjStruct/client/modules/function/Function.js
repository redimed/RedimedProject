/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.loggedIn.function",[
    "app.loggedIn.function.controller",
    "app.loggedIn.function.services"
])
.config(function($stateProvider){
    $stateProvider

        .state("loggedIn.function",{
            url:"/functions",
            templateUrl: "modules/function/views/function.html",
            controller: 'FunctionController'
        })
});