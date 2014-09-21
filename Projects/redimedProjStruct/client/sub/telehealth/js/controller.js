app.controller('telehealthFormController',function($scope,$rootScope,$http){
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