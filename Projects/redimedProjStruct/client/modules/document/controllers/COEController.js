/**
 * Created by thanh on 11/16/2014.
 */
angular.module('app.loggedIn.document.COE.controllers', [])
    .controller("COEController", function ($scope, $state, DocumentService, $http, $cookieStore, toastr, localStorageService,$filter) {
        //Decalration
            var insert = true;
        //================================================================
        // Start Signature

        var tempSignature;
        $scope.isSignature = false;
        $scope.showSignature = function () {
            $scope.isSignature = !$scope.isSignature;
        }

        $scope.cancelClick = function () {
            $scope.isSignature = !$scope.isSignature;
            $scope.info.Signature1 = tempSignature;
        };
        $scope.clearClick = function () {
            $scope.info.Signature1 = '';
        };
        $scope.okClick = function () {
            $scope.isSignature = !$scope.isSignature;
            tempSignature = $scope.info.Signature1;
        }
        // End Signature
        // Start Signature1
        var tempSignature1;
        $scope.isSignature1 = false;
        $scope.showSignature1 = function () {
            $scope.isSignature1 = !$scope.isSignature1;
        }

        $scope.cancelClick1 = function () {
            $scope.isSignature1 = !$scope.isSignature1;
            $scope.info.Signature2 = tempSignature1;
        };
        $scope.clearClick1 = function () {
            $scope.info.Signature2 = '';
        };
        $scope.okClick1 = function () {
            $scope.isSignature1 = !$scope.isSignature1;
            tempSignature1 = $scope.info.Signature2;
        }
        // End Signature1
        //============================================================================
        //Set Date Start
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //Set Date End
        //============================================================================
        // Get value
        var doctorInfo = $cookieStore.get('userInfo');
        console.log(doctorInfo.doctor_id);
        $scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        console.log($scope.apptInfo);
        console.log($scope.patientInfo);
        var Patient_ID =$scope.patientInfo.Patient_id;
        var CalID = $scope.apptInfo.CAL_ID;
        var date = new Date();
        var today = $filter('date')(date,'dd/MM/yyyy');
        //============================================================================
         $scope.info ={
             coe_id: null,
             DocId: null,
             DOCTOR_ID: doctorInfo.doctor_id,
             CalId: CalID,
             PatientId: Patient_ID,
             isEmployed: null,
             dateEmployed: date,
             inPosition: null,
             Signature1: null,
             coeName: null,
             coeTitle: null,
             coeDate: date,
             Signature2: null
         };
        var oriInfo = angular.copy($scope.info);
        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.COEForm.$setPristine();
        }

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        }
        //============================================================================
        DocumentService.checkCOE(Patient_ID,CalID).then(function(response){
            if(response['status'] === 'fail') {
                insert = true;
                $scope.isNew = true;
            }
            else
            {
                insert = false;
                $scope.isNew = false;
                $scope.info = response;
                console.log($scope.info);
                oriInfo = angular.copy($scope.info);
            }
        });

        $scope.submitCOE = function(COEForm){
            $scope.showClickedValidation = true;
            if(COEForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                var info = $scope.info;
                if(insert == true){
                    DocumentService.insertCOE(info).then(function(response){
                        if(response['status'] === 'success') {
                            alert("Insert Successfully!");
                        }
                        else
                        {
                            alert("Insert Failed!");
                        }
                    });
                }else
                {
                    var info = $scope.info;
                    DocumentService.updateCOE(info).then(function(response){
                        if(response['status'] === 'success') {
                            alert("Edit Successfully!");
                        }
                        else
                        {
                            alert("Edit Failed!");
                        }
                    });
                }

            }

        };

    });