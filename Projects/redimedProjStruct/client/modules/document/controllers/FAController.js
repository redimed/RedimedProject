
angular.module('app.loggedIn.document.FA.controllers',[])
    .controller("FAController",function($scope, $state,DocumentService,$http,$cookieStore) {
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
                                $scope.listFA[0].section[i].line.push({ "line_id" : dataL.LINE_ID,"line_name": dataL.LINE_NAME,"line_type": dataL.LineType, "line_comment" : dataL.IsCommentsText, "line_isscore1" : dataL.ISSCORE1,"line_isscore2" : dataL.ISSCORE2,"line_israting1" : dataL.ISRATING1,"line_israting2" : dataL.ISRATING2,"score_type1" : dataL.SCORE_TYPE1,"score_type2" : dataL.SCORE_TYPE2, "detail":[],"comment":[]});
                                angular.forEach(data.Detail, function(dataD){
                                    if(dataD.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                    {
                                        $scope.listFA[0].section[i].line[j].detail.push({ "detail_name": dataD.DETAIL_NAME, "val1_name": dataD.VAL1_NAME, "val2_name": dataD.VAL2_NAME,"val1_isvalue": dataD.VAL1_ISVALUE,"val2_isvalue": dataD.VAL2_ISVALUE,"val1_ischeckbox": dataD.VAL1_ISCHECKBOX,"val2_ischeckbox": dataD.VAL2_ISCHECKBOX, "comment_text": dataD.IsCommentText});
                                    }
                                });
                                angular.forEach(data.Comment, function(dataC){

                                    if(dataC.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                    {
                                        $scope.listFA[0].section[i].line[j].comment.push({ "comment_name": dataC.NAME, "comment_type": dataC.Comment_Type});
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


    

    });




