/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.loggedIn.patient.injuryManagement",[
    "app.loggedIn.patient.injuryManagement.map.controller",
    "app.loggedIn.patient.injuryManagement.detail.controller",
    "app.loggedIn.patient.injuryManagement.list.controller",
    "app.loggedIn.patient.injuryManagement.bluetooth.controller",
    "app.loggedIn.patient.injuryManagement.services"
])
.config(function($stateProvider){
    $stateProvider

        .state("loggedIn.patient.im_Map",{
            url: "/im/maps",
            views: {
                "main-content":{
                    templateUrl: "modules/injuryManagement/views/injuryMap.html",
                    controller: "InjuryMapController"
                }
            }

        })

        .state('loggedIn.patient.im_List',{
            url:"/im/list",
            views:{
                "main-content":{
                    templateUrl:"modules/injuryManagement/views/injuryList.html",
                    controller:"InjuryListController"
                }
            }
        })

        .state('loggedIn.patient.im_Bluetooth',{
            url:"/im/bluetooth",
            views:{
                "main-content":{
                    templateUrl:"modules/injuryManagement/views/bluetooth.html",
                    controller:"BluetoothController"
                }
            }
        })

        .state("loggedIn.patient.im_Detail",{
            url:"/im/details/:id",
            views:{
                "main-content":{
                    templateUrl:"modules/injuryManagement/views/injuryDetails.html",
                    controller:"InjuryDetailController"
                }
            }
        })

});