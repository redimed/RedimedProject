/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.loggedIn.PmProperties",[
    "app.loggedIn.PmProperties.controller",
    "app.loggedIn.PmProperties.services"
])
.config(function($stateProvider){
    $stateProvider

        .state("loggedIn.PmProperties",{
            url:"/PmProperties",

            templateUrl: "modules/PmProperties/views/PmProperties.html",
            controller: 'PmPropertiesController'

        })
});