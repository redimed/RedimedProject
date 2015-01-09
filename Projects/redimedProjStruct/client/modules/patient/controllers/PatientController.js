angular.module("app.loggedIn.patient.controller", [
    "app.loggedIn.patient.list.controller",

    "app.loggedIn.patient.home.controller",
    "app.loggedIn.patient.search.controller",
    "app.loggedIn.patient.action.controller",

    "app.loggedIn.patient.booking.controller",
    "app.loggedIn.patient.detail.controller",
    
    "app.loggedIn.patient.outside_referrals.controller",
    "app.loggedIn.patient.referrals.controller",
    "app.loggedIn.patient.appointment.controller",
    "app.loggedIn.patient.companies.controller",
    "app.loggedIn.patient.workcover.controller",
    "app.loggedIn.patient.itemsheet.controller"
])
.controller("PatientController", function ($scope, $cookieStore, ConfigService, PatientService, MODE_ROW) {
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