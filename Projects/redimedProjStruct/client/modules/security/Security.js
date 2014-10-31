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
    // END FORGOT

    //REGISTER
    .state("security.register", {
    	url: "/register",
    	views: {
    		"main-content": {
    			templateUrl: "modules/security/views/register.html",
                controller: "SecurityRegisterController"
    		}
    	}
    })
    //END REGISTER
})