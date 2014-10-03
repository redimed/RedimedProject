/**
 * Created by meditech on 03/10/2014.
 */
angular.module('app.loggedIn.booking.admin.user.controller',[])
.controller('UserController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingAdminService,toastr){
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
        })

        $scope.addNewUser = function(){
            $state.go('loggedIn.admin_user_new');
        }
})

.controller('NewUserController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingAdminService,toastr){
        $scope.isEdit = false;

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