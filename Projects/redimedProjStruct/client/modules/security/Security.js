angular.module("app.security",[
    "app.security.controller",
    "app.security.services"
])

.config(function($stateProvider){
    $stateProvider

    // STRUCTURE
    .state("security", {
    	abstract: false,
    	views: {
    		"root": {
    			templateUrl: "modules/security/views/structure.html",
                controller: "SecurityController"
    		}
    	}
    })
    //END STRUCTURE    

    // LOGIN
    .state("security.login", {
        url: "/login",
        views: {
        	"main-content": {
        		templateUrl: "modules/security/views/login.html",
                controller: "SecurityLoginController"
        	}
        }
    })
    // END LOGIN

    // FORGOT
    .state("security.forgot", {
    	url: "/forgot",
    	views: {
    		"main-content": {
    			templateUrl: "modules/security/views/forgot.html",
                controller: "SecurityForgotController"
    		}
    	}
    })

    .state("security.term",{
        url:"/terms",
        views: {
            "main-content": {
                templateUrl: "modules/security/views/terms.html",
                controller: "SecurityTermsController"
            }
        }
    })
    // END FORGOT

    //REGISTER
    //.state("security.register", {
    //	url: "/register",
    //	views: {
    //		"main-content": {
    //			templateUrl: "modules/security/views/register.html",
    //            controller: "SecurityRegisterController"
    //		}
    //	}
    //})
    //END REGISTER
    
    .state("security.rlobRegister", {
     url: "/rlob-register",
     views: {
         "main-content": {
                templateUrl: "/modules/rediLegalOnlineBooking/views/register.html",
                controller:'rlobRegisterController'
         }
     }
    })
    .state("security.rlobSponsor", {
     url: "/rlob-sponsor",
     views: {
         "main-content": {
                templateUrl: "/modules/rediLegalOnlineBooking/views/mobile/sponsor1.html",
                controller:'rlobSponsor1Controller'
            }
        }
    }) 
    .state("security.rlobSponsor.emergency", {
        url: "/emergency",
        templateUrl: "/modules/rediLegalOnlineBooking/views/mobile/emergency.html",
        controller:'rlobEmergencyController'
    })
    .state("security.rlobSponsor.nonemergency", {
        url: "/nonemergency",
        templateUrl: "/modules/rediLegalOnlineBooking/views/mobile/nonemergency.html",
        controller:'rlobNonEmergencyController'
    })
    
    //REDIRECT
    .state("security.redirect", {
        url: "/redirect/:userId/:patient_id",
        views: {
            "main-content": {
                template: "<div> Waitting </div>",
                controller: "SecurityRedirectController"
            }
        }
    })
    //END REDIRECT    
})