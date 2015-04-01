angular.module('app.loggedIn.rlob.paperless.ams5.controller',[])
    .controller("rlob_paperless_ams5Controller", function($scope,rlobService,toastr,ConfigService) {
      rlobService.checkBookingInFormAms5(rlobService.bookingInfoPaperless.id).then(function(data){
            if (data.status == 'update') {
                $scope.updateAMS5 = true;
                $scope.info = data.data;
                data.data.WRK_DATE_OF_BIRTH != null?$scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date(data.data.WRK_DATE_OF_BIRTH):$scope.info.WRK_DATE_OF_BIRTH_TEMP = null;
                data.data.WRK_DATE_OF_INJURI != null?$scope.info.WRK_DATE_OF_INJURI_TEMP = new Date(data.data.WRK_DATE_OF_INJURI):$scope.info.WRK_DATE_OF_INJURI_TEMP = null;
                data.data.EX_DATE != null?$scope.info.EX_DATE_TEMP = new Date(data.data.EX_DATE):$scope.info.EX_DATE_TEMP = null;
                data.data.DT_DATE != null?$scope.info.DT_DATE_TEMP = new Date(data.data.DT_DATE):$scope.info.DT_DATE_TEMP = new Date();
                console.log(data.data);
                console.log("update a5:"+$scope.updateAMS5);
                console.log($scope.info);
                $scope.isSaving = true;
            };
            if (data.status == 'insert') {
                $scope.insertAMS5 = true;
                    rlobService.getBookingDoctorCompany(rlobService.bookingInfoPaperless.id).then(function(data){
                        if (data.status == "success") {
                            console.log(data.data);
                            $scope.info.WRK_NAME = data.data.WRK_SURNAME +" "+data.data.WRK_OTHERNAMES;
                            data.data.WRK_DATE_OF_BIRTH != null?$scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date(data.data.WRK_DATE_OF_BIRTH):$scope.info.WRK_DATE_OF_BIRTH_TEMP = null;
                            data.data.WRK_DATE_OF_INJURI != null?$scope.info.WRK_DATE_OF_INJURI_TEMP = new Date(data.data.WRK_DATE_OF_INJURI):$scope.info.WRK_DATE_OF_INJURI_TEMP = null;
                            // $scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date(data.data.WRK_DATE_OF_BIRTH);
                            $scope.info.WRK_PHONE = data.data.WRK_PHONE;
                            $scope.info.WRK_EMAIL = data.data.WRK_EMAIL;
                            // $scope.info.WRK_DATE_OF_INJURI_TEMP = new Date(data.data.WRK_DESCRIPTION_OF_INJURI);
                            $scope.info.EMP_ORGANISATION_NAME = data.data.EMP_ORGANISATION_NAME;
                            $scope.info.EMP_POSTCODE = data.data.EMP_POSTCODE;
                            $scope.info.EMP_ADDRESS_1 = data.data.EMP_ADDRESS_1;
                            $scope.info.EMP_EMAIL = data.data.EMP_EMAIL;
                            $scope.info.EMP_PHONE = data.data.EMP_PHONE;
                            $scope.info.DT_NAME = data.data.DT_NAME;
                            $scope.info.DT_ADDRESS_1 = data.data.DT_ADDRESS_1;
                            $scope.info.DT_EMAIL = data.data.DT_EMAIL;
                            $scope.info.DT_PHONE = data.data.DT_PHONE;
                            $scope.info.DT_SIGNATURE = data.data.DT_SIGNATURE;
                            $scope.info.DT_DATE_TEMP = new Date();
                            console.log($scope.info);
                        };
                    });
                $scope.isSaving = false;
                console.log("insert a5:"+$scope.insertAMS5);
            };
        });
    	$scope.info = {
    		  AMS5_ID : null,
    		  BOOKING_ID : rlobService.bookingInfoPaperless.id,
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
      $scope.scrollTo= function(el, offeset)
        {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
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
      $scope.addNewFormAMS5 = function(info){
        // alert($scope.FormAms5.$invalid);
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
                    $scope.scrollTo($("#bodydata"),-200);
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
                    $scope.scrollTo($("#bodydata"),-200);
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
        }else{
          $scope.hadForcused=true;
          $('.errorSummaryAms5').show();
        };
      };
      $scope.edit = false;
      $scope.editFormAms5 = function(){
        $scope.isSaving = false;
        $scope.edit = true;
      };
      $scope.updateFormAMS5 = function(info){
      // alert($scope.FormAms5.$invalid);
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.FormAms5.$valid) {
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
              $scope.scrollTo($("#bodydata"),-200);

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
      }else{
        $scope.hadForcused=true;
        $('.errorSummaryAms5').show();
      };
    };
    $scope.goToName = function(name) {
      $scope.scrollTo($("[name='"+name+"']"),-200);
    }
    $scope.cancelFormAms5 = function(){
      $scope.isSaving = true;
    }
});