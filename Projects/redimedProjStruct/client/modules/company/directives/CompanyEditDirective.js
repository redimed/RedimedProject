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
				patient_id :$stateParams.patientid,
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
					console.log(scope.company.listInsurer);
					scope.company.checkColor = scope.company.form.Insurer;
                    _.forEach(scope.company.listInsurer, function(id){
                        scope.company.listTemp.push(id.id);
                    })
					scope.company.Company_name_Parent = response.data2[0].Company_name;
					

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
				console.log(postData);
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
				console.log("----///// ",scope.company.listInsurer);	
				
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
				console.log("-----------------",postData);
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
				load:function(){load();},
				save:function(){save();},
				listInsurer:[],
				checkColor:'',
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