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

        .state("loggedIn.im.detail",{
            url:"/im/details/:id",
            views:{
                "main-content":{
                    templateUrl:"modules/injuryManagement/views/injuryDetails.html",
                    controller:"InjuryDetailController"
                }
            }
        })

        .state('loggedIn.im.call',{
            url:"/im/call",
            views:{
                "main-content":{
                    templateUrl:"modules/injuryManagement/views/call.html",
                    controller:"CallController"
                }
            }
        })
});