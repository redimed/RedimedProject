/**
 * Created by meditech on 02/10/2014.
 */
angular.module('app.loggedIn.booking.admin.company.controller',[])
    .controller('AdminCompanyController',function($scope,$state,$modal,$filter,ngTableParams,$cookieStore,FileUploader,OnlineBookingAdminService,toastr){
        $scope.data = [];
        var comArr = [];
        var subArr = [];
        $scope.data1 = [];
        $scope.patientData = [];
        $scope.isSelected = false;

        $scope.selectedId = null;

        if($cookieStore.get('companyInfo') != undefined)
            $scope.companyInfo = $cookieStore.get('companyInfo');


        OnlineBookingAdminService.getCompanyList().then(function(data){

            comArr = data;
            for(var i=0; i<comArr.length; i++){
                if(comArr[i].father_id === null){
                    $scope.data.push(comArr[i]);
                }
            }

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

            $scope.tableParams2 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.data1.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.data1, params.filter()) :
                        $scope.data1;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data1;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.tableParams3 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.patientData.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.patientData, params.filter()) :
                        $scope.patientData;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.patientData;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        })

        $scope.showSubCompany = function(b){
            $scope.selectedId = b.id;
            $scope.selectedComp = b.Company_name;

            $scope.data1 = [];
            $scope.patientData = [];

            $scope.isSelected = true;
            for(var i=0 ; i<comArr.length; i++){
                if(comArr[i].father_id === b.id){
                    $scope.data1.push(comArr[i]);
                }
            }

            OnlineBookingAdminService.getCompanyPatients(b.id).then(function(rs){
                if(rs.status == 'success')
                {
                    $scope.patientData = rs.data;
                    for(var i=0; i<$scope.patientData.length; i++)
                    {
                        var nameArr = [];
                        nameArr.push($scope.patientData[i].Title);
                        nameArr.push($scope.patientData[i].First_name);
                        nameArr.push($scope.patientData[i].Sur_name);
                        nameArr.push($scope.patientData[i].Middle_name);

                        $scope.patientData[i].fullName = nameArr.join(' ');


                    }
                    $scope.tableParams3.reload();
                }

            })

            $scope.tableParams2.reload();
        }

        $scope.addNewCompany = function(){
            $state.go('loggedIn.admin_company_new');
        }

        $scope.editCompany = function(b){
            $state.go('loggedIn.admin_company_edit',{fatherId: b.id},{reload:true});
        }

        $scope.addSubCompany = function(){

            $state.go('loggedIn.admin_company_new',{id:$scope.selectedId},{reload:true})
        }

        $scope.editSubCompany = function(a){
            $state.go('loggedIn.admin_company_edit',{fatherId:$scope.selectedId,subId: a.id},{reload:true});
        }

        $scope.viewPatient = function(a){
            $state.go('loggedIn.patient.appointment',{patient_id:a.Patient_id,cal_id:1},{reload:true});
        }

        $scope.showRequirement = function() {

            var modalInstance = $modal.open({
                templateUrl: 'Requirements',
                controller: 'RequirementController',
                size: 'lg',
                resolve:{
                    idr: function(){
                        return $scope.selectedId;
                    }
                }
            })
            .result.then(function(response) {
                console.log(response);
            })
            
        }

    })

.controller('AdminNewCompanyController',function($scope,$state,ngTableParams,$stateParams,toastr,$cookieStore,OnlineBookingAdminService){
    $scope.isEdit = false;
    var comId = null;
    if($stateParams.id !== null || $stateParams.id !== '' || typeof $stateParams.id !== 'undefined')
        comId = $stateParams.id;

    $scope.info = {
        companyName:null,
        industry:null,
        addr:null,
        postCode:null,
        state:null,
        country:null,
        description:null,
        poNum:null,
        isInvoice:null,
        invoiceEmail:null,
        isResult:null,
        resultEmail:null,
        reportEmail:null,
        status:null,
        isProject:null,
        isPO:null,
        isExtra:null,
        phone: null,
        fatherId: comId
    };

    $scope.submitCompany = function(companyForm){
        $scope.showClickedValidation = true;
        if(companyForm.$invalid){
            toastr.error("Please Input All Required Information!", "Error");
        }else
        {
            OnlineBookingAdminService.checkCompanyName($scope.info.companyName).then(function(data){
                if(data.status == 'error')
                {
                    toastr.error("Company Name is already exists!");
                    $scope.isExist = true;
                }
                else
                {
                    $scope.isExist = false;
                    OnlineBookingAdminService.insertNewCompany($scope.info).then(function(data){
                        if(data.status === 'success')
                        {
                            toastr.success("Submit New Company Successfully!","Success");
                            $state.go('loggedIn.admin_company', null, {"reload":true});
                        }
                        else if(data.status === 'error')
                            toastr.error("Submit New Company Failed!", "Error");
                    })
                }
            })
            
        }
    }
})

.controller('AdminEditCompanyController',function($scope,$filter,ngTableParams,$state,$stateParams,OnlineBookingService,toastr,$cookieStore,OnlineBookingAdminService){
    $scope.isEdit = true;
    $scope.fatherId = ($stateParams.fatherId != null || $stateParams.fatherId != undefined) ? $stateParams.fatherId : null;
    $scope.subId = ($stateParams.subId != null || $stateParams.subId != undefined) ? $stateParams.subId : null;
    $scope.patientData = [];
    $scope.data1 = [];

    $scope.tableParams2 = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.data1.length, // length of data
        getData: function($defer, params) {
            var filteredData = params.filter() ?
                $filter('filter')($scope.data1, params.filter()) :
                $scope.data1;

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                $scope.data1;

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.tableParams3 = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: $scope.patientData.length, // length of data
        getData: function($defer, params) {
            var filteredData = params.filter() ?
                $filter('filter')($scope.patientData, params.filter()) :
                $scope.patientData;

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                $scope.patientData;

            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    OnlineBookingAdminService.getCompanyList().then(function(data){
         for(var i=0 ; i<data.length; i++){
            if(data[i].father_id == $scope.fatherId){
                $scope.data1.push(data[i]);
            }
        }
        $scope.tableParams2.reload();
    })

    OnlineBookingAdminService.getCompanyPatients($scope.fatherId == null ? $scope.subId : $scope.fatherId).then(function(rs){
        if(rs.status == 'success')
        {
            $scope.patientData = rs.data;
            for(var i=0; i<$scope.patientData.length; i++)
            {
                var nameArr = [];
                nameArr.push($scope.patientData[i].Title);
                nameArr.push($scope.patientData[i].First_name);
                nameArr.push($scope.patientData[i].Sur_name);
                nameArr.push($scope.patientData[i].Middle_name);

                $scope.patientData[i].fullName = nameArr.join(' ');
            }
            $scope.tableParams3.reload();
        }

    })

    $scope.addSubCompany = function(){
        $state.go('loggedIn.admin_company_new',{id:$scope.fatherId},{reload:true})
    }

    $scope.editSubCompany = function(a){
        $state.go('loggedIn.admin_company_edit',{fatherId:$scope.fatherId,subId: a.id},{reload:true});
    }

    $scope.viewPatient = function(a){
        $state.go('loggedIn.patient.appointment',{patient_id:a.Patient_id,cal_id:1},{reload:true});
    }

    $scope.info = {
        id: $scope.fatherId == null ? $scope.subId : $scope.fatherId,
        companyName:null,
        industry:null,
        addr:null,
        postCode:null,
        state:null,
        country:null,
        description:null,
        poNum:null,
        isInvoice:null,
        invoiceEmail:null,
        isResult:null,
        resultEmail:null,
        reportEmail:null,
        status:null,
        isProject:null,
        isPO:null,
        isExtra:null,
        phone: null
    };

    OnlineBookingAdminService.getCompanyInfo($scope.fatherId == null ? $scope.subId : $scope.fatherId).then(function(data){
        $scope.info = {
            id: $scope.fatherId == null ? $scope.subId : $scope.fatherId,
            companyName: data.Company_name,
            industry:data.Industry,
            addr:data.Addr,
            postCode:data.postcode,
            state:data.State,
            country:data.country,
            description:data.Description,
            poNum:data.PO_number,
            isInvoice:data.isInvoiceEmailToUser != 1 ? '0' : '1',
            invoiceEmail:data.invoice_email,
            isResult:data.isAddContactEmailToResult != 1  ? '0' : '1',
            resultEmail:data.result_email,
            reportEmail:data.report_to_email,
            status:data.default_status,
            phone: data.Phone,
            isProject:data.isProject != 1  ? '0' : '1',
            isPO:data.isPO != 1  ? '0' : '1',
            isExtra:data.isExtra != 1  ? '0' : '1'
        };
    })

        $scope.submitCompany = function(companyForm){
            $scope.showClickedValidation = true;
            if(companyForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                OnlineBookingAdminService.checkCompanyName($scope.info.companyName).then(function(data){
                    if(data.status == 'error'){
                        $scope.isExist = true;
                        toastr.error("Company Name is already exists!");
                    }
                    else
                    {
                        $scope.isExist =  false;
                        OnlineBookingAdminService.editCompanyInfo($scope.info).then(function(data){
                            if(data.status === 'success')
                            {
                                toastr.success("Edit Company Successfully!","Success");
                            }
                            else if(data.status === 'error')
                                toastr.error("Edit Company Failed!", "Error");
                        })
                    }
                })
            }
        }
})