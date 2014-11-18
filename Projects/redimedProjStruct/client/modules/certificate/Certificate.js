angular.module("app.loggedIn.certificate", [
    "app.loggedIn.certificate.controller"
])

.config(function ($stateProvider) {
	$stateProvider
	// STRUCTURE
    .state("loggedIn.certificate", {
        abstract: true,
        templateUrl: "modules/certificate/views/structure.html",
        controller: "CertificateController"
    })
    // HOME
    .state("loggedIn.certificate.home", {
        url: "/certificate/home",
        views: {
            "main-content": {
                templateUrl: "modules/certificate/views/home.html",
                controller: "CertificateHomeController"
            }
        }
    })
    // REFERRAL
    .state("loggedIn.certificate.referral", {
        url: "/certificate/referral",
        views: {
            "main-content": {
                templateUrl: "modules/certificate/views/referral.html",
                controller: "CertificateReferralController"
            }
        }
    })
    // SCRIPTS
    .state("loggedIn.certificate.scripts", {
        url: "/certificate/scripts",
        views: {
            "main-content": {
                templateUrl: "modules/certificate/views/scripts.html",
                controller: "CertificateScriptsController"
            }
        }
    })
})