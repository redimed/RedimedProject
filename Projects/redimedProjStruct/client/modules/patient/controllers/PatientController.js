angular.module("app.loggedIn.patient.controller", [
    "app.loggedIn.patient.list.controller",

    "app.loggedIn.patient.home.controller",
    "app.loggedIn.patient.search.controller",
    "app.loggedIn.patient.action.controller",

    "app.loggedIn.patient.booking.controller"
])
.controller("PatientController", function ($scope, $cookieStore, ConfigService, PatientService, MODE_ROW) {
    // FOR VIEW LIST
    $scope.searchObject = {
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
    // END FOR VIEW LIST

    //CONFIG
    $scope.rows = MODE_ROW;
    //END CONFIG
})