angular.module('app.loggedIn.document.gorgonFA.controllers', [])
    .controller("gorgonFAController", function ($scope, $filter, DocumentService,ConfigService, $http, $cookieStore, $state, toastr, $window, $stateParams, localStorageService) {
        // Start Signature
        var tempSignature;
        var oriInfo;
        $scope.isSignature = false;
        $scope.showSignature = function () {
            $scope.isSignature = !$scope.isSignature;
        }

        $scope.cancelClick = function () {
            $scope.isSignature = !$scope.isSignature;
            $scope.info.fsign = tempSignature;
        };
        $scope.clearClick = function () {
            $scope.info.fsign = '';
        };
        $scope.okClick = function () {
            $scope.isSignature = !$scope.isSignature;
            tempSignature = $scope.info.fsign;
        }
        // End Signature
        //============================================================================
        //Set Date Start
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //Set Date End
        //============================================================================
        var date = new Date();
        var today = $filter('date')(date, 'dd/MM/yyyy');

        function getAge(dateString) {
            var now = new Date();
            var birthDate = new Date(dateString);
            var age = now.getFullYear() - birthDate.getFullYear();
            var m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        //$scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        //var doctorInfo = $cookieStore.get('doctorInfo');
        var Patient_ID = $scope.patientInfo.Patient_id;
        var CalID = -1; // $scope.apptInfo.CAL_ID;
        var sex = $scope.patientInfo.Sex;
        //============================================================================
        // Math on interface
        $scope.print = function(){
            $window.location.href = '/api/document/gorgonFA/print/7';
        }
        var value;
        $scope.grip = function(){
            value = 0;
            if($scope.info.c_Right3 > 0 || $scope.info.c_Left3 > 0)
            {
                if($scope.info.c_Right3 * 1 >= $scope.info.c_Left3)
                {
                    value = $scope.info.c_Right3;
                }else if ($scope.info.c_Right3*1 < $scope.info.c_Left3) {
                    value = $scope.info.c_Left3;
                }
                if(sex == "Male")
                {
                    if(value < 40)
                    {
                        $scope.info.c_Result3 = 1;
                    }else if(value >= 40 && value <= 45)
                    {
                        $scope.info.c_Result3 = 2;
                    }else if(value >= 46 && value <= 51)
                    {
                        $scope.info.c_Result3 = 3;
                    }else if(value >= 52 && value <= 55)
                    {
                        $scope.info.c_Result3 = 4;
                    }else if(value > 55)
                    {
                        $scope.info.c_Result3 = 5;
                    }
                }else if(sex == "Female")
                {
                    if(value < 23)
                    {
                        $scope.info.c_Result3 = 1;
                    }else if(value >= 23 && value <= 26)
                    {
                        $scope.info.c_Result3 = 2;
                    }else if(value >= 27 && value <= 29)
                    {
                        $scope.info.c_Result3 = 3;
                    }else if(value >= 30 && value <= 33)
                    {
                        $scope.info.c_Result3 = 4;
                    }else if(value > 33)
                    {
                        $scope.info.c_Result3 = 5;
                    }
                }
            } else if ($scope.info.c_Left3 == '') {
                $scope.info.c_Result3 = 0;
            } else if ($scope.info.c_Left3 == null) {
                $scope.info.c_Result3 = 0;
            }else if($scope.info.c_Right3 == '')
            {
                $scope.info.c_Result3 = 0;
            }else if($scope.info.c_Right3 == null)
            {
                $scope.info.c_Result3 = 0;
            }
        };

        $scope.d_Push_ups = function () {
            value = $scope.info.d_Push_ups_total3;
            if(value > 0)
            {
                if (sex == "Male") {
                    if (value >= 1 && value <= 5) {
                        $scope.info.d_Result3 = 1;
                    } else if (value >= 6 && value <= 8) {
                        $scope.info.d_Result3 = 2;
                    } else if (value >= 9 && value <= 12) {
                        $scope.info.d_Result3 = 3;
                    } else if (value >= 13 && value <= 15) {
                        $scope.info.d_Result3 = 4;
                    } else if (value > 15) {
                        $scope.info.d_Result3 = 5;
                    }
                } else if(sex == "Female") {
                    if (value >= 1 && value <= 2) {
                        $scope.info.d_Result3 = 1;
                    } else if (value >= 3 && value <= 4) {
                        $scope.info.d_Result3 = 2;
                    } else if (value >= 5 && value <= 6) {
                        $scope.info.d_Result3 = 3;
                    } else if (value >= 7 && value <= 10) {
                        $scope.info.d_Result3 = 4;
                    } else if (value > 10) {
                        $scope.info.d_Result3 = 5;
                    }
                }
            }else{
                $scope.info.d_Result3 = 0;
            }
        };

        $scope.e_total3 = function(){
            value = $scope.info.e_total3;
            if(!!value){
                if(value >= 0 && value <=30)
                {
                    $scope.info.e_Result3 = 1;
                }else if(value > 30 && value <= 60)
                {
                    $scope.info.e_Result3 = 2;
                }else if(value > 60 && value <= 90)
                {
                    $scope.info.e_Result3 = 3;
                }else if(value > 90 && value <= 120)
                {
                    $scope.info.e_Result3 = 4;
                }else if(value > 120 )
                {
                    $scope.info.e_Result3 = 5;
                }
            }else{
                $scope.info.e_Result3 = null;
            }
        };

        $scope.aSec4 = function(){
            value = $scope.info.aSec4;
            if(!!value){
                if(value == 0){
                    $scope.info.aResult4 = 1;
                }else if( value >= 1 && value <= 20){
                    $scope.info.aResult4 = 2;
                }else if( value >= 21 && value <= 40){
                    $scope.info.aResult4 = 3;
                }else if( value >= 41 && value <= 60){
                    $scope.info.aResult4 = 4;
                }else if( value > 60){
                    $scope.info.aResult4 = 5;
                }
            }else{
                $scope.info.aResult4 = null;
            }
        };

        $scope.bTotal4 = function(){
            value = $scope.info.bTotal4;
            if(!!value) {
                if(value == 0){
                    $scope.info.bResult4 = 1;
                }else if( value >= 1 && value <= 9){
                    $scope.info.bResult4 = 2;
                }else if( value >= 10 && value <= 14){
                    $scope.info.bResult4 = 3;
                }else if( value >= 15 && value <= 19){
                    $scope.info.bResult4 = 4;
                }else if( value >= 20){
                    $scope.info.bResult4 = 5;
                }
            }else{
                $scope.info.bResult4 = null;
            }
        };

        $scope.cKneeling4 = function(){
            value = $scope.info.cKneeling4;
            if(!!value){
                if(value == 0){
                    $scope.info.cResult4 = 1;
                }else if( value >= 1 && value <= 10){
                    $scope.info.cResult4 = 2;
                }else if( value >= 11 && value <= 20){
                    $scope.info.cResult4 = 3;
                }else if( value >= 21 && value <= 30){
                    $scope.info.cResult4 = 4;
                }else if( value > 30){
                    $scope.info.cResult4 = 5;
                }
            }else{
                $scope.info.cResult4 = null;
            }
        };

        $scope.aMax = function () {
            value = $scope.info.aMax6;
            if(!!value)
            {
                if (value > 45) {
                    $scope.info.aResult6 = 5;
                } else if (value >= 23 && value <= 45) {
                    $scope.info.aResult6 = 4;
                } else if (value >= 10 && value <= 22) {
                    $scope.info.aResult6 = 3;
                } else if (value >= 6 && value <= 9) {
                    $scope.info.aResult6 = 2;
                } else if (value >= 0 && value <= 5) {
                    $scope.info.aResult6 = 1;
                }
            }else
            {
                $scope.info.aResult6 = null;
            }
        };

        $scope.bMax = function () {
            value =  $scope.info.bMax6;
            if(!!value)
            {
                if (value > 23) {
                    $scope.info.bResult6 = 5;
                } else if (value >= 12 && value <= 23) {
                    $scope.info.bResult6 = 4;
                } else if (value >= 6 && value <= 11) {
                    $scope.info.bResult6 = 3;
                } else if (value >= 4 && value <= 5) {
                    $scope.info.bResult6 = 2;
                } else if (value >= 0 && value <= 3) {
                    $scope.info.bResult6 = 1;
                }
            }else
            {
                $scope.info.bResult6 = null;
            }
        };

        $scope.cStrenght5 = function () {
            value = $scope.info.cStrenght5;
            if(!!value)
            {
                if (value == 0) {
                    $scope.info.cResult5 = 1;
                } else if (value >= 1 && value <= 20) {
                    $scope.info.cResult5 = 2;
                } else if (value >= 21 && value <= 40) {
                    $scope.info.cResult5 = 3;
                } else if (value >= 41 && value <= 60) {
                    $scope.info.cResult5 = 4;
                } else if (value > 60) {
                    $scope.info.cResult5 = 5;
                }
            }else
            {
                $scope.info.cResult5 = null;
            }
        };

        $scope.dTotal5 = function () {
            value =  $scope.info.dTotal5;
            if(!!value)
            {
                if (value == 0) {
                    $scope.info.dResult5 = 1;
                } else if (value >= 1 && value <= 5) {
                    $scope.info.dResult5 = 2;
                } else if (value > 5 && value <= 10) {
                    $scope.info.dResult5 = 3;
                } else if (value >= 11 && value <= 15) {
                    $scope.info.dResult5 = 4;
                } else if (value > 15) {
                    $scope.info.dResult5 = 5;
                }
            }else
            {
                $scope.info.dResult5 = null;
            }
        };
        var len,totalCom = '',str;
        $scope.collectComment = function () {
            $scope.info.LComment= (($scope.info.Rom_Comments1 != null && $scope.info.Rom_Comments1 != '') ? $scope.info.Rom_Comments1 + '\n' : '')  + (($scope.info.Comments2 != null && $scope.info.Comments2 != '') ? $scope.info.Comments2 + '\n' : '')+ totalCom;
        };

        $scope.totalComment = function(){
            if(typeof $scope.info.LComment === "undefined"){
                $scope.info.LComment= (($scope.info.Rom_Comments1 != null && $scope.info.Rom_Comments1 != '') ? $scope.info.Rom_Comments1 + '\n' : '')  + (($scope.info.Comments2 != null && $scope.info.Comments2 != '') ? $scope.info.Comments2 + '\n' : '');
            }
            len = ($scope.info.Rom_Comments1 != null ? $scope.info.Rom_Comments1.length : 0) + ($scope.info.Comments2 != null ? $scope.info.Comments2.length : 0);
            str = $scope.info.LComment.replace('\n','');
            str = str.replace('\n','');
            totalCom  = str.substr(len);
        }

        //=============================================================================
        $scope.maxDateDOB = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
        $scope.maxDate = date;

        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.gorgonFAForm.$setPristine();
        };

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        };

        //============================================INSERT && UPDATE===============================
        var insert = true;

        DocumentService.checkGorgonFA(Patient_ID, CalID).then(function (response) {
            if(response['status'] == 'not'){
                toastr.error("You have to make Pre-employment Health Assessment first", "Error");
                $state.go('loggedIn.gorgonMA', null, {'reload': true});
            }else if (response['status'] === 'insert') {
                insert = true;
                $scope.isNew = true;
                $scope.info = {
                    id: null,
                    patientId: Patient_ID,
                    fName: $scope.patientInfo.First_name + " " + $scope.patientInfo.Sur_name + " " + $scope.patientInfo.Middle_name,
                    age: null,
                    JAF: null,
                    DOB: $scope.patientInfo.DOB,
                    DOA: date,
                    IsConsentReason: null,
                    fsign: null,
                    fsignDate: date,
                    Estimated: null,
                    EstimatedComments: null,
                    MS_HeartConditions: null,
                    MS_HeartConditions_Comment: null,
                    MS_Lung_Asthma: null,
                    MS_Lung__Asthma_Comment: null,
                    MS_Diabetes: null,
                    MS_Diabetes_Comment: null,
                    MS_Fits: null,
                    MS_Fits_Comment: null,
                    MS_Medication: null,
                    MS_Medication_Comment: null,
                    MS_Other: null,
                    MS_Other_Comment: null,
                    MS_ie_Comment: null,
                    MS_Mx_Heart_Rage_1: $scope.patientInfo.DOB != null ?  getAge($scope.patientInfo.DOB) : 0,
                    MS_Mx_Heart_Rage_2: null,
                    MS_Mx_Weight_1: response['data'].WEIGHT,
                    MS_MX_Weight_2: null,
                    MS_Blood_Pressure_1: response['data'].SYSTOLIC_BP,
                    MS_Blood_Pressure_2: response['data'].DIASTOLIC_BP,
                    MS_Resting_Heart_Rate: response['data'].PULSE,
                    Rom_Neck1: null,
                    Rom_Thoracic1: null,
                    Rom_Lumbar1: null,
                    Rom_Shoulder1: null,
                    Rom_Elbow1: null,
                    Rom_Wrist1: null,
                    Rom_Fingers1: null,
                    Rom_Hips1: null,
                    Rom_Knees1: null,
                    Rom_Ankles1: null,
                    Rom_Comments1: null,
                    Rom_Total1: 0,
                    Heart_Rate_30S2: null,
                    Heart_Rate_1M2: null,
                    Heart_Rate_1M_30S2: null,
                    Heart_Rate_2M2: null,
                    Heart_Rate_2M_30S2: null,
                    Heart_Rate_3M2: null,
                    Heart_Rate_1M_Post2: null,
                    Step_Result2: null,
                    Step_Correct2: null,
                    Comments2: null,
                    Total2: null,
                    a_Right3: null,
                    a_Left3: null,
                    b_Right3: null,
                    b_Left3: null,
                    c_Grip3: null,
                    c_Right3: null,
                    c_Left3: null,
                    c_Result3: 0,//
                    d_Push_ups_total3: null,
                    d_Result3: 0,//
                    e_total3: null,
                    e_Result3: 0,//
                    Comments3: null,
                    Total3: 0,
                    aSec4: null,//
                    aResult4: null,//
                    bTotal4: null,
                    bCrepitus4: null,
                    bResult4: null,//
                    cKneeling4: null,
                    cResult4: null, //
                    Comments4: null,
                    Total4: 0,
                    aPosture5: null,
                    bHoverResult5: null,
                    cStrenght5: null,
                    cResult5: null,//
                    dTotal5: null,
                    dResult5: null,//
                    eWaitesBow5: null,
                    eResult5: null,//
                    fRight5: null,
                    fLeft5: null,
                    gRight5: null,
                    gFloat5: null,
                    Total5: 0,
                    aMax6: null,
                    aResult6: null,
                    bMax6: null,
                    bResult6: null,
                    c_16: 0,
                    c_1Comment6: null,
                    c_26: 0,
                    c_2Comment6: null,
                    c_36: 0,
                    c_3Comment6: null,
                    c_46: 0,
                    c_4Comment6: null,
                    c_56: 0,
                    c_5Comment6: null,
                    Comments6: null,
                    Total6: 0,
                    Score1Comment: null,
                    Score2Comment: null,
                    Score3Comment: null,
                    Score4Comment: null,
                    Score5Comment: null,
                    Score6Comment: null,
                    Score7Comment: null,
                    Score8Comment: null,
                    FCAToTal: 0,
                    FCAResult: null,
                    LEPDC: null,
                    LAPC: null,
                    LComment: null,
                    DocId : response['docID'],
                    LName : response['docName'],
                    LPosition : null,
                    Chest : 0,
                    Lsign: response['docSign'],
                    LDate : date ,
                    Created_by: null,
                    //Creation_date : null,
                    Last_updated_by: null,
                    //Last_update_date : null,
                    CalId: CalID
                };
                oriInfo = angular.copy($scope.info);
            }else if(response['status'] == 'update'){
                insert = false;
                $scope.isNew = false;
                $scope.info = {
                    id: response['data']['id'],
                    patientId: response['data']['patientId'],
                    fName: response['data']['fName'],
                    JAF: response['data']['JAF'],
                    DOB: response['data']['DOB'],
                    DOA: response['data']['DOA'],
                    IsConsentReason: response['data']['IsConsentReason'],
                    fsign: response['data']['fsign'],
                    fsignDate: response['data']['fsignDate'],
                    Estimated: response['data']['Estimated'],
                    EstimatedComments: response['data']['EstimatedComments'],
                    MS_HeartConditions: response['data']['MS_HeartConditions'],
                    MS_HeartConditions_Comment: response['data']['MS_HeartConditions_Comment'],
                    MS_Lung_Asthma: response['data']['MS_Lung_Asthma'],
                    MS_Lung__Asthma_Comment: response['data']['MS_Lung__Asthma_Comment'],
                    MS_Diabetes: response['data']['MS_Diabetes'],
                    MS_Diabetes_Comment: response['data']['MS_Diabetes_Comment'],
                    MS_Fits: response['data']['MS_Fits'],
                    MS_Fits_Comment: response['data']['MS_Fits_Comment'],
                    MS_Medication: response['data']['MS_Medication'],
                    MS_Medication_Comment: response['data']['MS_Medication_Comment'],
                    MS_Other: response['data']['MS_Other'],
                    MS_Other_Comment: response['data']['MS_Other_Comment'],
                    MS_ie_Comment: response['data']['MS_ie_Comment'],
                    MS_Mx_Heart_Rage_1: response['data']['MS_Mx_Heart_Rage_1'],
                    MS_Mx_Heart_Rage_2: response['data']['MS_Mx_Heart_Rage_2'],
                    MS_Mx_Weight_1: response['data']['MS_Mx_Weight_1'],
                    MS_MX_Weight_2: response['data']['MS_MX_Weight_2'],
                    MS_Blood_Pressure_1: response['data']['MS_Blood_Pressure_1'],
                    MS_Blood_Pressure_2: response['data']['MS_Blood_Pressure_2'],
                    MS_Resting_Heart_Rate: response['data']['MS_Resting_Heart_Rate'],
                    Rom_Neck1: response['data']['1Rom_Neck'],
                    Rom_Thoracic1: response['data']['1Rom_Thoracic'],
                    Rom_Lumbar1: response['data']['1Rom_Lumbar'],
                    Rom_Shoulder1: response['data']['1Rom_Shoulder'],
                    Rom_Elbow1: response['data']['1Rom_Elbow'],
                    Rom_Wrist1: response['data']['1Rom_Wrist'],
                    Rom_Fingers1: response['data']['1Rom_Fingers'],
                    Rom_Hips1: response['data']['1Rom_Hips'],
                    Rom_Knees1: response['data']['1Rom_Knees'],
                    Rom_Ankles1: response['data']['1Rom_Ankles'],
                    Rom_Comments1: response['data']['1Rom_Comments'],
                    Rom_Total1: response['data']['1Rom_Total'],
                    Heart_Rate_30S2: response['data']['2Heart_Rate_30S'],
                    Heart_Rate_1M2: response['data']['2Heart_Rate_1M'],
                    Heart_Rate_1M_30S2: response['data']['2Heart_Rate_1M_30S'],
                    Heart_Rate_2M2: response['data']['2Heart_Rate_2M'],
                    Heart_Rate_2M_30S2: response['data']['2Heart_Rate_2M_30S'],
                    Heart_Rate_3M2: response['data']['2Heart_Rate_3M'],
                    Heart_Rate_1M_Post2: response['data']['2Heart_Rate_1M_Post'],
                    Step_Result2: response['data']['2Step_Result'],
                    Step_Correct2: response['data']['2Step_Correct'],
                    Comments2: response['data']['2Comments'],
                    Total2: response['data']['2Total'],
                    a_Right3: response['data']['3a_Right'],
                    a_Left3: response['data']['3a_Left'],
                    b_Right3: response['data']['3b_Right'],
                    b_Left3: response['data']['3b_Left'],
                    c_Grip3: response['data']['3c_Grip'],
                    c_Right3: response['data']['3c_Right'],
                    c_Left3: response['data']['3c_Left'],
                    c_Result3: response['data']['3c_Result'],
                    d_Push_ups_total3: response['data']['3d_Push_ups_total'],
                    d_Result3: response['data']['3d_Result'],
                    e_total3: response['data']['3e_total'],
                    e_Result3: response['data']['3e_Result'],
                    Comments3: response['data']['3Comments'],
                    Total3: response['data']['3Total'],
                    aSec4: response['data']['4aSec'],//
                    aResult4: response['data']['4aResult'],//
                    bTotal4: response['data']['4bTotal'],
                    bCrepitus4: response['data']['4bCrepitus'],
                    bResult4: response['data']['4bResult'],//
                    cKneeling4: response['data']['4cKneeling'],
                    cResult4: response['data']['4cResult'], //
                    Comments4: response['data']['4Comments'],
                    Total4: response['data']['4Total'],
                    aPosture5: response['data']['5aPosture'],
                    bHoverResult5: response['data']['5bHoverResult'],
                    cStrenght5: response['data']['5cStrenght'],
                    cResult5: response['data']['5cResult'],//
                    dTotal5: response['data']['5dTotal'],
                    dResult5: response['data']['5dResult'],//
                    eWaitesBow5: response['data']['5eWaitesBow'],
                    eResult5: response['data']['5eResult'],//
                    fRight5: response['data']['5fRight'],
                    fLeft5: response['data']['5fLeft'],
                    gRight5: response['data']['5gRight'],
                    gFloat5: response['data']['5gFloat'],
                    Total5: response['data']['5Total'],
                    aMax6: response['data']['6aMax'],
                    aResult6: response['data']['6aResult'],
                    bMax6: response['data']['6bMax'],
                    bResult6: response['data']['6bResult'],
                    c_16: response['data']['6c_1'],
                    c_1Comment6: response['data']['6c_1Comment'],
                    c_26: response['data']['6c_2'],
                    c_2Comment6: response['data']['6c_2Comment'],
                    c_36: response['data']['6c_3'],
                    c_3Comment6: response['data']['6c_3Comment'],
                    c_46: response['data']['6c_4'],
                    c_4Comment6: response['data']['6c_4Comment'],
                    c_56: response['data']['6c_5'],
                    c_5Comment6: response['data']['6c_5Comment'],
                    Comments6: response['data']['6Comments'],
                    Total6: response['data']['6Total'],
                    Score1Comment: response['data']['Score1Comment'],
                    Score2Comment: response['data']['Score2Comment'],
                    Score3Comment: response['data']['Score3Comment'],
                    Score4Comment: response['data']['Score4Comment'],
                    Score5Comment: response['data']['Score5Comment'],
                    Score6Comment: response['data']['Score6Comment'],
                    Score7Comment: response['data']['Score7Comment'],
                    Score8Comment: response['data']['Score8Comment'],
                    FCAToTal: response['data']['FCAToTal'],
                    FCAResult: response['data']['FCAResult'],
                    LEPDC: response['data']['LEPDC'],
                    LAPC: response['data']['LAPC'],
                    LComment: response['data']['LComment'],
                    Created_by: response['data']['Created_by'],
                    Lsign : response['data']['Lsign'],
                    LName : response['data']['LName'],
                    LDate : response['data']['LDate'],
                    LPosition : response['data']['LPosition'],
                    Chest : response['data']['Chest'],
                    //Creation_date : response['data'][''],
                    Last_updated_by: response['data']['Last_updated_by'],
                    //Last_update_date : response['data'][''],
                    CalId: response['data']['CalId'],
                    DocId: response['data']['DocId']
                };
                oriInfo = angular.copy($scope.info);
                $scope.totalComment();
            }else if(response['status'] == 'error'){
                toastr.error("Fail", "Error");
            }

        });
        $scope.submitGorgonFA = function (gorgonFAForm) {
            $scope.showClickedValidation = true;
            if (gorgonFAForm.$invalid) {
                toastr.error("Please Input All Required Information!", "Error");
            } else {
                if (insert == true) {
                    var info = $scope.info;
                    DocumentService.insertGorgonFA(info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Successfully", "Success");
                            $state.go('loggedIn.gorgonFA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Fail", "Error");
                        }
                    });
                } else {
                    DocumentService.editGorgonFA($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Successfully", "Success");
                            $state.go('loggedIn.gorgonFA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Fail", "Error");
                        }
                    });
                }
            }

        };
    });