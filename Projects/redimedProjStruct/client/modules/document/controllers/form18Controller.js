/**
 * Created by HUYNHAN on 9/25/2014.
 */
angular.module('app.loggedIn.document.form18.controllers',[])
    .controller("form18Controller",function($scope,$rootScope,$http,$cookieStore) {
        var initPickers = function () {
            //init date pickers
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            }).on('changeDate',function(evn){

            });

        }
        initPickers();
        $scope.submit = function(){
            var info = $scope.info;
        };
    });