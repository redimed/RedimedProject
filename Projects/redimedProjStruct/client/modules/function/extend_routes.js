/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.loggedIn.function")
.config(function($stateProvider){
    $stateProvider

        .state("loggedIn.function_list",{
            url:"/functions",
            templateUrl: "modules/function/views/function.html",
            controller: 'FunctionController'

        })
});