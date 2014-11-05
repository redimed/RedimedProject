angular.module("app.loggedIn.doctor.controller", [
    "app.loggedIn.doctor.home.controller",
    "app.loggedIn.doctor.timetable.controller",
    "app.loggedIn.doctor.patients.controller",
])

.controller("DoctorController", function ($scope, MODE_ROW) {
	// FOR VIEW LIST
	$scope.searchObject = {
        limit: 10,
        offset: 0,
        maxSize: 5,
        currentPage: 1,
        data: {
            NAME: "",
            Email: "",
            Phone: null
        }
    }
    // END FOR VIEW LIST

            //CONFIG
            $scope.rows = MODE_ROW;
            //END CONFIG



            $scope.searchPatientsObject = {
                doctor_id: 0,
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    First_name: "",
                    Sur_name: "",
                    Middle_name: "",
                    Post_code: null
                }
            }
        })