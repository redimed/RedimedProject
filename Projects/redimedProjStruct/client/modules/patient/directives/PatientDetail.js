angular.module("app.loggedIn.patient.detail.directive", [
	"app.loggedIn.patient.detail.master.controller"
])
.directive("patientDetail", function(){
	return{
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@",
			patient: "=",
			params: "=",
			onsuccess: '=',
			actionCenter:'='// chua ham runWhenFinish();
		},
		templateUrl: "modules/patient/directives/templates/detail.html",
		controller:"PatientDetailMasterController"
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL
//phanquocchien.c1109g@gmail.com
//web-patienr-register
.directive("patientRegister", function(){
	return{
		restrict: "EA",
		scope: {
			options: "=",
			isClose: "@",
			patient: "=",
			params: "=",
			onsuccess: '=',
			actionCenter:'='// chua ham runWhenFinish();
		},
		templateUrl: "modules/patient/directives/templates/detail-register.html",
		controller:"PatientDetailMasterController"
	} // END RETURN
}) // END DIRECTIVE PATIENT DETAIL
