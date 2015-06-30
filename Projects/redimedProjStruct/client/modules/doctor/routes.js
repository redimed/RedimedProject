angular.module("app.loggedIn.doctor", [])
.config(function($stateProvider) {
    $stateProvider
    // STRUCTURE
    
    .state("loggedIn.doctor", {
        abstract: true,
        templateUrl: "modules/doctor/views/structure.html",
        controller: "DoctorController"
    })
    .state('loggedIn.doctor.list', {

        url: '/doctorLoad',
        resolve: {
            init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                $ocLazyLoad.load("modules/doctor/extend_routes.js");
                $ocLazyLoad.load("modules/mdtdoctor/extend_routes.js");
                //$ocLazyLoad.load("modules/mdtdoctor/services/mdtDoctorServices.js");
                $ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDetailDirective.js");
                $ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDirectives.js");
                $ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js");
                $ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorAddController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorHomeController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsAddController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsCatController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorItemsEditController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorListController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorPaperlessController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorPatientsController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorPatientsDetailApptController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorPatientsDetailController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailCalendarController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailCasualController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailLeaveController.js");
                $ocLazyLoad.load("modules/doctor/controllers/DoctorTimetableDetailProfileController.js");
                $ocLazyLoad.load("modules/doctor/controllers/FaChooseController.js");
                $ocLazyLoad.load("modules/doctor/directives/DoctorDirective.js");
                $ocLazyLoad.load("modules/doctor/directives/DoctorList.js");
                $ocLazyLoad.load("modules/doctor/directives/DoctorSearch.js");
                $ocLazyLoad.load("modules/doctor/directives/ItemSearch.js")
                .then(function(){
                    $state.go("loggedIn.doctor_list");
                })

            }
        }

    })


})
