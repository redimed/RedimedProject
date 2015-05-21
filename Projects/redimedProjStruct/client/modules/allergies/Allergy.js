angular.module('app.loggedIn.allergy',[
	'app.loggedIn.allergy.controller',
	'app.loggedIn.allergy.service',
    'app.loggedIn.allergy.directive'
])

.config(function($stateProvider){
	$stateProvider

	.state("loggedIn.allergy", {
        url: "/allergy",
        abstract: true,
        templateUrl: "modules/allergies/views/structure.html",
        controller: "AllergyController"
    })

    .state("loggedIn.patient.allergy", {
        abstract: true,
        views: {
            "main-content@loggedIn.patient": {
                templateUrl: "modules/allergies/views/structure.html",
                controller: "AllergyController"
            }
        }
    })

    .state("loggedIn.allergy.list", {
    	url:'/list',
    	views:{
    		'main-content':{
    			templateUrl:'modules/allergies/views/list.html',
    			controller: "AllergyListController"
    		}
    	}
    })

    //tan frame:
    // .state("loggedIn.patient.allergy.list",{
    //     url:'/:patient_id/allergy',
    //     views:{
    //         'main-content':{
    //             templateUrl:"modules/allergies/views/list.html",
    //             controller:"AllergyListController"
    //         }
    //     }
    // })
    //tan add
    .state("loggedIn.patient.allergy.list",{
        url:'/allergy',
        views:{
            'main-content':{
                templateUrl:"modules/allergies/views/list.html",
                controller:"AllergyListController"
            }
        }
    })


});