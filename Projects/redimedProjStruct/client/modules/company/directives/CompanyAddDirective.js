angular.module('app.loggedIn.company.directives.add', [])

.directive('addCompany', function(CompanyModel, $filter,$state,$modal,$stateParams,toastr,$cookieStore,ConfigService){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/add.html',
		scope: {
			options: '=',
			onRowClick: '&',
			//success:'=',
			actionCenter:'='//tannv.dts@gmail.com add
		},
		link: function(scope, elem, attrs)
		{
				var parent=document.getElementsByClassName("un_tn_modal_remove_background")[0].parentNode;
				parent.style.background="none";
				console.log(parent.style.background);
			var form ={
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
		        Site_medic:[],
		        User_id: $cookieStore.get('userInfo').id,
		        isPO:null,
		        isExtra:null,
		        parent_id :null,
		        listInsurerid :[],
		        from_date:null,
		        to_date:null,
		        // patient_id :$stateParams.patientId//tannv.dts@gmail.com comment
		        patient_id :$stateParams.patient_id,//tannv.dts add
		        suburb:null //phanquocchien.c1109g@gmail.com add
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
			scope.clickDisable = function(row){
				for (var i = 0; i <= scope.company.listTemp.length; i++) {
						if (scope.company.listTemp[i] == row.id) {
							scope.company.listTemp.splice(i,1);
							scope.company.listInsurer.splice(i,1);
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
						toastr.success('Delete Successfully');
					}, function(error){})
			    })
			}
			var addCompany = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addParent.html',
			      controller: 'CompanyAddParentDialgosController',
			      size :'',
			      resolve: {
			      		companyId: function(){
			      			return -1;
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
			var save = function(){
				ConfigService.beforeSave(scope.company.errors);
				_.forEach(form.Site_medic, function(n) {
				  	delete n.$$hashKey;
				});
				scope.company.form.Site_medic = form.Site_medic;
		    	var postData = angular.copy(scope.company.form);
		    	postData.Insurer = scope.company.InsurerTemp === '' ? null : scope.company.InsurerTemp;
		    	postData.listInsurerid = scope.company.listTemp;
		    	if(postData.from_date)
					postData.from_date = ConfigService.convertToDB(postData.from_date);
				if(postData.to_date)
					postData.to_date = ConfigService.convertToDB(postData.to_date);
		  		CompanyModel.add(postData)
		  			.then(function(response){
		  				toastr.success('Add Company Successfully');
		  				// $state.go('loggedIn.company');//tan comment
		  				//$state.go('loggedIn.patient.company');//tan add
		  				scope.actionCenter.closeModal();
		  				//scope.success = true;
		  			}, function(error){
		  				scope.company.errors = angular.copy(error.data.errors);
					   ConfigService.beforeError(scope.company.errors);
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
									$scope.submitItem = function(data){

										form.Site_medic.push({name:data})
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
						$scope.close = function(){
							$modalInstance.dismiss('cancel');
						}
			      	},
			      	size :'md'
			    })
		    }
		    scope.company = {
		    	form:form,
		    	listInsurer:[],
		    	listTemp:[],
		    	errors:[],
		    	Company_name_Parent:'',
		    	InsurerTemp:'',
		    	checkColor:'',
		    	save: function(){ save(); },
		    	addCompany :function(){addCompany();},
		    	addInsurer :function(){addInsurer();},
		    	remove : function(row){remove(row);},
		    	showListCompanyRep : function(){showListCompanyRep();}
		    }

		    scope.cancel=function()
		    {
		    	scope.actionCenter.closeModal();
		    }
		}//end link
		
	}//end return
})