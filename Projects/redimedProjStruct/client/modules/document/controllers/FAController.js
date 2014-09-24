
angular.module('app.loggedIn.document.FA.controllers',[])
    .controller("FAController",function($scope,DocumentService,$http,$cookieStore) {
        var initPickers = function () {
            //init date pickers
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            }).on('changeDate',function(evn){

            });

        }
        initPickers();
        $scope.submit = function(){
            var info = $scope.info;
        };

        var faList = [];
        $scope.fa = [];

        DocumentService.menuList().then(function(data){
            MenuService.functionList().then(function(data){
                $scope.functionList = data;
            })

            menuList = data;
            for(var i = 0;i<menuList.length;i++)
            {
                if(menuList[i].ParentID === null || menuList[i].ParentID === -1)
                    $scope.data.push(menuList[i]);

            }
        })



    });