
angular.module('app.loggedIn.document.gorgonUQ.controllers',[])
    .controller("gorgonUQController",function($scope,DocumentService,$http,$cookieStore,$state) {

        $scope.info = [];
        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';
        $scope.info = {
            name : userinfo.Booking_Person,
            Patient_Id : userinfo.id,
            age : '',
            sex : '',
            height : '',
            weight : ''
        };

        $scope.submit = function(){

            var info = $scope.info;
            console.log(info);
            DocumentService.insertUQ(info).then(function(response){
                if(response['status'] === 'success') {
                    alert("Insert Successfully!");
                    //$state.go('loggedIn.home');
                }
                else
                {
                    alert("Insert Failed!");
                }
            });
        };



    });