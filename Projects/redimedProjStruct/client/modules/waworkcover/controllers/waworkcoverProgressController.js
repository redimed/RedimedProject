
angular.module("app.loggedIn.waworkcover.progress.controller", [])

    .controller("waworkcoverProgressController", function ($scope, $cookieStore, toastr, waworkcoverService, PatientService, DoctorService, ConfigService, localStorageService) {
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
            $scope.assessID={
                assessID:26
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
            if($scope.waprogressform.$invalid){
                toastr.error("Your form is invalid!", "Error");
            }
            else{
                $scope.waprogress_map = angular.copy($scope.waprogress);
                for(var key in $scope.waprogress_map){
                    if($scope.waprogress_map[key] instanceof Date){
                        console.log('Changing');
                        $scope.waprogress_map[key] = ConfigService.getCommonDate($scope.waprogress_map[key]);
                    }
                }

                $scope.waprogress_map.cal_id = Patient.CAL_ID;
                waworkcoverService.insertProgress($scope.waprogress_map);
            }

        };

        $scope.getData = function(){
            waworkcoverService.getProgressAssess($scope.assessID).then(function(data){
                console.log(data);
                $scope.waprogress = data.assessment;
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
            if($scope.waprogressform.$invalid){
                toastr.error("Your form is invalid!", "Error");
            }
            else{
                for(var key in $scope.waprogress){
                    if($scope.waprogress[key] instanceof Date){
                        console.log('Changing');
                        $scope.waprogress[key] = parseDate($scope.waprogress[key]);
                    }
                }
                waworkcoverService.editProgress($scope.waprogress);
            }

        };

        $scope.$watch('waprogress.activities_1',function(){
            if($scope.waprogress.activities_1 == undefined || $scope.waprogress.activities_1 == ''){
                $scope.waprogress.outcome_1 = undefined;
                $scope.waprogress.isRequired_1 = undefined;
            }
        });

        $scope.$watch('waprogress.activities_2',function(){
            if($scope.waprogress.activities_2 == undefined || $scope.waprogress.activities_2 == ''){
                $scope.waprogress.outcome_2 = undefined;
                $scope.waprogress.isRequired_2 = undefined;
            }
        });

        $scope.$watch('waprogress.activities_3',function(){
            if($scope.waprogress.activities_3 == undefined || $scope.waprogress.activities_3 == ''){
                $scope.waprogress.outcome_3 = undefined;
                $scope.waprogress.isRequired_3 = undefined;
            }
        });

        $scope.$watch('waprogress.activities_4',function(){
            if($scope.waprogress.activities_4 == undefined || $scope.waprogress.activities_4 == ''){
                $scope.waprogress.outcome_4 = undefined;
                $scope.waprogress.isRequired_4 = undefined;
            }
        });

        $scope.$watch('waprogress.activities_5',function(){
            if($scope.waprogress.activities_5 == undefined || $scope.waprogress.activities_5 == ''){
                $scope.waprogress.outcome_5 = undefined;
                $scope.waprogress.isRequired_5 = undefined;
            }
        });

        $scope.$watch('waprogress.activities_6',function(){
            if($scope.waprogress.activities_6 == undefined || $scope.waprogress.activities_6 == ''){
                $scope.waprogress.outcome_6 = undefined;
                $scope.waprogress.isRequired_6 = undefined;
            }
        });

        $scope.$watch('waprogress.isFullCapacity',function(){
            if($scope.waprogress.isFullCapacity!=1){
                $scope.waprogress.isRequireTreat = null;
                $scope.waprogress.fullCapaFrom = null;
                if($scope.waprogress.isNoCapacity !=1 && $scope.waprogress.isSomeCapacity !=1 ){
                    $scope.waprogressform.isFullCapacity.$invalid = true;
                    $scope.waprogressform.isSomeCapacity.$invalid = true;
                    $scope.waprogressform.isNoCapacity.$invalid = true;
                }
                else{
                    $scope.waprogressform.isFullCapacity.$invalid = false;
                    $scope.waprogressform.isSomeCapacity.$invalid = false;
                    $scope.waprogressform.isNoCapacity.$invalid = false;
                }
            }
            else{
                $scope.waprogressform.isFullCapacity.$invalid = false;
                $scope.waprogressform.isSomeCapacity.$invalid = false;
                $scope.waprogressform.isNoCapacity.$invalid = false;
            }


        });

        $scope.$watch('waprogress.isSomeCapacity',function(){
            if($scope.waprogress.isSomeCapacity!=1){
                $scope.waprogress.someCapaFrom = null;
                $scope.waprogress.someCapaTo = null;
                $scope.waprogress.isPreDuties = null;
                $scope.waprogress.isModiDuties = null;
                $scope.waprogress.isWorkModifi = null;
                $scope.waprogress.isPreHours = null;
                $scope.waprogress.isModiHours = null;
                $scope.waprogress.modiDays = null;
                $scope.waprogress.modiHrs = null;
                if($scope.waprogress.isNoCapacity !=1 && $scope.waprogress.isFullCapacity !=1 ){
                    $scope.waprogressform.isFullCapacity.$invalid = true;
                    $scope.waprogressform.isSomeCapacity.$invalid = true;
                    $scope.waprogressform.isNoCapacity.$invalid = true;
                }
                else{
                    $scope.waprogressform.isFullCapacity.$invalid = false;
                    $scope.waprogressform.isSomeCapacity.$invalid = false;
                    $scope.waprogressform.isNoCapacity.$invalid = false;
                }
            }
            else{
                $scope.waprogressform.isFullCapacity.$invalid = false;
                $scope.waprogressform.isSomeCapacity.$invalid = false;
                $scope.waprogressform.isNoCapacity.$invalid = false;
            }
        });

        $scope.$watch('waprogress.isNoCapacity',function(){
            if($scope.waprogress.isNoCapacity !=1) {
                $scope.waprogress.noCapaFrom = null;
                $scope.waprogress.noCapaTo = null;
                if($scope.waprogress.isFullCapacity !=1 && $scope.waprogress.isSomeCapacity !=1 ){
                    $scope.waprogressform.isFullCapacity.$invalid = true;
                    $scope.waprogressform.isSomeCapacity.$invalid = true;
                    $scope.waprogressform.isNoCapacity.$invalid = true;
                }
                else{
                    scope.waprogressform.isFullCapacity.$invalid = false;
                    $scope.waprogressform.isSomeCapacity.$invalid = false;
                    $scope.waprogressform.isNoCapacity.$invalid = false;
                }
            }
            else{
                $scope.waprogressform.isFullCapacity.$invalid = false;
                $scope.waprogressform.isSomeCapacity.$invalid = false;
                $scope.waprogressform.isNoCapacity.$invalid = false;
            }
        });
        //END DETECT WORK CAPACITY CHANGE

        //START DETECT THE REQUIRED INFO OF WORK CAPACITY CHANGE
        $scope.$watch('waprogress.isRequireTreat',function(){
            if($scope.waprogress.isRequireTreat == 1){
                if($scope.waprogress.isFullCapacity == undefined || $scope.waprogress.isFullCapacity == 0){
                    $scope.waprogress.isFullCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.fullCapaFrom',function(){
            if($scope.waprogress.fullCapaFrom != '' && $scope.waprogress.fullCapaFrom != undefined){
                if($scope.waprogress.isFullCapacity == undefined || $scope.waprogress.isFullCapacity == 0) {
                    $scope.waprogress.isFullCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.someCapaFrom',function(){
            if($scope.waprogress.someCapaFrom != undefined && $scope.waprogress.someCapaFrom != ''){
                if($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.someCapaTo',function(){
            if($scope.waprogress.someCapaTo != undefined && $scope.waprogress.someCapaTo != '') {
                if ($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.isPreDuties',function(){
            if($scope.waprogress.isPreDuties != undefined && $scope.waprogress.isPreDuties != 0) {
                if ($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.isModiDuties',function(){
            if($scope.waprogress.isModiDuties != undefined && $scope.waprogress.isModiDuties != 0) {
                if ($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.isWorkModifi',function(){
            if($scope.waprogress.isWorkModifi != undefined && $scope.waprogress.isWorkModifi != 0) {
                if ($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.isPreHours',function(){
            if($scope.waprogress.isPreHours != undefined && $scope.waprogress.isPreHours != 0) {
                if ($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.isModiHours',function(){
            if($scope.waprogress.isModiHours != undefined && $scope.waprogress.isModiHours != 0){
                if($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                    $scope.waprogress.isSomeCapacity = 1;
                }
            }
            else {
                $scope.waprogress.modiHrs = null;
                $scope.waprogress.modiDays = null;
            }
        });

        $scope.$watch('waprogress.modiHrs',function(){
            if($scope.waprogress.modiHrs != '' && $scope.waprogress.modiHrs != undefined ){
                if($scope.waprogress.isModiHours==0 || $scope.waprogress.isModiHours==undefined) {
                    $scope.waprogress.isModiHours = 1;
                    if ($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                        $scope.waprogress.isSomeCapacity = 1;
                    }
                }

            }
        });

        $scope.$watch('waprogress.modiDays',function(){
            if($scope.waprogress.modiDays != '' && $scope.waprogress.modiDays != undefined ){
                if($scope.waprogress.isModiHours==0 || $scope.waprogress.isModiHours==undefined){
                    $scope.waprogress.isModiHours = 1;
                    if($scope.waprogress.isSomeCapacity == undefined || $scope.waprogress.isSomeCapacity == 0) {
                        $scope.waprogress.isSomeCapacity = 1;
                    }
                }
            }
        });

        $scope.$watch('waprogress.noCapaFrom',function(){
            if($scope.waprogress.noCapaFrom != '' && $scope.waprogress.noCapaFrom != undefined) {
                if ($scope.waprogress.isNoCapacity == undefined || $scope.waprogress.isNoCapacity == 0) {
                    $scope.waprogress.isNoCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.noCapaTo',function(){
            if($scope.waprogress.noCapaTo != undefined && $scope.waprogress.noCapaTo != '') {
                if ($scope.waprogress.isNoCapacity == undefined || $scope.waprogress.isNoCapacity == 0) {
                    $scope.waprogress.isNoCapacity = 1;
                }
            }
        });

        $scope.$watch('waprogress.liftUpKg',function(){
            if($scope.waprogress.liftUpKg != undefined && $scope.waprogress.liftUpKg != ''){
                if($scope.waprogress.isLiftUp==0 || $scope.waprogress.isLiftUp==undefined){
                    $scope.waprogress.isLiftUp = 1;
                }
            }
        });

        $scope.$watch('waprogress.sitUpMins',function(){
            if($scope.waprogress.sitUpMins != undefined && $scope.waprogress.sitUpMins != ''){
                if($scope.waprogress.isSitUp==0 || $scope.waprogress.isSitUp==undefined){
                    $scope.waprogress.isSitUp = 1;
                }

            }
        });

        $scope.$watch('waprogress.standUpMins',function(){
            if($scope.waprogress.standUpMins != undefined && $scope.waprogress.standUpMins != ''){
                if($scope.waprogress.isStandUp==0 || $scope.waprogress.isStandUp==undefined){
                    $scope.waprogress.isStandUp = 1;
                }

            }
        });

        $scope.$watch('waprogress.walkUpMeter',function(){
            if($scope.waprogress.walkUpMeter != undefined && $scope.waprogress.walkUpMeter != ''){
                if($scope.waprogress.isWalkUp==0 || $scope.waprogress.isWalkUp==undefined){
                    $scope.waprogress.isWalkUp = 1;
                }

            }
        });
        $scope.$watch('waprogress.isLiftUp',function(){
            if($scope.waprogress.isLiftUp != 1){
                $scope.waprogress.liftUpKg = null;
            }
        });

        $scope.$watch('waprogress.isStandUp',function(){
            if($scope.waprogress.isStandUp != 1){
                $scope.waprogress.standUpMins = null;
            }
        });

        $scope.$watch('waprogress.isSitUp',function(){
            if($scope.waprogress.isSitUp != 1){
                $scope.waprogress.sitUpMins = null;
            }
        });

        $scope.$watch('waprogress.isWalkUp',function(){
            if($scope.waprogress.isWalkUp != 1){
                $scope.waprogress.walkUpMeter = null;
            }
        });

        $scope.$watch('waprogress.activities_B1', function(){
            if($scope.waprogress.activities_B1 == undefined || $scope.waprogress.activities_B1 == ''){
                $scope.waprogress.goal_1 = undefined
            }
        });

        $scope.$watch('waprogress.activities_B2', function(){
            if($scope.waprogress.activities_B2 == undefined || $scope.waprogress.activities_B2 == ''){
                $scope.waprogress.goal_2 = undefined
            }
        });

        $scope.$watch('waprogress.activities_B3', function(){
            if($scope.waprogress.activities_B3 == undefined || $scope.waprogress.activities_B3 == ''){
                $scope.waprogress.goal_3 = undefined
            }
        });

        $scope.$watch('waprogress.activities_B4', function(){
            if($scope.waprogress.activities_B4 == undefined || $scope.waprogress.activities_B4 == ''){
                $scope.waprogress.goal_4 = undefined
            }
        });

        $scope.$watch('waprogress.activities_B5', function(){
            if($scope.waprogress.activities_B5 == undefined || $scope.waprogress.activities_B5 == ''){
                $scope.waprogress.goal_5 = undefined
            }
        });

        $scope.$watch('waprogress.activities_B6', function(){
            if($scope.waprogress.activities_B6 == undefined || $scope.waprogress.activities_B6 == ''){
                $scope.waprogress.goal_6 = undefined
            }
        });

        $scope.$watch('waprogress.supportDate', function(){
            if($scope.waprogress.supportDate != undefined && $scope.waprogress.supportDate != ''){
                if($scope.waprogress.isSupportRTW!=1) {
                    $scope.waprogress.isSupportRTW = 1;
                }
            }
        });

        $scope.$watch('waprogress.isSupportRTW', function(){
            if($scope.waprogress.isSupportRTW != 1){
                $scope.waprogress.supportDate = null;
            }
        });

        $scope.$watch('waprogress.isReview',function(){
            if($scope.waprogress.isReview != 1){
                $scope.waprogress.reviewOn = null;
            }
        });

        $scope.$watch('waprogress.reviewOn',function(){
            if($scope.waprogress.reviewOn != undefined && $scope.waprogress.reviewOn != ''){
                if($scope.waprogress.isReview != 1) {
                    $scope.waprogress.isReview = 1;
                }
            }
        });



    });