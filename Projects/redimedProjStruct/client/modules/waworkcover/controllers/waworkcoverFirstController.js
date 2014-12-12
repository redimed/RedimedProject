/**
 * Created by Minh Hikari on 11/28/2014.
 */
angular.module('app.loggedIn.waworkcover.first.controller', [

])
    .controller("WaWorkCoverFirstController", function ($scope, localStorageService) {
        var patientInfo = localStorageService.get('patientTempInfo'); //have Patient_id
        var apptInfo = localStorageService.get('apptTempInfo'); // have CAL_ID
        $scope.params = {
            edit: false,
            patientInfo: patientInfo,
            apptInfo: apptInfo
        }
    });