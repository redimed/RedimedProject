
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

//        DocumentService.menuList().then(function(data){
//
//            menuList = data;
//            for(var i = 0;i<menuList.length;i++)
//            {
//                if(menuList[i].ParentID === null || menuList[i].ParentID === -1)
//                    $scope.data.push(menuList[i]);
//
//            }
//        })

//        DocumentService.newFA().then(function(response){
//            if(response['status'] === 'success') {
//                alert("Insert Successfully!");
//            }
//            else
//            {
//                alert("Insert Failed!");
//            }
//        });
//
//        newFA: function(req,res)
//        {
//            db.sequelize.query("").success(function(data){
//                if(err)
//                {
//                    res.json({status:"fail"});
//                }
//                else
//                {
//                    res.json(rows);
//
//                }
//            })
//        }

    });