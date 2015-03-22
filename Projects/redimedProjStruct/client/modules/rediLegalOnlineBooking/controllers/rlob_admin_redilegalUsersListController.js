/**
 * Created by Phan Quoc Chien on 07/11/2014.
 */

angular.module('app.loggedIn.rlob.redilegalUsersListController.controller',[])
    .controller("rlob_admin_redilegalUsersListController", function($scope,rlobService) {
        $scope.usersList=[];
        $scope.getUsersList=function()
        {
            rlobService.getUsersList()
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.usersList=data.data;
                }
                else
                {
                    $scope.usersList=[];
                }
            },function(err){
                $scope.usersList=[];
            })
        }

        $scope.getUsersList();
    });
