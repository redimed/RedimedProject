
angular.module('app.loggedIn.document.MA.controllers',['fcsa-number'])
    .controller("MAController",function($scope,DocumentService,$http,$cookieStore,toastr,$stateParams,localStorageService) {
        var oriInfoH,
            oriInfoL;
        // Start Signature
        var tempSignature;
        $scope.isSignature = false;
        $scope.showSignature = function () {
            $scope.isSignature = !$scope.isSignature;
        }

        $scope.cancelClick = function () {
            $scope.isSignature = !$scope.isSignature;
            $scope.infoH.SIGN = tempSignature;
        };
        $scope.clearClick = function () {
            $scope.infoH.SIGN = '';
        };
        $scope.okClick = function () {
            $scope.isSignature = !$scope.isSignature;
            tempSignature = $scope.infoH.SIGN;
        }
        // End Signature

        $scope.listMA = [];
        $scope.infoH = [];
        $scope.infoL = [];

        $scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        var doctorInfo = $cookieStore.get('doctorInfo');
        var Patient_ID = $scope.patientInfo.Patient_id;
        var CalID = $scope.apptInfo.CAL_ID;
        var sex = $scope.patientInfo.Sex;
        $scope.Ratio = function(){
            $scope.infoH.WAIST_TO_HIP_RATE = $scope.infoH.WAIST_CIR / $scope.infoH.HIP_CIR;
            if(sex == "female")
            {
                if($scope.infoH.WAIST_TO_HIP_RATE < 0.80)
                {
                    $scope.infoH.RISK = 0;
                }else if($scope.infoH.WAIST_TO_HIP_RATE >= 0.80 && $scope.infoH.WAIST_TO_HIP_RATE <= 0.85)
                {
                    $scope.infoH.RISK = 1;
                }else if($scope.infoH.WAIST_TO_HIP_RATE > 0.85)
                {
                    $scope.infoH.RISK = 2;
                }
            }else
            {
                if($scope.infoH.WAIST_TO_HIP_RATE < 0.90)
                {
                    $scope.infoH.RISK = 0;
                }else if($scope.infoH.WAIST_TO_HIP_RATE >= 0.90 && $scope.infoH.WAIST_TO_HIP_RATE <= 0.95)
                {
                    $scope.infoH.RISK = 1;
                }else if($scope.infoH.WAIST_TO_HIP_RATE > 0.95)
                {
                    $scope.infoH.RISK = 2;
                }
            }
        };

        $scope.submitMA = function(MAForm){
            $scope.showClickedValidation = true;
            if(MAForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                DocumentService.insertMA($scope.infoL,$scope.infoH).then(function(response){
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
            Patient_id : Patient_ID,
            HEIGHT : null,
            WEIGHT: null,
            BMI: NaN,
            URINALYSIS: null,
            BSL : null,
            WAIST_CIR : null,
            HIP_CIR : null,
            WAIST_TO_HIP_RATE : null,
            RISK : null,
            DIST_RIGHT_EYE : null,
            DIST_RIGHT_EYE_CORRECTED : null,
            DIST_LEFT_EYE : null,
            DIST_LEFT_EYE_CORRECTED : null,
            NEAR_RIGHT_EYE : null,
            NEAR_RIGHT_EYE_CORRECTED : null,
            NEAR_LEFT_EYE : null,
            NEAR_LEFT_EYE_CORRECTED : null,
            PERIPHERAL_VISION : null,
            VISUAL_AIDS : null,
            VISUAL_AIDS_TYPE : null,
            COLOR_VISUAL : null,
            COLOR_VISUAL_SCORE : null,
            ISWOULD : null,
            COMMENTS: null,
            FINAL_ASS : null,
            COMMENTS2: null,
            DOCTOR_NAME: null,
            SIGN  : null,
            HA_DATE : null,
            LOCATION_ID : null,
            QUEST_DF_ID : null,
            Created_by : null,
            //Creation_date : today,
            Last_updated_by : null,
            CAL_ID : CalID,
            DF_CODE : null,
            ISENABLE : 1,
            IS_URINALYSIS : null,
            EXAMINED_COMMENT: null,
            IS_CANDIDATE_CAN_UNDERTAKE : null,
            IS_CANDIDATE_BE_ADVERSELY_AFFECTED : null,
            CANDIDATE_CAN_UNDERTAKE_COMMENT: null,
            CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT: null,
            DESCRIPTION : null
        };
        oriInfoH  = angular.copy($scope.infoH);
        $scope.infoL = {
            "MA_LINE_ID"  : null,
            "QUESTION" : null,
            "VAL1_NAME" : null,
            "VAL1" : {},
            "VAL2_NAME" : null,
            "VAL2" : {},
            "VAL3_NAME" : null,
            "VAL3" : {},
            "VAL4_NAME" : null,
            "VAL4" : null,
            "VAL5_NAME" : null,
            "VAL5" : null,
            "VAL6_NAME" : null,
            "VAL6" : null,
            "YES_NO" : null,
            "COMMENTS" : {},
            "ORD" : null,
            "GROUP_ID" : null,
            "Created_by" : null,
            "Creation_date" : null,
            "Last_updated_by" : null,
            "Last_update_date" : null,
            "CAL_ID" : null,
            "PATIENT_ID" : Patient_ID,
            "YES_NO_VAL" : {},
            "ISENABLE" : 1
        };
        oriInfoL  = angular.copy($scope.infoL);

        $scope.resetForm = function () {
            $scope.infoH = angular.copy(oriInfoH);
            $scope.infoL = angular.copy(oriInfoL);
            $scope.MAForm.$setPristine();
        }

        $scope.infoChanged = function () {
            if(!angular.equals(oriInfoH, $scope.infoH) == false && !angular.equals(oriInfoL,$scope.infoL) == false)
            {
                return  false;
            }else{
                return true;
            }
        }

        DocumentService.checkMA(Patient_ID,CalID).then(function(response){
            if(response['status'] === 'fail') {
                $scope.isNew = true;
                DocumentService.newMA(Patient_ID,CalID).then(function(response){
                    DocumentService.loadMA(Patient_ID,CalID).then(function(response){
                        if(response['status'] === 'fail') {
                            alert("load fail!");
                        }
                        else
                        {
                            var data = response[0];
                            var dataH = data.Header[0];
                            $scope.listMA.push({ "header_name": dataH.DESCRIPTION,"header_id" : dataH.MA_ID, "group":[]});
                            var i = 0;
                            angular.forEach(data.Group, function(dataG){
                                if(dataG.MA_ID ==  $scope.listMA[0].header_id  )
                                {
                                    $scope.listMA[0].group.push({"group_id" : dataG.GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                                    angular.forEach(data.Line, function(dataL){
                                        if(dataL.GROUP_ID ==  $scope.listMA[0].group[i].group_id )
                                        {
                                            $scope.listMA[0].group[i].line.push({ "line_id" : dataL.MA_LINE_ID,"line_name": dataL.QUESTION, "value1" : dataL.VAL1_NAME, "value2" : dataL.VAL2_NAME, "yesno" : dataL.YES_NO });
                                            $scope.infoL.YES_NO_VAL[dataL.MA_LINE_ID]= dataL.YES_NO_VAL;
                                            $scope.infoL.VAL1[dataL.MA_LINE_ID] = dataL.VAL1;
                                            $scope.infoL.VAL2[dataL.MA_LINE_ID] = dataL.VAL2;
                                            $scope.infoL.VAL3[dataL.MA_LINE_ID] = dataL.VAL3;
                                            $scope.infoL.COMMENTS[dataL.MA_LINE_ID] = dataL.COMMENTS;
                                        }
                                    });
                                    i++;
                                }
                            });
                            oriInfoL  = angular.copy($scope.infoL);
                        }
                    });
                });
            }else
            {
                $scope.isNew = false;
                $scope.infoH = {
                    Patient_id : response.Patient_id,
                    HEIGHT : response.HEIGHT,
                    WEIGHT: response.WEIGHT,
                    BMI: response.BMI * 1,
                    URINALYSIS: response.URINALYSIS,
                    BSL : response.BSL,
                    WAIST_CIR : response.WAIST_CIR,
                    HIP_CIR : response.HIP_CIR,
                    WAIST_TO_HIP_RATE : response.WAIST_TO_HIP_RATE,
                    RISK : response.RISK,
                    DIST_RIGHT_EYE : response.DIST_RIGHT_EYE,
                    DIST_RIGHT_EYE_CORRECTED : response.DIST_RIGHT_EYE_CORRECTED,
                    DIST_LEFT_EYE : response.DIST_LEFT_EYE,
                    DIST_LEFT_EYE_CORRECTED : response.DIST_LEFT_EYE_CORRECTED,
                    NEAR_RIGHT_EYE : response.NEAR_RIGHT_EYE,
                    NEAR_RIGHT_EYE_CORRECTED : response.NEAR_RIGHT_EYE_CORRECTED,
                    NEAR_LEFT_EYE : response.NEAR_LEFT_EYE,
                    NEAR_LEFT_EYE_CORRECTED : response.NEAR_LEFT_EYE_CORRECTED,
                    PERIPHERAL_VISION : response.PERIPHERAL_VISION,
                    VISUAL_AIDS : response.VISUAL_AIDS,
                    VISUAL_AIDS_TYPE : response.VISUAL_AIDS_TYPE,
                    COLOR_VISUAL : response.COLOR_VISUAL,
                    COLOR_VISUAL_SCORE : response.COLOR_VISUAL_SCORE,
                    ISWOULD : response.ISWOULD,
                    COMMENTS: response.COMMENTS,
                    FINAL_ASS : response.FINAL_ASS,
                    COMMENTS2: response.COMMENTS2,
                    DOCTOR_NAME: response.DOCTOR_NAME,
                    SIGN  : response.SIGN,
                    HA_DATE : response.HA_DATE,
                    LOCATION_ID : response.LOCATION_ID,
                    QUEST_DF_ID : response.QUEST_DF_ID,
                    Created_by : response.Created_by,
                    Last_updated_by : response.Last_updated_by,
                    CAL_ID : response.CAL_ID,
                    DF_CODE : response.DF_CODE,
                    ISENABLE : response.ISENABLE,
                    IS_URINALYSIS : response.IS_URINALYSIS,
                    EXAMINED_COMMENT: response.EXAMINED_COMMENT,
                    IS_CANDIDATE_CAN_UNDERTAKE : response.IS_CANDIDATE_CAN_UNDERTAKE,
                    IS_CANDIDATE_BE_ADVERSELY_AFFECTED : response.IS_CANDIDATE_BE_ADVERSELY_AFFECTED,
                    CANDIDATE_CAN_UNDERTAKE_COMMENT: response.CANDIDATE_CAN_UNDERTAKE_COMMENT,
                    CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT: response.CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT,
                    DESCRIPTION : response.DESCRIPTION
                };

                oriInfoH  = angular.copy($scope.infoH);
                DocumentService.loadMA(Patient_ID,CalID).then(function(response){
                    if(response['status'] === 'fail') {
                        alert("load fail!");
                    }
                    else
                    {
                        var data = response[0];
                        var dataH = data.Header[0];
                        $scope.listMA.push({ "header_name": dataH.DESCRIPTION,"header_id" : dataH.MA_ID, "group":[]});
                        var i = 0;
                        angular.forEach(data.Group, function(dataG){
                            if(dataG.MA_ID ==  $scope.listMA[0].header_id  )
                            {
                                $scope.listMA[0].group.push({"group_id" : dataG.GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                                angular.forEach(data.Line, function(dataL){
                                    if(dataL.GROUP_ID ==  $scope.listMA[0].group[i].group_id )
                                    {
                                        $scope.listMA[0].group[i].line.push({ "line_id" : dataL.MA_LINE_ID,"line_name": dataL.QUESTION, "value1" : dataL.VAL1_NAME, "value2" : dataL.VAL2_NAME, "yesno" : dataL.YES_NO });
                                        $scope.infoL.YES_NO_VAL[dataL.MA_LINE_ID]= dataL.YES_NO_VAL;
                                        $scope.infoL.VAL1[dataL.MA_LINE_ID] = dataL.VAL1;
                                        $scope.infoL.VAL2[dataL.MA_LINE_ID] = dataL.VAL2;
                                        $scope.infoL.VAL3[dataL.MA_LINE_ID] = dataL.VAL3;
                                        $scope.infoL.COMMENTS[dataL.MA_LINE_ID] = dataL.COMMENTS;
                                    }
                                });
                                i++;
                            }
                        });
                        oriInfoL  = angular.copy($scope.infoL);
                    }
                });

            }
        });




    });




