/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob.bookingBehalf.controller',[])
    .controller("rlob_admin_bookingBehalfController", function($scope,$state,rlobService,bookingService) {
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

        $scope.makeBooking=function(user)
        {
        	var bookingBehalfInfo={
        		ASS_SURNAME:user.Booking_Person,
                ASS_OTHERNAMES:user.Booking_Person,
                ASS_CONTACT_NO:user.Contact_number,
                ASS_EMAIL:user.Contact_email,
                ASS_ID:user.id,
                COMPANY_ID:user.company_id
        	}
        	bookingService.setBookingBehalfInfo(bookingBehalfInfo);
            $state.go("loggedIn.rlob.rlob_booking");
        }
    });
