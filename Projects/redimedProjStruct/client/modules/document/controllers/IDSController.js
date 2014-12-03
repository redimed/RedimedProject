
angular.module('app.loggedIn.document.IDS.controllers',[])
    .controller("IDSController",function($scope,$state,DocumentService,$http,$cookieStore,$stateParams,toastr,localStorageService) {
        var oriInfoH;
        var oriInfoL;
        $scope.infoL = [];
        $scope.listIDS = [];

        // Start Signature
        var tempSignature;
        $scope.isSignature = false;
        $scope.showSignature = function () {
            $scope.isSignature = !$scope.isSignature;
        }

        $scope.cancelClick = function () {
            $scope.isSignature = !$scope.isSignature;
            $scope.infoH.SIGNATURE = tempSignature;
        };
        $scope.clearClick = function () {
            $scope.infoH.SIGNATURE = '';
        };
        $scope.okClick = function () {
            $scope.isSignature = !$scope.isSignature;
            tempSignature = $scope.infoH.SIGNATURE;
        }
        // End Signature

//        var CalID = $stateParams.CalID;
//        var Patient_ID = $stateParams.PatientID;
//        console.log("IDS: " + CalID + " patient: " + Patient_ID);

        //var doctorInfo = $cookieStore.get('doctorInfo');
        //$scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        var Patient_ID =$scope.patientInfo.Patient_id;
        var CalID = -1; // $scope.apptInfo.CAL_ID;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.infoH = {
            IDAS_ID : null,
            PATIENT_ID : Patient_ID,
            CAL_ID : CalID,
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
            TesterDate : new Date()
        };
        oriInfoH  = angular.copy($scope.infoH);
        $scope.infoL.YES_NO = [];
        $scope.infoL.PATIENT_ID = Patient_ID;
        $scope.infoL.CAL_ID = CalID;
        oriInfoL  = angular.copy($scope.infoL.YES_NO);

        $scope.resetForm = function () {
            $scope.infoH = angular.copy(oriInfoH);
            $scope.infoL.YES_NO = angular.copy(oriInfoL);
            $scope.IDSForm.$setPristine();
        }

        $scope.infoChanged = function () {
            if(!angular.equals(oriInfoH, $scope.infoH) == false && !angular.equals(oriInfoL,$scope.infoL.YES_NO) == false)
            {
                return  false;
            }else{
                return true;
            }
        }

        $scope.submitIDS = function(IDSForm){
            $scope.showClickedValidation = true;
            if(IDSForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                var infoL = $scope.infoL.YES_NO;
                var infoH = $scope.infoH;
                DocumentService.insertIDS(infoL,infoH).then(function(response){
                    if(response['status'] === 'success') {
                        toastr.success("Successfully","Success");
                        $state.go('loggedIn.IDS', null, {'reload': true});
                    }
                    else
                    {
                        toastr.error("Fail", "Error");
                    }
                });
            }

        };

        DocumentService.checkIDS(Patient_ID,CalID).then(function(response){
            if(response['status'] === 'new') {
                $scope.isNew = true;
                $scope.infoH.TesterSign = response['doctor'].Signature;
                $scope.infoH.TesterName = response['doctor'].NAME;
            }else if(response['status'] === 'update')
            {
                $scope.isNew = false;
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
                    SIGNATURE: response.data.SIGNATURE,
                    TesterName :  response.data.TesterName,
                    TesterSign: response.data.TesterSign,
                    TesterDate : response.data.TesterDate
                };
                oriInfoH  = angular.copy($scope.infoH);
            }else
            {
                toastr.error("Fail", "Error");
                return;
            }

            DocumentService.loadIDS(Patient_ID,CalID).then(function(response){
                if(response['status'] === 'fail') {
                    toastr.error("Fail", "Error");
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
                    oriInfoL  = angular.copy($scope.infoL.YES_NO);
                }
            });
        });


    });




