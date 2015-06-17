angular.module('starter.NFC',[
    'starter.NFC.controller'

])
    .config(function($stateProvider){
        $stateProvider
            .state('app.NFC',{
                url:"/readNFC",
                cache: false,
                views:{
                    'menuContent':{
                        templateUrl:"modules/NFC/views/readNFC.html",
                        controller:"readNFCController"
                    }
                }
            })
    })

