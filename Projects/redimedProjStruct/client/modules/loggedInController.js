angular.module("app.loggedIn.controller",[
])

.controller("loggedInController", function($scope, $state, $cookieStore, UserService){
    var userInfo = $cookieStore.get('userInfo');
    $scope.loggedInMenus = [];
    $scope.user = userInfo.Booking_Person;


    // Load before logged in    
    var loadLoggedIn = function(){
        // MENU
        UserService.menu().then(function(response){
            var i = 0;
            angular.forEach(response, function(menu){



                if(menu.Parent_Id === -1)
                    $scope.loggedInMenus.push({"parent": {"name": menu.Description, "definition":menu.Definition , "menu_id": menu.Menu_Id, "childs":[]}});
                else{
                    var j = 0;
                    angular.forEach($scope.loggedInMenus, function(lmenu){
                        if(lmenu.parent.menu_id === menu.Parent_Id){

                            $scope.loggedInMenus[j].parent.childs.push({"name": menu.Description, "definition":menu.Definition, "id": menu.Menu_Id});
                        }
                        j++;
                    })
                }
                i++;
            });
        });
        // END MENU
    }

    loadLoggedIn();
    //End load before logged in

    //Logout
    $scope.logout = function(){
        $cookieStore.remove("userInfo");
        $cookieStore.remove("companyInfo");
        $state.go("security.login");
    }

    // Toggle Menu
    $scope.toggle = false;

    $scope.toggleMenu = function(){
        $scope.toggle = !$scope.toggle;

        if($scope.toggle){
            angular.element("#main-page").addClass("page-sidebar-closed");
            angular.element("#main-menu").addClass("page-sidebar-menu-closed");
        }else{
            angular.element("#main-page").removeClass("page-sidebar-closed");
            angular.element("#main-menu").removeClass("page-sidebar-menu-closed");
        }
    }
    // End Toggle Menu
})