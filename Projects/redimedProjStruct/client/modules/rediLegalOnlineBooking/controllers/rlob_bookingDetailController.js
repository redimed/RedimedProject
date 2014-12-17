angular.module('app.loggedIn.rlob.bookingDetail.controller',[])
.controller("rlob_bookingDetailController", function ($scope, $http, $state,$stateParams, $cookieStore) {
    //
    //Khong cho nguoi su dung upload file thong qua bien isCanUpload
    $scope.isCanUpload=false;
    $scope.isAdminGetFiles=true;
    $scope.isAdminUpload=true;
    $scope.loginInfo = $cookieStore.get('userInfo');
    $scope.bookingStatus=rlobConstant.bookingStatus;
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