
angular.module('app.loggedIn.document.IDS.controllers',[])
    .controller("IDSController",function($scope,DocumentService,$http,$cookieStore) {

        $scope.infoL = [];
        $scope.listIDS = [];

        $scope.infoH = {
            IDAS_ID : null,
            PATIENT_ID : 3,
            CAL_ID : 11111,
            DOCTOR_ID : 1,
            DF_CODE :  null,
            NAME :  null,
            IDAS_DATE : null,
            Temperature :  null,
            Creatinine :  null,
            Drug_Test_Time :  null,
            Expiry_Date : null,
            Notes :  null,
            Alcohol_Test_Time :  null,
            Reading :  null,
            Positive_Negative : null,
            Reading2 :  null,
            ITEM_ID : null,
            Created_by : null,
            Creation_date : null,
            Last_updated_by : null,
            Last_update_date : null,
            NAME_COMMENT :  null,
            ISENABLE : null,
            SIGNATURE: null,
            TesterName :  null,
            TesterSign: null,
            TesterDate : null
        };

        $scope.infoL.YES_NO = [];

//        $scope.infoL ={
//            IDAS_LINE_ID : null,
//            IDAS_GROUP_ID: null,
//            IDAS_ID: null,
//            PATIENT_ID : null,
//            CAL_ID : null,
//            ORD: null,
//            QUESTION : null,
//            YES_NO: null,
//            Created_by: null,
//            Creation_date: null,
//            Last_updated_by: null,
//            Last_update_date: null,
//            ISENABLE : null
//        };



        $scope.submitIDS = function(IDSForm){
            var imageSign = document.getElementById('signDisplay').src;
            $scope.infoH.SIGNATURE = imageSign;
            $scope.showClickedValidation = true;
            if(IDSForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                var infoL = $scope.infoL.YES_NO;
                var infoH = $scope.infoH;
                DocumentService.insertIDS(infoL,infoH).then(function(response){
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

        DocumentService.checkIDS("2","12211").then(function(response){
            if(response['status'] === 'fail') {
                alert("aaaaaaaaaaaaaaaaaaaa");
                DocumentService.newIDS().then(function(response){
                    DocumentService.loadIDS().then(function(response){
                        if(response['status'] === 'fail') {
                            alert("load fail!");
                        }
                        else
                        {
                            var data = response[0];
                            var dataH = data.Header[0];
                            $scope.listIDS.push({"header_id" : dataH.IDAS_ID, "group":[]});
                            var i = 0;
                            angular.forEach(data.Group, function(dataG){
                                if(dataG.IDAS_ID ==  $scope.listIDS[0].header_id  )
                                {
                                    $scope.listIDS[0].group.push({"group_id" : dataG.IDAS_GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                                    angular.forEach(data.Line, function(dataL){
                                        if(dataL.IDAS_GROUP_ID ==  $scope.listIDS[0].group[i].group_id )
                                        {
                                            $scope.listIDS[0].group[i].line.push({ "line_id" : dataL.IDAS_LINE_ID,"line_name": dataL.QUESTION});
                                        }
                                    });
                                    i++;
                                }
                            });
                        }
                    });
                });
            }else
            {
                alert("qqqqqqqqqqqqqqqqqqqqqqqqqqq");
                DocumentService.loadIDS().then(function(response){
                    if(response['status'] === 'fail') {
                        alert("load fail!");
                    }
                    else
                    {

                        var data = response[0];
                        var dataH = data.Header[0];
                        $scope.listIDS.push({"header_id" : dataH.IDAS_ID, "group":[]});
                        var i = 0;
                        angular.forEach(data.Group, function(dataG){
                            if(dataG.IDAS_ID ==  $scope.listIDS[0].header_id  )
                            {
                                $scope.listIDS[0].group.push({"group_id" : dataG.IDAS_GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                                angular.forEach(data.Line, function(dataL){
                                    if(dataL.IDAS_GROUP_ID ==  $scope.listIDS[0].group[i].group_id )
                                    {
                                        $scope.listIDS[0].group[i].line.push({ "line_id" : dataL.IDAS_LINE_ID,"line_name": dataL.QUESTION});
                                        $scope.infoL.YES_NO.push(dataL.YES_NO);
                                    }
                                });
                                i++;
                            }
                        });
                    }



                });
                $scope.infoH = {
                    IDAS_ID : response.data.IDAS_ID,
                    PATIENT_ID : response.data.PATIENT_ID,
                    CAL_ID : response.data.CAL_ID,
                    DOCTOR_ID : response.data.DOCTOR_ID,
                    DF_CODE :  response.data.DF_CODE,
                    NAME :  response.data.NAME,
                    IDAS_DATE : response.data.IDAS_DATE,
                    Temperature :  response.data.Temperature,
                    Creatinine :  response.data.Creatinine,
                    Drug_Test_Time :  response.data.Drug_Test_Time,
                    Expiry_Date : response.data.Expiry_Date,
                    Notes :  response.data.Notes,
                    Alcohol_Test_Time :  response.data.Alcohol_Test_Time,
                    Reading :  response.data.Reading,
                    Positive_Negative : response.data.Positive_Negative,
                    Reading2 :  response.data.Reading2,
                    ITEM_ID : response.data.ITEM_ID,
                    Created_by : response.data.Created_by,
                    Creation_date : response.data.Creation_date,
                    Last_updated_by : response.data.Last_updated_by,
                    Last_update_date : response.data.Last_update_date,
                    NAME_COMMENT :  response.data.NAME_COMMENT,
                    ISENABLE : response.data.ISENABLE,
                    SIGNATURE: response.rs,
                    TesterName :  response.data.TesterName,
                    TesterSign: response.data.TesterSign,
                    TesterDate : response.data.TesterDate
                };


            }
        });


    });




