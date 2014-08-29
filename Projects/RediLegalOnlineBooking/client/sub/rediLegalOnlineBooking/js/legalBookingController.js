/**
 * Created by meditech on 8/29/2014.
 */
app.controller("legalBookingController", function($scope,$http) {
    $scope.test=function()
    {
        $http({
            method:"GET",
            url:"/api/cln_specialties/list",
            params:{rl_id:'1'}
        })
            .success(function(data) {
                alert(JSON.stringify(data));
            })
            .error(function (data) {

            })
            .finally(function() {

            });
    }
});