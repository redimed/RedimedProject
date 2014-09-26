/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.make.controller',[])
    .controller('MakeBookingController',function($scope,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;

        if($cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }


        $scope.companyName = companyInfo[0].Company_name;
        $scope.companyList = [];
        $scope.packageList = [];
        $scope.data = [];



        $scope.c = companyInfo[0];

        if($scope.data != null)
        {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.data.length, // length of data
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
        }


        OnlineBookingService.getSubCompany(companyInfo[0].id).then(function(response){
            if(response.status === 'success')
            {
                $scope.companyList = response.rs;
            }
        })

        OnlineBookingService.getPackage(companyInfo[0].id).then(function(data){
            if(data.status === 'success')
            {
                $scope.packageList = data.rs;
            }
        })

        $scope.packageChange = function(PackId){
            var arrAss = [];
            var arrHead = [];

            if(PackId !== null)
            {
                OnlineBookingService.getPackageAssById(PackId).then(function(data){
                    if(data.status === 'success')
                    {
                        for(var i=0; i<data.rs.length; i++)
                        {
                            arrAss.push(data.rs[i]);

                        }

                        $scope.packAss = arrAss;

                    }
                })
            }else
            {
                $scope.packAss = [];
            }

        };

        $scope.newCandidate = function()
        {
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/newCandidate.html',
                controller: 'NewCandidateController',
                size: 'md',
                resolve:{
                    companyId: function(){
                        return companyInfo[0].id;
                    }
                }
            });

            modalInstance.result.then(function (candidateInfo){
                $scope.data.push(candidateInfo);

                $scope.tableParams.reload();

            },function(err){
                console.log(err);
            });
        }


})

.controller('NewCandidateController',function($scope,$filter,$state,$modalInstance,OnlineBookingService, companyId){
        $scope.info = {
            siteId:'',
            fromDate: '',
            toDate: '',
            calId:'',
            name:'',
            dob:'',
            position:'',
            phone:'',
            email:''
        };
        $scope.siteList = [];
        $scope.calList = [];
        $scope.positionList = [];
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        OnlineBookingService.getSite().then(function(data){
            $scope.siteList = data;
        })

        OnlineBookingService.getPositionList(companyId).then(function(data){
            $scope.positionList = data;
        })

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.siteChange = function(){
            if(typeof $scope.info.siteId !== 'undefined' && $scope.info.siteId !== null && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(id,from,to).then(function(data){
                    $scope.calList = data;
                })
            }
            else
            {
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }

        }

        $scope.fromDateChange = function()
        {
            if(typeof $scope.info.siteId !== 'undefined' && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(id,from,to).then(function(data){
                    $scope.calList = data;
                })
            }
            else
            {
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }



        }

        $scope.toDateChange = function()
        {
            if(typeof $scope.info.siteId !== 'undefined' && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(id,from,to).then(function(data){
                    $scope.calList = data;
                })
            }
            else
            {
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }
        }

        $scope.submitCandidate = function()
        {
            $scope.candidateInfo = {
                siteId:'',
                fromDate: '',
                toDate: '',
                calId:'',
                name:'',
                dob:'',
                position:'',
                phone:'',
                email:''
            };
            $scope.candidateInfo.name = $scope.info.name;
            $scope.candidateInfo.dob = $filter('date')($scope.info.dob,'dd/MM/yyyy');
            $scope.candidateInfo.position = $scope.info.position;
            $scope.candidateInfo.phone = $scope.info.phone;
            $scope.candidateInfo.email = $scope.info.email;
            $scope.candidateInfo.siteId = $scope.info.siteId;
            $scope.candidateInfo.fromDate = $filter('date')($scope.info.fromDate,'dd/MM/yyyy');
            $scope.candidateInfo.toDate = $filter('date')($scope.info.toDate,'dd/MM/yyyy');
            $scope.candidateInfo.calId = $scope.info.calId;

            $modalInstance.close($scope.candidateInfo);

        }

    })