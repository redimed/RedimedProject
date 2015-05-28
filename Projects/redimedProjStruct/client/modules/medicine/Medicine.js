angular.module('app.loggedIn.medicine',[
	'app.loggedIn.medicine.controller',
	'app.loggedIn.medicine.service',
    'app.loggedIn.medicine.directive'
])

.config(function($stateProvider){
	$stateProvider

	.state("loggedIn.medicine", {
        url: "/medicine",
        abstract: true,
        templateUrl: "modules/medicine/views/structure.html",
        controller: "MedicineController"
    })

    .state("loggedIn.medicine.list", {
    	url:'/list',
    	views:{
    		'main-content':{
    			templateUrl:'modules/medicine/views/list.html',
    			controller: "MedicineListController"
    		}
    	}
    })


});