
angular.module('app.loggedIn.document.FA.controllers',[])

    .controller("FAController",function($scope,$filter,$timeout,DocumentService,$http,$cookieStore,toastr) {


        $scope.listFA = [];
        $scope.infoH = [];
        $scope.infoL = [];
        $scope.infoS = [];
        $scope.infoD = [];
        $scope.infoC = [];
        $scope.manage = [];
        $scope.a = {};
        $scope.total = {};



        var value={},
            age = 24,
            gender = 'male',
            val = 0,
            sum = 0,
            avg = 0,
            total = 0,
            rateTotal,
            dem = 0;
        $scope.age = age;

        var date = new Date();
        var today = $filter('date')(date,'ddMMyy');

        $scope.rate = function(id){
            val = $scope.infoL.RATING_VALUE1[id];
            if(val == 1){
                $scope.infoL.RATE1[id] = "Poor";
            }else if(val == 2){
                $scope.infoL.RATE1[id] = "Fair";
            }else if(val == 3){
                $scope.infoL.RATE1[id] = "Good";
            }else if(val == 4){
                $scope.infoL.RATE1[id] = "Excellent";
            }else{
                $scope.infoL.RATE1[id] = '';
            }
            rateTotalFunction(id);

        };

        var rateTotalFunction = function(id){
            rateTotal = [];
            dem= 0;
            for(var i in $scope.a)
            {
                total=0;
                for(var j in $scope.a[i])
                {
                    if(j != 'rating')
                    {
                        if(j == id)
                        {
                            $scope.a[i][j] = $scope.infoL.RATING_VALUE1[id];
                        }
                        total = total + $scope.a[i][j]*1;
                    }
                }
                $scope.infoL.RATING_VALUE1[i] = total;

                DocumentService.checkRating($scope.a[i].rating,age, gender, total).then(function(response){
                    if(response['status'] != 'fail' && response.length > 0){
                        rateTotal.push(response[0].RATE);
                        dem = 0;
                        for(var k in $scope.a)
                        {
                            for(var t =0;t < rateTotal.length; t++)
                            {
                                if(t == dem)
                                {
                                    $scope.infoL.RATE1[k] = rateTotal[t];
                                }
                            }
                            dem++;
                        }
                    }else
                    {
                        $scope.infoL.RATE1[i] = '';
                    }
                });

            }
        };

        $scope.mathScore = function(idD, idL, score1, rating1, score2, rating2, type1, type2, rating_id){
            if(score1 == 1)
            {
                if(rating1 == 1)
                {
                    if(type1 == 3)
                    {
                        sum = 0,
                        avg = 0;
                        value[idL][idD][0]=$scope.infoD.VAL1_VALUE[idD];
                        for(var i in value[idL])
                        {
                            sum = sum + value[idL][i][0] * 1;
                            avg++;
                        }
                        val = sum / avg;
                        $scope.infoL.SCORE1[idL] = val;
                    }else if(type1 == 4)
                    {
                        var max = 0;
                        for(var i in value[idL])
                        {
                            if(i > max)
                            {
                                max = i;
                            }
                        }
                        val =$scope.infoD.VAL1_VALUE[max];
                    }else if(type1 == 6)
                    {
                        val = $scope.infoD.VAL1_VALUE[idD];
                    }
                    DocumentService.checkRating(rating_id,age, gender, val).then(function(response){
                        if(response['status'] != 'fail' && response.length > 0){
                            $scope.infoL.RATING_VALUE1[idL] = response[0].VALUE;
                            $scope.infoL.RATE1[idL] = response[0].RATE;
                            rateTotalFunction(idL);
                        }else
                        {
                            $scope.infoL.RATING_VALUE1[idL]=null;
                            $scope.infoL.RATE1[idL] = '';
                            rateTotalFunction(idL);
                        }
                    });

                    if(score2 == 1 && rating2 == 1 && type2 == 3){
                        sum = 0;
                        avg = 0;
                        val = 0;
                        value[idL][idD][1]=$scope.infoD.VAL2_VALUE[idD];
                        for(var i in value[idL])
                        {
                            sum = sum + value[idL][i][1] * 1;
                            avg++;
                        }
                        val = sum / avg;
                        $scope.infoL.SCORE2[idL] = val;
                        DocumentService.checkRating(rating_id,age, gender, val).then(function(response){
                            if(response['status'] != 'fail' && response.length > 0){
                                $scope.infoL.RATING_VALUE2[idL] = response[0].VALUE;
                                $scope.infoL.RATE2[idL] = response[0].RATE;
                            }else
                            {
                                $scope.infoL.RATING_VALUE2[idL]=null;
                                $scope.infoL.RATE2[idL] = '';
                            }

                        });
                    }

                }else if(rating1 == 0)
                {
                    if(type1 == 9)
                    {
                        var max = 0;
                        value[idL][idD][0]=$scope.infoD.VAL1_VALUE[idD]*1;

                        for(var i in value[idL])
                        {
                            if(value[idL][i][0] > max)
                            {
                                max = value[idL][i][0];

                            }
                        }
                        $scope.manage[idL] = max;
                    }
                }
            }
        };


        $scope.submitFA = function(FAForm){
//            var imageSign = document.getElementById('signDisplay').src;
//            $scope.infoH.SIGNATURE = imageSign;

            $scope.showClickedValidation = true;
            if(FAForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                DocumentService.insertFA($scope.infoH,$scope.infoS,$scope.infoL,$scope.infoD,$scope.infoC).then(function(response){
                    console.log(response['status']);
                    if(response['status'] === 'success') {
                        alert("Insert Successfully!");
                        //$state.go('loggedIn.home');
                    }
                    else
                    {
                        alert("Insert Failed!");
                    }
                });
            }
        };

        $scope.infoH ={
            PATIENT_ID: 4,
            CAL_ID : 11221,
            FA_ID: null,
            ENTITY_ID: null,
            FA_TYPE: null,
            FA_NAME : null,
            ISENABLE: null,
            Created_by: null,
            Last_updated_by: null,
            Risk: null,
            Comments : null,
            Recommend: null,
            Att_Flexibility: 0,
            Att_Core_Stability: 0,
            Att_Wirst_Elbow_func: 0,
            Att_Shoulder_func: 0,
            Att_Lower_Limb_func: 0,
            Att_Balance: 0,
            ASSESSED_ID: null,
            ASSESSED_SIGN: null,
            ASSESSED_DATE : null,
            ASSESSED_NAME : null,
            ITEM_ID: null
        };

        $scope.infoL = {
//            PATIENT_ID : null,
//            CAL_ID : null,
//            LINE_ID: null,
//            SECTION_ID : null,
//            FA_ID : null,
//            QUESTION: null,
//            PICTURE: null,
//            ISSCORE1 : null,
//            SCORE_TYPE1 : null,
            SCORE1 : {},
//            ISRATING1 : null,
//            RATING_ID1 : null,
            RATING_VALUE1 : {},
            COMMENTS: {},
//            ORD : null,
//            ISSCORE2 : null,
//            SCORE_TYPE2 : null,
            SCORE2 : {},
//            ISRATING2 : null,
//            RATING_ID2 : null,
            RATING_VALUE2 : {},
//            ISENABLE : null,
//            Created_by : null,
//            Creation_date : null,
//            Last_updated_by : null,
//            Last_update_date : null,
//            IsCommentsText : null,
//            LineType : null,
            RATE1 : {},
            RATE2 : {}//,
//            VAL1_NAME_HEADER: null,
//            VAL1_VALUE_HEADER: null,
//            VAL2_NAME_HEADER: null,
//            VAL2_VALUE_HEADER: null,
//            IS_SHOW_RANKING_TABLE : null
        };

//        $scope.infoS ={
//            "PATIENT_ID" : null,
//            "CAL_ID" : null,
//            "SECTION_ID" : null,
//            "FA_ID" : null,
//            "SECTION_NAME" : null,
//            "ISENABLE" : null,
//            "ORD" : null,
//            "USER_TYPE" : null,
//            "Created_by" : null,
//            "Creation_date" : null,
//            "Last_updated_by" : null,
//            "Last_update_date" : null,
//            "SECTION_TYPE" : null
//        };

        $scope.infoD = {
//            PATIENT_ID : null,
//            CAL_ID : null,
//            DETAIL_ID : null,
//            LINE_ID : null,
//            QUESTION : null,
//            VAL1_NAME : null,
//            VAL1_ISVALUE : null,
            VAL1_VALUE : {},
//            VAL1_ISCHECKBOX : null,
            VAL1_CHECKBOX : {},
//            VAL2_NAME : null,
//            VAL2_ISVALUE : null,
            VAL2_VALUE : {},
//            VAL2_ISCHECKBOX : null,
            VAL2_CHECKBOX : {},
            COMMENTS : {}//,
//            PICTURE : null,
//            ORD : null,
//            ISENABLE : null,
//            Created_by : null,
//            Creation_date: null,
//            Last_updated_by : null,
//            Last_update_date: null,
//            VAL1_ISCOMMENT_WHEN_YES : null,
//            VAL1_ISCOMMENT_WHEN_NO : null,
//            VAL2_ISCOMMENT_WHEN_YES : null,
//            VAL2_ISCOMMENT_WHEN_NO : null,
//            IsCommentText : null,
//            LineTestRefer : null,
//            VAL1_VALUE_IS_NUMBER : null,
//            VAL2_VALUE_IS_NUMBER : null
        };

        $scope.infoC ={
//            "PATIENT_ID" : null,
//            "CAL_ID" : null,
//            "FA_COMMENT_ID" : null,
//            "LINE_ID" : null,
//            "NAME" : null,
            "VALUE": {}//,
//            "ISENABLE" : null,
//            "Created_by" : null,
//            "Creation_date" : null,
//            "Last_updated_by" : null,
//            "Last_update_date" : null,
//            "Comment_Type" : null
        };


        DocumentService.checkFA($scope.infoH.PATIENT_ID,$scope.infoH.CAL_ID).then(function(response){
            if(response['status'] === 'fail') {
                alert("aaaaaaaaaaaaaaaaaaaa");
                DocumentService.newFA($scope.infoH.PATIENT_ID,$scope.infoH.CAL_ID).then(function(response){
                    DocumentService.loadFA($scope.infoH.PATIENT_ID,$scope.infoH.CAL_ID).then(function(response){
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
                                        $scope.listFA[0].section[i].line.push({ "line_id" : dataL.LINE_ID,"rating_id1" :dataL.RATING_ID1,"rating_id2" :dataL.RATING_ID2,"line_name": dataL.QUESTION,"line_type": dataL.LineType, "line_comment" : dataL.IsCommentsText, "line_isscore1" : dataL.ISSCORE1,"line_isscore2" : dataL.ISSCORE2,"line_israting1" : dataL.ISRATING1,"line_israting2" : dataL.ISRATING2,"score_type1" : dataL.SCORE_TYPE1,"score_type2" : dataL.SCORE_TYPE2, "detail":[],"comment":[]});
                                        $scope.infoL.COMMENTS[dataL.LINE_ID] = dataL.COMMENTS;
                                        $scope.infoL.SCORE1[dataL.LINE_ID] = dataL.SCORE1;
                                        $scope.infoL.SCORE2[dataL.LINE_ID] = dataL.SCORE2;
                                        $scope.infoL.RATING_VALUE1[dataL.LINE_ID] = dataL.RATING_VALUE1;
                                        $scope.infoL.RATING_VALUE2[dataL.LINE_ID] = dataL.RATING_VALUE2;
                                        $scope.infoL.RATE1[dataL.LINE_ID] = dataL.RATE1;
                                        $scope.infoL.RATE2[dataL.LINE_ID] = dataL.RATE2;
                                        value[dataL.LINE_ID] = {};
                                        angular.forEach(data.Detail, function(dataD){
                                            if(dataD.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                            {
                                                $scope.listFA[0].section[i].line[j].detail.push({"detail_id": dataD.DETAIL_ID, "detail_name": dataD.QUESTION, "val1_name": dataD.VAL1_NAME, "val2_name": dataD.VAL2_NAME,"val1_isvalue": dataD.VAL1_ISVALUE,"val2_isvalue": dataD.VAL2_ISVALUE,"val1_ischeckbox": dataD.VAL1_ISCHECKBOX,"val2_ischeckbox": dataD.VAL2_ISCHECKBOX, "comment_text": dataD.IsCommentText,"summary" : dataD.LineTestRefer});
                                                $scope.infoD.COMMENTS[dataD.DETAIL_ID]=dataD.COMMENTS;
                                                $scope.infoD.VAL1_CHECKBOX[dataD.DETAIL_ID] = dataD.VAL1_CHECKBOX;
                                                $scope.infoD.VAL2_CHECKBOX[dataD.DETAIL_ID] = dataD.VAL2_CHECKBOX;
                                                $scope.infoD.VAL2_VALUE[dataD.DETAIL_ID] = dataD.VAL2_VALUE;
                                                $scope.infoD.VAL1_VALUE[dataD.DETAIL_ID] = dataD.VAL1_VALUE;
                                                value[dataL.LINE_ID][dataD.DETAIL_ID] = [dataD.VAL1_VALUE,dataD.VAL2_VALUE];
                                                $scope.mathScore(dataD.DETAIL_ID, dataL.LINE_ID, 1, 0, null, null, 9, null, null);
                                            }
                                        });
                                        angular.forEach(data.Comment, function(dataC){

                                            if(dataC.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                            {
                                                $scope.listFA[0].section[i].line[j].comment.push({"comment_id":dataC.FA_COMMENT_ID,"comment_name": dataC.NAME, "comment_type": dataC.Comment_Type});
                                                $scope.infoC.VALUE[dataC.FA_COMMENT_ID] = dataC.VALUE;
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
            }else
            {
                alert("qqqqqqqqqqqqqqqqqqqqqqqqqqq");
                $scope.infoH = {
                    PATIENT_ID: response.PATIENT_ID ,
                    CAL_ID : response.CAL_ID ,
                    //FA_ID: response.FA_ID ,
                    ENTITY_ID: response.ENTITY_ID ,
                    //FA_TYPE: response.FA_TYPE ,
                    //FA_NAME : response.FA_NAME ,
                    //ISENABLE: response.ISENABLE ,
                    Created_by: response.Created_by ,
                    Creation_date : response.Creation_date ,
                    Last_updated_by: response.Last_updated_by ,
                    Last_update_date : response.Last_update_date ,
                    Risk: response.Risk ,
                    Comments : response.Comments ,
                    Recommend: response.Recommend ,
                    Att_Flexibility: response.Att_Flexibility ,
                    Att_Core_Stability: response.Att_Core_Stability ,
                    Att_Wirst_Elbow_func: response.Att_Wirst_Elbow_func ,
                    Att_Shoulder_func: response.Att_Shoulder_func ,
                    Att_Lower_Limb_func: response.Att_Lower_Limb_func ,
                    Att_Balance: response.Att_Balance ,
                    ASSESSED_ID: response.ASSESSED_ID ,
                    ASSESSED_SIGN: response.ASSESSED_SIGN ,
                    ASSESSED_DATE : response.ASSESSED_DATE ,
                    ASSESSED_NAME : response.ASSESSED_NAME ,
                    ITEM_ID: response.ITEM_ID
                };
                DocumentService.loadFA($scope.infoH.PATIENT_ID,$scope.infoH.CAL_ID).then(function(response){
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
                                    $scope.listFA[0].section[i].line.push({ "line_id" : dataL.LINE_ID,"rating_id1" :dataL.RATING_ID1,"rating_id2" :dataL.RATING_ID2,"line_name": dataL.QUESTION,"line_type": dataL.LineType, "line_comment" : dataL.IsCommentsText, "line_isscore1" : dataL.ISSCORE1,"line_isscore2" : dataL.ISSCORE2,"line_israting1" : dataL.ISRATING1,"line_israting2" : dataL.ISRATING2,"score_type1" : dataL.SCORE_TYPE1,"score_type2" : dataL.SCORE_TYPE2, "detail":[],"comment":[]});
                                    $scope.infoL.COMMENTS[dataL.LINE_ID] = dataL.COMMENTS;
                                    $scope.infoL.SCORE1[dataL.LINE_ID] = dataL.SCORE1;
                                    $scope.infoL.SCORE2[dataL.LINE_ID] = dataL.SCORE2;
                                    $scope.infoL.RATING_VALUE1[dataL.LINE_ID] = dataL.RATING_VALUE1;
                                    $scope.infoL.RATING_VALUE2[dataL.LINE_ID] = dataL.RATING_VALUE2;
                                    $scope.infoL.RATE1[dataL.LINE_ID] = dataL.RATE1;
                                    $scope.infoL.RATE2[dataL.LINE_ID] = dataL.RATE2;
                                    value[dataL.LINE_ID] = {};
                                    angular.forEach(data.Detail, function(dataD){
                                        if(dataD.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                        {
                                            $scope.listFA[0].section[i].line[j].detail.push({"detail_id": dataD.DETAIL_ID, "detail_name": dataD.QUESTION, "val1_yes": dataD.VAL1_ISCOMMENT_WHEN_YES, "val1_no": dataD.VAL1_ISCOMMENT_WHEN_NO, "val2_yes" : dataD.VAL2_ISCOMMENT_WHEN_YES, "val2_no" : dataD.VAL2_ISCOMMENT_WHEN_NO, "val1Validate" : dataD.VAL1_VALUE_IS_NUMBER,"val2Validate" : dataD.VAL2_VALUE_IS_NUMBER, "val1_name": dataD.VAL1_NAME, "val2_name": dataD.VAL2_NAME,"val1_isvalue": dataD.VAL1_ISVALUE,"val2_isvalue": dataD.VAL2_ISVALUE,"val1_ischeckbox": dataD.VAL1_ISCHECKBOX,"val2_ischeckbox": dataD.VAL2_ISCHECKBOX, "comment_text": dataD.IsCommentText,"summary" : dataD.LineTestRefer});
                                            $scope.infoD.COMMENTS[dataD.DETAIL_ID]=dataD.COMMENTS;
                                            $scope.infoD.VAL1_CHECKBOX[dataD.DETAIL_ID] = dataD.VAL1_CHECKBOX;
                                            $scope.infoD.VAL2_CHECKBOX[dataD.DETAIL_ID] = dataD.VAL2_CHECKBOX;
                                            $scope.infoD.VAL2_VALUE[dataD.DETAIL_ID] = dataD.VAL2_VALUE;
                                            $scope.infoD.VAL1_VALUE[dataD.DETAIL_ID] = dataD.VAL1_VALUE;
                                            value[dataL.LINE_ID][dataD.DETAIL_ID] = [dataD.VAL1_VALUE,dataD.VAL2_VALUE];
                                            $scope.mathScore(dataD.DETAIL_ID, dataL.LINE_ID, 1, 0, null, null, 9, null, null);
                                        }
                                    });
                                    angular.forEach(data.Comment, function(dataC){

                                        if(dataC.LINE_ID ==  $scope.listFA[0].section[i].line[j].line_id )
                                        {
                                            $scope.listFA[0].section[i].line[j].comment.push({"comment_id":dataC.FA_COMMENT_ID,"comment_name": dataC.NAME, "comment_type": dataC.Comment_Type});
                                            $scope.infoC.VALUE[dataC.FA_COMMENT_ID] = dataC.VALUE;
                                        }
                                    });
                                    j++;
                                }

                            });
                            i++;
                        });

                    }
                });

            }
        });


    });




