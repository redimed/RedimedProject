/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.make.controller',[])
    .controller('MakeBookingController',function($scope,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore,$window){
        var companyInfo;
        var userInfo;

        if(typeof $cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        if(typeof $cookieStore.get('userInfo') !== 'undefined')
        {
            userInfo = $cookieStore.get('userInfo');
        }

      
        $scope.companyName = companyInfo[0].Company_name === null ? '':companyInfo[0].Company_name;
      
        
        $scope.companyList = [];
        $scope.packageList = [];
        $scope.data = [];

        var mPO;
        var mResult;
        var mInvoice;

        $scope.c = {
            SubCompanyId:'',
            PO_number:'',
            result_email:'',
            invoice_email:'',
            Project:'',
            Comment:'',
            PackId:''
        };



        $scope.c = companyInfo[0];
        mPO = companyInfo[0].PO_number;
        mResult = companyInfo[0].result_email;
        mInvoice = companyInfo[0].invoice_email;

        if($scope.data != null)
        {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 20           // count per page
            }, {
                counts:[],
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

        $scope.subChange = function(subId){
            if(subId !== null)
            {
                OnlineBookingService.getSubCompanyInfo(subId).then(function(data){
                    $scope.c.SubCompanyId = data.id;
                    $scope.c.PO_number = data.PO_number;
                    $scope.c.result_email = data.result_email;
                    $scope.c.invoice_email = data.invoice_email;
                })
            }

            if(subId === null)
            {


                $scope.c.PO_number = mPO;
                $scope.c.result_email = mResult;
                $scope.c.invoice_email = mInvoice;

            }

        }

        $scope.newCandidate = function()
        {
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/newCandidate.html',
                controller: 'NewCandidateController',
                size: 'md',
                resolve:{
                    companyId: function(){
                        return companyInfo[0].id;
                    },
                    editInfo: function(){
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (candidateInfo){
                $scope.data.push(candidateInfo);

                $scope.tableParams.reload();

            },function(err){
                console.log(err);
            });
        };

        $scope.editCandidate = function(b){
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/newCandidate.html',
                controller: 'NewCandidateController',
                size: 'md',
                resolve:{
                    companyId: function(){
                        return companyInfo[0].id;
                    },
                    editInfo: function(){
                        return b;
                    }

                }
            });

            modalInstance.result.then(function (candidateInfo){
                var index = $scope.data.indexOf(b);
                $scope.data[index] = candidateInfo;

                $scope.tableParams.reload();

            },function(err){
                console.log(err);
            });

        };

        $scope.deleteCandidate = function(b)
        {
            var index = $scope.data.indexOf(b);
            if(index > -1)
            {
                $scope.data.splice(index,1);
            }
            $scope.tableParams.reload();

        };

        $scope.submitBooking = function(bookingForm){
            $scope.headInfo = {
                PO_number: $scope.c.PO_number,
                result_email: $scope.c.result_email,
                invoice_email: $scope.c.invoice_email,
                ProjectIdentification: $scope.c.Project,
                Comment: $scope.c.Comment,
                PackageId: $scope.c.PackId,
                CompanyId: companyInfo[0].father_id == null ? companyInfo[0].id : companyInfo[0].father_id,
                Booking_Person: userInfo.Booking_Person,
                contact_number: userInfo.Contact_number,
                subCompany_Id: $scope.c.SubCompanyId == null ? null : $scope.c.SubCompanyId,
                contact_email: userInfo.Contact_email
            };

            $scope.showClickedValidation = true;
            if(bookingForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {

                if($scope.data != null){
                    OnlineBookingService.submitBook($scope.data,$scope.headInfo).then(function(data){
                        if(data.status === 'success')
                            alert('Submit Booking Successfully!')
                        else if(data.status === 'error')
                            alert('Submit Booking Failed!')

                    })
                }
            }

        }

})

.controller('NewCandidateController',function($scope,$filter,$state,$modalInstance,OnlineBookingService, companyId, editInfo, toastr){

        $scope.info = {
            siteId:'',
            fromDate: '',
            toDate: '',
            calId:'',
            candidateName:'',
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

        if(editInfo !== null)
        {
            $scope.info = editInfo;
        }

        if(typeof $scope.info.siteId !== 'undefined' && $scope.info.siteId !== null && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
        {
            var id = $scope.info.siteId;
            var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
            var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

            OnlineBookingService.getCalendar(id,from,to).then(function(data){
                $scope.calList = data;
            })
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

        $scope.submitCandidate = function(candidateForm)
        {
            $scope.showClickedValidation = true;
            if(candidateForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                $scope.candidateInfo = {
                    siteId: '',
                    fromDate: '',
                    toDate: '',
                    calId: '',
                    candidateName: '',
                    dob: '',
                    position: '',
                    phone: '',
                    email: '',
                    siteName: '',
                    submitDate: '',
                    displayDate: ''

                };
                $scope.candidateInfo.candidateName = $scope.info.candidateName;
                $scope.candidateInfo.dob = $filter('date')($scope.info.dob, 'yyyy-MM-dd');
                $scope.candidateInfo.position = $scope.info.position;
                $scope.candidateInfo.phone = $scope.info.phone;
                $scope.candidateInfo.email = $scope.info.email;
                $scope.candidateInfo.siteId = $scope.info.siteId;
                $scope.candidateInfo.fromDate = $filter('date')($scope.info.fromDate, 'yyyy-MM-dd');
                $scope.candidateInfo.toDate = $filter('date')($scope.info.toDate, 'yyyy-MM-dd');
                $scope.candidateInfo.calId = $scope.info.calId;

                if($scope.info.calId !== null) {
                    OnlineBookingService.getAppointmentTime($scope.info.calId).then(function (data) {
                        var submitDate = $filter('date')(data[0].From_time, 'yyyy-MM-dd HH:mm:ss');
                        var displayDate = $filter('date')(data[0].From_time, 'dd/MM/yyyy HH:mm:ss');
                        $scope.candidateInfo.submitDate = submitDate;
                        $scope.candidateInfo.displayDate = displayDate;
                    })
                }

                for (var i = 0; i < $scope.siteList.length; i++) {
                    if ($scope.info.siteId === $scope.siteList[i].id) {
                        $scope.candidateInfo.siteName = $scope.siteList[i].Site_name;
                    }
                }

                $modalInstance.close($scope.candidateInfo);
            }

        }

    })