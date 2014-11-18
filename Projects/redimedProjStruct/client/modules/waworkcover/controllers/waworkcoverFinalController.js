
angular.module("app.loggedIn.waworkcover.final.controller", [])

    .controller("waworkcoverFinalController", function ($scope, $cookieStore, toastr, waworkcoverService, PatientService, DoctorService, ConfigService, localStorageService) {
        // VARIABLES
        var Patient = localStorageService.get("patientTempInfo");
        Patient.CAL_ID = localStorageService.get("apptTempInfo").CAL_ID;
        // END VARIABLES

        // LIST OF PATIENTS
        $scope.patientInfo = {};
        $scope.companyInfo = {};
        $scope.doctorInfo = {};
        // END LIST OF PATIENTS

        var init = function(){
            $scope.oneAtATime = false;
            $scope.isFirstOpen = true;
            $scope.numOfRow = [1,2,3];

            $scope.assessID={
                assessID:14
                //first: 94
                //progress: 26
                //final: 14

            };

            PatientService.getById(Patient.Patient_id).then(function(list){
                $scope.patientInfo = list;
                $scope.patientInfo.DOB = ConfigService.getCommonDateDefault($scope.patientInfo.DOB);
                if($scope.patientInfo.company_id){
                    waworkcoverService.getCompanyFromPatient($scope.patientInfo.company_id).then(function(list){
                        $scope.companyInfo = list.data;
                    })
                }
            })

            DoctorService.getById($cookieStore.get("doctorInfo").doctor_id).then(function(list){
                $scope.doctorInfo = list;
            })

        };
        init();

        var parseDate = function(myDate){
            var dateString = myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate();
            return dateString;
        };

        $scope.insertData = function(){
            $scope.isSubmitted = true;
            if($scope.wafinalform.$invalid){
                toastr.error("Your form is invalid!", "Error");
            }
            else{
                $scope.wafinal_map = angular.copy($scope.wafinal);

                for(var key in $scope.wafinal_map){
                    if($scope.wafinal_map[key] instanceof Date){
                        console.log('Changing');
                        $scope.wafinal_map[key] = ConfigService.getCommonDate($scope.wafinal_map[key]);
                    }
                }

                $scope.wafinal_map.cal_id = Patient.CAL_ID;
                waworkcoverService.insertFinal($scope.wafinal_map);
            }

        };

        $scope.getData = function(){
            waworkcoverService.getFinalAssess($scope.assessID).then(function(data){
                console.log(data);
                $scope.wafinal = data.assessment;
                $scope.doctorInfo = data.doctor;

                var dob = new Date(data.patient.DOB);
                data.patient.DOB = dob.getMonth() + '/' + dob.getDate() + '/' + dob.getFullYear();
                console.log(data.patient.DOB);

                $scope.patientInfo = data.patient;
                $scope.companyInfo = data.company;



            }); //$scope.assessID will be dynamic.
        };

        $scope.editData = function(){
            $scope.isSubmitted = true;
            if($scope.wafinalform.$invalid){
                toastr.error("Your form is invalid!", "Error");
            }
            else{
                for(var key in $scope.wafinal){
                    if($scope.wafinal[key] instanceof Date){
                        console.log('Changing');
                        $scope.wafinal[key] = parseDate($scope.wafinal[key]);
                    }
                }
                waworkcoverService.editFinal($scope.wafinal);
            }

        };


        $scope.$watch('wafinal.isFullCapacity',function(){
            if($scope.wafinal.isFullCapacity !=1 ){
                $scope.wafinal.fullCapaFrom = null;
                $scope.wafinal.isRequireTreat = null;
                if($scope.wafinal.isCapacityForWork !=1){
                    $scope.wafinalform.isFullCapacity.$invalid = true;
                    $scope.wafinalform.isCapacityForWork.$invalid = true;
                }
                else{
                    $scope.wafinalform.isFullCapacity.$invalid = false;
                    $scope.wafinalform.isCapacityForWork.$invalid = false;
                }
            }
            else{
                $scope.wafinalform.isFullCapacity.$invalid = false;
                $scope.wafinalform.isCapacityForWork.$invalid = false;
            }
        });

        $scope.$watch('wafinal.isCapacityForWork',function(){
            if($scope.wafinal.isCapacityForWork !=1 ){
                $scope.wafinal.capaHours = null;
                $scope.wafinal.capaDays = null;
                $scope.wafinal.capaFrom = null;
                if($scope.wafinal.isFullCapacity !=1){
                    $scope.wafinalform.isFullCapacity.$invalid = true;
                    $scope.wafinalform.isCapacityForWork.$invalid = true;
                }
                else{
                    $scope.wafinalform.isFullCapacity.$invalid = false;
                    $scope.wafinalform.isCapacityForWork.$invalid = false;
                }
            }
            else{
                $scope.wafinalform.isFullCapacity.$invalid = false;
                $scope.wafinalform.isCapacityForWork.$invalid = false;
            }
        });

        $scope.$watch('wafinal.isRequireTreat',function(){
            if($scope.wafinal.isRequireTreat != 0 && $scope.wafinal.isRequireTreat != undefined ){
                if($scope.wafinal.isFullCapacity !=1){
                    $scope.wafinal.isFullCapacity = 1;
                }
            }
        });

        $scope.$watch('wafinal.fullCapaFrom',function(){
            if($scope.wafinal.fullCapaFrom != '' && $scope.wafinal.fullCapaFrom != undefined ){
                if($scope.wafinal.isFullCapacity !=1){
                    $scope.wafinal.isFullCapacity = 1;
                }
            }
        });

        $scope.$watch('wafinal.capaHours',function(){
            if($scope.wafinal.capaHours != '' && $scope.wafinal.capaHours != undefined ){
                if($scope.wafinal.isCapacityForWork !=1){
                    $scope.wafinal.isCapacityForWork = 1;
                }
            }
        });

        $scope.$watch('wafinal.capaDays',function(){
            if($scope.wafinal.capaDays != '' && $scope.wafinal.capaDays != undefined ){
                if($scope.wafinal.isCapacityForWork !=1){
                    $scope.wafinal.isCapacityForWork = 1;
                }
            }
        });

        $scope.$watch('wafinal.capaFrom',function(){
            if($scope.wafinal.capaFrom != '' && $scope.wafinal.capaFrom != undefined ){
                if($scope.wafinal.isCapacityForWork !=1){
                    $scope.wafinal.isCapacityForWork = 1;
                }
            }
        });

        $scope.$watch('wafinal.liftUpKg',function(){
            if($scope.wafinal.liftUpKg != undefined && $scope.wafinal.liftUpKg != ''){
                if($scope.wafinal.isLiftUp==0 || $scope.wafinal.isLiftUp==undefined){
                    $scope.wafinal.isLiftUp = 1;
                }
            }
        });



        $scope.$watch('wafinal.sitUpMins',function(){
            if($scope.wafinal.sitUpMins != undefined && $scope.wafinal.sitUpMins != ''){
                if($scope.wafinal.isSitUp==0 || $scope.wafinal.isSitUp==undefined){
                    $scope.wafinal.isSitUp = 1;
                }

            }
        });

        $scope.$watch('wafinal.standUpMins',function(){
            if($scope.wafinal.standUpMins != undefined && $scope.wafinal.standUpMins != ''){
                if($scope.wafinal.isStandUp==0 || $scope.wafinal.isStandUp==undefined){
                    $scope.wafinal.isStandUp = 1;
                }

            }
        });

        $scope.$watch('wafinal.walkUpMeter',function(){
            if($scope.wafinal.walkUpMeter != undefined && $scope.wafinal.walkUpMeter != ''){
                if($scope.wafinal.isWalkUp==0 || $scope.wafinal.isWalkUp==undefined){
                    $scope.wafinal.isWalkUp = 1;
                }

            }
        });
        $scope.$watch('wafinal.isLiftUp',function(){
            if($scope.wafinal.isLiftUp != 1){
                $scope.wafinal.liftUpKg = null;
            }
        });

        $scope.$watch('wafinal.isStandUp',function(){
            if($scope.wafinal.isStandUp != 1){
                $scope.wafinal.standUpMins = null;
            }
        });

        $scope.$watch('wafinal.isSitUp',function(){
            if($scope.wafinal.isSitUp != 1){
                $scope.wafinal.sitUpMins = null;
            }
        });

        $scope.$watch('wafinal.isWalkUp',function(){
            if($scope.wafinal.isWalkUp != 1){
                $scope.wafinal.walkUpMeter = null;
            }
        });

    });
