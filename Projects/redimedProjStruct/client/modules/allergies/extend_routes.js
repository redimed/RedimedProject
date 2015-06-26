angular.module('app.loggedIn.allergy')

.config(function($stateProvider){
	$stateProvider
    
    .state("loggedIn.allergy_list", {
    	url:'/allergy',
		templateUrl:'modules/allergies/views/list.html',
		controller: "AllergyListController"
    })

    .state("loggedIn.patient.allergy_list", {
        views: {
            "main-content@loggedIn.patient": {
                templateUrl: "modules/allergies/views/structure.html",
                controller: "AllergyController"
            }
        }
    })

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