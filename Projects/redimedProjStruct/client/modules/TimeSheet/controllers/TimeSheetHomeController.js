angular.module("app.loggedIn.TimeSheet.Home.Controller", [])
    .controller("TimeSheetHomeController", function($scope, localStorageService, TimeSheetService, $cookieStore, toastr, $state) {
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba

        //LOAD ROLE ON TREEAPPROVE
        TimeSheetService.LoadRole($cookieStore.get("userInfo").id).then(function(response) {
            if (response.status === "error") {
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Loading fail!", "Error");
            } else if (response.status === "fail") {
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("You not permission on Timesheet system!", "Fail");
            } else if (response.status === "success") {
                localStorageService.set("position", response.position[0].NODE_CODE);
                $scope.position = localStorageService.get("position");
            } else {
                //catch exception
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Server respose error!", "Error");
            }
        });
        //END LOAD ROLE ON TREEAPPROVE
    });
