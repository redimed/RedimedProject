/**
 * Created by meditech on 10/09/2014.
 */
app.controller("gorgonFAController",function($scope,$http,$cookieStore) {
    var user = $cookieStore.get('userInfo');
    console.log(user[0]);
    $scope.submit = function(){
      var info = $scope.info;

    };
});