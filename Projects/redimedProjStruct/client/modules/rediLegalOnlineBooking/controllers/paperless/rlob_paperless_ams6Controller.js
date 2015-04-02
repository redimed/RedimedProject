angular.module('app.loggedIn.rlob.paperless.ams6.controller',[])
    .controller("rlob_paperless_ams6Controller", function($scope,rlobService,toastr,ConfigService) {
    	rlobService.checkBookingInFormAms6(rlobService.bookingInfoPaperless.id).then(function(data){
    		if (data.status == 'update') {
    			$scope.update = true;
    			$scope.info = data.data;
    			data.data.WRK_DATE_OF_BIRTH != null?$scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date(data.data.WRK_DATE_OF_BIRTH):$scope.info.WRK_DATE_OF_BIRTH_TEMP = null;
                data.data.WRK_DATE_OF_INJURI != null?$scope.info.WRK_DATE_OF_INJURI_TEMP = new Date(data.data.WRK_DATE_OF_INJURI):$scope.info.WRK_DATE_OF_INJURI_TEMP = null;
                data.data.DATE_ASSESS != null?$scope.info.DATE_ASSESS_TEMP = new Date(data.data.DATE_ASSESS):$scope.info.DATE_ASSESS_TEMP = null;
                data.data.DT_DATE != null?$scope.info.DT_DATE_TEMP = new Date(data.data.DT_DATE):$scope.info.DT_DATE_TEMP = new Date();
    			console.log("update a6:"+$scope.update);
			    console.log($scope.info);
				$scope.isSaving = true;
    		};
    		if (data.status == 'insert') {
    			$scope.insert = true;
	    			rlobService.getBookingDoctorCompany(rlobService.bookingInfoPaperless.id).then(function(data){
			    		if (data.status == "success") {
                            $scope.info.WRK_NAME = data.data.WRK_SURNAME +" "+data.data.WRK_OTHERNAMES;
                            // $scope.info.WRK_DATE_OF_BIRTH = data.data.WRK_DATE_OF_BIRTH;
                            $scope.info.WRK_PHONE = data.data.WRK_PHONE;
                            $scope.info.WRK_EMAIL = data.data.WRK_EMAIL;
                            data.data.WRK_DATE_OF_BIRTH != null?$scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date(data.data.WRK_DATE_OF_BIRTH):$scope.info.WRK_DATE_OF_BIRTH_TEMP = null;
                			data.data.WRK_DATE_OF_INJURI != null?$scope.info.WRK_DATE_OF_INJURI_TEMP = new Date(data.data.WRK_DATE_OF_INJURI):$scope.info.WRK_DATE_OF_INJURI_TEMP = null;
                            // $scope.info.WRK_DESCRIPTION_OF_INJURI = data.data.WRK_DESCRIPTION_OF_INJURI;
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
    			console.log("insert a6:"+$scope.insert);
    		};
    	});
        
		$scope.info = {
			AMS6_ID : null,
			BOOKING_ID : rlobService.bookingInfoPaperless.id,
			WRK_NAME : null,
			WRK_ADDRESS_1 : null,
			WRK_ADDRESS_2 : null,
			WRK_POSTCODE : null,
			WRK_DATE_OF_BIRTH_TEMP : null,
			WRK_DATE_OF_BIRTH : null,
			WRK_DATE_OF_INJURI : null,
			WRK_DATE_OF_INJURI_TEMP : null,
			WRK_INSURER_CLAIM_NUMBER : null,
			WRK_DESCRIPTION_OF_INJURI : null,
			WRK_PHONE : null,
			WRK_EMAIL : null,
			WRK_WORKCOVER_WA_CLAIM_NUMBER : null,
			COMPANIES_ID : null,
			EMP_ORGANISATION_NAME : null,
			EMP_CONTACT_PERSON : null,
			EMP_ADDRESS_1 : null,
			EMP_ADDRESS_2 :null,
			EMP_POSTCODE : null,
			EMP_PHONE : null,
			EMP_EMAIL : null,
			EMP_NAME_OF_INSURER : null,
			EMP_WORKCOVER_MUNBER : null,
			PURPOSE_OF_THE_ASSESSMENT : null,
			DATE_ASSESS : null,
			DATE_ASSESS_TEMP : null,
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
			DT_EMAIL : null,
			ISENABLE : null
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
		$scope.addNewFormAMS6 = function(info){
			$scope.$broadcast('show-errors-check-validity');
		    if ($scope.FormAms6.$valid) {
				if ($scope.update == true) {
					// console.log(info.WRK_DATE_OF_BIRTH_TEMP);
					info.WRK_DATE_OF_BIRTH_TEMP !=null?$scope.info.WRK_DATE_OF_BIRTH = ConfigService.getCommonDate(info.WRK_DATE_OF_BIRTH_TEMP):$scope.info.WRK_DATE_OF_BIRTH = null;
					info.WRK_DATE_OF_INJURI_TEMP != null?$scope.info.WRK_DATE_OF_INJURI = ConfigService.getCommonDate(info.WRK_DATE_OF_INJURI_TEMP):$scope.info.WRK_DATE_OF_INJURI = null;
					info.DATE_ASSESS_TEMP != null?$scope.info.DATE_ASSESS = ConfigService.getCommonDate(info.DATE_ASSESS_TEMP):$scope.info.DATE_ASSESS = null;
					info.DT_DATE_TEMP != null?$scope.info.DT_DATE = ConfigService.getCommonDate(info.DT_DATE_TEMP):$scope.info.DT_DATE = null;
					
					console.log($scope.info);
					if (info.BOOKING_ID != null && info.BOOKING_ID != "") {
						rlobService.updateFromAms6(info).then(function(data){
							if (data.status == 'success') {
								toastr.success("Update Success!","Success");
								$scope.isSaving = true;
								// $scope.AMS6_ID_NEW = data.data;
								// console.log($scope.AMS6_ID_NEW);
								$scope.scrollTo($("#bodydata']"),-200);
							}
							else{
								toastr.error("Update Failed!","Error");
							}
						});
					}else{
						toastr.error("Not Booking Id!","Error");
					};
					
				};
				if ($scope.insert == true) {
					// console.log(info.WRK_DATE_OF_BIRTH_TEMP);
					info.WRK_DATE_OF_BIRTH_TEMP !=null?$scope.info.WRK_DATE_OF_BIRTH = ConfigService.getCommonDate(info.WRK_DATE_OF_BIRTH_TEMP):$scope.info.WRK_DATE_OF_BIRTH = null;
					info.WRK_DATE_OF_INJURI_TEMP != null?$scope.info.WRK_DATE_OF_INJURI = ConfigService.getCommonDate(info.WRK_DATE_OF_INJURI_TEMP):$scope.info.WRK_DATE_OF_INJURI = null;
					info.DATE_ASSESS_TEMP != null?$scope.info.DATE_ASSESS = ConfigService.getCommonDate(info.DATE_ASSESS_TEMP):$scope.info.DATE_ASSESS = null;
					info.DT_DATE_TEMP != null?$scope.info.DT_DATE = ConfigService.getCommonDate(info.DT_DATE_TEMP):$scope.info.DT_DATE = null;
					
					console.log($scope.info);
					if (info.BOOKING_ID != null && info.BOOKING_ID != "") {
						rlobService.addNewFromAms6(info).then(function(data){
							if (data.status == 'success') {
								toastr.success("Insert Success!","Success");
								$scope.isSaving = true;
								$scope.info.AMS6_ID = data.data;
								console.log($scope.info);
								$scope.scrollTo($("#bodydata]"),-200);
							}
							else{
								toastr.error("Insert Failed!","Error");
							}
						});
					}else{
						toastr.error("Not Booking Id!","Error");
					};
				};
			}else{
				$scope.hadForcused=true;
          		$('.errorSummaryAms6').show();
			};
		};
		$scope.edit = false;
		$scope.editFormAms6 = function(){
			$scope.isSaving = false;
			$scope.edit = true;
		};
		$scope.updateFormAMS6 = function(info){
			$scope.$broadcast('show-errors-check-validity');
		    if ($scope.FormAms6.$valid) {
				// console.log(info.WRK_DATE_OF_BIRTH_TEMP);
				info.WRK_DATE_OF_BIRTH_TEMP !=null?$scope.info.WRK_DATE_OF_BIRTH = ConfigService.getCommonDate(info.WRK_DATE_OF_BIRTH_TEMP):$scope.info.WRK_DATE_OF_BIRTH = null;
				info.WRK_DATE_OF_INJURI_TEMP != null?$scope.info.WRK_DATE_OF_INJURI = ConfigService.getCommonDate(info.WRK_DATE_OF_INJURI_TEMP):$scope.info.WRK_DATE_OF_INJURI = null;
				info.DATE_ASSESS_TEMP != null?$scope.info.DATE_ASSESS = ConfigService.getCommonDate(info.DATE_ASSESS_TEMP):$scope.info.DATE_ASSESS = null;
				info.DT_DATE_TEMP != null?$scope.info.DT_DATE = ConfigService.getCommonDate(info.DT_DATE_TEMP):$scope.info.DT_DATE = null;
				
				console.log($scope.info);
				console.log(info);
				if (info.BOOKING_ID != null && info.BOOKING_ID != "") {
					rlobService.updateFromAms6(info).then(function(data){
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
          		$('.errorSummaryAms6').show();
			};
		};
		$scope.goToName = function(name) {
	      $scope.scrollTo($("[name='"+name+"']"),-200);
	    };
		$scope.cancelFormAms6 = function(){
			$scope.isSaving = true;
		}
});
