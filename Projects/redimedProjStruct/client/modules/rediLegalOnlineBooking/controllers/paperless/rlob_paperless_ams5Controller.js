angular.module('app.loggedIn.rlob.paperless.ams5.controller',[])
    .controller("rlob_paperless_ams5Controller", function($scope,rlobService,toastr,ConfigService) {
    	$scope.info = {
    		  AMS5_ID : null,
    		  BOOKING_ID : null,
          WRK_NAME : null,
          WRK_ADDRESS_2 : null,
          WRK_ADDRESS_1 : null,
          WRK_POSTCODE : null,
          WRK_DATE_OF_BIRTH_TEMP : null,
          WRK_DATE_OF_BIRTH : null,
          WRK_DATE_OF_INJURI_TEMP : null,
          WRK_DATE_OF_INJURI : null,
          WRK_INSURER_CLAIM_NUMBER : null,
          WRK_DESCRIPTION_OF_INJURI : null,
          WRK_PHONE : null,
          WRK_EMAIL : null,
          WRK_WORKCOVER_WA_CLAIM_NUMBER : null,
          COMPANIES_ID : null,
          EMP_ORGANISATION_NAME : null,
          EMP_CONTACT_PERSON : null,
          EMP_ADDRESS_1 : null,
          EMP_ADDRESS_2 : null,
          EMP_POSTCODE : null,
          EMP_PHONE : null,
          EMP_EMAIL : null,
          EMP_NAME_OF_INSURER : null,
          EMP_WORKCOVER_MUNBER : null,
          PURPOSE_OF_THE_ASSESSMENT : null,
          EX_DATE_TEMP : null,
          EX_DATE : null,
          EXL_NAME : null,
          EXL_ADDRESS_1 : null,
          EXL_ADDRESS_2 : null,
          EXL_POSTCODE : null,
          REPORTS_AND_DOCUMENTS : null,
          NARRATIVE_HISTORY : null,
          DIAGNOSIS_AND_STUDIES : null,
          DIAGNOSIS_AND_IMPAIRMENTS : null,
          PROPORTION_OF_PERMANENT_IMPAIRMENT : null,
          INJURY_ASSESSMENT : null,
          DOCTOR_ID : null,
          DT_DATE_TEMP : null,
          DT_DATE : null,
          DT_SIGNATURE : null,
          DT_NAME : null,
          DT_ADDRESS_1 : null,
          DT_ADDRESS_2 : null,
          DT_POSTCODE : null,
          DT_PHONE : null,
          DT_EMAIL : null
    	};
    	//begin signature
      var tempSignature;
      $scope.isSignature = false;
      $scope.showSignature = function () {
          $scope.isSignature = !$scope.isSignature;
      };
      $scope.cancelClick = function () {
          $scope.isSignature = !$scope.isSignature;
          $scope.info.DT_SIGNATURE = tempSignature;
      };
      $scope.clearClick = function () {
          $scope.info.DT_SIGNATURE = '';
      };
      $scope.okClick = function () {
          $scope.isSignature = !$scope.isSignature;
          tempSignature = $scope.info.DT_SIGNATURE;
      };    
      //end signature
      
      $scope.$watchCollection('bookingDetailAMS5',function(newValue,oldValue){
          console.log(newValue);
          $scope.info.AMS5_ID = $scope.bookingDetailAMS5.AMS5_ID,
          $scope.info.BOOKING_ID = $scope.bookingDetailAMS5.BOOKING_ID,
          $scope.info.WRK_NAME = $scope.bookingDetailAMS5.WRK_NAME,
          $scope.info.WRK_ADDRESS_2 = $scope.bookingDetailAMS5.WRK_ADDRESS_2,
          $scope.info.WRK_ADDRESS_1 = $scope.bookingDetailAMS5.WRK_ADDRESS_1,
          $scope.info.WRK_POSTCODE = $scope.bookingDetailAMS5.WRK_POSTCODE,
          $scope.bookingDetailAMS5.WRK_DATE_OF_BIRTH != null?$scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date($scope.bookingDetailAMS5.WRK_DATE_OF_BIRTH):$scope.info.WRK_DATE_OF_BIRTH_TEMP = null;
          $scope.bookingDetailAMS5.WRK_DATE_OF_INJURI != null?$scope.info.WRK_DATE_OF_INJURI_TEMP = new Date($scope.bookingDetailAMS5.WRK_DATE_OF_INJURI):$scope.info.WRK_DATE_OF_INJURI_TEMP = null;
          $scope.info.WRK_INSURER_CLAIM_NUMBER = $scope.bookingDetailAMS5.WRK_INSURER_CLAIM_NUMBER,
          $scope.info.WRK_DESCRIPTION_OF_INJURI = $scope.bookingDetailAMS5.WRK_DESCRIPTION_OF_INJURI,
          $scope.info.WRK_PHONE = $scope.bookingDetailAMS5.WRK_PHONE,
          $scope.info.WRK_EMAIL = $scope.bookingDetailAMS5.WRK_EMAIL,
          $scope.info.WRK_WORKCOVER_WA_CLAIM_NUMBER = $scope.bookingDetailAMS5.WRK_WORKCOVER_WA_CLAIM_NUMBER,
          $scope.info.COMPANIES_ID = $scope.bookingDetailAMS5.COMPANIES_ID,
          $scope.info.EMP_ORGANISATION_NAME = $scope.bookingDetailAMS5.EMP_ORGANISATION_NAME,
          $scope.info.EMP_CONTACT_PERSON = $scope.bookingDetailAMS5.EMP_CONTACT_PERSON,
          $scope.info.EMP_ADDRESS_1 = $scope.bookingDetailAMS5.EMP_ADDRESS_1,
          $scope.info.EMP_ADDRESS_2 = $scope.bookingDetailAMS5.EMP_ADDRESS_2,
          $scope.info.EMP_POSTCODE = $scope.bookingDetailAMS5.EMP_POSTCODE,
          $scope.info.EMP_PHONE = $scope.bookingDetailAMS5.EMP_PHONE,
          $scope.info.EMP_EMAIL = $scope.bookingDetailAMS5.EMP_EMAIL,
          $scope.info.EMP_NAME_OF_INSURER = $scope.bookingDetailAMS5.EMP_NAME_OF_INSURER,
          $scope.info.EMP_WORKCOVER_MUNBER = $scope.bookingDetailAMS5.EMP_WORKCOVER_MUNBER,
          $scope.info.PURPOSE_OF_THE_ASSESSMENT = $scope.bookingDetailAMS5.PURPOSE_OF_THE_ASSESSMENT,
          $scope.bookingDetailAMS5.EX_DATE != null?$scope.info.EX_DATE_TEMP = new Date($scope.bookingDetailAMS5.EX_DATE):$scope.info.EX_DATE_TEMP = null;
          $scope.info.EXL_NAME = $scope.bookingDetailAMS5.EXL_NAME,
          $scope.info.EXL_ADDRESS_1 = $scope.bookingDetailAMS5.EXL_ADDRESS_1,
          $scope.info.EXL_ADDRESS_2 = $scope.bookingDetailAMS5.EXL_ADDRESS_2,
          $scope.info.EXL_POSTCODE = $scope.bookingDetailAMS5.EXL_POSTCODE,
          $scope.info.REPORTS_AND_DOCUMENTS = $scope.bookingDetailAMS5.REPORTS_AND_DOCUMENTS,
          $scope.info.NARRATIVE_HISTORY = $scope.bookingDetailAMS5.NARRATIVE_HISTORY,
          $scope.info.DIAGNOSIS_AND_STUDIES = $scope.bookingDetailAMS5.DIAGNOSIS_AND_STUDIES,
          $scope.info.DIAGNOSIS_AND_IMPAIRMENTS = $scope.bookingDetailAMS5.DIAGNOSIS_AND_IMPAIRMENTS,
          $scope.info.PROPORTION_OF_PERMANENT_IMPAIRMENT = $scope.bookingDetailAMS5.PROPORTION_OF_PERMANENT_IMPAIRMENT,
          $scope.info.INJURY_ASSESSMENT = $scope.bookingDetailAMS5.INJURY_ASSESSMENT,
          $scope.info.DOCTOR_ID = $scope.bookingDetailAMS5.DOCTOR_ID,
          $scope.bookingDetailAMS5.DT_DATE != null?$scope.info.DT_DATE_TEMP = new Date($scope.bookingDetailAMS5.DT_DATE):$scope.info.DT_DATE_TEMP = null;
          $scope.info.DT_SIGNATURE = $scope.bookingDetailAMS5.DT_SIGNATURE,
          $scope.info.DT_NAME = $scope.bookingDetailAMS5.DT_NAME,
          $scope.info.DT_ADDRESS_1 = $scope.bookingDetailAMS5.DT_ADDRESS_1,
          $scope.info.DT_ADDRESS_2 = $scope.bookingDetailAMS5.DT_ADDRESS_2,
          $scope.info.DT_POSTCODE = $scope.bookingDetailAMS5.DT_POSTCODE,
          $scope.info.DT_PHONE = $scope.bookingDetailAMS5.DT_PHONE,
          $scope.info.DT_EMAIL = $scope.bookingDetailAMS5.DT_EMAIL
      });

      $scope.isSaving = false;
      $scope.addNewFormAMS5 = function(info){
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.FormAms5.$valid) {
          if ($scope.updateAMS5 == true) {
              // console.log(info.WRK_DATE_OF_BIRTH_TEMP);
              info.WRK_DATE_OF_BIRTH_TEMP !=null?$scope.info.WRK_DATE_OF_BIRTH = ConfigService.getCommonDate(info.WRK_DATE_OF_BIRTH_TEMP):$scope.info.WRK_DATE_OF_BIRTH = null;
              info.WRK_DATE_OF_INJURI_TEMP != null?$scope.info.WRK_DATE_OF_INJURI = ConfigService.getCommonDate(info.WRK_DATE_OF_INJURI_TEMP):$scope.info.WRK_DATE_OF_INJURI = null;
              info.EX_DATE_TEMP != null?$scope.info.EX_DATE = ConfigService.getCommonDate(info.EX_DATE_TEMP):$scope.info.EX_DATE = null;
              info.DT_DATE_TEMP != null?$scope.info.DT_DATE = ConfigService.getCommonDate(info.DT_DATE_TEMP):$scope.info.DT_DATE = null;

              console.log($scope.info);
              if (info.BOOKING_ID != null && info.BOOKING_ID != "") {
                rlobService.updateFromAms5(info).then(function(data){
                  if (data.status == 'success') {
                    toastr.success("Update Success!","Success");
                    $scope.isSaving = true;
                    // $scope.AMS6_ID_NEW = data.data;
                    // console.log($scope.AMS6_ID_NEW);
                  }
                  else{
                    toastr.error("Update Failed!","Error");
                  }
                });
              }else{
                toastr.error("Not Booking Id!","Error");
              };
          };
          if ($scope.insertAMS5 == true) {
              info.WRK_DATE_OF_BIRTH_TEMP !=null?$scope.info.WRK_DATE_OF_BIRTH = ConfigService.getCommonDate(info.WRK_DATE_OF_BIRTH_TEMP):$scope.info.WRK_DATE_OF_BIRTH = null;
              info.WRK_DATE_OF_INJURI_TEMP != null?$scope.info.WRK_DATE_OF_INJURI = ConfigService.getCommonDate(info.WRK_DATE_OF_INJURI_TEMP):$scope.info.WRK_DATE_OF_INJURI = null;
              info.EX_DATE_TEMP != null?$scope.info.EX_DATE = ConfigService.getCommonDate(info.EX_DATE_TEMP):$scope.info.EX_DATE = null;
              info.DT_DATE_TEMP != null?$scope.info.DT_DATE = ConfigService.getCommonDate(info.DT_DATE_TEMP):$scope.info.DT_DATE = null;
              
              console.log($scope.info);
              if (info.BOOKING_ID != null && info.BOOKING_ID != "") {
                rlobService.addNewFromAms5(info).then(function(data){
                  if (data.status == 'success') {
                    toastr.success("Insert Success!","Success");
                    $scope.isSaving = true;
                    $scope.info.AMS5_ID = data.data;
                    console.log($scope.info);
                  }
                  else{
                    toastr.error("Insert Failed!","Error");
                  }
                });
              }else{
                toastr.error("Not Booking Id!","Error");
              };
          };
          // console.log(info);
        };
      };
      $scope.edit = false;
      $scope.editFormAms5 = function(){
        $scope.isSaving = false;
        $scope.edit = true;
      };
      $scope.updateFormAMS5 = function(info){
      // console.log(info.WRK_DATE_OF_BIRTH_TEMP);
      info.WRK_DATE_OF_BIRTH_TEMP !=null?$scope.info.WRK_DATE_OF_BIRTH = ConfigService.getCommonDate(info.WRK_DATE_OF_BIRTH_TEMP):$scope.info.WRK_DATE_OF_BIRTH = null;
      info.WRK_DATE_OF_INJURI_TEMP != null?$scope.info.WRK_DATE_OF_INJURI = ConfigService.getCommonDate(info.WRK_DATE_OF_INJURI_TEMP):$scope.info.WRK_DATE_OF_INJURI = null;
      info.EX_DATE_TEMP != null?$scope.info.EX_DATE = ConfigService.getCommonDate(info.EX_DATE_TEMP):$scope.info.EX_DATE = null;
      info.DT_DATE_TEMP != null?$scope.info.DT_DATE = ConfigService.getCommonDate(info.DT_DATE_TEMP):$scope.info.DT_DATE = null;
      
      console.log($scope.info);
      console.log(info);
      if (info.BOOKING_ID != null && info.BOOKING_ID != "") {
        rlobService.updateFromAms5(info).then(function(data){
          if (data.status == 'success') {
            toastr.success("Edit Success!","Success");
            $scope.isSaving = true;
            // $scope.AMS6_ID_NEW = data.data;
            // console.log($scope.AMS6_ID_NEW);
          }
          else{
            toastr.error("Edit Failed!","Error");
          }
        });
      }else{
        toastr.error("Not Booking Id!","Error");
      };
    };
    $scope.cancelFormAms5 = function(){
      $scope.isSaving = true;
    }
});