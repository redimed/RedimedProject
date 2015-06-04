angular.module("app.loggedIn.doctor.controller", [
    "app.loggedIn.doctor.home.controller",
    "app.loggedIn.doctor.list.controller",
    "app.loggedIn.doctor.timetable.controller",
    "app.loggedIn.doctor.patients.controller",
    "app.loggedIn.doctor.items.controller",
    "app.loggedIn.doctor.add.controller",
    "app.loggedIn.doctor.paperless.controller",
    "app.loggedIn.doctor.fachoose.controller"
])

.controller("DoctorController", function ($scope, $filter, $cookieStore, MODE_ROW, ConfigService, DoctorService) {
    // FOR VIEW LIST
    $scope.searchObject = {
        limit: 10,
        offset: 0,
        maxSize: 5,
        currentPage: 1,
        data: {
            NAME: "",
            Email: "",
            Phone: null
        }
    }
    // END FOR VIEW LIST

    //CONFIG
    $scope.rows = MODE_ROW;
    //END CONFIG

    $scope.searchPatientsObject = {
        doctor_id: 0,
        limit: 10,
        offset: 0,
        maxSize: 5,
        currentPage: 1,
        data: {
            First_name: "",
            Sur_name: "",
            Middle_name: "",
            Post_code: null
        }
    }

    // MODEL OBJECT DOCTOR DETAIL
    $scope.modelDoctorObject = {
        NAME: '',
        Email: '',
        Phone: '',
        Signature: '',
        Title: '',
        First_name: '',
        Middle_name: '',
        Sur_name: '',
        CLINICAL_DEPT_ID: null,
        Provider_no: 0,
        Provider_type: '',
        Appt_interval: 0,
        isReceiveEmailAfterHour: "0",
        Qualification_id: '',
        Prescriber_no: 0,
        Sign_off: '',
        Payee_provider_no: 0,
        ABN_no:0,
        Default_bank_account_id: '',
        Medical_Registration_no: 0,
        OSHC_ID: '',
        isAppointmentBook: "0",
        Isenable: "0",
        isNewCalendarSlot: "0",
        Address: ""
    }
    // END MODEL OBJECT DOCTOR DETAIL

	$scope.setClassAppt = function (type) {
        if (type === null || type === 'ChangePers')
            return 'danger';	
        if (type === 'Done')
            return 'success';
        if (type === 'NotYet')
            return 'warning';
        if (type === 'Billing')
            return 'info';
    }

    /**
     * tannv.dts@gmail.com
     * gan m
     */
    $scope.apptStatus=ptnConst.apptStatus;
    $scope.setColorAppt=function(status)
    {
        if(status==ptnConst.apptStatus.checkedIn.value)
        {
            return "un_tn_row_red un_tn_row_hover_red";
        }
        else if(status==ptnConst.apptStatus.workInProgress.value)
        {
            return "un_tn_row_yellow un_tn_row_hover_yellow";
        }
        else if(status==ptnConst.apptStatus.booking.value)
        {
            return "un_tn_row_green un_tn_row_hover_green";
        }
        else
        {
            return "un_tn_row_blank un_tn_row_hover_blank";
        }
    }
	
	$scope.views = {
		patient_info: 'modules/doctor/views/patient-info.html',
        paperless: 'modules/doctor/views/paperless.html',
		patient_path: 'modules/patient/views/patient/',
	};
	
	$scope.modeFormItem = {
		reset: function(){
			$scope.isSubmit = false;
			$scope.modelObjectMap = {
				ITEM_TYPE: 'Services',
				Prefix: '',
			};
			$scope.invalid = {};
		},
		validate: function(){
			var date_pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
			
			var isValidDateFormat = function(date){
				return date && !date_pattern.test(date);
			}
			
			// CHECK FORMAT OF DATE
			$scope.invalid.ITEM_START_DATE = isValidDateFormat($scope.modelObjectMap.ITEM_START_DATE);
		
			$scope.invalid.ITEM_END_DATE = isValidDateFormat($scope.modelObjectMap.ITEM_END_DATE);
			
			if($scope.invalid.ITEM_END_DATE || $scope.invalid.ITEM_START_DATE)
				return false;
				
			return true;
		},
		init: function(){
			$scope.modeFormItem.reset();
			$scope.doctorInfo = $cookieStore.get('doctorInfo');
			
			var dept_id = $scope.doctorInfo.CLINICAL_DEPT_ID;
			
			var initOption = function(){
				$scope.options = {};
				
				ConfigService.taxes_option().then(function(data){
					$scope.options.taxes = data;
				});
				ConfigService.prefix_headers_option('item').then(function(data){
					$scope.options.prefix_headers = data;
				});
				ConfigService.provider_types_option().then(function(data){
					$scope.options.provider_types = data;
				});
				
				ConfigService.inv_uoms_option().then(function(data){
					$scope.options.uoms = data;
				});
				
				DoctorService.getItemHeader(dept_id).then(function(data){
					$scope.options.item_headers = data;
				});
			}
			
			initOption();
		},
		submit: function(callback){
			var t_start = $scope.modelObjectMap.ITEM_START_DATE;
			var t_end =  $scope.modelObjectMap.ITEM_END_DATE;
			
			$scope.modelObjectMap.ITEM_START_DATE = ConfigService.getCommonDateDatabase(t_start);
			$scope.modelObjectMap.ITEM_END_DATE = ConfigService.getCommonDateDatabase(t_end);

			if(!$scope.modelObjectMap.ITEM_START_DATE){
                delete $scope.modelObjectMap.ITEM_START_DATE;
            }
            if(!$scope.modelObjectMap.ITEM_END_DATE){
                delete $scope.modelObjectMap.ITEM_END_DATE;
            }



            

			var arrFilter =  $filter('arrGetBy');
			var obj = arrFilter($scope.options.prefix_headers, 'PREFIX_NAME', $scope.modelObjectMap.ITEM_TYPE);
			$scope.modelObjectMap.Prefix = obj.PREFIX;

			callback();

		}
	}
	
})