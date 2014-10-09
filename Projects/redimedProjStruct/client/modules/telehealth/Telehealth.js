/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.telehealth',['app.loggedIn.telehealth.formController','app.loggedIn.telehealth.services'])
.config(function($stateProvider){
        $stateProvider
            .state('loggedIn.telehealthForm',{
                url:'/telehealth/form',
                templateUrl:'modules/telehealth/views/patientForm.html',
                controller:'TelehealthFormController'
            })
    })