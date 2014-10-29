/**
 * Created by meditech on 02/10/2014.
 */
angular.module('app.loggedIn.booking.admin.company.controller',[])
    .controller('AdminCompanyController',function($scope,$state,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService,toastr){
        $scope.data = [];
        var comArr = [];
        var subArr = [];
        $scope.data1 = [];
        $scope.isSelected = false;
        $scope.selectedComp = null;

        $scope.selectedId = null;


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


        })

        $scope.showSubCompany = function(b){
            $scope.selectedId = b.id;

            $scope.data1 = [];
            $scope.isSelected = true;
            $scope.selectedComp = b.id;
            for(var i=0 ; i<comArr.length; i++){
                if(comArr[i].father_id === b.id){
                    $scope.data1.push(comArr[i]);
                }

            }
            $scope.tableParams2.reload();
        }

        $scope.addNewCompany = function(){
            $state.go('loggedIn.admin_company_new');
        }

        $scope.editCompany = function(b){
            $state.go('loggedIn.admin_company_edit',{id: b.id});
        }

        $scope.addSubCompany = function(){

            $state.go('loggedIn.admin_subCompany_new',{id:$scope.selectedComp})
        }

        $scope.editSubCompany = function(a){
            $state.go('loggedIn.admin_company_edit',{id: a.id});
        }

    })

.controller('AdminNewCompanyController',function($scope,$state,$stateParams,toastr,$cookieStore,OnlineBookingAdminService){
    $scope.isEdit = false;
        var comId;
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
        fatherId: comId
    };

    $scope.submitCompany = function(companyForm){
        $scope.showClickedValidation = true;
        if(companyForm.$invalid){
            toastr.error("Please Input All Required Information!", "Error");
        }else
        {
            OnlineBookingAdminService.insertNewCompany($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Submit New Company Successfully!","Success");
                    $state.go('loggedIn.admin_company_new', null, {"reload":true});
                }
                else if(data.status === 'error')
                    toastr.error("Submit New Company Failed!", "Error");
            })
        }
    }
})

.controller('AdminEditCompanyController',function($scope,$state,$stateParams,OnlineBookingService,toastr,$cookieStore,OnlineBookingAdminService){
    $scope.isEdit = true;

    $scope.info = {
        id: $stateParams.id,
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
        isExtra:null
    };



    OnlineBookingAdminService.getCompanyInfo($stateParams.id).then(function(data){
        $scope.info = {
            id: $stateParams.id,
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
                OnlineBookingAdminService.editCompanyInfo($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Edit Company Successfully!","Success");
                    }
                    else if(data.status === 'error')
                        toastr.error("Edit Company Failed!", "Error");
                })
            }
        }
})