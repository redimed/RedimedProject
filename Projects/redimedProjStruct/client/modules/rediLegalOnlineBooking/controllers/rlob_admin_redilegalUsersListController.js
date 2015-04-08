/**
 * Created by Phan Quoc Chien on 07/11/2014.
 */

angular.module('app.loggedIn.rlob.redilegalUsersListController.controller',[])
    .controller("rlob_admin_redilegalUsersListController", function($scope,rlobService,SecurityService,toastr) {
        //Khai bao
        $scope.registerStatus=rlobConstant.registerStatus;
        //------------------------------------------------------------------------------
        $scope.sizePageList=[
            // {value:3,display:'3 Rows'},
            {value:10,display:'10 Rows'},
            {value:20,display:'20 Rows'},
            {value:30,display:'30 Rows'},
            {value:40,display:'40 Rows'},
            {value:50,display:'50 Rows'},
            {value:60,display:'60 Rows'},
            {value:70,display:'70 Rows'},
            {value:80,display:'80 Rows'},
            {value:90,display:'90 Rows'},
            {value:100,display:'100 Rows'}

        ];
        $scope.searchInfoMap = {
            currentPage: 1, //page hien tai tren phan trang
            itemsPerPage:$scope.sizePageList[0].value,//so luong item tren 1 page
            totalItems:'',//tong so result (tong phan tu tren tat ca cac trang)
            maxSize:15, //so luong danh dau trang hien thi
            emailKey:'',
            nameKey:'',
            companyKey:'',
            statusKey:''
        }

        /**
         * Xu ly khi nhan phan trang
         * tannv.dts@gmail.com
         * @type {Array}
         */
        $scope.usersList=[];
        $scope.pagingHandle = function () {
            rlobService.getUsersList($scope.searchInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.usersList = data.data.list;
                    $scope.searchInfo.totalItems=data.data.totalItems;
                }
                else
                {
                    $scope.usersList=[];
                }
            },function(err){
                $scope.usersList=[];
            })
        }

        /**
         * Xu ly khi co dieu kien search moi
         * tannv.dts@gmail.com
         */
        $scope.searchHandle=function()
        {
            $scope.searchInfo.currentPage=1;
            $scope.pagingHandle();
        }
        $scope.reset = function () {
            $scope.searchInfo = angular.copy($scope.searchInfoMap);
            $scope.pagingHandle();
        }
        /**
         * Load data khi enter page
         * tannv.dts@gmail.com
         */
        $scope.searchInfo = angular.copy($scope.searchInfoMap);
        $scope.searchHandle();    

        /**
         * Cap nhat redilegal user register status
         * tannv.dts@gmail.com
         */
        
        $scope.selectedItem={};
        $scope.editItem={};
        $scope.setSelectedItem=function(item)
        {
            $scope.selectedItem=item;
            $scope.editItem=angular.copy($scope.selectedItem);
        }
        $scope.updateRedilegalUserStatus=function(user_name,status)
        {
            if($scope.selectedItem.Company_name==null && status!=rlobConstant.registerStatus.REJECT.value)
            {
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Please reselect the infomation of company!");
                return;
            }
            rlobService.updateRedilegalUserStatus(user_name,status)
            .then(function(data){
                if(data.status=='success')
                {
                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Update status success!");
                    $scope.selectedItem.MEDICO_LEGAL_REGISTER_STATUS=status;
                }
                else
                {
                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Update status fail!");
                }
            },function(err){
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Update status fail!");
            });
        }

        $scope.companyList = [];
        SecurityService.company().then(function(response){
            $scope.companyList = response;
        });
        $scope.stateList=[];
        rlobService.getStates('Australia')
        .then(function(data){
            if(data.status=='success')
            {
                $scope.stateList=data.data;
            }
            else
            {
                $scope.stateList=[];
            }
        });

        $scope.$watch('editItem.company_id',function(newValue,oldValue){
            if($scope.editItem.company_id)
            {
                for(var i=0;i<$scope.companyList.length;i++)
                {
                    var item=$scope.companyList[i];
                    if(item.id==$scope.editItem.company_id)
                    {
                        $scope.editItem.Company_name=item.Company_name;
                        return;
                    }
                }
            }
        });

        $scope.showViewAndUpdateDialog=function()
        {
            $('#rlob-view-edit-user').modal({show:true,backdrop:'static'});
        }

        $scope.updateUser=function()
        {
            if($scope.editItem.Company_name==null && $scope.editItem.MEDICO_LEGAL_REGISTER_STATUS!=rlobConstant.registerStatus.REJECT.value)
            {
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Please reselect the infomation of company!");
                return;
            }

            $scope.showClickedValidation = true;
            if($scope.editForm.$invalid){
                toastr.error("Please check form.", "Error");
            }
            else
            {
                rlobService.updateUserInfo($scope.editItem)
                .then(function(data){
                    if(data.status=='success')
                    {
                        angular.extend($scope.selectedItem,$scope.editItem);
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Update success!");
                    }
                    else
                    {
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Update fail!");
                    }
                },function(err){
                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Update fail!");
                });

                $("#rlob-view-edit-user").modal('hide');
            }
        }
    });
