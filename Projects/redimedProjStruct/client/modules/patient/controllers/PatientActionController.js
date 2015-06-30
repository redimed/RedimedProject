angular.module("app.loggedIn.patient.action.controller", [])

.controller("PatientActionController", function($scope, $modalInstance, toastr, ConfigService, PatientService, ReceptionistService, DoctorService, items){
    $scope.mode = "search";

	$scope.modelObject = {
        Title: 'Mr',
        First_name: '',
        Sur_name: '',
        Middle_name: '',
        Known_as: '',
        Address1: '',
        Address2: '',
        Post_code: null,
        Country: 'AU',
        DOB: '',
        Sex: 'Male',
        Home_phone: null,
        Work_phone: null,
        Mobile: null,
        No_SMS: "0",
        Account_type: '',
        Account_holder: '',
        Account_Seft: null,
        Medicare_no: null,
        Ref: null,
        Exp_medicare: '',
        Private_fund_id: '',
        MemberShip_no: null,
        UPI: null,
        HCC_Pension_No: null,
        Exp_pension: '',
        DVA_No: null,
        Balance: null,
        Pays_Gap_Only: "1",
        Email: '',
        Suburb: '',
        Alias_First_name: '',
        Alias_Sur_name: '',
        Phone_ext: null
    }

    $scope.options = {
        titles: ConfigService.title_option(),
        sexes: ConfigService.sex_option(),
        sms: ConfigService.yes_no_option(),
        countries: ConfigService.country_option(),
        gaps: ConfigService.yes_no_option()
    }

    // STEP
    $scope.step = 1;
    $scope.isSubmit = false;

    var reset = function(){
        $scope.step = 1;
        $scope.modelObjectMap = angular.copy($scope.modelObject);
    }

    $scope.nextStep = function(form){
        $scope.isSubmit = true;

        switch($scope.step){
            case 1:
                if(form.$invalid){
                    toastr.error("You got errors to fix", "Error");
                }else{
                    $scope.step++;
                    $scope.isSubmit = false;
                }
                break;
            case 2:
                if(form.$invalid){
                    toastr.error("You got errors to fix", "Error");
                }else{
                    $scope.step++;
                    $scope.isSubmit = false;
                }
                break;
            case 3:
                if(form.$invalid){
                    toastr.error("You got errors to fix", "Error");
                }else{
                    // DATE
                    $scope.modelObjectMap.DOB = ConfigService.getCommonDateDatabase($scope.modelObjectMap.DOB);
                    $scope.modelObjectMap.Exp_medicare = ConfigService.getCommonDateDatabase($scope.modelObjectMap.Exp_medicare);
                    $scope.modelObjectMap.Exp_pension = ConfigService.getCommonDateDatabase($scope.modelObjectMap.Exp_pension);
                    // END DATE

                    if(items.bookingObject.Patient_id !== null){
                        PatientService.updatePatient({patient: $scope.modelObjectMap}).then(function(data){
                            if (data.status != 'success') {
                                toastr.error("Cannot Insert!", "Error");
                                return;
                            }
                            reset();
                            toastr.success('Edit Successfully !!!', "Success");
                            $modalInstance.close({patientId: items.patient.Patient_id});
                        })
                    }else{
                        PatientService.insertPatient({patient: $scope.modelObjectMap}).then(function (data) {
                            if (data.status != 'success') {
                                toastr.error("Cannot Insert!", "Error");
                                return;
                            }
                            reset();
                            $scope.modelObjectBookingMap.Patient_id = data.data.Patient_id;

                            ReceptionistService.booking($scope.modelObjectBookingMap).then(function(data){
                                $modalInstance.close("OK");
                            })
                            toastr.success('Insert Successfully !!!', "Success");
                        })
                    }
                    $scope.isSubmit = false;
                }
                break;
        }
    }

    $scope.backStep = function(){
        if($scope.step > 1){
            $scope.step--;
        }
    }
    // END STEP

    $scope.modelObjectMap = {};
    var init = function(){
        angular.extend($scope.modelObject, items.patient);

        $scope.modelObjectMap = angular.copy($scope.modelObject);

        if(items.patient){
            // DATE
            $scope.modelObjectMap.DOB = ConfigService.convertToDate(items.patient.DOB);
            $scope.modelObjectMap.Exp_medicare = ConfigService.convertToDate(items.patient.Exp_medicare);
            $scope.modelObjectMap.Exp_pension = ConfigService.convertToDate(items.patient.Exp_pension);
            // END DATE

            // INT
            $scope.modelObjectMap.Home_phone = parseInt($scope.modelObjectMap.Home_phone);
            $scope.modelObjectMap.Work_phone = parseInt($scope.modelObjectMap.Work_phone);
            $scope.modelObjectMap.Mobile = parseInt($scope.modelObjectMap.Mobile);
            $scope.modelObjectMap.Account_Seft = parseInt($scope.modelObjectMap.Account_Seft);
            $scope.modelObjectMap.MemberShip_no = parseInt($scope.modelObjectMap.MemberShip_no);
            $scope.modelObjectMap.HCC_Pension_No = parseInt($scope.modelObjectMap.HCC_Pension_No);
            $scope.modelObjectMap.UPI = parseInt($scope.modelObjectMap.UPI);
            $scope.modelObjectMap.DVA_No = parseInt($scope.modelObjectMap.DVA_No);
            $scope.modelObjectMap.Balance = parseInt($scope.modelObjectMap.Balance);
            $scope.modelObjectMap.Ref = parseInt($scope.modelObjectMap.Ref);
            $scope.modelObjectMap.Post_code = parseInt($scope.modelObjectMap.Post_code);
            // END INT
        }

        // LOAD OPTIONS
        PatientService.listAccType().then(function (data) {
            if (data.status != 'success') {
                alert('error');
                return;
            }
            $scope.accTypeIndex = data.list;
        });

        PatientService.listPrvFund().then(function (data) {
            if (data.status != 'success') {
                alert('error');
                return;
            }
            $scope.fundIndex = data.list;
        });
    }

    init();

    /* SEARCH */
    $scope.search_map = {
        limit: 10,
        offset: 0,
        maxSize: 5,
        currentPage: 1,
        data: {
            Title: '',
            First_name: '',
            Middle_name: '',
            Sur_name: '',
            DOB: ''
        },
        ORDER_BY: "Sur_name ASC"
    }
    $scope.list = {};
    $scope.loadList = function () {
        PatientService.getByOption({search: $scope.search}).then(function (data) {

            for (var i = 0, len = data.list.length; i < len; ++i) {
                if (data.list[i].DOB)
                    data.list[i].DOB = ConfigService.getCommonDate(data.list[i].DOB);
            }
            $scope.list.results = data.list;
        });
    };

    var initSearch = function () {
        $scope.search = angular.copy($scope.search_map);

        $scope.sexIndex = [{code: 'Female'}, {code: 'Male'}];

        $scope.pagingIndex = [{code: 10}, {code: 20}, {code: 50}];



        $scope.loadList();

        PatientService.getTotals().then(function (data) {
            $scope.list.count = data.count;
        });
    }

    initSearch();
    $scope.setPage = function () {
        $scope.search.offset = ($scope.search.currentPage - 1) * $scope.search.limit;
        $scope.loadList();
    }

    $scope.goToBooking = function(list){
        $scope.modelObjectBookingMap.Patient_id = list.Patient_id;

        ReceptionistService.booking($scope.modelObjectBookingMap).then(function(data){
            $modalInstance.close("OK");
        })
    }
    /* END SEARCH */

    /* BOOKING DETAIL */
    $scope.modelObjectBooking = items.bookingObject;
    $scope.modelObjectBookingMap = {};
    angular.extend($scope.options, items.options);

    ReceptionistService.getById(items.cal_id).then(function(response){
        angular.extend($scope.modelObjectBooking, response);

        $scope.modelObjectBookingMap = angular.copy($scope.modelObjectBooking);

        //DOCTOR
        DoctorService.getById($scope.modelObjectBookingMap.DOCTOR_ID).then(function(doctor){
            $scope.modelObjectBookingMap.DOCTOR_NAME = doctor.NAME;
        });

        //SITE
        for(var i = 0; i < items.options.redimedsites.length; i++){
            if(items.options.redimedsites[i].id === $scope.modelObjectBookingMap.SITE_ID){
                $scope.modelObjectBookingMap.SITE_NAME = items.options.redimedsites[i].Site_name;
            }
        }

        //CLINICAL DEPARTMENT
        for(var i = 0; i < items.options.dept.length; i++){
            if(items.options.dept[i].CLINICAL_DEPT_ID === $scope.modelObjectBookingMap.CLINICAL_DEPT_ID){
                $scope.modelObjectBookingMap.CLINICAL_DEPT_NAME = items.options.dept[i].CLINICAL_DEPT_NAME;
            }
        }

        ConfigService.system_service_by_clinical($scope.modelObjectBookingMap.CLINICAL_DEPT_ID).then(function(list){
            items.options.services = list;
        })

        //PATIENT
        if(response.Patient_id !== null){
            PatientService.getPatient(response.Patient_id).then(function(data){
                $scope.modelObjectBookingMap.PATIENT = data.data[0];
            });
        }

        if(items.data.from_time_map){
            $scope.modelObjectBookingMap.from_time_map = items.data.from_time_map;
            $scope.modelObjectBookingMap.to_time_map = items.data.to_time_map;
        }else{
            $scope.modelObjectBookingMap.from_time = items.data.from_time;
            $scope.modelObjectBookingMap.from_time_map = ConfigService.convertToTimeString(items.data.from_time);

            $scope.modelObjectBookingMap.to_time = items.data.to_time;
            $scope.modelObjectBookingMap.to_time_map = ConfigService.convertToTimeString(items.data.to_time);
        }
    })
    /* END BOKING DETAIL */
})