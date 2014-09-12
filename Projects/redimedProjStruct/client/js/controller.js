app.controller("homeController",function($scope,$cookieStore,$rootScope,$http,$location,$window){
    $http.get('/users/loggedin').success(function(data){
        $cookieStore.put('userInfo',data.userInfo);
    });

    $http({
        method:"POST",
        url: "/users/home"
    })
        .success(function (data) {
            var menuL = [];
            for(i=0;i<data.length;i++)
            {
                if(data[i].Parent_Id == -1)
                {
                    menuL.push(data[i]);
                }
            }

            for(k=0;k<menuL.length;k++)
            {
                var child = [];
                for(j = 0; j< data.length; j++)
                {
                    if(data[j].Parent_Id != -1)
                    {
                        if(data[j].Parent_Id === menuL[k].Menu_Id)
                        {
                            child.push(data[j]);
                        }
                    }
                }
                menuL[k].menuchild = child;
            }

            for(k=0;k<menuL.length;k++)
            {
                for(z = 0; z < menuL[k].menuchild.length; z++)
                {
                    var child = [];
                    for(j = 0; j< data.length; j++)
                    {
                        if(data[j].Parent_Id != -1)
                        {
                            if(data[j].Parent_Id === menuL[k].menuchild[z].Menu_Id)
                            {
                                child.push(data[j]);
                            }
                        }

                    }

                    menuL[k].menuchild[z].childOnChild = child;

                }

            }

            $rootScope.menuL = menuL;

        })
        .error(function (data) {
            alert("fail")

        })
        .finally(function () {

        });



    $scope.logout = function(){
        $http.post('/users/logout');
        $window.location.href = "/";
    };
});