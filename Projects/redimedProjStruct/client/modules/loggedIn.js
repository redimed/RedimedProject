angular.module("app.loggedIn", [
    "app.loggedIn.controller", // LOGGED IN CONTROLLER
    "app.loggedIn.home", // HOME MODULE
    "app.loggedIn.user", // USER MODULE
    "app.loggedIn.function", //FUNCTION MODULE
    "app.loggedIn.menu", //MENU MODULE
    "app.loggedIn.telehealth", //Telehealth MODULE
    "app.loggedIn.booking", //ONLINE-BOOKING MODULE
    "app.loggedIn.booking.admin",
    "app.loggedIn.document", // Document telehealth
    "app.loggedIn.rlob", //Redi Legal Online Booking
    "app.loggedIn.medifood", //Medifood
    "app.loggedIn.vaccinob", //Vaccination Online Booking
    "app.loggedIn.iso", //ISO manage files
    "app.loggedIn.pr",//PAYROLL (TANNV.DTS@GMAIL.COM)
    "app.loggedIn.doctor", // DOCTOR MODULE
    "app.loggedIn.receptionist", // RECEPTIONIST MODULE
    "app.loggedIn.patient",
    "app.loggedIn.waworkcover",
    "app.loggedIn.certificate",
    "app.loggedIn.item",
    "app.loggedIn.insurer",
    "app.loggedIn.department",
    /*AUTO CREATE*/
    'app.loggedIn.invoice',
    'app.loggedIn.mdtrecall',
    'app.loggedIn.mdtappointment',

    'app.loggedIn.mdtinsurer',

    'app.loggedIn.mdtoutdoctor',

    'app.loggedIn.mdtoutreferral',

    'app.loggedIn.sysstate',

    'app.loggedIn.syscountry',

    'app.loggedIn.mdtredimedsites',

    'app.loggedIn.sysservice',

    'app.loggedIn.sysrltypes',


    'app.loggedIn.mdtspecialty',

    'app.loggedIn.sysqualification',

    'app.loggedIn.mdtdept',

    'app.loggedIn.mdtprovider',

    'app.loggedIn.systitle',

    'app.loggedIn.mdtdoctor',

    'app.loggedIn.department',

    'app.loggedIn.script',

    'app.loggedIn.referral',
    'app.loggedIn.sysservices',
    /*END AUTO CREATE*/
    'app.loggedIn.timetable',

    'app.loggedIn.im',
    "app.loggedIn.staff",

    // MODULE TREEAPPROVE
    'app.loggedIn.treeApprove',
    // END MODULE TREE APPROVE

    //MODULE TIMESHEET
    'app.loggedIn.TimeSheet',
    //END MODULE TIMESHEET
    
    'app.loggedIn.claim',

    'app.loggedIn.timetable',
    'app.loggedIn.timetable_old',
    'app.loggedIn.appointment',
    'app.loggedIn.medicine',
    'app.loggedIn.allergy',
    
    'app.loggedIn.company',
    'app.loggedIn.alert',
    'app.loggedIn.outreferral',
    'app.loggedIn.problem',
    'app.loggedIn.fadefine'
])

.config(function($stateProvider) {
    $stateProvider

        .state("loggedIn", {
        abstract: true,
        views: {
            "root": {
                templateUrl: "common/views/structure.html",
                controller: "loggedInController"
            }
        }
    })
})
