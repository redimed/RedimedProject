angular.module("app.loggedIn.patient.search.controller", [])

.controller("PatientSearchController", function ($scope, ConfigService, PatientService) {
    $scope.search_map = {
        limit: 10,
        offset: 0,
        maxSize: 5,
        currentPage: 1,
        data: {
            Title: '',
            First_name: '',
            Middle_name: '',
            Sur_name: '',
            DOB: ''
        },
        ORDER_BY: "Sur_name ASC"
    }
    $scope.list = {};
    $scope.loadList = function () {
        PatientService.getByOption({search: $scope.search}).then(function (data) {

            for (var i = 0, len = data.list.length; i < len; ++i) {
                if (data.list[i].DOB)
                    data.list[i].DOB = ConfigService.getCommonDate(data.list[i].DOB);
            }
            $scope.list.results = data.list;
        });
    };

    var init = function () {
        $scope.search = angular.copy($scope.search_map);

        $scope.sexIndex = [{code: 'Female'}, {code: 'Male'}];

        $scope.pagingIndex = [{code: 10}, {code: 20}, {code: 50}];



        $scope.loadList();

        PatientService.getTotals().then(function (data) {
            $scope.list.count = data.count;
        });
    }

    init();
    $scope.setPage = function () {
        $scope.search.offset = ($scope.search.currentPage - 1) * $scope.search.limit;
        $scope.loadList();
    }

});