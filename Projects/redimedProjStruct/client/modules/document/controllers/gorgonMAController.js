
angular.module('app.loggedIn.document.gorgonMA.controllers',[])
    .controller("gorgonMAController",function($scope,$rootScope,$http,$cookieStore,$window) {
        $scope.print = function(){
            $window.location.href = '/api/document/gorgonMA/print/5';
        }
    });