
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
                //alert("Insert Failed!");
            }
        });

        $scope.listFA = [];


        DocumentService.loadFA().then(function(response){
            if(response['status'] === 'fail') {
                alert("load fail!");
            }
            else
            {
                var data = response[0];
                var dataH = data.Header[0];
                var dataS = data.Section;
                $scope.listFA.push({ "header_name": dataH.FA_NAME, "section":[]});
                var i = 0;
                angular.forEach(data.Section, function(dataS){
                    $scope.listFA[0].section.push({"section_id" : dataS.SECTION_ID, "section_name": dataS.SECTION_NAME, "line":[]});
                    var j = 0;
                    angular.forEach(data.Line, function(dataL){
                        if(dataL.SECTION_ID ==  $scope.listFA[0].section[i].section_id )
                        {
                            $scope.listFA[0].section[i].line.push({ "line_id" : dataL.LINE_ID,"line_name": dataL.LINE_NAME, "detail":[],"comment":[]});
                            angular.forEach(data.Detail, function(dataD){
                                if(dataD.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                {
                                    $scope.listFA[0].section[i].line[j].detail.push({ "detail_name": dataD.DETAIL_NAME});
                                }
                            });
                            angular.forEach(data.Comment, function(dataC){

                                if(dataC.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                {
                                    $scope.listFA[0].section[i].line[j].comment.push({ "comment_name": dataC.NAME});
                                }
                            });
                            j++;
                        }

                    });
                    i++;
                });
            }
        });




    });




