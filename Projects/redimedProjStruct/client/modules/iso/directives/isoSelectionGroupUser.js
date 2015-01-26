angular.module("app.loggedIn.iso.selectionGroupUser.directive", [])
	.directive('isoSelectionGroupUser', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                show:'=',
                selectedGroup:'='
            },
            templateUrl: 'modules/iso/directives/isoSelectionGroupUser.html',
            controller: function ($scope,isoService)
            {
                $scope.groupList=[];
                isoService.isoUserGroup.getUserGroupList()
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.groupList=data.data;

                    }
                    else
                    {
                        $scope.groupList=[];
                    }
                },function(err){
                    $scope.groupList=[];
                })
                $scope.setSelectedGroup=function(group)
                {
                    $scope.selectedGroup.GROUP_NAME=group.GROUP_NAME;
                    $scope.selectedGroup.GROUP_ID=group.GROUP_ID;
                    $scope.show=false;
                }
            }

        };
    })