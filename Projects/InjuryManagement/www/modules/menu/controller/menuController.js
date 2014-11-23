angular.module("starter.menu.controller",[])
    .controller("menuController",function($scope,localStorageService,$state,UserService,$ionicPopover){
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

        //    popover

        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function() {
            // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function() {
            // Execute action
        });
        //    end Popover

    })
    //.directive('fadeBar', function($timeout) {
    //    return {
    //        restrict: 'E',
    //        template: '<div class="fade-bar"></div>',
    //        replace: true,
    //        link: function($scope, $element, $attr) {
    //            // Run in the next scope digest
    //            $timeout(function() {
    //                // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is
    //                $scope.$watch('sideMenuController.getOpenRatio()', function(ratio) {
    //                    // Set the transparency of the fade bar
    //                    $element[0].style.opacity = Math.abs(ratio);
    //                });
    //            });
    //        }
    //    }
    //});