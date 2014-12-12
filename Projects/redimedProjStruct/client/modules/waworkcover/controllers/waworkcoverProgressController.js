/**
 * Created by Minh Hikari on 12/2/2014.
 */
angular.module('app.loggedIn.waworkcover.progress.controller', [

])
    .controller('WaWorkCoverProgressController', function ($scope, localStorageService) {
        var patientInfo = localStorageService.get('patientTempInfo'); //have Patient_id
        var apptInfo = localStorageService.get('apptTempInfo'); // have CAL_ID
        $scope.params = {
            create: true,
            edit: false,
            patientInfo: patientInfo,
            apptInfo: apptInfo
        }
    });