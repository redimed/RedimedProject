angular.module('app.loggedIn.timetable', [])

.config(function($stateProvider){

	$stateProvider
	.state('loggedIn.timetable', {
		resolve: {
			init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				async.waterfall([
					function(callback) {
						$ocLazyLoad.load('modules/timetable/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/timetable/dialogs/TimetableCalendarAddDayDialog.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/timetable/dialogs/TimetableCalendarAddSiteDialog.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/timetable/dialogs/TimetableCalendarEditDayDialog.js')
						.then(function() {
							callback(null);
						})
					},
					function(callback) {
						$ocLazyLoad.load('modules/timetable/directives/TimetableCalendarDirective.js')
						.then(function() {
							callback(null);
						});
					}
				])
			}
		}

	})


})