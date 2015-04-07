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
				parent_id :$stateParams.patientid,
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
		        User_id:'',
		        isPO:'',
		        isExtra:'',
		        parent_id :'',
		        listInsurerid :[],
			}
			var load = function(row){
				scope.company.loading = true;
				CompanyModel.byCompanyId(form).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.form = response.data[0];
					scope.company.form.User_id = $cookieStore.get('userInfo').id;
					scope.company.listInsurer = response.data1;
                    _.forEach(scope.company.listInsurer, function(id){
                        scope.company.listTemp.push(id.id);
                    })
					scope.company.Company_name_Parent = response.data2[0].Company_name;
					console.log(response);
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
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
								console.log(scope.company.listTemp);
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
				var postData = angular.copy(scope.company.form);
				postData.listInsurerid = scope.company.listInsurer;
				CompanyModel.edit(postData)
				.then(function(response){
					toastr.success('Edit Company Successfully');
		  					$state.go('loggedIn.company');
				}, function(error){
					scope.company.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.company.errors);
				})
			}
			var addCompany = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addParent.html',
			      controller: 'CompanyAddParentDialgosController',
			      size :''
			    })
			    .result.then(function(row){
			    	scope.company.Company_name_Parent = row.Company_name;
			    	scope.company.parent_id = row.id;
			    	scope.company.father_id = row.id;
			    })
			}

			var addInsurer = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addInsurer.html',
			      controller: 'CompanyInsurerDialgosController',
			      size :''
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
			scope.company = {
				form: form,
				error: '',
				loading: false,
				// form: '',
				load:function(){load();},
				save:function(){save();},
				listInsurer:[],
		    	listTemp:[],
		    	Company_name_Parent:'',
		    	save :function(){save();},
		    	addCompany :function(){addCompany();},
		    	addInsurer :function(){addInsurer();},
		    	remove : function(row){remove(row);}
			}

			/* LOAD FIRST */
			scope.company.load();
			/* END LOAD FIRST */
		}//end link
		
	}//end return
})