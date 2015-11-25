angular.module('starter.detailWorker.controller', []).controller('detailWorkerController', function($scope, UserService, localStorageService, $stateParams, $state, $ionicPopup, ConfigService, WorkerServices, $timeout) {
    $scope.place = {
        value: ''
    }
    if ($scope.userInfo.UserType.user_type == 'Patient') {
        $scope.b = "app.profile";
    } else {
        $scope.b = "app.listWorker";
    }
    $scope.titleIndex = ConfigService.title_option();
    $scope.sexIndex = ConfigService.sex_option();
    WorkerServices.listAccType().then(function(data) {
        if (data.status != 'success') {
            alert('error');
            return;
        }
        $scope.accTypeIndex = data.list;
    });
    WorkerServices.listPrvFund().then(function(data) {
        if (data.status != 'success') {
            alert('error');
            return;
        }
        $scope.fundIndex = data.list;
    });
    UserService.getPatientbyID($stateParams.patientID).then(function(result) {
        $scope.worker = result;
        if (result.Sex == 0) {
            $scope.worker.Sex = "Male";
        } else
        if (result.Sex == 1) {
            $scope.worker.Sex = "Female";
        }
    })
    $scope.updateWorker = function() {
        $scope.worker.First_name = _.capitalize($scope.worker.First_name);
        $scope.worker.Sur_name = _.capitalize($scope.worker.Sur_name);
        $scope.worker.Middle_name = _.capitalize($scope.worker.Middle_name);
        UserService.updateWorker($scope.worker).then(function(result) {
            if (result.status == "success") {
                $scope.popupMessage = {
                    message: "Update Success Infomation"
                };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpSuccess.html",
                    scope: $scope,
                    buttons: [{
                        text: "Ok",
                        onTap: function(e) {
                            // $state.go('app.profile');
                        }
                    }]
                });
            }
        })
    }
    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function() {
            document.getElementById('autocomplete').blur();
        });
    };
    $scope.$watch('worker.Address1', function(newval, old) {
        if ($scope.worker && $scope.worker.Address1 && newval) {
            $scope.change();
        }
    })
    $scope.change = function() {
        console.log(">>>>>");
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };
        var string = $scope.worker.Address1;
        var arr = string.split(",");
        var trim = _.map(arr, _.trim);
        console.log(trim.length)
        if (trim.length == 4) {
            var place = $scope.place.value;
            
            switch (trim[2]) {
                case "Northern Territory":
                    $scope.worker.State = "NT";
                    break;
                case "Queensland":
                    $scope.worker.State = "QLD";
                    break;
                case "Victoria":
                    $scope.worker.State = "VIC";
                    break;
                case "New South Wales":
                    $scope.worker.State = "NSW";
                    break;
                case "South Australia":
                    $scope.worker.State = "SA";
                    break;
                case "Western Australia":
                    $scope.worker.State = "WA";
                    break;
                case "Tasmania":
                    $scope.worker.State = "TAS";
                    break;
                default:
                    break;
            }
            $scope.worker.Suburb = trim[1];
            $scope.worker.Country = trim[3];
        }else{
            
        }
    }
})