angular.module('app.loggedIn.company.directives.edit', [])

.directive('editCompany', function($filter,$state,$stateParams,CompanyModel,$modal,toastr,$cookieStore,ConfigService){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/edit.html',
		scope: {
			options: '='
		},
		link: function(scope, elem, attrs){
			var form = {
				id:$stateParams.companyId,
				// patient_id :$stateParams.patientid,//tannv.dts@gmail.com comment
				patient_id :$stateParams.patient_id,//tannv.dts@gmail.com add
				Company_name:null,
		        Industry:null,
		        Addr:null,
		        postcode:null,
		        State:null,
		        Description:null,
		        latitude:null,
		        longitude:null,
		        country:null,
		        result_email:null,
		        invoice_email:null,
		        PO_number:null,
		        isProject:null,
		        isCalendar:null,
		        father_id:null,
		        report_to_email:null,
		        default_status:null,
		        isInvoiceEmailToUser:null,
		        isAddContactEmailToResult:null,
		        IMA:null,
		        Site_name:null,
		        Medic_contact_no:null,
		        Email:null,
		        CODE:null,
		        Insurer:null,
		        Phone:null,
		        User_id:null,
		        isPO:null,
		        isExtra:null,
		        parent_id :null,
		        listInsurerid :[],
		        from_date:null,
		        to_date:null,
		        suburb:null
			}
			var load = function(row){
				scope.company.loading = true;
				CompanyModel.byCompanyId(form).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.form = response.data[0];
					scope.company.form.User_id = $cookieStore.get('userInfo').id;
					scope.company.listInsurer = response.data1;
					scope.company.checkColor = scope.company.form.Insurer;
                    _.forEach(scope.company.listInsurer, function(id){
                        scope.company.listTemp.push(id.id);
                    })
					scope.company.Company_name_Parent = response.data2[0].Company_name;
					scope.company.form.from_date = ConfigService.convertToDate(scope.company.form.from_date);
					scope.company.form.to_date = ConfigService.convertToDate(scope.company.form.to_date);
					console.log(response.data[0].Site_medic);
					form.Site_medic = (response.data[0].Site_medic == null || response.data[0].Site_medic == undefined || response.data[0].Site_medic == '')?[]:JSON.parse(response.data[0].Site_medic);
					console.log(form.Site_medic);
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
			}
			scope.onRowClick = function(row){
				var postData = { 
					Insurer:row.id,
					id:$stateParams.companyId
				}
				 scope.company.InsurerTemp = row.id;
				 scope.company.checkColor = row.id;
				CompanyModel.updateInsurer(postData)
						.then(function(response){
							toastr.success('Active Insurer Successfully');
						}, function(error){	
						})
				
			}
			scope.disableInsurer = function(row){
				var postData ={
					company_id:$stateParams.companyId,
					insurer_id:row.id,
					isEnable :row.checkisEnable
				}
				CompanyModel.disableInsurer(postData)
						.then(function(response){
						}, function(error){				
						})
				for (var i = 0; i <= scope.company.listTemp.length; i++) {
						if (scope.company.listTemp[i] == row.id) {
							if (scope.company.listInsurer[i].checkisEnable == 0) {
								scope.company.listInsurer[i].checkisEnable = 1;
							} else{
								scope.company.listInsurer[i].checkisEnable = 0;
							};
						} 
				}	
			}
			var remove = function(row){
				$modal.open({
					templateUrl:  'modules/company/dialogs/templates/remove.html',
					controller: 'CompanyRemoveDialog',
					size: 'sm',
					resolve: {
						row: function(){
							return row;
						}
					}
				})
			    .result.then(function(row){
			    	CompanyModel.removeInsurer(row)
					.then(function(response){
						for (var i = 0; i <= scope.company.listTemp.length; i++) {
							if (scope.company.listTemp[i] == row.id) {
								scope.company.listTemp.splice(i,1);
								scope.company.listInsurer.splice(i,1);
							} 
						}
						toastr.success('Delete Successfully');
					}, function(error){})
			    })
			}
			var save = function(){
				ConfigService.beforeSave(scope.company.errors);
				scope.company.form.patient_id = $stateParams.patient_id;
				scope.company.form.Site_medic = JSON.stringify(form.Site_medic);
				var postData = angular.copy(scope.company.form);
				if(postData.from_date)
					postData.from_date = ConfigService.convertToDB(postData.from_date);
				if(postData.to_date)
					postData.to_date = ConfigService.convertToDB(postData.to_date);

				postData.listInsurerid = scope.company.listInsurer;
				
				CompanyModel.edit(postData)
				.then(function(response){
					toastr.success('Edit Company Successfully');
		  			// $state.go('loggedIn.company');//tannv.dts comment
		  			$state.go('loggedIn.patient.company');//tannv.dts add
				}, function(error){
					scope.company.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.company.errors);
				})
			}
			var addCompany = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addParent.html',
			      controller: 'CompanyAddParentDialgosController',
			      size :'',
			      resolve: {
			      		companyId: function(){
			      			return $stateParams.companyId;
			      		}
			      }
			    })
			    .result.then(function(row){
			    	scope.company.Company_name_Parent = row.Company_name;
			    	scope.company.form.parent_id = row.id;
			    	scope.company.form.father_id = row.id;
			    })
			}

			var addInsurer = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addInsurer.html',
			      controller: 'CompanyInsurerDialgosController',
			      size :'',
			      resolve: {
			      		insurerArray: function(){
			      			return scope.company.listTemp;
			      		}
			      }
			    })
			    .result.then(function(row){
			    	row.checkisEnable=1;
					var flag = 0
					for (var i = 0; i <= scope.company.listTemp.length; i++) {
						if (scope.company.listTemp[i] == row.id) {
							flag = flag +1;
						} else{
						}
					}
					if (flag<=0) {
						scope.company.listTemp.push(row.id);
						scope.company.listInsurer.push(row);
					};
					
				})
			}
			 var showListCompanyRep = function(){
		    	var modalInstance = $modal.open({
			      	templateUrl: 'modules/company/dialogs/templates/listCompanyRep.html',
			      	controller: function($scope, $modalInstance)
			      	{
						$scope.list = form.Site_medic;
						$scope.onRowClick = function(data){
							swal({
					            title: "Confirm Delete",
					            text: "Are You Sure Want To Delete This Company Rep?",
					            type: "warning",
					            showCancelButton: true,
					            confirmButtonColor: "#DD6B55",
					            confirmButtonText: "Yes",
					            closeOnConfirm: true
					        }, function() {
					            form.Site_medic.splice(data,1);
					        })
						}
						$scope.addlist = function(){
							var modalInstance = $modal.open({
								templateUrl: 'modules/company/dialogs/templates/companyRep.html',
								controller: function($scope, $modalInstance,toastr)
								{
									$scope.formAdd = true;
									$scope.close = function(){
  										$modalInstance.dismiss('cancel');
    								}
									$scope.submitItem = function(){
										form.Site_medic.push({name:$scope.listInfo.name})
										console.log(form.Site_medic);
										toastr.success('Add Company Rep Successfully');
										$scope.close();
									}
								},
								size: 'sm'
							});
						}
						$scope.editItem = function(name,index){
							var name = name;
							var index = index;
							var modalInstance = $modal.open({
								templateUrl: 'modules/company/dialogs/templates/companyRep.html',
								controller: function($scope, $modalInstance)
								{
									$scope.formAdd = false;
									$scope.listInfo = {
										name:name
									}
									$scope.close = function(){
  										$modalInstance.dismiss('cancel');
    								}
    								$scope.saveItem = function(){
										form.Site_medic[index].name = $scope.listInfo.name;
										console.log(form.Site_medic);
										toastr.success('Edit Company Rep Successfully');
										$scope.close();
    								}
								},
								size: 'sm'
							});
						}
			      	},
			      	size :'md'
			    })
		    }
			scope.company = {
				form: form,
				error: '',
				loading: false,
				load:function(){load();},
				save:function(){save();},
				listInsurer:[],
				checkColor:'',
		    	listTemp:[],
		    	Company_name_Parent:'',
		    	save :function(){save();},
		    	addCompany :function(){addCompany();},
		    	addInsurer :function(){addInsurer();},
		    	remove : function(row){remove(row);},
		    	showListCompanyRep : function(){showListCompanyRep();}
			}

			//tannv.dts@gmail.com
			scope.cancel=function()
		    {
		    	$state.go('loggedIn.patient.company');//tannv.dts add
		    }

			/* LOAD FIRST */
			scope.company.load();
			/* END LOAD FIRST */
		}//end link
		
	}//end return
})