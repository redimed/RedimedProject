angular.module("app.loggedIn.patient.controller", [
    "app.loggedIn.patient.list.controller",

    "app.loggedIn.patient.home.controller",
    "app.loggedIn.patient.search.controller",
    "app.loggedIn.patient.action.controller",

    "app.loggedIn.patient.booking.controller",
    "app.loggedIn.patient.detail.controller",
    "app.loggedIn.patient.recall.controller",
    "app.loggedIn.patient.outside_referrals.controller",
    "app.loggedIn.patient.referrals.controller",
    "app.loggedIn.patient.appointment.controller",
    "app.loggedIn.patient.companies.controller",
    "app.loggedIn.patient.workcover.controller",
    "app.loggedIn.patient.itemsheet.controller",
    "app.loggedIn.patient.invoices.controller",
    "app.loggedIn.patient.invoice_detail.controller",
    "app.loggedIn.patient.appt.controller",
    "app.loggedIn.patient.apptdoc.controller",
    "app.loggedIn.patient.checkin.controller",
    "app.loggedIn.patient.detail.master.controller"
])
.controller("PatientController", function ($state, $scope, sysServiceService, DoctorService, $cookieStore, toastr, ConfigService, PatientService, MODE_ROW, $stateParams, mdtAppointmentService, rlobService) {
    var patient_id = $scope.patient_id = $stateParams.patient_id;
    var cal_id = $scope.cal_id = $stateParams.cal_id;
    //chien set patient id in allergy
    $scope.search = {};
    $scope.search.Patient_id = $scope.patient_id;
    //change bar
    $scope.patientBarVer={};
    $scope.patientBarVer.version='zip';
    // phanquocchien.c1109g@gmail.com
    // set bar version
    $scope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
        if(toState.name.indexOf('loggedIn.patient')>-1)
        {
            $scope.patientBarVer.version='zip';
            // $scope.patientBarVer.version='full';
        }
    })
    $scope.patient_detail_modules = [
        {wrap:0,'name': 'Patient', 'color': 'blue-soft', 'desc': 'Info', 'icon': 'fa fa-user',
            'state': 'loggedIn.patient.detail'},
        {wrap:0,'name': 'Companies', 'color': 'red-soft', 'desc': 'Total: 0', 'icon': 'fa fa-building',
            'state': 'loggedIn.patient.company'},
        {wrap:0,'name': 'Claim', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o',
            'state': 'loggedIn.patient.claim.list'},
        {wrap:0,'name': 'Alert', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o',
            'state': 'loggedIn.patient.alert.list({patientId:' + $stateParams.patient_id + ', calId:'+$stateParams.cal_id+'})'},
        {wrap:0,'name': 'Referral', 'color': 'purple-soft', 'desc': 'Total: 0', 'icon': 'fa fa-envelope-o',
            'state': 'loggedIn.patient.outreferral.list({patientId:' + $stateParams.patient_id + ', calId:'+$stateParams.cal_id+'})'},
        // {wrap:1,'name': 'Injury Management', 'icon': 'fa fa-medkit', 'color': 'blue-soft', 'desc': '',
        //     'state': 'loggedIn.patient.im_List'},
        {wrap:1,'name': 'Consultation', 'icon': 'fa fa-user-md', 'color': 'purple-soft', 'desc': '',
            'state': 'loggedIn.patient.consult({patient_id:' + $stateParams.patient_id + ', cal_id:' +$stateParams.cal_id+ '})'},    
        {wrap:0,'name':'Problem List', 'color':'red-soft', 'icon':'fa fa-exclamation-triangle', 
            'state':'loggedIn.patient.problem_list'},
        {wrap:0,'name':'Allergy list', 'color':'green-soft', 'icon':'fa fa-exclamation-triangle', 
            'state':'loggedIn.patient.allergy.list'},
    ];

    $scope.patient_apt_modules = [
        // {'name': 'Appointment', 'icon': 'fa fa-bookmark-o', 'color': 'blue-soft', 'desc': 'Info',
        //     'state': 'loggedIn.receptionist.appointment.detail({patient_id:' + $stateParams.patient_id + ', cal_id:' + $stateParams.cal_id + '})'},
        {wrap:1,'name': 'ItemSheet', 'icon': 'fa fa-bookmark-o', 'color': 'blue-soft', 'desc': 'Info',
            'state': 'loggedIn.patient.itemsheet'},
        // {wrap:1,'name': 'Paperless', 'icon': 'fa fa-pencil-square-o', 'color': 'red-soft', 'desc': 'Total: 0',
        //     'state': 'loggedIn.doctor.paperless({patient_id:' + $stateParams.patient_id + ', cal_id:' + $stateParams.cal_id + '})'},
        // {wrap:1,'name': 'Workcover', 'icon': 'fa fa-paper-plane-o', 'color': 'green-soft', 'desc': 'Has: 0',
        //     'state': 'loggedIn.patient.workcover'},
        // {wrap:1,'name': 'Script', 'icon': 'fa fa-envelope-square', 'color': 'purple-soft', 'desc': 'Has: 0',
        //     'state': 'loggedIn.patient.script'},
        // {wrap:1,'name': 'Make Referral', 'icon': 'fa fa-envelope-square', 'color': 'blue-soft', 'desc': 'Has: 0',
        //     'state': 'loggedIn.patient.referral.list'},
        {wrap:0,'name': 'Invoices', 'icon': 'fa fa-money', 'color': 'red-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.patient.invoices'},    
        {wrap:1,'name': 'Appointment List', 'icon': 'fa fa-repeat', 'color': 'green-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.patient.appt'},
        // {wrap:1,'name': 'Documents', 'icon': 'fa fa-file-text', 'color': 'purple-soft', 'desc': 'Total: 0',
        //     'state': 'loggedIn.patient.apptdoc'},
        {wrap:1,'name': 'Recall', 'color': 'blue-soft', 'desc': 'Recall', 'icon': 'fa fa-repeat',
            'state': 'loggedIn.patient.recall'},
    ];
    
    //get patient info
    $scope.current_patient = {};
    $scope.getPatientInfo = function(){
        PatientService.mdtById($scope.patient_id).then(function (response) {
            $scope.current_patient = response.data;
            $scope.current_patient.company = response.company;
            for (var key in $scope.current_patient) {
                if ($scope.current_patient[key]) {
                    if (key.indexOf("is") != -1 || key.indexOf("Is") != -1)
                        $scope.current_patient[key] = $scope.current_patient[key].toString();
                    if (key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
                        $scope.current_patient[key] = new Date($scope.current_patient[key]);
                }
            }

            $scope.current_patient.Title = parseInt($scope.current_patient.Title);
            if ($stateParams.cal_id != -1) {
                mdtAppointmentService.byId($scope.cal_id).then(function(response){
                    if(response.status == 'error'){
                        toastr.error('Error Get Detail', 'Error');
                    }else{

                        $scope.current_patient.Site_name=response.data.site.Site_name;
                        $scope.current_patient.FROM_TIME=response.data.FROM_TIME;
                    }
                })
            };
        });
    }
    $scope.getPatientInfo();
    // get appointments
    
    //chien get list allercy
    $scope.setListAllergy = function(){
        PatientService.getListAllergyinPatient($scope.search).then(function(data){
            if (data.status == 'success') {
                $scope.listAllergyinPAtient = data.list;
            };
        })
    }
    $scope.setListAllergy();

    // FOR VIEW LIST
    $scope.searchObject = {
        doctor_id: 0,
        limit: 5,
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
    // END FOR VIEW LIST

    //CONFIG
    $scope.rows = MODE_ROW;
    //END CONFIG

    // USE FOR BOOKING
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
    
    $scope.mode = 'search';

    // END USE FOR BOOKING
    
    //phanquocchien add new appoint
    $scope.getClinicalDepts = function(){
        var user_id = $cookieStore.get('userInfo').id;
        PatientService.getDoctorInfoByUserId(user_id).then(function(data){
            if (data.status == "success") {
                $scope.doctorId = data.data.doctor_id,
                $scope.clinicalDeptId = data.data.CLINICAL_DEPT_ID;
                sysServiceService.byClinicalDepartment($scope.clinicalDeptId).then(function(response){
                    $scope.options.clinical_depts = response.data;
                })

            };
        });
    };
    $scope.getClinicalDepts();
    
    $scope.apptDate = new Date();
    $scope.submitCalendar = function(){
        $scope.isSubmit = true;
        if(!$scope.appointForm.$invalid){
            var from_time_part=moment($scope.from_time,"HHmm").format("HH:mm");
            var to_time_part=moment($scope.to_time,"HHmm").format("HH:mm");

            if (moment($scope.from_time,"HHmm").format("HH:mm") === 'Invalid date') {
                toastr.error('From time format error');
                return
            }else{
                if (moment($scope.to_time,"HHmm").format("HH:mm") === 'Invalid date') {
                    toastr.error('To time format error');
                    return
                };
            };
            var from_time = moment($scope.apptDate).format('YYYY-MM-DD')+" "+ from_time_part +":00";
            var to_time = moment($scope.apptDate).format('YYYY-MM-DD')+ " "+ to_time_part+":00";

            var postData = {
                FROM_TIME: from_time,
                TO_TIME: to_time,
                SITE_ID: $scope.site_id,
                DOCTOR_ID: $scope.doctorId,
                CLINICAL_DEPT_ID: $scope.clinicalDeptId,
                SERVICE_ID: $scope.service_Id
            }
            DoctorService.addCalendar(postData).then(function(response){
                toastr.success('Add successfully !!!');
                $scope.cal_id = response.data;
                rlobService.addApptPatient($scope.patient_id,response.data).then(function(data){
                    if (data.status == 'success') {
                        angular.element('#popupNewAppoint').modal('hide');
                        angular.element('#popupNewAppoint').on('hidden.bs.modal', function (e) {
                            initObject();
                            $scope.changeAppt({CAL_ID:$scope.cal_id});
                        });
                    };
                })
            },function(err){

            })
        };
    };

    $scope.newAppoint = function(){
        angular.element('#popupNewAppoint').modal('show');
    };

    $scope.changeAppt = function(item) {
        $state.go('loggedIn.patient.consult', {patient_id: patient_id, cal_id: item.CAL_ID});
    };

    var initObject = function () {
        $scope.appt_params = {
            id: $scope.cal_id,
            permission: {
                edit: true
            }
        };

        PatientService.getAppointments(patient_id)
        .then(function(response){
            $scope.list_appt = response.data.appointments;
            var current_appt = null;
            angular.forEach($scope.list_appt, function(item) {
                // console.log('item',item);
                if(item.CAL_ID == $scope.cal_id) {
                    current_appt = item;
                }
            });
        }, function(error) {
        });

    }

    initObject();
})