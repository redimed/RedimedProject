angular.module('app.loggedIn.company')

.directive('addCompanyNotFollow', function(CompanyModel, $filter,$state,$modal,$stateParams,toastr,$cookieStore,ConfigService,$q){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/add.html',
		scope: {
			options: '=',
			onRowClick: '&',
			success:'=',
			actionCenter:'='
		},
		link: function(scope, elem, attrs)
		{
			var actionCenter = scope.actionCenter;
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
		        Site_medic:null,
		        User_id: $cookieStore.get('userInfo').id,
		        isPO:null,
		        isExtra:null,
		        parent_id :null,
		        listInsurerid :[]
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
					var postData = { 
						Insurer:row.id,
						id:$stateParams.companyId
					}
					scope.company.InsurerTemp = row.id;
					scope.company.checkColor = row.id;
					CompanyModel.updateInsurer(postData)
					.then(function(response){}, function(error){})
					
				})
			}
			var save = function(){
				ConfigService.beforeSave(scope.company.errors);
		    	var postData = angular.copy(scope.company.form);
		    	postData.Insurer = scope.company.InsurerTemp === '' ? null : scope.company.InsurerTemp;
		    	postData.listInsurerid = scope.company.listTemp;
		  		CompanyModel.addCompanyNotFollow(postData)
		  			.then(function(response){
		  				toastr.success('Add Company Successfully');
		  				//phan quoc chien set company name and company id
		    			actionCenter.saveModal(postData.Company_name,response.data[0].id);
		  			}, function(error){
		  				scope.company.errors = angular.copy(error.data.errors);
					   ConfigService.beforeError(scope.company.errors);
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
		    	remove : function(row){remove(row);}
		    }
		    scope.cancel=function()
		    {
		    	actionCenter.closeModal();
		    }
		}//end link
		
	}//end return
})