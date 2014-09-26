
angular.module('app.loggedIn.document.FA.controllers',[])
    .controller("FAController",function($scope,DocumentService,$http,$cookieStore) {
        //Date picker
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


        $scope.listFA = [];

        DocumentService.newFA().then(function(response){
            if(response['status'] === 'success') {
                alert("Insert Successfully!");
            }
            else
            {
                alert("Insert Failed!");
            }
        });

        $scope.listFA = [];


        DocumentService.loadFA().then(function(response){
            if(response['status'] === 'fail') {
                alert("load fail!");
            }
            else
            {
                $scope.listFA = response;

            }
        });

        var items = [];
        $scope.getSectionByID = function(id){
            items = $scope.listFA;
            var item ={};
            for(var i=0;i<items.length;i++)
            {
                if(items[i].SECTION_ID == id)
                {
                    item = items[i];
                    return item.SECTION_NAME;
                }
            }
        };

        $scope.getHeaderByID = function(id){
            items = $scope.listFA;
            var item ={};
            for(var i=0;i<items.length;i++)
            {
                if(items[i].FA_ID == id)
                {
                    item = items[i];
                    return item.FA_NAME;
                }
            }
        };

        $scope.getLineByID = function(id){
            items = $scope.listFA;
            var item ={};
            for(var i=0;i<items.length;i++)
            {
                if(items[i].LINE_ID == id)
                {
                    item = items[i];
                    return item.LINE_QUESTION;
                }
            }
        };

        $scope.getLineDetailByID = function(id){
            items = $scope.listFA;
            var item ={};
            for(var i=0;i<items.length;i++)
            {
                if(items[i].DETAIL_ID == id)
                {
                    item = items[i];
                    return item.DETAIL_QUESTION;
                }
            }
        };

        $scope.getCommentByID = function(id){
            items = $scope.listFA;
            var item ={};
            for(var i=0;i<items.length;i++)
            {
                if(items[i].FA_COMMENT_ID == id)
                {
                    item = items[i];
                    return item.NAME;
                }
            }
        };




    });




