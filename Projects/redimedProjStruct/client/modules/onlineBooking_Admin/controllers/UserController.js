/**
 * Created by meditech on 03/10/2014.
 */
angular.module('app.loggedIn.booking.admin.user.controller',[])
.controller('AdminUserController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingAdminService,toastr){
        $scope.selectedId = null;
        $scope.selectedRow = null;
        $scope.arr = [];


        $scope.info = {
            id: null,
            user_id: null,
            user_name : null,
            menu_id: null,
            isEnable: null
        }


        OnlineBookingAdminService.getListUser().then(function(data){
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')(data, params.filter()) :
                        data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.tableParams2 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.arr.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.arr, params.filter()) :
                        $scope.arr;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.arr;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })

        $scope.addNewUser = function(){
            $state.go('loggedIn.admin_user_new');
        }

        $scope.editUser = function(b)
        {
            $state.go('loggedIn.admin_user_edit',{id: b.id});
        }

        $scope.showMenu = function(b){
            $scope.selectedId = b.id;
            $scope.selectedRow = null;
            $scope.info = {
                id: null,
                user_id: null,
                user_name : null,
                menu_id: null,
                isEnable: null
            };
            $scope.arr = [];
            $scope.rs = [];
            OnlineBookingAdminService.getUserMenu(b.id).then(function(data){
                $scope.rs = data;
            })

            $scope.$watch('rs',function(rs){
                $scope.arr = rs;
                $scope.tableParams2.reload();
            })

        }

        $scope.showMenuDetails = function(b){
            $scope.selectedRow = b.id;


            OnlineBookingAdminService.getMenuList().then(function(data){
                $scope.menuList = [];
                for(var i =0 ; i<data.length; i++){
                    if(data[i].isEnable == 1)
                        $scope.menuList.push(data[i]);
                }
            })

            OnlineBookingAdminService.getUserMenuDetails(b.id).then(function(data){

                $scope.info.id = data[0].id;
                $scope.info.user_id = data[0].user_id;
                $scope.info.user_name = data[0].user_name;
                $scope.info.menu_id = data[0].menu_id;
                $scope.info.isEnable = data[0].isEnable == 1 ? '1':'0';
            })

        }

        $scope.submitUserMenu = function(menuForm){
            $scope.showClickedValidation = true;
            if(menuForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {

                    OnlineBookingAdminService.editUserMenu($scope.info).then(function (data) {
                        if(data.status === 'success') {
                            toastr.success("Edit Successfully!", "Success");
                            OnlineBookingAdminService.getUserMenu($scope.info.id).then(function (data) {
                                $scope.rs = data;
                            })


                            $scope.$watch('rs', function (rs) {
                                $scope.arr = rs;
                                $scope.tableParams2.reload();
                            })
                        }
                        else{
                            toastr.success("Edit Failed!", "Error");
                        }
                    })
            }
        }

        $scope.addNewUserMenu = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/onlineBooking_Admin/views/newSubMenu.html',
                controller:'AddNewUserMenuController',
                size:'md',
                resolve:{
                    userId:function(){
                        return $scope.selectedId;
                    }
                }
            })
        }
})

.controller('AddNewUserMenuController',function($scope,$state,$modal,$modalInstance,$filter,ngTableParams,OnlineBookingAdminService,userId,toastr){

        $scope.info = {
            user_id: userId,
            menu_id: null,
            isEnable: null
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };

        OnlineBookingAdminService.getMenuList().then(function(data){
            $scope.menuList = [];
            for(var i =0 ; i<data.length; i++){
                if(data[i].isEnable == 1)
                    $scope.menuList.push(data[i]);
            }
        })

        $scope.addNew = function(menuForm){
            $scope.showClickedValidation = true;
            if(menuForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.insertUserMenu($scope.info).then(function (data) {
                    if(data.status === 'success') {
                        toastr.success("Insert Successfully!", "Success");

                        $modalInstance.dismiss('cancel');

                        $state.go('loggedIn.admin_user',null,{reload:true});
                    }
                    else{
                        toastr.success("Insert Failed!", "Error");
                    }
                })

            }
        }
})

.controller('AdminNewUserController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingAdminService,toastr){
        $scope.isEdit = false;
        $scope.isCompany = false;

        $scope.userTypeChange = function(b){
            if(b == 'Company')
                $scope.isCompany = true;
            else
                $scope.isCompany = false;
        }

        $scope.info = {
            bookPerson:null,
            email: null,
            isDownload: null,
            isEnable: null,
            isMakeBooking: null,
            isPackage: null,
            isPosition:null,
            isSetting:null,
            isShowAll:null,
            isShowBooking:null,
            isViewAllData:null,
            password:null,
            phone:null,
            username:null,
            userType:null,
            companyId:null,
            poNum:null,
            invoiceEmail:null,
            resultEmail:null,
            reportEmail:null,
            function_id:null,
            empId:null,
            isCalendar:null,
            isProject:null,
            isAdmin:null,
            isReceiveEmail: null
        };

        OnlineBookingAdminService.getListCompany().then(function(data){
            $scope.companyList = data;
        })

        OnlineBookingAdminService.getListFunction().then(function(data){
            $scope.functionList = data;
        })

        OnlineBookingAdminService.getListEmployee().then(function(data){
            $scope.empList = data;
        })

        $scope.submitUser = function(userForm){
            $scope.showClickedValidation = true;
            if(userForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.insertNewUser($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Submit New User Successfully!","Success");
                        $state.go('loggedIn.admin_user_new', null, {"reload":true});
                    }
                    else if(data.status === 'error')
                        toastr.error("Submit New User Failed!", "Error");
                })
            }
        }
})

    .controller('AdminEditUserController',function($scope,$state,$stateParams,$modal,OnlineBookingService,OnlineBookingAdminService,toastr,$cookieStore){


        $scope.isEdit = true;

        $scope.isCompany = false;

        $scope.userTypeChange = function(b){
            if(b == 'Company')
                $scope.isCompany = true;
            else
                $scope.isCompany = false;
        }

        $scope.info = {
            userId: $stateParams.id,
            bookPerson:null,
            email: null,
            isDownload: null,
            isEnable: null,
            isMakeBooking: null,
            isPackage: null,
            isPosition:null,
            isSetting:null,
            isShowAll:null,
            isShowBooking:null,
            isViewAllData:null,
            password:null,
            phone:null,
            username:null,
            userType:null,
            companyId:null,
            poNum:null,
            invoiceEmail:null,
            resultEmail:null,
            reportEmail:null,
            function_id:null,
            empId:null,
            isCalendar:null,
            isProject:null,
            isAdmin:null,
            isReceiveEmail: null
        };

        OnlineBookingAdminService.getListCompany().then(function(data){
            $scope.companyList = data;
        })

        OnlineBookingAdminService.getListFunction().then(function(data){
            $scope.functionList = data;
        })

        OnlineBookingAdminService.getListEmployee().then(function(data){
            $scope.empList = data;
        })

        OnlineBookingService.getUserInfo($stateParams.id).then(function(data){
            $scope.info.bookPerson = data.Booking_Person;
            $scope.info.email = data.Contact_email;
            $scope.info.isDownload = data.isDownloadResult == 1 ? '1':'0';
            $scope.info.isEnable = data.isEnable == 1 ? '1':'0';
            $scope.info.isMakeBooking = data.isMakeBooking == 1 ? '1':'0';
            $scope.info.isPackage = data.isPackage == 1 ? '1':'0';
            $scope.info.isPosition = data.isPosition == 1 ? '1':'0';
            $scope.info.isSetting = data.isSetting == 1 ? '1':'0';
            $scope.info.isShowAll = data.isAll == 1 ? '1':'0';
            $scope.info.isShowBooking = data.isBooking == 1 ? '1':'0';
            $scope.info.isViewAllData = data.isAllCompanyData == 1 ? '1':'0';
            $scope.info.phone = data.Contact_number;
            $scope.info.username = data.user_name;
            $scope.info.userType = data.user_type;
            $scope.info.companyId = data.company_id;
            $scope.info.poNum = data.PO_number;
            $scope.info.invoiceEmail = data.invoiceemail;
            $scope.info.resultEmail = data.result_email;
            $scope.info.reportEmail = data.Report_To_email;
            $scope.info.function_id = data.function_id;
            $scope.info.empId = data.employee_id;
            $scope.info.isCalendar = data.isCalendar == 1 ? '1':'0';
            $scope.info.isProject = data.isProject == 1 ? '1':'0';
            $scope.info.isAdmin = data.isAdmin == 1 ? '1':'0';
            $scope.isReceiveEmail = data.isReceiveEmailAfterHour == 1 ? '1':'0';

            if($scope.info.userType == 'Company')
                $scope.isCompany = true;
        })



        $scope.submitUser = function(userForm){
            $scope.showClickedValidation = true;
            if(userForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingService.editUserInfo($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Submit New User Successfully!","Success");
                    }
                    else if(data.status === 'error')
                        toastr.error("Submit New User Failed!", "Error");
                })
            }
        }

        $scope.changePass = function(){
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking_Admin/views/changePassModal.html',
                controller: 'AdminChangePassController',
                size: 'md',
                resolve:{
                    userId: function(){
                        return $stateParams.id;
                    }

                }
            });
        }
    })

    .controller('AdminChangePassController',function($scope,$filter,$state,$modalInstance,OnlineBookingService, userId, toastr){
        $scope.info = {
            oldPass:null,
            newPass:null,
            id:userId
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.okClick = function(){
            OnlineBookingService.changeUserPassword($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Change Password Successfully","Success");
                    $modalInstance.dismiss('cancel');
                }
                else if(data.status === 'error')
                    toastr.error("Change Password Failed", "Error");
            })
        }
    })