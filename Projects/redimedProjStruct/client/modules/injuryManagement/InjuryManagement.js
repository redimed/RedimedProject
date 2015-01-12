/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.loggedIn.im",[
    "app.loggedIn.im.controller",
    "app.loggedIn.im.services"
])
.config(function($stateProvider){
    $stateProvider

        .state("loggedIn.im", {
            abstract: true,
            templateUrl: "modules/injuryManagement/views/structure.html",
            controller: "InjuryManagementController"
        })

        .state("loggedIn.im.map",{
            url: "/im/maps",
            views: {
                "main-content":{
                    templateUrl: "modules/injuryManagement/views/injuryMap.html",
                    controller: "InjuryMapController"
                }
            }

        })
});