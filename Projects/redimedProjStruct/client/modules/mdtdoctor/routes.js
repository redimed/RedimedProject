angular.module('app.loggedIn.mdtdoctor', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.mdtdoctor', {
			url: '/mdtoutdoctorload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
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
			                        $ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.j")
			                        .then(function() {
			                            callback(null);
			                        })
			                    },
			                    function(callback) {
			                    	$state.go('loggedIn.mdtoutdoctor_load');
			                    }
		                    	]);
				}
			}
		})


})