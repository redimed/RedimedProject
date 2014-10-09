
angular.module('app.loggedIn.document.gorgonUQ.controllers',[])
    .controller("gorgonUQController",function($scope,DocumentService,$http,$cookieStore) {

        $scope.data = [];
        var data = $scope.data;
        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';
        console.log(userinfo);
        $scope.data = {
            name : userinfo.Booking_Person,
            age : '',
            sex : '',
            height : '',
            weight : ''
        };

//        DocumentService.insertUQ(data).then(function(response){
//            if(response['status'] === 'success') {
//                alert("Insert Successfully!");
//            }
//            else
//            {
//                alert("Insert Failed!");
//            }
//        });

    });