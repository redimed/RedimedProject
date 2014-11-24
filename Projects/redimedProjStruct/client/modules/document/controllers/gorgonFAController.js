
angular.module('app.loggedIn.document.gorgonFA.controllers',[])
    .controller("gorgonFAController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,toastr,$window,$stateParams,localStorageService) {
        // Start Signature
        var tempSignature;
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
        //var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';
        var date = new Date();
        var today = $filter('date')(date,'dd/MM/yyyy');

        function getAge(dateString)
        {
            var now = new Date();
            var birthDate = new Date(dateString);
            var age = now.getFullYear() - birthDate.getFullYear();
            var m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate()))
            {
                age--;
            }
            return age;
        }

        //$scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        //var doctorInfo = $cookieStore.get('doctorInfo');
        var Patient_ID = $scope.patientInfo.Patient_id;
        var CalID = -1;//$scope.apptInfo.CAL_ID;
        var sex = $scope.patientInfo.Sex;
        //============================================================================
        // Math on interface
        $scope.c_Left3 = function(){
            if($scope.info.c_Grip3 == 1)
            {
                console.log($scope.info.c_Left3);
                if($scope.info.c_Left3 > 0)
                {
                    if(sex === "male")
                    {
                        if($scope.info.c_Left3 < 40)
                        {
                            $scope.info.c_Result3 = 1;
                        }else if($scope.info.c_Left3 >= 40 && $scope.info.c_Left3 <= 45)
                        {
                            $scope.info.c_Result3 = 2;
                        }else if($scope.info.c_Left3 >= 46 && $scope.info.c_Left3 <= 51)
                        {
                            $scope.info.c_Result3 = 3;
                        }else if($scope.info.c_Left3 >= 52 && $scope.info.c_Left3 <= 55)
                        {
                            $scope.info.c_Result3 = 4;
                        }else
                        {
                            $scope.info.c_Result3 = 5;
                        }
                    }else
                    {
                        if($scope.info.c_Left3 < 23)
                        {
                            $scope.info.c_Result3 = 1;
                        }else if($scope.info.c_Left3 >= 23 && $scope.info.c_Left3 <= 26)
                        {
                            $scope.info.c_Result3 = 2;
                        }else if($scope.info.c_Left3 >= 27 && $scope.info.c_Left3 <= 29)
                        {
                            $scope.info.c_Result3 = 3;
                        }else if($scope.info.c_Left3 >= 30 && $scope.info.c_Left3 <= 33)
                        {
                            $scope.info.c_Result3 = 4;
                        }else
                        {
                            $scope.info.c_Result3 = 5;
                        }
                    }
                }else if($scope.info.c_Left3 == '')
                {
                    $scope.info.c_Result3 = 0;
                }else if($scope.info.c_Left3 == null)
                {
                    $scope.info.c_Result3 = 0;
                }

            }

        };

        $scope.c_Right3 = function(){
            if($scope.info.c_Grip3 == 0)
            {
                if($scope.info.c_Right3 > 0)
                {
                    if(sex === "male")
                    {
                        if($scope.info.c_Right3 < 40)
                        {
                            $scope.info.c_Result3 = 1;
                        }else if($scope.info.c_Right3 >= 40 && $scope.info.c_Right3 <= 45)
                        {
                            $scope.info.c_Result3 = 2;
                        }else if($scope.info.c_Right3 >= 46 && $scope.info.c_Right3 <= 51)
                        {
                            $scope.info.c_Result3 = 3;
                        }else if($scope.info.c_Right3 >= 52 && $scope.info.c_Right3 <= 55)
                        {
                            $scope.info.c_Result3 = 4;
                        }else
                        {
                            $scope.info.c_Result3 = 5;
                        }
                    }else
                    {
                        if($scope.info.c_Right3 < 23)
                        {
                            $scope.info.c_Result3 = 1;
                        }else if($scope.info.c_Right3 >= 23 && $scope.info.c_Right3 <= 26)
                        {
                            $scope.info.c_Result3 = 2;
                        }else if($scope.info.c_Right3 >= 27 && $scope.info.c_Right3 <= 29)
                        {
                            $scope.info.c_Result3 = 3;
                        }else if($scope.info.c_Right3 >= 30 && $scope.info.c_Right3 <= 33)
                        {
                            $scope.info.c_Result3 = 4;
                        }else
                        {
                            $scope.info.c_Result3 = 5;
                        }
                    }
                }else if($scope.info.c_Right3 == '')
                {
                    $scope.info.c_Result3 = 0;
                }else if($scope.info.c_Right3 == null)
                {
                    $scope.info.c_Result3 = 0;
                }

            }

        };

        $scope.d_Push_ups = function(){
            if(sex === "male")
            {
                if($scope.info.d_Push_ups_total3 >= 1 && $scope.info.d_Push_ups_total3 <= 4)
                {
                    $scope.info.d_Result3 = 1;
                }else if($scope.info.d_Push_ups_total3 >= 5 && $scope.info.d_Push_ups_total3 <= 8)
                {
                    $scope.info.d_Result3 = 2;
                }else if($scope.info.d_Push_ups_total3 >= 9 && $scope.info.d_Push_ups_total3 <= 12)
                {
                    $scope.info.d_Result3 = 3;
                }else if($scope.info.d_Push_ups_total3 >= 13 && $scope.info.d_Push_ups_total3 <= 15)
                {
                    $scope.info.d_Result3 = 4;
                }else if($scope.info.d_Push_ups_total3 > 15)
                {
                    $scope.info.d_Result3 = 5;
                }
            }else
            {
                if($scope.info.d_Push_ups_total3 >= 1 && $scope.info.d_Push_ups_total3 <= 2)
                {
                    $scope.info.d_Result3 = 1;
                }else if($scope.info.d_Push_ups_total3 >= 3 && $scope.info.d_Push_ups_total3 <= 4)
                {
                    $scope.info.d_Result3 = 2;
                }else if($scope.info.d_Push_ups_total3 >= 5 && $scope.info.d_Push_ups_total3 <= 6)
                {
                    $scope.info.d_Result3 = 3;
                }else if($scope.info.d_Push_ups_total3 >= 7 && $scope.info.d_Push_ups_total3 <= 10)
                {
                    $scope.info.d_Result3 = 4;
                }else if($scope.info.d_Push_ups_total3 > 10)
                {
                    $scope.info.d_Result3 = 5;
                }
            }
        };

        $scope.aMax = function(){
            if($scope.info.aMax6 >= 0 && $scope.info.aMax6 <= 5)
            {
                $scope.info.aResult6 = 0;
            }else if($scope.info.aMax6 >= 6 && $scope.info.aMax6 <= 9)
            {
                $scope.info.aResult6 = 1;
            }else if($scope.info.aMax6 >= 10 && $scope.info.aMax6 <= 22)
            {
                $scope.info.aResult6 = 2;
            }else if($scope.info.aMax6 >= 23 && $scope.info.aMax6 <= 45)
            {
                $scope.info.aResult6 = 3;
            }else if($scope.info.aMax6 > 45)
            {
                $scope.info.aResult6 = 4;
            }
        };

        $scope.bMax = function(){
            if($scope.info.bMax6 >= 0 && $scope.info.bMax6 <= 3)
            {
                $scope.info.bResult6 = 0;
            }else if($scope.info.bMax6 >= 4 && $scope.info.bMax6 <= 5)
            {
                $scope.info.bResult6 = 1;
            }else if($scope.info.bMax6 >= 6 && $scope.info.bMax6 <= 11)
            {
                $scope.info.bResult6 = 2;
            }else if($scope.info.bMax6 >= 12 && $scope.info.bMax6 <= 23)
            {
                $scope.info.bResult6 = 3;
            }else if($scope.info.bMax6 > 23)
            {
                $scope.info.bResult6 = 4;
            }
        };
        //=============================================================================
        $scope.maxDateDOB = new Date(date.getFullYear() - 1,date.getMonth() ,date.getDate());
        $scope.maxDate = date;
        $scope.info = {
            id: null,
            patientId : Patient_ID,
            fName : $scope.patientInfo.First_name + " " + $scope.patientInfo.Sur_name + " " + $scope.patientInfo.Middle_name,
            age : getAge($scope.patientInfo.DOB),
            JAF : null,
            DOB : $scope.patientInfo.DOB,
            DOA : date,
            IsConsentReason : null,
            fsign : null,
            fsignDate : date,
            Estimated : null,
            EstimatedComments : null,
            MS_HeartConditions : null,
            MS_HeartConditions_Comment : null,
            MS_Lung_Asthma : null,
            MS_Lung__Asthma_Comment : null,
            MS_Diabetes : null,
            MS_Diabetes_Comment : null,
            MS_Fits : null,
            MS_Fits_Comment : null,
            MS_Medication : null,
            MS_Medication_Comment : null,
            MS_Other : null,
            MS_Other_Comment : null,
            MS_ie_Comment : null,
            MS_Mx_Heart_Rage_1 : null,
            MS_Mx_Heart_Rage_2 : null,
            MS_Mx_Weight_1 : null,
            MS_MX_Weight_2 : null,
            MS_Blood_Pressure_1 : null,
            MS_Blood_Pressure_2 : null,
            MS_Resting_Heart_Rate : null,
            Rom_Neck1 : null,
            Rom_Thoracic1 : null,
            Rom_Lumbar1 : null,
            Rom_Shoulder1 : null,
            Rom_Elbow1 : null,
            Rom_Wrist1 : null,
            Rom_Fingers1 : null,
            Rom_Hips1 : null,
            Rom_Knees1 : null,
            Rom_Ankles1 : null,
            Rom_Comments1 : null,
            Rom_Total1 : 0,
            Heart_Rate_30S2 : null,
            Heart_Rate_1M2 : null,
            Heart_Rate_1M_30S2 : null,
            Heart_Rate_2M2 : null,
            Heart_Rate_2M_30S2 : null,
            Heart_Rate_3M2 : null,
            Heart_Rate_1M_Post2 : null,
            Step_Result2 : null,
            Step_Correct2 : null,
            Comments2 : null,
            Total2 : 0,
            a_Right3 : null,
            a_Left3 : null,
            b_Right3 : null,
            b_Left3: null,
            c_Grip3 : null,
            c_Right3 : null,
            c_Left3 : null,
            c_Result3 : 0,//
            d_Push_ups_total3 : null,
            d_Result3 : 0,//
            e_total3 : null,
            e_Result3 : 0,//
            Comments3 : null,
            Total3 : 0,
            aSec4 : null,//
            aResult4 : null,//
            bTotal4 : null,
            bCrepitus4 : null,
            bResult4 : null,//
            cKneeling4 : null,
            cResult4 : null, //
            Comments4 : null,
            Total4 : 0,
            aPosture5 : null,
            bHoverResult5: null,
            cStrenght5 : null,
            cResult5 : null,//
            dTotal5 : null,
            dResult5 : null,//
            eWaitesBow5 : null,
            eResult5 : null,//
            fRight5 : null,
            fLeft5 : null,
            gRight5 : null,
            gFloat5 : null,
            Total5 : 0,
            aMax6 : null,
            aResult6 : null,
            bMax6 : null,
            bResult6 : null,
            c_16 : 0,
            c_1Comment6 : null,
            c_26 : 0,
            c_2Comment6 : null,
            c_36 : 0,
            c_3Comment6 : null,
            c_46 : 0,
            c_4Comment6 : null,
            c_56 : 0    ,
            c_5Comment6 : null,
            Comments6 : null,
            Total6 : 0,
            Score1Comment : null,
            Score2Comment : null,
            Score3Comment : null,
            Score4Comment : null,
            Score5Comment : null,
            Score6Comment : null,
            Score7Comment : null,
            Score8Comment : null,
            FCAToTal : null,
            FCAResult : null,
            LEPDC : null,
            LAPC : null,
            LComment : null,
            Lsign : null,
            LDate : date,
            LName : null,
            LPosition : null,
            Created_by : null,
            //Creation_date : null,
            Last_updated_by : null,
            //Last_update_date : null,
            CalId : CalID,
            DocId : null

        };

        var oriInfo = angular.copy($scope.info);

        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.gorgonFAForm.$setPristine();
        }

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        }

        //============================================INSERT && UPDATE===============================
        var insert = true;

        DocumentService.checkGorgonFA(Patient_ID,CalID).then(function(response){
            if(response['status'] === 'fail')
            {
                insert = true;
                $scope.isNew = true;
            }
            else
            {
                insert = false;
                $scope.isNew = false;
                $scope.info = {
                    id: response['id'],
                    patientId :response['patientId'],
                    fName : response['fName'],
                    age : getAge($scope.patientInfo.DOB),
                    JAF : response['JAF'],
                    DOB : response['DOB'],
                    DOA : response['DOA'],
                    IsConsentReason : response['IsConsentReason'],
                    fsign : response['fsign'],
                    fsignDate : response['fsignDate'],
                    Estimated : response['Estimated'],
                    EstimatedComments : response['EstimatedComments'],
                    MS_HeartConditions : response['MS_HeartConditions'],
                    MS_HeartConditions_Comment : response['MS_HeartConditions_Comment'],
                    MS_Lung_Asthma : response['MS_Lung_Asthma'],
                    MS_Lung__Asthma_Comment : response['MS_Lung__Asthma_Comment'],
                    MS_Diabetes : response['MS_Diabetes'],
                    MS_Diabetes_Comment : response['MS_Diabetes_Comment'],
                    MS_Fits : response['MS_Fits'],
                    MS_Fits_Comment : response['MS_Fits_Comment'],
                    MS_Medication : response['MS_Medication'],
                    MS_Medication_Comment : response['MS_Medication_Comment'],
                    MS_Other : response['MS_Other'],
                    MS_Other_Comment : response['MS_Other_Comment'],
                    MS_ie_Comment : response['MS_ie_Comment'],
                    MS_Mx_Heart_Rage_1 : response['MS_Mx_Heart_Rage_1'],
                    MS_Mx_Heart_Rage_2 : response['MS_Mx_Heart_Rage_2'],
                    MS_Mx_Weight_1 : response['MS_Mx_Weight_1'],
                    MS_MX_Weight_2 : response['MS_MX_Weight_2'],
                    MS_Blood_Pressure_1 : response['MS_Blood_Pressure_1'],
                    MS_Blood_Pressure_2 : response['MS_Blood_Pressure_2'],
                    MS_Resting_Heart_Rate : response['MS_Resting_Heart_Rate'],
                    Rom_Neck1 : response['1Rom_Neck'],
                    Rom_Thoracic1 : response['1Rom_Thoracic'],
                    Rom_Lumbar1 : response['1Rom_Lumbar'],
                    Rom_Shoulder1 : response['1Rom_Shoulder'],
                    Rom_Elbow1 : response['1Rom_Elbow'],
                    Rom_Wrist1 : response['1Rom_Wrist'],
                    Rom_Fingers1 : response['1Rom_Fingers'],
                    Rom_Hips1 : response['1Rom_Hips'],
                    Rom_Knees1 : response['1Rom_Knees'],
                    Rom_Ankles1 : response['1Rom_Ankles'],
                    Rom_Comments1 : response['1Rom_Comments'],
                    Rom_Total1 : response['1Rom_Total'],
                    Heart_Rate_30S2 : response['2Heart_Rate_30S'],
                    Heart_Rate_1M2 : response['2Heart_Rate_1M'],
                    Heart_Rate_1M_30S2 : response['2Heart_Rate_1M_30S'],
                    Heart_Rate_2M2 : response['2Heart_Rate_2M'],
                    Heart_Rate_2M_30S2 : response['2Heart_Rate_2M_30S'],
                    Heart_Rate_3M2 : response['2Heart_Rate_3M'],
                    Heart_Rate_1M_Post2 : response['2Heart_Rate_1M_Post'],
                    Step_Result2 : response['2Step_Result'],
                    Step_Correct2 : response['2Step_Correct'],
                    Comments2 : response['2Comments'],
                    Total2 : response['2Total'],
                    a_Right3 : response['3a_Right'],
                    a_Left3 : response['3a_Left'],
                    b_Right3 : response['3b_Right'],
                    b_Left3: response['3b_Left'],
                    c_Grip3 : response['3c_Grip'],
                    c_Right3 : response['3c_Right'],
                    c_Left3 : response['3c_Left'],
                    c_Result3 : response['3c_Result'],
                    d_Push_ups_total3 : response['3d_Push_ups_total'],
                    d_Result3 : response['3d_Result'],
                    e_total3 : response['3e_total'],
                    e_Result3 : response['3e_Result'],
                    Comments3 : response['3Comments'],
                    Total3 : response['3Total'],
                    aSec4 : response['4aSec'],//
                    aResult4 : response['4aResult'],//
                    bTotal4 : response['4bTotal'],
                    bCrepitus4 : response['4bCrepitus'],
                    bResult4 : response['4bResult'],//
                    cKneeling4 : response['4cKneeling'],
                    cResult4 : response['4cResult'], //
                    Comments4 : response['4Comments'],
                    Total4 : response['4Total'],
                    aPosture5 : response['5aPosture'],
                    bHoverResult5: response['5bHoverResult'],
                    cStrenght5 : response['5cStrenght'],
                    cResult5 : response['5cResult'],//
                    dTotal5 : response['5dTotal'],
                    dResult5 : response['5dResult'],//
                    eWaitesBow5 : response['5eWaitesBow'],
                    eResult5 : response['5eResult'],//
                    fRight5 : response['5fRight'],
                    fLeft5 : response['5fLeft'],
                    gRight5 : response['5gRight'],
                    gFloat5 : response['5gFloat'],
                    Total5 : response['5Total'],
                    aMax6 : response['6aMax'],
                    aResult6 : response['6aResult'],
                    bMax6 : response['6bMax'],
                    bResult6 : response['6bResult'],
                    c_16 : response['6c_1'],
                    c_1Comment6 : response['6c_1Comment'],
                    c_26 : response['6c_2'],
                    c_2Comment6 : response['6c_2Comment'],
                    c_36 : response['6c_3'],
                    c_3Comment6 : response['6c_3Comment'],
                    c_46 : response['6c_4'],
                    c_4Comment6 : response['6c_4Comment'],
                    c_56 :response['6c_5'],
                    c_5Comment6 : response['6c_5Comment'],
                    Comments6 : response['6Comments'],
                    Total6 : response['6Total'],
                    Score1Comment : response['Score1Comment'],
                    Score2Comment : response['Score2Comment'],
                    Score3Comment : response['Score3Comment'],
                    Score4Comment : response['Score4Comment'],
                    Score5Comment : response['Score5Comment'],
                    Score6Comment : response['Score6Comment'],
                    Score7Comment : response['Score7Comment'],
                    Score8Comment : response['Score8Comment'],
                    FCAToTal : response['FCAToTal'],
                    FCAResult : response['FCAResult'],
                    LEPDC : response['LEPDC'],
                    LAPC : response['LAPC'],
                    LComment : response['LComment'],
                    Lsign : response['Lsign'],
                    LDate : response['LDate'],
                    LName : response['LName'],
                    LPosition : response['LPosition'],
                    Created_by : response['Created_by'],
                    //Creation_date : response[''],
                    Last_updated_by : response['Last_updated_by'],
                    //Last_update_date : response[''],
                    CalId : response['CalId'],
                    DocId : response['DocId']

                };
                oriInfo = angular.copy($scope.info);
            }
        });


        $scope.submitGorgonFA = function(gorgonFAForm){
            $scope.showClickedValidation = true;
            if(gorgonFAForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {

                if(insert == true)
                {
                    var info = $scope.info;
                    DocumentService.insertGorgonFA(info).then(function(response){
                        if(response['status'] === 'success') {
                            $scope.isNew = false;
                            toastr.success("Successfully","Success");
                        }
                        else
                        {
                            toastr.error("Fail", "Error");
                        }
                    });
                }else{
                    DocumentService.editGorgonFA($scope.info).then(function(response){
                        if(response['status'] === 'success') {
                            toastr.success("Successfully","Success");
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