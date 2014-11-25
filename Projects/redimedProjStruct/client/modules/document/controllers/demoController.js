angular.module('app.loggedIn.document.demo.controllers',[])
    .controller("demoController",function($scope,MODE_ROW,$filter,DocumentService,$http,$cookieStore,$state,toastr,localStorageService) {


        $scope.setPage = function () {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        }

        $scope.reset = function () {
            $scope.searchObjectMap = angular.copy($scope.searchPatientsObject);
            $scope.loadList();
        }

        $scope.loadList = function()
        {
            DocumentService.loadPatient($scope.searchObjectMap).then(function(response){
                if(response[status] != 'fail'){
                    $scope.list = response;
                }else
                {
                    toastr.error("loading fail");
                }
            })
        }

        $scope.goToTimetableDetail = function (list) {
            alert("aaaaaaaaaaaaaaaaaaa");
            localStorageService.set("tempPatient", list);
            $state.go("loggedIn.Detail");
        }

        var init = function () {
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
            $scope.rows = MODE_ROW;
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
            //SEARCH FUNCTION
            $scope.searchObjectMap = angular.copy($scope.searchPatientsObject);
            //END SEARCH FUNCTION
            $scope.list={};
            $scope.loadList();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
        }

        init();

    })