
angular.module('app.loggedIn.document.MA.controllers',['fcsa-number'])
    .controller("MAController",function($scope,DocumentService,$http,$cookieStore,$state,toastr,$stateParams,localStorageService) {
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

//        $scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
//        var doctorInfo = $cookieStore.get('doctorInfo');
//        console.log($scope.patientInfo);
        var Patient_ID = $scope.patientInfo.Patient_id;
        var CalID = -1; // $scope.apptInfo.CAL_ID;
        var sex = $scope.patientInfo.Sex;

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
        var insert = true;
        DocumentService.checkMA(Patient_ID,CalID).then(function(response){
            if(response['status'] === 'new') {
                $scope.isNew = true;
                insert = true;

            }else if(response['status'] === 'update')
            {
                insert = false;
                $scope.isNew = false;

            }else{
                toastr.error("Fail", "Error");
                return;
            }

            var data = response.data[0];
            var dataH = data.Header[0];
            $scope.listMA.push({ "header_name": dataH.DESCRIPTION,"header_id" : dataH.MA_ID, "group":[]});
            var i = 0;
            angular.forEach(data.Group, function(dataG){
                if(dataG.MA_ID ==  $scope.listMA[0].header_id)
                {
                    $scope.listMA[0].group.push({"group_id" : dataG.GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                    angular.forEach(data.Line, function(dataL){
                        if(dataL.GROUP_ID ==  $scope.listMA[0].group[i].group_id )
                        {
                            $scope.listMA[0].group[i].line.push({ "line_id" : dataL.MA_LINE_ID,"line_name": dataL.QUESTION, "value1" : dataL.VAL1_NAME, "value2" : dataL.VAL2_NAME, "yesno" : dataL.YES_NO });
                            if(insert == false){
                                $scope.infoL.YES_NO_VAL[dataL.MA_LINE_ID]= dataL.YES_NO_VAL;
                                $scope.infoL.VAL1[dataL.MA_LINE_ID] = dataL.VAL1;
                                $scope.infoL.VAL2[dataL.MA_LINE_ID] = dataL.VAL2;
                                $scope.infoL.VAL3[dataL.MA_LINE_ID] = dataL.VAL3;
                                $scope.infoL.COMMENTS[dataL.MA_LINE_ID] = dataL.COMMENTS;
                            }
                        }
                    });
                    i++;
                }
            });
            if(insert == false){
                $scope.infoH = {
                    MA_ID : dataH.MA_ID,
                    Patient_id : dataH.Patient_id,
                    HEIGHT : dataH.HEIGHT,
                    WEIGHT: dataH.WEIGHT,
                    BMI:  dataH.BMI == null ? NaN : dataH.BMI * 1,
                    URINALYSIS: dataH.URINALYSIS,
                    BSL : dataH.BSL,
                    WAIST_CIR : dataH.WAIST_CIR,
                    HIP_CIR : dataH.HIP_CIR,
                    WAIST_TO_HIP_RATE : dataH.WAIST_TO_HIP_RATE,
                    RISK : dataH.RISK,
                    DIST_RIGHT_EYE : dataH.DIST_RIGHT_EYE,
                    DIST_RIGHT_EYE_CORRECTED : dataH.DIST_RIGHT_EYE_CORRECTED,
                    DIST_LEFT_EYE : dataH.DIST_LEFT_EYE,
                    DIST_LEFT_EYE_CORRECTED : dataH.DIST_LEFT_EYE_CORRECTED,
                    NEAR_RIGHT_EYE : dataH.NEAR_RIGHT_EYE,
                    NEAR_RIGHT_EYE_CORRECTED : dataH.NEAR_RIGHT_EYE_CORRECTED,
                    NEAR_LEFT_EYE : dataH.NEAR_LEFT_EYE,
                    NEAR_LEFT_EYE_CORRECTED : dataH.NEAR_LEFT_EYE_CORRECTED,
                    PERIPHERAL_VISION : dataH.PERIPHERAL_VISION,
                    VISUAL_AIDS : dataH.VISUAL_AIDS,
                    VISUAL_AIDS_TYPE : dataH.VISUAL_AIDS_TYPE,
                    COLOR_VISUAL : dataH.COLOR_VISUAL,
                    COLOR_VISUAL_SCORE : dataH.COLOR_VISUAL_SCORE,
                    ISWOULD : dataH.ISWOULD,
                    COMMENTS: dataH.COMMENTS,
                    FINAL_ASS : dataH.FINAL_ASS,
                    COMMENTS2: dataH.COMMENTS2,
                    DOCTOR_NAME: dataH.DOCTOR_NAME,
                    SIGN  : dataH.SIGN,
                    HA_DATE : dataH.HA_DATE,
                    LOCATION_ID : dataH.LOCATION_ID,
                    QUEST_DF_ID : dataH.QUEST_DF_ID,
                    Created_by : dataH.Created_by,
                    Last_updated_by : dataH.Last_updated_by,
                    CAL_ID : dataH.CAL_ID,
                    DF_CODE : dataH.DF_CODE,
                    ISENABLE : dataH.ISENABLE,
                    IS_URINALYSIS : dataH.IS_URINALYSIS,
                    EXAMINED_COMMENT: dataH.EXAMINED_COMMENT,
                    IS_CANDIDATE_CAN_UNDERTAKE : dataH.IS_CANDIDATE_CAN_UNDERTAKE,
                    IS_CANDIDATE_BE_ADVERSELY_AFFECTED : dataH.IS_CANDIDATE_BE_ADVERSELY_AFFECTED,
                    CANDIDATE_CAN_UNDERTAKE_COMMENT: dataH.CANDIDATE_CAN_UNDERTAKE_COMMENT,
                    CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT: dataH.CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT,
                    DESCRIPTION : dataH.DESCRIPTION
                };
                oriInfoH  = angular.copy($scope.infoH);
                oriInfoL  = angular.copy($scope.infoL);
            }
        });

        $scope.submitMA = function(MAForm){
            $scope.showClickedValidation = true;
            if(MAForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                if (insert == true) {
                    DocumentService.insertMA($scope.infoL,$scope.infoH).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Add new success!", "Success");
                            $scope.isNew = false;
                            $state.go('loggedIn.MA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Add new fail!", "Error");
                        }
                    });
                } else {
                    DocumentService.updateMA($scope.infoL,$scope.infoH).then(function(response){
                        if(response['status'] === 'success') {
                            toastr.success("Successfully","Success");
                            $state.go('loggedIn.MA', null, {'reload': true});
                        }
                        else
                        {
                            toastr.error("Fail", "Error");
                        }
                    });
                }

            }
        };


    });




