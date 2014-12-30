/**
 * Created by Minh Hikari on 11/28/2014.
 */
angular.module('app.loggedIn.waworkcover.first.controller', [

])
    .controller("WaWorkCoverFirstController", function ($scope, $stateParams) {
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