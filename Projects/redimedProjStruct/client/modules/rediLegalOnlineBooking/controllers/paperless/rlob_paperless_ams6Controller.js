angular.module('app.loggedIn.rlob.paperless.ams6.controller',[])
    .controller("rlob_paperless_ams6Controller", function($scope,rlobService,toastr,ConfigService) {
		$scope.info = {
			AMS6_ID : null,
			BOOKING_ID : null,
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
			DT_DATE_TEMP : new Date(),
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
		console.log($scope.isAdmin);
		console.log($scope.isDoctor);
		console.log($scope.isAssistant);
		// console.log($scope.bookingDetail);
    	$scope.$watchCollection('bookingDetail',function(newValue,oldValue){
    		console.log(newValue);
			$scope.info.AMS6_ID = $scope.bookingDetail.AMS6_ID;
			$scope.info.BOOKING_ID = $scope.bookingDetail.BOOKING_ID;
			$scope.info.WRK_NAME = $scope.bookingDetail.WRK_NAME;
			$scope.info.WRK_ADDRESS_1 = $scope.bookingDetail.WRK_ADDRESS_1;
			$scope.info.WRK_ADDRESS_2 = $scope.bookingDetail.WRK_ADDRESS_2;
			$scope.info.WRK_POSTCODE =$scope.bookingDetail.WRK_POSTCODE;
			$scope.bookingDetail.WRK_DATE_OF_BIRTH != null?$scope.info.WRK_DATE_OF_BIRTH_TEMP = new Date($scope.bookingDetail.WRK_DATE_OF_BIRTH):$scope.info.WRK_DATE_OF_BIRTH_TEMP = null;
			// $scope.info.WRK_DATE_OF_BIRTH = $scope.bookingDetail.WRK_DATE_OF_BIRTH ;
			// $scope.info.WRK_DATE_OF_INJURI = $scope.bookingDetail.WRK_DATE_OF_INJURI;
			$scope.bookingDetail.WRK_DATE_OF_INJURI != null?$scope.info.WRK_DATE_OF_INJURI_TEMP = new Date($scope.bookingDetail.WRK_DATE_OF_INJURI):$scope.info.WRK_DATE_OF_INJURI_TEMP = null;
			$scope.info.WRK_INSURER_CLAIM_NUMBER = $scope.bookingDetail.WRK_INSURER_CLAIM_NUMBER;
			$scope.info.WRK_DESCRIPTION_OF_INJURI = $scope.bookingDetail.WRK_DESCRIPTION_OF_INJURI;
			$scope.info.WRK_PHONE = $scope.bookingDetail.WRK_PHONE;
			$scope.info.WRK_EMAIL = $scope.bookingDetail.WRK_EMAIL;
			$scope.info.WRK_WORKCOVER_WA_CLAIM_NUMBER = $scope.bookingDetail.WRK_WORKCOVER_WA_CLAIM_NUMBER;
			$scope.info.COMPANIES_ID = $scope.bookingDetail.COMPANIES_ID;
			$scope.info.EMP_ORGANISATION_NAME = $scope.bookingDetail.EMP_ORGANISATION_NAME;
			$scope.info.EMP_CONTACT_PERSON = $scope.bookingDetail.EMP_CONTACT_PERSON;
			$scope.info.EMP_ADDRESS_1 = $scope.bookingDetail.EMP_ADDRESS_1;
			$scope.info.EMP_ADDRESS_2 =$scope.bookingDetail.EMP_ADDRESS_2;
			$scope.info.EMP_POSTCODE = $scope.bookingDetail.EMP_POSTCODE;
			$scope.info.EMP_PHONE = $scope.bookingDetail.EMP_PHONE;
			$scope.info.EMP_EMAIL = $scope.bookingDetail.EMP_EMAIL;
			$scope.info.EMP_NAME_OF_INSURER = $scope.bookingDetail.EMP_NAME_OF_INSURER;
			$scope.info.EMP_WORKCOVER_MUNBER = $scope.bookingDetail.EMP_WORKCOVER_MUNBER;
			$scope.info.PURPOSE_OF_THE_ASSESSMENT = $scope.bookingDetail.PURPOSE_OF_THE_ASSESSMENT;
			// $scope.info.DATE_ASSESS = $scope.bookingDetail.DATE_ASSESS;
			$scope.bookingDetail.DATE_ASSESS != null?$scope.info.DATE_ASSESS_TEMP = new Date($scope.bookingDetail.DATE_ASSESS):$scope.info.DATE_ASSESS_TEMP = null;
			$scope.info.INJURY_ASSESSMENT = $scope.bookingDetail.INJURY_ASSESSMENT;
			$scope.info.DOCTOR_ID = $scope.bookingDetail.DOCTOR_ID;
			$scope.bookingDetail.DT_DATE != null?$scope.info.DT_DATE_TEMP = new Date($scope.bookingDetail.DT_DATE):$scope.info.DT_DATE_TEMP = new Date();
			// $scope.info.DT_DATE = $scope.bookingDetail.DT_DATE;
			$scope.info.DT_SIGNATURE = $scope.bookingDetail.DT_SIGNATURE;
			$scope.info.DT_NAME = $scope.bookingDetail.DT_NAME;
			$scope.info.DT_ADDRESS_1 = $scope.bookingDetail.DT_ADDRESS_1;
			$scope.info.DT_ADDRESS_2 = $scope.bookingDetail.DT_ADDRESS_2;
			$scope.info.DT_POSTCODE = $scope.bookingDetail.DT_POSTCODE;
			$scope.info.DT_PHONE = $scope.bookingDetail.DT_PHONE;
			$scope.info.DT_EMAIL = $scope.bookingDetail.DT_EMAIL;
			$scope.info.ISENABLE = $scope.bookingDetail.ISENABLE;
    	});
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
		$scope.isSaving = false;
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
							}
							else{
								toastr.error("Insert Failed!","Error");
							}
						});
					}else{
						toastr.error("Not Booking Id!","Error");
					};
				};
			};
		};
		$scope.edit = false;
		$scope.editFormAms6 = function(){
			$scope.isSaving = false;
			$scope.edit = true;
		};
		$scope.updateFormAMS6 = function(info){
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
		$scope.cancelFormAms6 = function(){
			$scope.isSaving = true;
		}
});
