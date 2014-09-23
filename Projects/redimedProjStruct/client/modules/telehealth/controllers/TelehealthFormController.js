/**
 * Created by meditech on 23/09/2014.
 */
angular.module('app.loggedIn.telehealth.formController',[])
.controller('TelehealthFormController',function($scope,$rootScope,$http,TelehealthService){
        var initPickers = function () {
            //init date pickers
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            }).on('changeDate',function(evn){

            });

        }
        initPickers();

    });