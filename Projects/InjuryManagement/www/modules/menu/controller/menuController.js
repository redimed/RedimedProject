angular.module("starter.menu.controller",[])
    .controller("menuController",function($scope,localStorageService,$state,UserService){
        var userInfo= localStorageService.get("userInfo");
        $scope.Injurymenu = [];
        $scope.user = userInfo.Booking_Person;
        $scope.userName = userInfo.user_name;
        $scope.selectedMenu = null;
        UserService.getUserInfo(userInfo.id).then(function(data){
            $scope.img = data.img;
        })

        var loadMenu = function(){
            // MENU


            UserService.menu(userInfo.id).then(function(response){
                var i = 0;
                angular.forEach(response, function(menu){
                    if(menu.Parent_Id === -1)
                        $scope.Injurymenu.push({"parent": {"name": menu.Description, "definition":menu.Definition , "menu_id": menu.Menu_Id, "childs":[]}});
                    else{
                        var j = 0;
                        angular.forEach($scope.Injurymenu, function(lmenu){
                            if(lmenu.parent.menu_id === menu.Parent_Id){
                                $scope.Injurymenu[j].parent.childs.push({"name": menu.Description, "definition":menu.Definition, "id": menu.Menu_Id});
                            }
                            j++;
                        })
                    }
                    i++;
                });
            });
            // END MENU
        }
        loadMenu();

        $scope.logout = function(){
            localStorageService.remove('userInfo');
            localStorageService.remove('companyInfo');
            $state.go("security.login");
        }
    })