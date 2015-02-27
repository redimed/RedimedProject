angular.module("app.loggedIn.iso.selectionUserName.directive", [])
	.directive('isoSelectionUserName', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                show:'=',
                selectedUserName:'='
            },
            templateUrl: 'modules/iso/directives/isoSelectionUserName.html',
            controller: function ($scope,isoService)
            {
                $scope.userNameKey='';
                $scope.userNameList=[];
                /**
                 * xu ly khi search username
                 * tannv.dts@gmail.com
                 */
                $scope.filterUserName=function()
                {
                    $scope.currentPage=1;
                    $scope.handleUserNameListPaging();
                }
                
                /**
                 * xu ly phan trang danh sach cac username
                 * tannv.dts@gmail.com
                 */
                $scope.handleUserNameListPaging=function()
                {
                    $scope.userNameList=[];
                    isoService.core.getCountUserName($scope.userNameKey)
                    .then(function(data){

                        if(data.status=='success')
                        {
                            $scope.totalItems=data.data.NUM_OF_USER_NAME;
                            $scope.itemsPerPage=5;
                            $scope.maxSize=7;
                            isoService.core.getUserNameList($scope.userNameKey,$scope.currentPage,$scope.itemsPerPage)
                            .then(function(data){
                                if(data.status=='success'){
                                    $scope.userNameList=data.data;
                                }
                                else
                                {
                                    
                                }
                            },function(err){
                                
                            })
                        }
                        else
                        {
                            
                        }
                    },function(err){
                        
                    })
                }

                $scope.filterUserName();

                $scope.autoInc=0;
                $scope.getSelectedUserName=function(user)
                {
                    $scope.selectedUserName.user_name=user.user_name;
                    $scope.selectedUserName.id=user.id;
                    $scope.autoInc++;
                    $scope.selectedUserName.autoInc=$scope.autoInc;
                    $scope.show=false;
                }
            }


        };
    })