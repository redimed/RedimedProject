angular.module('app.loggedIn.rlob.paperless.controller',[])
    .controller("rlob_paperlessController", function($scope,rlobService,$cookieStore) {
    	$scope.update = false;
    	$scope.insert = false;
        $scope.updateAMS5 = false;
        $scope.insertAMS5 = false;
    	rlobService.checkBookingInFormAms6(rlobService.bookingInfoPaperless.id).then(function(data){
    		if (data.status == 'update') {
    			$scope.update = true;
    			$scope.bookingDetail = data.data;
    			console.log("update a6:"+$scope.update);
			    console.log($scope.bookingDetail);
    		};
    		if (data.status == 'insert') {
    			$scope.insert = true;
	    			rlobService.getBookingDoctorCompany(rlobService.bookingInfoPaperless.id).then(function(data){
			    		if (data.status == "success") {
                            $scope.bookingDetail.WRK_NAME = data.data.WRK_SURNAME +" "+data.data.WRK_OTHERNAMES;
                            $scope.bookingDetail.WRK_DATE_OF_BIRTH = data.data.WRK_DATE_OF_BIRTH;
                            $scope.bookingDetail.WRK_PHONE = data.data.WRK_PHONE;
                            $scope.bookingDetail.WRK_EMAIL = data.data.WRK_EMAIL;
                            $scope.bookingDetail.WRK_DESCRIPTION_OF_INJURI = data.data.WRK_DESCRIPTION_OF_INJURI;
                            $scope.bookingDetail.EMP_ORGANISATION_NAME = data.data.EMP_ORGANISATION_NAME;
                            $scope.bookingDetail.EMP_POSTCODE = data.data.EMP_POSTCODE;
                            $scope.bookingDetail.EMP_ADDRESS_1 = data.data.EMP_ADDRESS_1;
                            $scope.bookingDetail.EMP_EMAIL = data.data.EMP_EMAIL;
                            $scope.bookingDetail.EMP_PHONE = data.data.EMP_PHONE;
                            $scope.bookingDetail.DT_NAME = data.data.DT_NAME;
                            $scope.bookingDetail.DT_ADDRESS_1 = data.data.DT_ADDRESS_1;
                            $scope.bookingDetail.DT_EMAIL = data.data.DT_EMAIL;
                            $scope.bookingDetail.DT_PHONE = data.data.DT_PHONE;
			    			$scope.bookingDetail.DT_SIGNATURE = data.data.DT_SIGNATURE;
			    			console.log($scope.bookingDetail);
			    		};
	    			});
    			console.log("insert a6:"+$scope.insert);
    		};
    	});
        rlobService.checkBookingInFormAms5(rlobService.bookingInfoPaperless.id).then(function(data){
            if (data.status == 'update') {
                $scope.updateAMS5 = true;
                $scope.bookingDetailAMS5 = data.data;
                console.log("update a5:"+$scope.updateAMS5);
                console.log($scope.bookingDetailAMS5);
            };
            if (data.status == 'insert') {
                $scope.insertAMS5 = true;
                    rlobService.getBookingDoctorCompany(rlobService.bookingInfoPaperless.id).then(function(data){
                        if (data.status == "success") {
                            $scope.bookingDetailAMS5.WRK_NAME = data.data.WRK_SURNAME +" "+data.data.WRK_OTHERNAMES;
                            $scope.bookingDetailAMS5.WRK_DATE_OF_BIRTH = data.data.WRK_DATE_OF_BIRTH;
                            $scope.bookingDetailAMS5.WRK_PHONE = data.data.WRK_PHONE;
                            $scope.bookingDetailAMS5.WRK_EMAIL = data.data.WRK_EMAIL;
                            $scope.bookingDetailAMS5.WRK_DESCRIPTION_OF_INJURI = data.data.WRK_DESCRIPTION_OF_INJURI;
                            $scope.bookingDetailAMS5.EMP_ORGANISATION_NAME = data.data.EMP_ORGANISATION_NAME;
                            $scope.bookingDetailAMS5.EMP_POSTCODE = data.data.EMP_POSTCODE;
                            $scope.bookingDetailAMS5.EMP_ADDRESS_1 = data.data.EMP_ADDRESS_1;
                            $scope.bookingDetailAMS5.EMP_EMAIL = data.data.EMP_EMAIL;
                            $scope.bookingDetailAMS5.EMP_PHONE = data.data.EMP_PHONE;
                            $scope.bookingDetailAMS5.DT_NAME = data.data.DT_NAME;
                            $scope.bookingDetailAMS5.DT_ADDRESS_1 = data.data.DT_ADDRESS_1;
                            $scope.bookingDetailAMS5.DT_EMAIL = data.data.DT_EMAIL;
                            $scope.bookingDetailAMS5.DT_PHONE = data.data.DT_PHONE;
                            $scope.bookingDetailAMS5.DT_SIGNATURE = data.data.DT_SIGNATURE;
                            console.log($scope.bookingDetailAMS5);
                        };
                    });
                console.log("insert a5:"+$scope.insertAMS5);
            };
        });
        $scope.bookingDetailAMS5 = {
              AMS5_ID : null,
              BOOKING_ID : rlobService.bookingInfoPaperless.id,
              WRK_NAME : null,
              WRK_ADDRESS_2 : null,
              WRK_ADDRESS_1 : null,
              WRK_POSTCODE : null,
              WRK_DATE_OF_BIRTH : null,
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
              DT_DATE : null,
              DT_SIGNATURE : null,
              DT_NAME : null,
              DT_ADDRESS_1 : null,
              DT_ADDRESS_2 : null,
              DT_POSTCODE : null,
              DT_PHONE : null,
              DT_EMAIL : null
        };
    	$scope.bookingDetail = {
			AMS6_ID : null,
            BOOKING_ID : rlobService.bookingInfoPaperless.id,
            WRK_NAME : null,
            WRK_ADDRESS_1 : null,
            WRK_ADDRESS_2 : null,
            WRK_POSTCODE : null,
            WRK_DATE_OF_BIRTH : null,
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
            EMP_ADDRESS_2 :null,
            EMP_POSTCODE : null,
            EMP_PHONE : null,
            EMP_EMAIL : null,
            EMP_NAME_OF_INSURER : null,
            EMP_WORKCOVER_MUNBER : null,
            PURPOSE_OF_THE_ASSESSMENT : null,
            DATE_ASSESS : null,
            INJURY_ASSESSMENT : null,
            DOCTOR_ID : null,
            DT_DATE : null,
            DT_SIGNATURE : null,
            DT_NAME : null,
            DT_ADDRESS_1 : null,
            DT_ADDRESS_2 : null,
            DT_POSTCODE : null,
            DT_PHONE : null,
            DT_EMAIL : null,
    	};
    	$scope.uersType=rlobConstant.uersType;
    	$scope.loginInfo=$cookieStore.get('userInfo').user_type;
      console.log($scope.loginInfo);
    	$scope.isDoctor = true;
    	if ($scope.loginInfo == $scope.uersType.doctor) {
    		$scope.isDoctor = false;
    	};
    	$scope.isAdmin = true;
    	if ($scope.loginInfo == $scope.uersType.admin) {
    		$scope.isAdmin = false;
    	};
    	$scope.isAssistant = true;
    	if ($scope.loginInfo == $scope.uersType.assistant) {
    		$scope.isAssistant = false;
    	};
    	console.log($scope.uersType.doctor);
});