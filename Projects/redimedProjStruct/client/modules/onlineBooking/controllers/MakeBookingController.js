/**
 * Created by meditech on 24/09/2014.
 */


angular.module('app.loggedIn.booking.make.controller',[])
.controller('MakeBookingController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
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
                $scope.packageList.push({id:-1,package_name:"Custom Package"});
            }

        })


        var arrCustomAss = [];
        $scope.packageChange = function(PackId){
            var arrAss = [];


            if(PackId !== null)
            {
                if(PackId == -1)
                {
                    $scope.packAss = [];

                    var modalInstance = $modal.open({
                        templateUrl:'modules/onlineBooking/views/customPackage.html',
                        controller: 'CustomPackageController',
                        size:'lg'
                    })

                    modalInstance.result.then(function (data){
                        for(var i=0; i<data.length; i++)
                        {
                            arrAss.push({head_name:data[i].HeaderName == null || data[i].HeaderName == '' ? '' : data[i].HeaderName,ass_name:data[i].ass_name});
                            arrCustomAss.push({ass_id:data[i].ass_id, ass_name:data[i].ass_name});
                        }

                        $scope.packAss = _.groupBy(arrAss,"head_name");

                        $scope.newCandidate();

                    },function(err){
                        console.log(err);
                    });
                }
                else
                {
                    arrCustomAss = [];
                    OnlineBookingService.getPackageAssById(PackId).then(function(data){
                        if(data.status === 'success')
                        {
                            for(var i=0; i<data.rs.length; i++)
                            {
                                arrAss.push({head_name:data.rs[i].HeaderName == null || data.rs[i].HeaderName == '' ? '' : data.rs[i].HeaderName,ass_name:data.rs[i].ass_name});
                            }

                            $scope.packAss = _.groupBy(arrAss,"head_name");


                        }
                    })

                    $scope.newCandidate();
                }


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
                contact_email: userInfo.Contact_email,
                arrCustomAss : arrCustomAss.length <= 0 ? null : arrCustomAss

            };

            $scope.showClickedValidation = true;
            if(bookingForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {

                if($scope.data.length <= 0)
                {
                    toastr.error("Please Add Some Candidate For Booking!", "Error");
                }
               else{
                    OnlineBookingService.submitBook($scope.data,$scope.headInfo).then(function(data){
                        if(data.status === 'success')
                        {
                            toastr.success("Submit Booking Successfully!","Success");
                            $state.go('loggedIn.makeBooking', null, {"reload":true});
                        }
                        else if(data.status === 'error')
                            toastr.error("Submit Booking Failed!", "Error");

                    })
                }

            }

        }

})

.controller('CustomPackageController',function($scope,$state,$modalInstance,OnlineBookingService , OnlineBookingAdminService, toastr){
        $scope.info = {
            checkedAss: []
        }

        OnlineBookingAdminService.getAssessment().then(function(data){
            $scope.assList = data;
        })


        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.okClick = function(){

            OnlineBookingService.customPackage($scope.info.checkedAss).then(function(data){
                $modalInstance.close(data);
            })
        }
})

.controller('NewCandidateController',function($scope,$filter,$state,$modalInstance,OnlineBookingService, companyId, editInfo, toastr){

        $scope.info = {
            siteId:null,
            fromDate: null,
            toDate: null,
            calId:null,
            candidateName:null,
            dob:null,
            position:null,
            phone:null,
            email:null,
            stateId:null,
            suburbId:null,
            stateName:null,
            suburbName:null
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
            console.log($scope.info);
            if($scope.info.stateId != null)
            {
                OnlineBookingService.getSiteState($scope.info.siteId).then(function(data){
                    $scope.stateList = data;
                })
            }
           if($scope.info.suburbId != null){
               OnlineBookingService.getStateSuburb($scope.info.stateId).then(function(data){
                   $scope.suburbList = data;
               })
           }

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

        $scope.minDate = new Date();

        $scope.maxDate = new Date();

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.haveState = false;
        $scope.haveSuburb = false;
        $scope.siteChange = function(){
            if(typeof $scope.info.siteId !== 'undefined' && $scope.info.siteId !== null && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                $scope.info.stateId = null;
                $scope.info.suburbId = null;
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');
                OnlineBookingService.getSiteState(id).then(function(data){
                    if(data != null && data.length > 0)
                    {
                        $scope.calList = [];
                        $scope.info.appointmentTime = '';
                        $scope.haveState = true;
                        $scope.stateList = data;

                    }
                    else
                    {
                        $scope.haveState = false;
                        $scope.haveSuburb = false;
                        OnlineBookingService.getCalendar(id,from,to).then(function(data){
                            $scope.calList = data;
                        })
                    }

                })

            }
            else
            {
                $scope.info.stateId = null;
                $scope.info.suburbId = null;
                $scope.haveState = false;
                $scope.haveSuburb = false;
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }

        }

        $scope.siteStateChange = function(id){
            if(id != null)
            {

                $scope.info.suburbId = null;
                $scope.suburbList = [];
                OnlineBookingService.getStateSuburb(id).then(function(data){
                    if(data != null && data.length > 0){
                        $scope.haveSuburb = true;
                        $scope.suburbList = data;
                    }
                })
            }
            else
            {
                $scope.info.suburbId = null;
                $scope.haveSuburb = false;
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
                    displayDate: '',
                    stateId:'',
                    suburbId:'',
                    stateName:'',
                    suburbName:''

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
                $scope.candidateInfo.stateId = $scope.info.stateId;
                $scope.candidateInfo.suburbId = $scope.info.suburbId;
                if(typeof $scope.stateList !== 'undefined' || $scope.stateList != null)
                {
                    for(var i = 0; i<$scope.stateList.length; i++)
                    {
                        if($scope.info.stateId == $scope.stateList[i].state_id)
                            $scope.candidateInfo.stateName = $scope.stateList[i].state_name;
                    }
                }

                if(typeof $scope.suburbList !== 'undefined' || $scope.suburbList != null)
                {
                    for(var i = 0; i<$scope.suburbList.length; i++)
                    {
                        if($scope.info.suburbId == $scope.suburbList[i].suburb_id)
                            $scope.candidateInfo.suburbName = $scope.suburbList[i].suburb_name;
                    }
                }

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