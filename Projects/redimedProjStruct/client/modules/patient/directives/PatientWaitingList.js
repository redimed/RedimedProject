angular.module("app.loggedIn.patient.waiting_list.directive", [])

.directive("mdtWaitingList", function(WaitingListModel){
	return {
		restrict: "EA",
		scope: {

		},
		templateUrl:"modules/patient/directives/templates/waiting_list.html",
		link: function(scope, element, attrs){
		}
	} // end return
})