
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


        DocumentService.loadFA().then(function(response){
            if(response['status'] === 'fail') {
                alert("load fail!");
            }
            else
            {
                //$scope.listFA.push(response);
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




{
//                    alert($scope.listFA.length);
//                    var i = 0;
//                    angular.forEach(response, function(list){
//
//                        if($scope.listFA.length === 0)
//                        {
//                            $scope.listFA.push({"list": {"header" : list.FA_NAME, "listS": []}});
//                        }else
//                        {
//                            var j = 0;
//                            angular.forEach($scope.listFA, function(listH) {
//                                if (listH.list.header !== list.FA_NAME) {
//                                    $scope.listFA.push({"list": {"header" : list.FA_NAME, "listS": []}});
//
//                                        if($scope.listFA.list.listS.length === 0)
//                                        {
//                                            $scope.listFA.list.listS.push({"section":list.SECTION_NAME});
//                                        }else
//                                        {
//                                            var b = 0;
//                                            angular.forEach($scope.listFA.list.listS, function(listS) {
//                                                if (listS.sections !== list.SECTION_NAME) {
//                                                    $scope.listFA.list.listS.push({"section":list.SECTION_NAME});
//
//                                                }
//                                                b++;
//                                            });
//                                        }
//                                }
//                                j++;
//                            });
//                        }
//
//                        i++;
//                    });
}