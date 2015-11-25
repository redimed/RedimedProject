angular.module('starter.consultation',[
    'starter.consultation.services',
    'starter.consultation.controller',
    'starter.consultationDetail.controller'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.consultationList',{
                url: "/consultationList",
                cache: false,
                views: {
                    'menuContent' : {
                        templateUrl: "modules/consutationHistory/views/consultationList.html",
                        controller: "consultationController"
                    }
                }
            })
            .state('app.detailConsultation',{
                url:'/consultationDetail/:patient_id/:cal_id',
                cache:false,
                views:{
                    'menuContent':{
                        templateUrl:"modules/consutationHistory/views/consultationDetail.html",
                        controller:"consultationDetailController"
                    }
                }
            })
           
    })

