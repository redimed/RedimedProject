angular.module("app.loggedIn.TimeSheet.Tree.Controller", [])
    .controller("TimeSheetTree", function($scope, MODE_ROW, localStorageService, $state, TimeSheetService, $modal, $cookieStore, toastr) {
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba
        
        $scope.info = {};

        //FUNCTION SETPAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //END FUNCTION SETPAGE

        //FUNCTION RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchDepartmentsObject);
            $scope.loadList();
        };
        //END FUNCTION RESET

        $scope.loadList = function(idInput) {
            if (idInput === "DESC") {
                $scope.searchObjectMap.order = "DESC";
            } else if (idInput === "ASC") {
                $scope.searchObjectMap.order = "ASC";
            }

            TimeSheetService.LoadTreeTimeSheet($scope.searchObjectMap).then(function(response) {
                if (response[status] !== "fail") {
                    $scope.list = response;
                } else {
                    $scope.list = response;
                    toastr.error("Loading fail!", "Error");
                }
            });
            $(idInput).focus();
        };

        //FUNCTION INIT
        var init = function() {
            $scope.searchObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    NAME: "",
                    Email: "",
                    phone: null
                }
            };
            $scope.rows = MODE_ROW;
            $scope.searchDepartmentsObject = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                order: "DESC",
                GROUP_TYPE: "Time Sheet",
                data: {
                    GROUP_NAME: "",
                }
            };

            //SEARCH FUNCTION
            $scope.searchObjectMap = angular.copy($scope.searchDepartmentsObject);
            //END SEARCH FUNCTION

            $scope.list = {};
            $scope.loadList();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
        };
        //END FUNCTION INIT

        //CALL INIT FUNCTION
        init();
        //END CAL INIT FUNCTION

        $scope.goToListNode = function(idTreeTimeSheet) {
            localStorageService.set("idTreeTimeSheet", idTreeTimeSheet);
            $state.go("loggedIn.TimeSheetHome.TimeSheetListNode");
        };
    });
