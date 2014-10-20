angular.module('app.loggedIn.rlob.bookingDetail.controller',[])
.controller("rlob_bookingDetailController", function ($scope, $http, $stateParams, $cookieStore) {
    $scope.loginInfo = $cookieStore.get('userInfo');

    $http({
        method: "POST",
        url: "/api/rlob/rl_bookings/get-booking-by-id",
        data: {bookingId: $stateParams.bookingId,userId:$scope.loginInfo.id}
    }).success(function (data) {
        if (data.status == 'success')
        {
            $scope.selectedBooking = data.data;
            $("#view-detail-booking-dialog").modal({show: true, backdrop: 'static'});
        }
        else
        {
            alert("data not exist!");
        }
    })
    .error(function (data) {
        console.log("error");
    });

});