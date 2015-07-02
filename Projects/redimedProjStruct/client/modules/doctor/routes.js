angular.module("app.loggedIn.doctor", [])
.config(function($stateProvider) {
    $stateProvider
    .state('loggedIn.doctor.list', {

        url: '/doctorLoad',
        resolve: {
            init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                async.waterfall([
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/extend_routes.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorAddController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorHomeController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsAddController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsCatController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsEditController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorListController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorPaperlessController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorPatientsController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorPatientsDetailApptController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorPatientsDetailController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailCalendarController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailCasualController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailLeaveController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailProfileController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/controllers/FaChooseController.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/directives/DoctorDirective.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/directives/DoctorList.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/directives/DoctorSearch.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/doctor/directives/ItemSearch.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/mdtdoctor/extend_routes.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDetailDirective.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDirectives.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback){
                        $ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js")
                        .then(function() {
                            callback(null);
                        })
                    },
                    function(callback) {
                        $state.go("loggedIn.doctor_list");
                    }
                ]);
            }
        }

    })
    // STRUCTURE
    
    .state("loggedIn.doctor", {
        abstract: true,
        templateUrl: "modules/doctor/views/structure.html"
        //controller: "DoctorController"
    })


})
