/**
 * Created by meditech on 29/09/2014.
 */
angular.module('app.loggedIn.booking.setting.controller',[])
.controller('SettingController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        var userInfo;
        $scope.data = [];

        if(typeof $cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        if(typeof $cookieStore.get('userInfo') !== 'undefined')
        {
            userInfo = $cookieStore.get('userInfo');
        }

        OnlineBookingService.getUserByCompany(companyInfo[0].id).then(function(data){
            $scope.data = data;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.data, params.filter()) :
                        $scope.data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })


        $scope.newUser = function(){
            $state.go('loggedIn.newUser');
        }

        $scope.editUser = function(b){
            $state.go('loggedIn.editUser',{id: b.id});
        }
})

.controller('NewUserController',function($scope,$state,OnlineBookingService,toastr,$cookieStore){

    var companyInfo;
        $scope.isEdit = false;
    $scope.data = [];

    if(typeof $cookieStore.get('companyInfo') !== 'undefined')
    {
        companyInfo = $cookieStore.get('companyInfo');
    }


        $scope.info = {
            bookPerson:null,
            email: null,
            isDownload: "1",
            isEnable: "1",
            isMakeBooking: "1",
            isPackage: "1",
            isPosition:"1",
            isSetting:"1",
            isShowAll:"1",
            isShowBooking:"1",
            isViewAllData:"1",
            password:null,
            phone:null,
            username:null,
            userType:'Company',
            companyId:companyInfo[0].id,
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



    $scope.submitUser = function(userForm){
        $scope.showClickedValidation = true;
        if(userForm.$invalid){
            toastr.error("Please Input All Required Information!", "Error");
        }else {
            OnlineBookingService.insertNewUser($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Submit New User Successfully!","Success");
                    $state.go('loggedIn.newUser', null, {"reload":true});
                }
                else if(data.status === 'error')
                    toastr.error("Submit New User Failed!", "Error");
            })
        }
    }
})

.controller('EditUserController',function($scope,$state,$stateParams,$modal,OnlineBookingService,toastr,$cookieStore){
        var companyInfo;

        $scope.isEdit = true;

        $scope.data = [];

        if(typeof $cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        $scope.info = {
            userId: $stateParams.id,
            bookPerson:null,
            email: null,
            isDownload: "1",
            isEnable: "1",
            isMakeBooking: "1",
            isPackage: "1",
            isPosition:"1",
            isSetting:"1",
            isShowAll:"1",
            isShowBooking:"1",
            isViewAllData:"1",
            phone:null,
            username:null,
            companyId:companyInfo[0].id,
            userType:'Company'
        };

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
                templateUrl: 'modules/onlineBooking/views/changePassModal.html',
                controller: 'ChangePassController',
                size: 'md',
                resolve:{
                    userId: function(){
                        return $stateParams.id;
                    }

                }
            });
        }
})

.controller('ChangePassController',function($scope,$filter,$state,$modalInstance,OnlineBookingService, userId, toastr){
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
                }
                else if(data.status === 'error')
                    toastr.error("Change Password Failed", "Error");
            })
        }
})