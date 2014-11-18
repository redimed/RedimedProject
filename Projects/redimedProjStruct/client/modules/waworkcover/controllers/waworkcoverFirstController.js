
angular.module("app.loggedIn.waworkcover.first.controller", [])

    .controller("waworkcoverFirstController", function ($scope, $cookieStore, $state, toastr, localStorageService, waworkcoverService, PatientService, DoctorService, ConfigService) {

        // SIGNATURE
        $scope.clearSignature = function(){
            $scope.wafirst.signature = "";
        }
        // END SIGNATURE

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
            $scope.numOfRow = [1,2,3,4,5,6];

            

            $scope.assessID={
                assessID:99
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
            var dateString = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate();
            return dateString;
        };

        $scope.insertData = function(){
            $scope.isSubmitted = true;
            if($scope.wafirstform.$invalid){
                toastr.error("Your form is invalid!", "Error");
            }
            else{
                $scope.wafirst_map = angular.copy($scope.wafirst);

                for(var key in $scope.wafirst_map){
                    if($scope.wafirst_map[key] instanceof Date){
                        $scope.wafirst_map[key] = ConfigService.getCommonDate($scope.wafirst_map[key]);
                    }
                }
                $scope.wafirst_map.cal_id = Patient.CAL_ID;

                waworkcoverService.insertFirst($scope.wafirst_map).then(function(response){
                    if(response.status === 'OK'){
                    }
                });
            }

        };

        $scope.editData = function(){
            $scope.isSubmitted = true;
            if($scope.wafirstform.$invalid){
                toastr.error("Your form is invalid!", "Error");
            }
            else{
                for(var key in $scope.wafirst){
                    if($scope.wafirst[key] instanceof Date){
                        console.log('Changing');
                        $scope.wafirst[key] = ConfigService.getCommonDate($scope.wafirst[key]);
                    }
                }
                waworkcoverService.editFirst($scope.wafirst);
            }

        };

        $scope.getData = function(){
            waworkcoverService.getFirstAssess($scope.assessID).then(function(data){
                console.log(data);
                $scope.wafirst = data.assessment;
                $scope.doctorInfo = data.doctor;

                var dob = new Date(data.patient.DOB);
                data.patient.DOB = dob.getMonth() + '/' + dob.getDate() + '/' + dob.getFullYear();
                console.log(data.patient.DOB);

                $scope.patientInfo = data.patient;
                $scope.companyInfo = data.company;



            }); //$scope.assessID will be dynamic.
        };

        //$scope.addRow = function(){
        //    $scope.numOfRow[$scope.numOfRow.length] = $scope.numOfRow + 1;
        //};
        //$scope.removeRow = function(){
        //    $scope.numOfRow.splice($scope.numOfRow.length - 1,1);
        //}

        //CODE FOR DETECT CHANGE HERE

        //START DETECT WORK CAPACITY CHANGE
        $scope.$watch('wafirst.isFullCapacity',function(){
            if($scope.wafirst.isFullCapacity!=1){
                $scope.wafirst.isRequireTreat = null;
                $scope.wafirst.fullCapaFrom = null;
                if($scope.wafirst.isNoCapacity !=1 && $scope.wafirst.isSomeCapacity !=1 ){
                    $scope.wafirstform.isFullCapacity.$invalid = true;
                    $scope.wafirstform.isSomeCapacity.$invalid = true;
                    $scope.wafirstform.isNoCapacity.$invalid = true;
                }
                else{
                    $scope.wafirstform.isFullCapacity.$invalid = false;
                    $scope.wafirstform.isSomeCapacity.$invalid = false;
                    $scope.wafirstform.isNoCapacity.$invalid = false;
                }
            }
            else{
                $scope.wafirstform.isFullCapacity.$invalid = false;
                $scope.wafirstform.isSomeCapacity.$invalid = false;
                $scope.wafirstform.isNoCapacity.$invalid = false;
            }


        });

        $scope.$watch('wafirst.isSomeCapacity',function(){
            if($scope.wafirst.isSomeCapacity!=1){
                $scope.wafirst.someCapaFrom = null;
                $scope.wafirst.someCapaTo = null;
                $scope.wafirst.isPreDuties = null;
                $scope.wafirst.isModiDuties = null;
                $scope.wafirst.isWorkModifi = null;
                $scope.wafirst.isPreHours = null;
                $scope.wafirst.isModiHours = null;
                $scope.wafirst.modiDays = null;
                $scope.wafirst.modiHrs = null;
                if($scope.wafirst.isNoCapacity !=1 && $scope.wafirst.isFullCapacity !=1 ){
                    $scope.wafirstform.isFullCapacity.$invalid = true;
                    $scope.wafirstform.isSomeCapacity.$invalid = true;
                    $scope.wafirstform.isNoCapacity.$invalid = true;
                }
                else{
                    $scope.wafirstform.isFullCapacity.$invalid = false;
                    $scope.wafirstform.isSomeCapacity.$invalid = false;
                    $scope.wafirstform.isNoCapacity.$invalid = false;
                }
            }
            else{
                $scope.wafirstform.isFullCapacity.$invalid = false;
                $scope.wafirstform.isSomeCapacity.$invalid = false;
                $scope.wafirstform.isNoCapacity.$invalid = false;
            }
        });

        $scope.$watch('wafirst.isNoCapacity',function(){
            if($scope.wafirst.isNoCapacity !=1) {
                $scope.wafirst.noCapaFrom = null;
                $scope.wafirst.noCapaTo = null;
                if($scope.wafirst.isFullCapacity !=1 && $scope.wafirst.isSomeCapacity !=1 ){
                    $scope.wafirstform.isFullCapacity.$invalid = true;
                    $scope.wafirstform.isSomeCapacity.$invalid = true;
                    $scope.wafirstform.isNoCapacity.$invalid = true;
                }
                else{
                    scope.wafirstform.isFullCapacity.$invalid = false;
                    $scope.wafirstform.isSomeCapacity.$invalid = false;
                    $scope.wafirstform.isNoCapacity.$invalid = false;
                }
            }
            else{
                $scope.wafirstform.isFullCapacity.$invalid = false;
                $scope.wafirstform.isSomeCapacity.$invalid = false;
                $scope.wafirstform.isNoCapacity.$invalid = false;
            }
        });
        //END DETECT WORK CAPACITY CHANGE

        //START DETECT THE REQUIRED INFO OF WORK CAPACITY CHANGE
        $scope.$watch('wafirst.isRequireTreat',function(){
            if($scope.wafirst.isRequireTreat == 1){
                if($scope.wafirst.isFullCapacity == undefined || $scope.wafirst.isFullCapacity == 0){
                    $scope.wafirst.isFullCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.fullCapaFrom',function(){
            if($scope.wafirst.fullCapaFrom != '' && $scope.wafirst.fullCapaFrom != undefined){
                if($scope.wafirst.isFullCapacity == undefined || $scope.wafirst.isFullCapacity == 0) {
                    $scope.wafirst.isFullCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.someCapaFrom',function(){
            if($scope.wafirst.someCapaFrom != undefined && $scope.wafirst.someCapaFrom != ''){
                if($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.someCapaTo',function(){
            if($scope.wafirst.someCapaTo != undefined && $scope.wafirst.someCapaTo != '') {
                if ($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.isPreDuties',function(){
            if($scope.wafirst.isPreDuties != undefined && $scope.wafirst.isPreDuties != 0) {
                if ($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.isModiDuties',function(){
            if($scope.wafirst.isModiDuties != undefined && $scope.wafirst.isModiDuties != 0) {
                if ($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.isWorkModifi',function(){
            if($scope.wafirst.isWorkModifi != undefined && $scope.wafirst.isWorkModifi != 0) {
                if ($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.isPreHours',function(){
            if($scope.wafirst.isPreHours != undefined && $scope.wafirst.isPreHours != 0) {
                if ($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.isModiHours',function(){
            if($scope.wafirst.isModiHours != undefined && $scope.wafirst.isModiHours != 0){
                if($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                    $scope.wafirst.isSomeCapacity = 1;
                }
            }
            else {
                $scope.wafirst.modiHrs = null;
                $scope.wafirst.modiDays = null;
            }
        });

        $scope.$watch('wafirst.modiHrs',function(){
            if($scope.wafirst.modiHrs != '' && $scope.wafirst.modiHrs != undefined ){
                if($scope.wafirst.isModiHours==0 || $scope.wafirst.isModiHours==undefined) {
                    $scope.wafirst.isModiHours = 1;
                    if ($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                        $scope.wafirst.isSomeCapacity = 1;
                    }
                }

            }
        });

        $scope.$watch('wafirst.modiDays',function(){
            if($scope.wafirst.modiDays != '' && $scope.wafirst.modiDays != undefined ){
                if($scope.wafirst.isModiHours==0 || $scope.wafirst.isModiHours==undefined){
                    $scope.wafirst.isModiHours = 1;
                    if($scope.wafirst.isSomeCapacity == undefined || $scope.wafirst.isSomeCapacity == 0) {
                        $scope.wafirst.isSomeCapacity = 1;
                    }
                }
            }
        });

        $scope.$watch('wafirst.noCapaFrom',function(){
            if($scope.wafirst.noCapaFrom != '' && $scope.wafirst.noCapaFrom != undefined) {
                if ($scope.wafirst.isNoCapacity == undefined || $scope.wafirst.isNoCapacity == 0) {
                    $scope.wafirst.isNoCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.noCapaTo',function(){
            if($scope.wafirst.noCapaTo != undefined && $scope.wafirst.noCapaTo != '') {
                if ($scope.wafirst.isNoCapacity == undefined || $scope.wafirst.isNoCapacity == 0) {
                    $scope.wafirst.isNoCapacity = 1;
                }
            }
        });

        $scope.$watch('wafirst.liftUpKg',function(){
            if($scope.wafirst.liftUpKg != undefined && $scope.wafirst.liftUpKg != ''){
                if($scope.wafirst.isLiftUp==0 || $scope.wafirst.isLiftUp==undefined){
                    $scope.wafirst.isLiftUp = 1;
                }
            }
        });

        $scope.$watch('wafirst.sitUpMins',function(){
            if($scope.wafirst.sitUpMins != undefined && $scope.wafirst.sitUpMins != ''){
                if($scope.wafirst.isSitUp==0 || $scope.wafirst.isSitUp==undefined){
                    $scope.wafirst.isSitUp = 1;
                }

            }
        });

        $scope.$watch('wafirst.standUpMins',function(){
            if($scope.wafirst.standUpMins != undefined && $scope.wafirst.standUpMins != ''){
                if($scope.wafirst.isStandUp==0 || $scope.wafirst.isStandUp==undefined){
                    $scope.wafirst.isStandUp = 1;
                }

            }
        });

        $scope.$watch('wafirst.walkUpMeter',function(){
            if($scope.wafirst.walkUpMeter != undefined && $scope.wafirst.walkUpMeter != ''){
                if($scope.wafirst.isWalkUp==0 || $scope.wafirst.isWalkUp==undefined){
                    $scope.wafirst.isWalkUp = 1;
                }

            }
        });
        $scope.$watch('wafirst.isLiftUp',function(){
            if($scope.wafirst.isLiftUp != 1){
                $scope.wafirst.liftUpKg = null;
            }
        });

        $scope.$watch('wafirst.isStandUp',function(){
            if($scope.wafirst.isStandUp != 1){
                $scope.wafirst.standUpMins = null;
            }
        });

        $scope.$watch('wafirst.isSitUp',function(){
            if($scope.wafirst.isSitUp != 1){
                $scope.wafirst.sitUpMins = null;
            }
        });

        $scope.$watch('wafirst.isWalkUp',function(){
            if($scope.wafirst.isWalkUp != 1){
                $scope.wafirst.walkUpMeter = null;
            }
        });

        $scope.$watch('wafirst.isReview',function(){
            if($scope.wafirst.isReview != 1){
                $scope.wafirst.reviewOn = null;
            }
        });

        $scope.$watch('wafirst.reviewOn',function(){
            if($scope.wafirst.reviewOn != undefined && $scope.wafirst.reviewOn != ''){
                $scope.wafirst.isReview = 1;
            }
        });

        $scope.$watch('wafirst.reviewOn', function(){
           if($scope.wafirst.reviewOn != '' && $scope.wafirst.reviewOn != undefined){
               if($scope.wafirst.isReview != 1){
                   $scope.wafirst.isReview = 1;
               }
           }
        });

        $scope.$watch('wafirst.isReview', function() {
            if($scope.wafirst.isReview != 1){
                $scope.wafirst.reviewOn = null;
            }
        });
        //END DETECT THE REQUIRED INFO OF WORK CAPACITY CHANGE

        $scope.$watch('wafirst.activities_1', function(){
            if($scope.wafirst.activities_1 == undefined || $scope.wafirst.activities_1 == ''){
                $scope.wafirst.goal_1 = undefined
            }
        });

        $scope.$watch('wafirst.activities_2', function(){
            if($scope.wafirst.activities_2 == undefined || $scope.wafirst.activities_2 == ''){
                $scope.wafirst.goal_2 = undefined
            }
        });

        $scope.$watch('wafirst.activities_3', function(){
            if($scope.wafirst.activities_3 == undefined || $scope.wafirst.activities_3 == ''){
                $scope.wafirst.goal_3 = undefined
            }
        });

        $scope.$watch('wafirst.activities_4', function(){
            if($scope.wafirst.activities_4 == undefined || $scope.wafirst.activities_4 == ''){
                $scope.wafirst.goal_4 = undefined
            }
        });

        $scope.$watch('wafirst.activities_5', function(){
            if($scope.wafirst.activities_5 == undefined || $scope.wafirst.activities_5 == ''){
                $scope.wafirst.goal_5 = undefined
            }
        });

        $scope.$watch('wafirst.activities_6', function(){
            if($scope.wafirst.activities_6 == undefined || $scope.wafirst.activities_6 == ''){
                $scope.wafirst.goal_6 = undefined
            }
        });




    });