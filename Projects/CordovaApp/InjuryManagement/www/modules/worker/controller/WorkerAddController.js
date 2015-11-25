angular.module('starter.worker.add.controller', []).controller('workerAddController', function($scope, WorkerServices, $state, $stateParams, localStorageService, $ionicPopup, $ionicLoading, $timeout, ConfigService) {
    var userInfoLS = localStorageService.get("userInfo");
    $scope.nfcInfo = [];
    $scope.injurySubmitNonemer = localStorageService.get("checkNonemer");
    $scope.isSubmit = false;
    $scope.isSubmit2 = false;
    $scope.isSubmit3 = false;
    $scope.isFailMobile = false;
    $scope.isFailEmail = false;
    $scope.isMobile = null;
    $scope.place = {
        value: ''
    };
    $scope.stateParams = '';
    $scope.workerObj = {
        company_id: userInfoLS.company_id,
        Title: null,
        First_name: null,
        Sur_name: null,
        Middle_name: null,
        Address1: null,
        Address2: null,
        State: null,
        Country: 'Australia',
        DOB: null,
        Sex: null,
        Home_phone: null,
        Work_phone: null,
        Mobile: null,
        Suburb: null,
        Known_as: null,
        Email: null,
        Post_code: null,
        Account_type: null,
        Account_holder: null,
        Medicare_no: null,
        Exp_medicare: null,
        Private_fund_id: null,
        UPI: null,
        MemberShip_no: null,
        DVA_No: null,
        HCC_Pension_No: null,
        Occupation: null,
        Partner_name: null,
        Partner_DOB: null,
        Partner_Occupation: null,
        Alias_First_name: null,
        Alias_Sur_name: null,
        UR_no: null,
        Custom: null
    }
    $scope.$watch('worker.Address1', function(newval, old) {
        if ($scope.worker && $scope.worker.Address1 && newval) {
            $scope.change();
        }
    })
    $scope.change = function() {
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
        console.log(trim.length);
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
        } else {
            $scope.worker.Suburb = '';
            $scope.worker.Country = 'Australia';
            $scope.worker.State = '';
        }
    };
    var reset = function() {
        $scope.worker = angular.copy($scope.workerObj);
        $scope.isSubmit = false;
        $scope.isSubmit2 = false;
    };
    $scope.reset = reset;
    var init = function() {
        reset();
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
    };
    $scope.checkField = function(isMobile) {
        if (isMobile) {
            $scope.iconLoadingMobile = true;
            if ($scope.worker.Mobile == '' || typeof $scope.worker.Mobile == 'undefined') {
                $timeout(function() {
                    $scope.iconLoadingMobile = false;
                    $scope.iconSuccessMobile = false;
                    $scope.iconErrorMobile = false;
                }, 0.1 * 1000);
            } else {
                WorkerServices.checkMobile($scope.worker.Mobile).then(function(data) {
                    $scope.iconSuccessMobile = false;
                    $scope.iconErrorMobile = false;
                    if (data.status == 'success') {
                        if (data.count == 0) {
                            $scope.isFailMobile = false;
                        } else {
                            $scope.isFailMobile = true;
                        }
                        $timeout(function() {
                            $scope.iconLoadingMobile = false;
                            if ($scope.isFailMobile) {
                                $scope.iconLoadingMobile = false;
                                $scope.iconErrorMobile = true;
                            } else {
                                $scope.iconSuccessMobile = true;
                            }
                        }, 2 * 1000);
                    }
                })
            }
        } else {
            WorkerServices.checkEmail($scope.worker.Email).then(function(data) {
                if (typeof $scope.worker.Email == 'undefined') {
                    $scope.iconLoadingMail = true;
                    $scope.iconSuccessMail = false;
                    $scope.iconErrorMail = false;
                    $timeout(function() {
                        $scope.iconLoadingMail = false;
                        $scope.iconSuccessMail = false;
                    }, 10 * 1000);
                } else {
                    if (data.status == 'success') {
                        $scope.iconLoadingMail = false;
                        if (data.data.length == 0) {
                            $scope.iconSuccessMail = true;
                            $scope.isFailEmail = false;
                        } else {
                            $scope.iconErrorMail = true;
                            $scope.isFailEmail = true;
                        }
                    }
                }
            })
        }
    };
    $scope.nextFormFirst = function(first) {
        if ($state.params.injurySearch !== null) {
            $scope.stateParams = $state.params.injurySearch;
        }

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        }
        var d = new Date($scope.worker.DOB);
        $scope.worker.DOB = formatDate(d);
        $scope.isSubmit = true;
        if (first.$invalid || $scope.dateError) {
            $scope.popupMessage = {
                message: "Please check your information!"
            };
            $ionicPopup.show({
                templateUrl: "modules/popup/PopUpError.html",
                scope: $scope,
                buttons: [{
                    text: "Ok"
                }]
            });
        } else {
            $state.go('app.worker.main');
        }
    };
    //check DOB
    $scope.changeDOBworker = function() {
        var today = new Date().getFullYear();
        if ($scope.worker.DOB.split("-")[0] >= today.toString() || $scope.worker.DOB == '') {
            $scope.dateError = true;
        } else {
            $scope.dateError = false;
        }
    };
    //back injuryDesc
    $scope.backdescInjury = function() {
        localStorageService.set("checkNonemerg", $scope.injurySubmitNonemer);
        $state.go('app.injury.desInjury');
    };
    //submit worker check true false
    $scope.submitInsertWorker = function(workerForm, last) {
        $scope.isSubmit3 = true;
        if (last.$invalid) {
            $scope.popupMessage = {
                message: 'Please Check ' + last.$error.required[0].$name
            };
            $ionicPopup.show({
                templateUrl: "modules/popup/PopUpError.html",
                scope: $scope,
                buttons: [{
                    text: "Ok"
                }]
            });
            return;
        };
        if ($scope.injurySubmitNonemer) {
            $state.go('app.chooseAppointmentCalendar');
        } else {
            $scope.messageLoading = {
                message: "Waiting..."
            };
            $ionicLoading.show({
                templateUrl: "modules/loadingTemplate.html",
                animation: 'fade-in',
                scope: $scope,
                maxWidth: 500,
                showDelay: 0
            });

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                return [year, month, day].join('-');
            }
            var d = new Date($scope.worker.DOB);
            $scope.worker.DOB = formatDate(d);
            $scope.worker.First_name = _.capitalize($scope.worker.First_name);
            $scope.worker.Sur_name = _.capitalize($scope.worker.Sur_name);
            $scope.worker.Middle_name = _.capitalize($scope.worker.Middle_name);
            console.log($scope.worker);
            WorkerServices.insertWorker({
                patient: $scope.worker
            }).then(function(data) {
                if (data.status != 'success') {
                    console.log(data);
                    $ionicLoading.hide();
                    $scope.popupMessage = {
                        message: "Please check your information!"
                    };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [{
                            text: "Ok"
                        }]
                    });
                    return;
                } else {
                    $timeout(function() {
                        reset();
                        $ionicLoading.hide();
                        $scope.popupMessage = {
                            message: "We have added worker to company. Do you want write NFC to tag?"
                        };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpSuccess.html",
                            scope: $scope,
                            buttons: [{
                                text: "Cancel",
                                onTap: function() {
                                    console.log($scope.stateParams)
                                    if ($scope.stateParams == 'injury') {
                                        ConfigService.workerData = data.data;
                                        $state.go('app.injury.desInjury', {
                                            workeradd: 'worker'
                                        });
                                    } else {
                                        $state.go('app.worker.add', {
                                            reload: true
                                        });
                                    }
                                }
                            }, {
                                text: "Yes, I do",
                                type: "btn-black",
                                onTap: function(e) {
                                    $scope.nfcInfo = data;
                                    $state.go('app.worker.writeNFC');
                                }
                            }]
                        })
                    }, 2000);
                }
            })
        }
    };
    init();
    if ($scope.nfcInfo.length == 0) {
        $scope.nfcInfo = localStorageService.get('newInfo');
    }
    $scope.NFCwrite = function() {
        localStorageService.set('mode', 'write');
        var mode = localStorageService.get('mode');
        writeNFC.initialize($scope.nfcInfo, mode);
    }
})