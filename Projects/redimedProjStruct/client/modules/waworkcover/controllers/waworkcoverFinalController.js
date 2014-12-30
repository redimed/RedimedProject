/**
 * Created by Minh Hikari on 11/28/2014.
 */
angular.module('app.loggedIn.waworkcover.final.controller', [

])
    .controller("WaWorkCoverFinalController", function ($scope, $stateParams) {
//        var patientInfo = localStorageService.get('patientTempInfo'); //have Patient_id
//        var apptInfo = localStorageService.get('apptTempInfo'); // have CAL_ID
//        $scope.params = {
//            create: true,
//            edit: false,
//            patientInfo: patientInfo,
//            apptInfo: apptInfo
//        }
        var patientInfo = $stateParams.patient_id; //have Patient_id
        var apptInfo = $stateParams.cal_id; // have CAL_ID
        var editMode = false;
        var wc_id = $stateParams.wc_id;
        if($stateParams.action !== 'edit'){
            editMode = false;
        }
        else{
            editMode = true;
        }
        $scope.params = {
            edit: editMode,
            patientInfo: patientInfo,
            apptInfo: apptInfo,
            workcover: wc_id
        }
    });