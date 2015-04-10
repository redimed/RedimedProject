angular.module('app.loggedIn.company.directives.add', [])

.directive('addCompany', function(CompanyModel, $filter,$state,$modal,$stateParams,toastr,$cookieStore,ConfigService){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/add.html',
		scope: {
			options: '=',
			onRowClick: '&'
		},
		link: function(scope, elem, attrs)
		{
			var form ={
		        Company_name:'',
		        Industry:'',
		        Addr:'',
		        postcode:'',
		        State:'',
		        Description:'',
		        latitude:'',
		        longitude:'',
		        country:'',
		        result_email:'',
		        invoice_email:'',
		        PO_number:'',
		        isProject:'',
		        isCalendar:'',
		        father_id:'',
		        report_to_email:'',
		        default_status:'',
		        isInvoiceEmailToUser:'',
		        isAddContactEmailToResult:'',
		        IMA:'',
		        Site_name:'',
		        Medic_contact_no:'',
		        Email:'',
		        CODE:'',
		        Insurer:'',
		        Phone:'',
		        Site_medic:'',
		        User_id: $cookieStore.get('userInfo').id,
		        isPO:'',
		        isExtra:'',
		        parent_id :'',
		        listInsurerid :[],
		        patient_id :$stateParams.patientId
			}
			scope.onRowClick = function(row){
				 scope.company.InsurerTemp = row.id;
				 scope.company.checkColor = row.id;
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
		    	var postData = angular.copy(scope.company.form);
		    	postData.Insurer = scope.company.InsurerTemp;
		    	postData.listInsurerid = scope.company.listTemp;
		  		CompanyModel.add(postData)
		  			.then(function(response){
		  				toastr.success('Add Company Successfully');
		  				$state.go('loggedIn.company');
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
		}//end link
		
	}//end return
})