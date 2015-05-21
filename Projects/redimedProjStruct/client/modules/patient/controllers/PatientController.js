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
    "app.loggedIn.patient.checkin.controller"
])
.controller("PatientController", function ($scope, $cookieStore, ConfigService, PatientService, MODE_ROW, $stateParams) {
    $scope.patientID = $stateParams.patientID;
    console.log($stateParams);


    $scope.patient_detail_modules = [
        {'name': 'Patient', 'color': 'blue-soft', 'desc': 'Info', 'icon': 'fa fa-user',
            'state': 'loggedIn.patient.detail({patient_id:' + $stateParams.patientID + '})'},
        {'name': 'Companies', 'color': 'red-soft', 'desc': 'Total: 0', 'icon': 'fa fa-building',
            'state': 'loggedIn.company({patientId:' + $stateParams.patientID + '})'},
        {'name': 'Claim', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o',
            'state': 'loggedIn.patient.claim.list({patientId:' + $stateParams.patientID + ', calId:'+$stateParams.cal_id+'})'},
        {'name': 'Alert', 'color': 'green-soft', 'desc': 'Available', 'icon': 'fa fa-newspaper-o',
            'state': 'loggedIn.patient.alert.list({patientId:' + $stateParams.patientID + ', calId:'+$stateParams.cal_id+'})'},
        {'name': 'Outside Referral', 'color': 'purple-soft', 'desc': 'Total: 0', 'icon': 'fa fa-envelope-o',
            'state': 'loggedIn.patient.outreferral.list({patientId:' + $stateParams.patientID + ', calId:'+$stateParams.cal_id+'})'},  
        {'name': 'Injury Management', 'icon': 'fa fa-medkit', 'color': 'blue-soft', 'desc': '',
            'state': 'loggedIn.im.list({patient_id:' + $stateParams.patientID + '})'},
        {'name': 'Medical Measure', 'icon': 'fa fa-stethoscope', 'color': 'red-soft', 'desc': '',
            'state': 'loggedIn.im.bluetooth({patient_id:' + $stateParams.patientID + '})'},
        {'name': 'Consultation', 'icon': 'fa fa-user-md', 'color': 'purple-soft', 'desc': '',
            'state': 'loggedIn.consult.patient({patient_id:' + $stateParams.patientID + ', cal_id:' +$stateParams.cal_id+ '})'},    
        {'name':'Problem List', 'color':'red-soft', 'icon':'fa fa-exclamation-triangle', 
            'state':'loggedIn.patient.problem.list({patient_id:'+$stateParams.patientID+'})'},
        {'name':'Allergy list', 'color':'green-soft', 'icon':'fa fa-exclamation-triangle', 
            'state':'loggedIn.patient.allergy.list({patient_id:'+$stateParams.patientID+'})'},

    ];

    $scope.patient_apt_modules = [
        // {'name': 'Appointment', 'icon': 'fa fa-bookmark-o', 'color': 'blue-soft', 'desc': 'Info',
        //     'state': 'loggedIn.receptionist.appointment.detail({patient_id:' + $stateParams.patientID + ', cal_id:' + $stateParams.cal_id + '})'},
         {'name': 'ItemSheet', 'icon': 'fa fa-bookmark-o', 'color': 'blue-soft', 'desc': 'Info',
            'state': 'loggedIn.patient.itemsheet({patient_id:' + $stateParams.patientID + ', cal_id:' + $stateParams.cal_id + '})'},
        {'name': 'Paperless', 'icon': 'fa fa-pencil-square-o', 'color': 'red-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.doctor.paperless({patient_id:' + $stateParams.patientID + ', cal_id:' + $stateParams.cal_id + '})'},
        {'name': 'Workcover', 'icon': 'fa fa-paper-plane-o', 'color': 'green-soft', 'desc': 'Has: 0',
            'state': 'loggedIn.patient.workcover({patient_id:' + $stateParams.patientID + ', cal_id: '+  $stateParams.cal_id +'})'},
        {'name': 'Script', 'icon': 'fa fa-envelope-square', 'color': 'purple-soft', 'desc': 'Has: 0',
            'state': 'loggedIn.patient.script.list({patient_id:' + $stateParams.patientID + ', cal_id:' +$stateParams.cal_id+ '})'},
        {'name': 'Referral', 'icon': 'fa fa-envelope-square', 'color': 'blue-soft', 'desc': 'Has: 0',
            'state': 'loggedIn.patient.referral.list({patient_id:' + $stateParams.patientID + ', cal_id:' +$stateParams.cal_id+ '})'},
        {'name': 'Invoices', 'icon': 'fa fa-money', 'color': 'red-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.patient.invoices({patient_id:' + $stateParams.patientID + ', cal_id:' +$stateParams.cal_id+ '})'},    
        {'name': 'Appointment List', 'icon': 'fa fa-repeat', 'color': 'green-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.patient.appt({patient_id:' + $stateParams.patientID + ', cal_id:' +$stateParams.cal_id+ '})'},
        {'name': 'Documents', 'icon': 'fa fa-file-text', 'color': 'purple-soft', 'desc': 'Total: 0',
            'state': 'loggedIn.patient.apptdoc({patient_id:' + $stateParams.patientID + ', cal_id:' +$stateParams.cal_id+ '})'},
       {'name': 'Recall', 'color': 'blue-soft', 'desc': 'Recall', 'icon': 'fa fa-repeat',
            'state': 'loggedIn.patient.recall({patient_id:' + $stateParams.patientID + '})'},
    ];
    //get patient info
    $scope.current_patient = {};

    PatientService.mdtById($scope.patientID).then(function (response) {
        $scope.current_patient = response.data;
        console.log(response.data);
        for (var key in $scope.current_patient) {
            if ($scope.current_patient[key]) {
                if (key.indexOf("is") != -1 || key.indexOf("Is") != -1)
                    $scope.current_patient[key] = $scope.current_patient[key].toString();
                if (key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
                    $scope.current_patient[key] = new Date($scope.current_patient[key]);
            }
        }

        $scope.current_patient.Title = parseInt($scope.current_patient.Title);
    });
    
    // get appointments
    

    
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
})