angular.module("app.loggedIn.doctor.controller", [
    "app.loggedIn.doctor.home.controller",
    "app.loggedIn.doctor.timetable.controller",
    "app.loggedIn.doctor.patients.controller",
    "app.loggedIn.doctor.add.controller"
])

.controller("DoctorController", function ($scope, MODE_ROW, ConfigService) {
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

    // MODEL OBJECT DOCTOR DETAIL
    $scope.modelDoctorObject = {
        NAME: '',
        Email: '',
        Phone: '',
        Signature: '',
        Title: '',
        First_name: '',
        Middle_name: '',
        Sur_name: '',
        CLINICAL_DEPT_ID: null,
        Provider_no: 0,
        Provider_type: '',
        Appt_interval: 0,
        isReceiveEmailAfterHour: "0",
        Qualification_id: '',
        Prescriber_no: 0,
        Sign_off: '',
        Payee_provider_no: 0,
        ABN_no:0,
        Default_bank_account_id: '',
        Medical_Registration_no: 0,
        OSHC_ID: '',
        isAppointmentBook: "0",
        Isenable: "0",
        isNewCalendarSlot: "0",
        Address: ""
    }
    // END MODEL OBJECT DOCTOR DETAIL

    $scope.options = {
        titles: ConfigService.title_option() 
    }
})