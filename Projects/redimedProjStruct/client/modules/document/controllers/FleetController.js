angular.module('app.loggedIn.document.QANTASfleet.controllers',[])
  .controller("FleetController",function($scope, $filter, DocumentService, ConfigService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService){
    $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.patientInfo = localStorageService.get('tempPatient');
        CalID = $stateParams.cal_id; 
        Patient_ID = $scope.patientInfo.Patient_id;
        console.log($scope.patientInfo);
        $scope.isSignatureShow = false;
        $scope.patientInfo.DOB = moment($scope.patientInfo.DOB).format('YYYY-MM-DD');
         $scope.rates = [
          {id:0, name:'Excellent'},
          {id:1, name:'Very Good'},
          {id:2, name:'Good'},
          {id:3, name:'Average'},
          {id:4, name:'Poor'}
        ];
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
        $scope.mathBPM = function(value){
          if(isNaN(value)==false){
            if(value==null||value.length==0||value<0){
              $scope.info.group3_sec2_rate1 ="";
            }
            else{
              if(value<71&&value>=0){
                $scope.info.group3_sec2_rate1 ="Excellent";
              }
              else if(value>=71&&value<=102){
                $scope.info.group3_sec2_rate1 ="Good";
              }
              else if(value>=103&&value<=117){
                $scope.info.group3_sec2_rate1 ="Average";
              }
              else if(value>=118&&value<=147){
                $scope.info.group3_sec2_rate1 ="Below Average";
              }
              else{
                $scope.info.group3_sec2_rate1 ="Poor";
              }
            }
          }
        }
        $scope.showSignature = function(){
          $scope.isSignatureShow = true;
        }
        $scope.okClick = function () {
        $scope.isSignatureShow = false;
        //console.log($scope.info.PATIENT_SIGN);
        }
        $scope.cancelClick = function () {
            $scope.isSignatureShow = false;
        }
        $scope.clearClick = function () {
            $scope.info.PATIENT_SIGN = '';
        }
        $scope.insert = false;
        DocumentService.checkQANTAS_Fleet(Patient_ID,CalID).then(function(response){
            if(response.status==="insert"){
              $scope.insert = true;
              $scope.info ={
                PATIENT_ID:Patient_ID,
                CAL_ID:CalID,
                check1:null,
                check2:null,
                check3:null,
                check4:null,
                check5:null,
                check6:null,
                check7:null,
                check8:null,
                check9:null,
                check10:null,
                check11:null,
                check12:null,
                check13:null,
                check14:null,
                check15:null,
                check16:null,
                check17:null,
                check18:null,
                check19:null,
                check20:null,
                check21:null,
                check22:null,
                check23:null,
                check24:null,
                check25:null,
                check26:null,
                check27:null,
                check28:null,
                check29:null,
                check30:null,
                check31:null,
                check32:null,
                check33:null,
                check34:null,
                check35:null,
                check36:null,
                check37:null,
                check38:null,
                check39:null,
                check40:null,
                check41:null,
                check42:null,
                check43:null,
                check44:null,
                check45:null,
                check46:null,
                check47:null,
                check48:null,
                check49:null,
                check50:null,
                check51:null,
                check52:null,
                check53:null,
                group3_sec1_comment1:null,
                group3_sec1_comment2:null,
                group3_sec1_value1:null,
                group3_sec1_value2:null,
                group3_sec2_comment1:null,
                group3_sec2_comment2:null,
                group3_sec2_comment3:null,
                group3_sec2_comment4:null,
                group3_sec2_comment5:null,
                group3_sec2_comment6:null,
                group3_sec2_rate1:null,
                group3_sec2_value1:null,
                group3_sec2_value2:null,
                group3_sec3_checkL_1:null,
                group3_sec3_checkL_2:null,
                group3_sec3_checkL_3:null,
                group3_sec3_checkL_4:null,
                group3_sec3_checkL_5:null,
                group3_sec3_checkL_6:null,
                group3_sec3_checkL_7:null,
                group3_sec3_checkL_8:null,
                group3_sec3_checkL_9:null,
                group3_sec3_checkL_10:null,
                group3_sec3_checkL_11:null,
                group3_sec3_checkL_12:null,
                group3_sec3_checkR_1:null,
                group3_sec3_checkR_2:null,
                group3_sec3_checkR_3:null,
                group3_sec3_checkR_4:null,
                group3_sec3_checkR_5:null,
                group3_sec3_checkR_6:null,
                group3_sec3_checkR_7:null,
                group3_sec3_checkR_8:null,
                group3_sec3_checkR_9:null,
                group3_sec3_checkR_10:null,
                group3_sec3_checkR_11:null,
                group3_sec3_checkR_12:null,
                group3_sec3_comment1:null,
                group3_sec3_comment2:null,
                group3_sec3_comment3:null,
                group3_sec3_comment4:null,
                group3_sec3_comment5:null,
                group3_sec3_comment6:null,
                group3_sec3_comment7:null,
                group3_sec3_comment8:null,
                group3_sec3_comment9:null,
                group3_sec3_comment10:null,
                group3_sec3_comment11:null,
                group3_sec3_comment12:null,
                group3_sec4_comment1:null,
                group3_sec4_rate1:null,
                group3_sec4_rate2:null,
                group3_sec4_rate3:null,
                group3_sec4_rate4:null,
                group3_sec4_rate5:null,
                group3_sec4_rate6:null,
                group3_sec4_rate7:null,
                group3_sec4_rate8:null,
                group3_sec4_rate9:null,
                group3_sec5_comment1:null,
                group3_sec5_comment2:null,
                group3_sec5_comment3:null,
                group3_sec5_comment4:null,
                group3_sec5_value1:null,
                group3_sec5_value2:null,
                group3_sec5_value3:null,
                group3_sec5_value4:null,
                group3_sec6_comment1:null,
                group4_checkbox1:null,
                group4_checkbox2:null,
                group4_checkbox3:null,
                group4_checkbox4:null,
                group4_comment1:null,
                group4_comment2:null,
                group4_comment3:null,
                group4_comment4:null,
                group4_comment5:null,
                dateChose:null,
                PATIENT_SIGN:null
              };
              $scope.info.group3_sec2_value1 = parseInt((220 - getAge($scope.patientInfo.DOB))*0.85);         
            }
            else if(response.status==="update"){
              $scope.insert = false;
              $scope.info = angular.copy(response['data']);
              $scope.dateChose = $scope.info.dateChose;
            }
            else if(response.status==="error"){
              toastr.error("fail","FAIL");
            }
        });
        
        
        $scope.submitQANTAS_Fleet = function(QANTAS_Fleetform){
          if($scope.insert==true){
            $scope.info.dateChose = $scope.dateChose;
            DocumentService.insertQANTAS_Fleet($scope.info).then(function(response){
              if(response.status==="success"){
                toastr.success("insert!!","success");
              }
              else{
                toastr.error("fail!!","FAIL");
              }
            })
          }
          else{
            $scope.info.dateChose = $scope.dateChose;
            DocumentService.updateQANTAS_Fleet($scope.info).then(function(response){
              
              if(response.status==="success"){
                toastr.success("update!!","success");
              }
              else{
                toastr.error("fail!!","FAIL");
              }
            })
          }
        };
  });