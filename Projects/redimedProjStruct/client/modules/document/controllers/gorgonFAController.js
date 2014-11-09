
angular.module('app.loggedIn.document.gorgonFA.controllers',[])
    .controller("gorgonFAController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,toastr) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.info = [];
        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';
        var date = new Date();
        var today = $filter('date')(date,'dd/MM/yyyy');

        $scope.info = {
            patientId : userinfo.id,
            fName : userinfo.Booking_Person,
            age : 20,
            JAF : null,
            DOB : null,
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
            //
            MS_ie_Comment : null,
            MS_Mx_Heart_Rage_1 : null,
            MS_Mx_Heart_Rage_2 : null,
            //
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
            Rom_Total1 : null,
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
            Total2 : null,
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
            Total3 : null,
            aSec4 : null,//
            aResult4 : null,//
            bTotal4 : null,
            bCrepitus4 : null,
            bResult4 : null,//
            cKneeling4 : null,
            cResult4 : null, //
            Comments4 : null,
            Total4 : null,
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
            Total5 : null,
            aMax6 : null,
            aResult6 : null,
            bMax6 : null,
            bResult6 : null,
            c_16 : null,
            c_1Comment6 : null,
            c_26 : null,
            c_2Comment6 : null,
            c_36 : null,
            c_3Comment6 : null,
            c_46 : null,
            c_4Comment6 : null,
            c_56 : null,
            c_5Comment6 : null,
            Comments6 : null,
            Total6 : null,
            Score1Comment : null,
            Score2Comment : null,
            Score3Comment : null,
            Score4Comment : null,
            Score5Comment : null,
            Score6Comment : null,
            Score7Comment : null,
            Score8Comment : null,
            FCAToTal : null,
            FCAResult : null,//
            LEPDC : null,
            LAPC : null,
            LComment : null,
            Lsign : null,
            LDate : date,
            LName : null,
            LPosition : null,
            Created_by : null,
            Creation_date : null,
            Last_updated_by : null,
            Last_update_date : null,
            CalId : null,
            DocId : null

    };

        var sex = "female";
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



        $scope.maxDateDOB = new Date(date.getFullYear() - 1,date.getMonth() ,date.getDate());
        $scope.maxDate = date;


        $scope.submitGorgonFA = function(gorgonFAForm){
            $scope.showClickedValidation = true;
            if(gorgonFAForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                var info = $scope.info;
                console.log(info);
                DocumentService.insertGorgonFA(info).then(function(response){
                    if(response['status'] === 'success') {
                        alert("Insert Successfully!");
                    }
                    else
                    {
                        alert("Insert Failed!");
                    }
                });
            }

        };
    });