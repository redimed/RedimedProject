angular.module("app.loggedIn.patient.consult.controller",[])

	.controller("PatientConsultController",function(DoctorService,$filter,$rootScope,$interval,$window,$document,$cookieStore,$scope,$state,$modal,InsurerService,toastr,socket,OTSession,ReceptionistService,$stateParams,ConsultationService,PatientService,UserService,$interval){

		/* VUONG */
		$scope.addTemplate = function(){
			$state.go('loggedIn.template');
			$cookieStore.put('template_patient_id', $stateParams.patient_id);
		}		
		/* END VUONG */
		/*chien star*/
		//buttom add make referral
		$scope.referralAddForm = {
			is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.referral_panel.reload();
                    $scope.referralAddForm.close();
            }
		};
		//get list consultation of patient
		$scope.setListConsultationOfPatient = function(){
			ConsultationService.getListConsultOfPatient($stateParams.patient_id).then(function(data){
				if (data.status == 'success') {
					$scope.listConsultOfPatient = data.data;
					console.log(data.data);
				};
			});
		}
		$scope.setListConsultationOfPatient();
		//
		$scope.showPopupHistory = function(data){
			//console.log('---------------', data);
			var modalInstance = $modal.open({
				templateUrl:'modules/consultation/dialogs/dialogs_consult_history.html',
				controller: 'ConsultHistoryController',
				resolve: {
					consults:function(){
						return data;
					}
				}
			})
			
		}
		/*chien end*/
		$scope.patient_id = $stateParams.patient_id;
		$scope.cal_id = $stateParams.cal_id;
		$scope.userInfo = $cookieStore.get('userInfo');
		//chien show patien bar
        $scope.patientBarVer.version='zip';
        
		$scope.currDate = $filter('date')(new Date(),'dd/MM/yyyy hh:mm a');

		$scope.patientInfo = {};
		$scope.companyInfo = {};
		$scope.problemArr = [];
		$scope.isConsult = true;

		$scope.consultInfo = {
			patient_id: $scope.patient_id,
			cal_id: $scope.cal_id,
			problem_id: null,
			history: null,
			examination: null,
			treatment: null,
			diagnosis: null,
			measurements: [],
			scripts: [],
			images: []
		}
		//tannv.dts@gmail.com
		$scope.timerDisplay=null;
		//-------------------------------------------------
		$scope.problemAddForm = {
	        is_show: false,
	        open: function () {
	            this.is_show = true;
	        },
	        close: function () {
	            this.is_show = false;
	        },
	        success: function (response) {
	            if (response.status == 'success')
	            {
	            	$scope.problemAddForm.close();
	            	ConsultationService.getPatientProblem($scope.patient_id).then(function(rs){
						if(rs.status.toLowerCase() == 'success' && rs.data)
						{
							$scope.problemList = rs.data;
							$scope.consultInfo.problem_id = response.data.Problem_id;
							$scope.viewProblem(response.data.Problem_id);
						}
					})


	            }
	        }
	    }

		$scope.callInfo = {
			isCalling: null,
			callUser: null
		}

		var newwin = null;
		function popup(url) 
		{
			 params  = 'width='+screen.width;
			 params += ', height='+screen.height;
			 params += ', top=0, left=0';
			 params += ', fullscreen=yes';

		 	if ((newwin == null) || (newwin.closed))
			{
				newwin=window.open(url,'RedimedCallingWindow', params);
				newwin.focus();
			}

			if(newwin != null && !newwin.closed)
				window.open('','RedimedCallingWindow','');
			return false;
		}

		/**
		 * create by: unknown
		 * modify by tannv.dts@gmail.com
		 */
		function refresh(patientId){
	    	ConsultationService.getPatientCompany(patientId)
	    	.then(function(rs){
	    		exlog.log(rs);
				if(rs.status.toLowerCase() == 'success' && rs.info)
				{
					$scope.companyInfo = rs.info;
				}
			},function(err){
				exlog.logErr(err);
			});
	    }

	    refresh($scope.patient_id);

		$interval(function(){
			refresh($scope.patient_id);
		},40 * 1000);


		PatientService.get($scope.patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				var fName = [];
				fName.push(rs.data.First_name,rs.data.Sur_name,rs.data.Middle_name);
				$scope.patientInfo = rs.data;
				$scope.patientInfo.FullName = 
					(rs.data.Title != null || rs.data.Title != '') ? (rs.data.Title +" . " + fName.join(' ')) : fName.join(' ');

				InsurerService.insurerByPatient($scope.patient_id).then(function(res){
					if(res.status.toLowerCase() == 'success' && res.data.length > 0)
						$scope.patientInfo.insurer = res.data[0].insurer_name;
				})
			}
		})

		

		
		ConsultationService.getPatientProblem($scope.patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
				$scope.problemList = rs.data;
		})

		$scope.viewProblem = function(id){
			$scope.problemArr = [];
			if(id != null)
			{
				var index = _.findIndex($scope.problemList, { 'Problem_id': id});
				$scope.problemArr.push($scope.problemList[index]);
			}
			else
				$scope.problemArr = [];
		};

		$scope.measureAction = function(type,index){
			if(type == 'new')
			{
				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/measureModal.html',
					size:'lg',
					controller: "MeasurementController",
					resolve:{
						measure:function(){
							return null;
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
						$scope.consultInfo.measurements.push(data.value);
				})
			}

			if(type == 'edit')
			{
				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/measureModal.html',
					size:'lg',
					controller: "MeasurementController",
					resolve:{
						measure: function(){
							return $scope.consultInfo.measurements[index];
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
						$scope.consultInfo.measurements[index] = data.value;;
				})
			}

			if(type == 'delete')
			{
				swal({
	                title: "Confirm Delete",
	                text: "Are You Sure Want To Delete This Measure?",
	                type: "warning",
	                showCancelButton: true,
	                confirmButtonColor: "#DD6B55",
	                confirmButtonText: "Yes",
	                closeOnConfirm: true
	            }, function() {
	                $scope.consultInfo.measurements.splice(index,1);
	            })
			}
		};

		$scope.scriptAction = function(type,index){
			if(type == 'new')
			{
				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/scriptModal.html',
					windowClass: "consult-modal-window",
					controller:'ScriptController',
					resolve: {
						actual_doctor_id: function(){
							return $scope.actual_doctor_id;
						},
						script: function(){
							return null;
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
					{
						console.log(data.value.medication_name)
						if (data.value.medication_name !== null) {
							var count = 0;
							for (var i = 0; i < $scope.consultInfo.scripts.length; i++) {
								if($scope.consultInfo.scripts[i].medication_name === data.value.medication_name)
								{
									count ++;
								}
							};
							if (count === 0) {
								$scope.consultInfo.scripts.push(data.value);
							};
						};
						
						
					}
				})
			}

			if(type == 'edit')
			{

				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/scriptModal.html',
					windowClass: "consult-modal-window",
					controller:'ScriptController',
					resolve: {
						actual_doctor_id: function(){
							return $scope.actual_doctor_id;
						},
						script: function(){
							return $scope.consultInfo.scripts[index];
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
					{
						$scope.consultInfo.scripts[index] = data.value;
					}
				})
			}

			if(type == 'delete')
			{
				swal({
	                title: "Confirm Delete",
	                text: "Are You Sure Want To Delete This Script?",
	                type: "warning",
	                showCancelButton: true,
	                confirmButtonColor: "#DD6B55",
	                confirmButtonText: "Yes",
	                closeOnConfirm: true
	            }, function() {
	                $scope.consultInfo.scripts.splice(index,1);
	            })
			}
		};

		$scope.backClick = function(){
			 var from = $cookieStore.get('fromState');
			 var params = {};
			 if(from.fromParams != null || typeof from.fromParams !== 'undefined')
	        {
	            angular.forEach(from.fromParams, function(value , key) {
	                params[key] = value;
	            })
	        }
	        $state.go(from.fromState.name,params);
		};

		//==================================MAKE CALL============================
		function cancelListenerHandler(){
			console.log("Remove Success");
		}
		$scope.makeCall = function(user){

		 	socket.removeListener('generateSessionSuccess', cancelListenerHandler());

			socket.emit("generateSession",$scope.userInfo.id);
			socket.on("generateSessionSuccess",function(opentokRoom){
				popup($state.href('call',{apiKey:opentokRoom.apiKey,sessionId:opentokRoom.sessionId,token:opentokRoom.token,callUser: user.id, isCaller: 1, patientId:$scope.patient_id}));
			})
	    }

	    //==================================FILE SHARING============================
	     $scope.dropzoneConfig = {
		    'options': { 
		      'url': 'api/upload',
		      'addRemoveLinks':true
		    },
		    'eventHandlers': {
		      'sending': function (file, xhr, formData) {
		      	formData.append("patient_id", $scope.patient_id);
		      },
		      'success': function (file, response) {
		      	if(response.status == 'success')
		      	{
		      		socket.emit("shareFile",response.id,response.fileName,$scope.callInfo.callUser);
		      		toastr.success("Upload File Successfully!");
		      	}
		      	else
		      		toastr.error("Upload File Failed!");
		      }
		    }
		  };

	  	// ======================================WORK COVER=======================================
	  	$scope.selectedOpt = null;
	  	$scope.currWorkcover = null;

	  	$scope.first_opt = PatientService.workcoverSearchOpt('first', $scope.patient_id);
		$scope.progress_opt = PatientService.workcoverSearchOpt('progress', $scope.patient_id);
		$scope.final_opt = PatientService.workcoverSearchOpt('final', $scope.patient_id);
	    $scope.general_opt = PatientService.workcoverSearchOpt('general', $scope.patient_id);

	  	$scope.viewWorkcover = function(i){
	  		$scope.selectedOpt = i;
	  		switch(i){
	  			case 1:
	  				$scope.currWorkcover = 'First Assessment';
	  				break;
  				case 2:
	  				$scope.currWorkcover = 'Progress Assessment';
	  				break;
  				case 3:
	  				$scope.currWorkcover = 'Final Assessment';
	  				break;
  				case 4:
	  				$scope.currWorkcover = 'General Assessment';
	  				break;
	  		}
	  	}

	  	$scope.addWorkcover = function(){
	  		if($scope.selectedOpt != null)
	  		{
	  			switch($scope.selectedOpt){
	  				case 1:
		  				$state.go('loggedIn.waworkcover.first', {
							patient_id: $scope.patient_id,
			                action: 'add',
			                cal_id: $scope.cal_id,
			                wc_id: 0
			            });
		  				break;
	  				case 2:
		  				$state.go('loggedIn.waworkcover.progress', {
							patient_id: $scope.patient_id,
			                action: 'add',
			                cal_id: $scope.cal_id,
			                wc_id: 0
			            });
		  				break;
	  				case 3:
		  				$state.go('loggedIn.waworkcover.final', {
							patient_id: $scope.patient_id,
			                action: 'add',
			                cal_id: $scope.cal_id,
			                ass_id: 0
			            });
		  				break;
	  				case 4:
		  				$state.go('loggedIn.waworkcover.general', {
							patient_id: $scope.patient_id,
			                action: 'add',
			                cal_id: $scope.cal_id,
			                ass_id: 0
			            });
		  				break;
	  			}
	  		}
	  	}

	  	// ======================================ITEM SHEET========================================
	  	var arrGetBy = $filter('arrGetBy');
        $scope.appointment = {CAL_ID: $scope.cal_id, Patient_id:  $scope.patient_id};

        $scope.items_search_panel = {};
        $scope.deptItems =  null; // DEPT ITEM LIST
        $scope.apptItems = []; //APPT ITEM LIST
        $scope.extraItems = [];

        var isInDeptItems = function(item_id) {
        	if($scope.deptItems.length > 0)
        	{
	            for(var i= 0, len = $scope.deptItems.length; i < len; ++i){
	                var cat = $scope.deptItems[i];
	                 for(var j= 0, len2 = cat.items.length; j < len2; ++j){
	                    var t_item = cat.items[j];
	                     if(item_id == t_item.ITEM_ID) {
	                         return t_item;
	                    }
	                }
	            }
            }
            return false;

        }

        // INIT INVOICE
        PatientService.initInvoice($scope.appointment.Patient_id, $scope.appointment.CAL_ID);
        // END INIT INVOICE 

        ReceptionistService.apptDetail( $scope.appointment.CAL_ID)
        //  GET APPOINTMENT DETAIL
        .then(function(response){
            if(response.status === 'success') {
                delete response.data.Patient_id;
                angular.extend($scope.appointment, response.data);

                return PatientService.getDeptItems($scope.appointment.CLINICAL_DEPT_ID);
            }
        })
        // GET ITEMS OF DEPARTMENT
        .then(function(response){
            if(response.status === 'success') {
                $scope.deptItems = response.data.filter(function(item){
                    return item.clnDeptItemList.ISENABLE;
                });
				
                return PatientService.getApptItems($scope.appointment.CAL_ID, $scope.appointment.Patient_id);
            }
        })
        // GET ITEMS OF APPT AND GET ONLY EXTRA ITEM
        .then(function(response){
            if(response.status==='success'){
                $scope.apptItems = response.data;
                var item_id_list = [];
		 		angular.forEach($scope.deptItems, function(cat, key) {
                    angular.forEach(cat.items, function(item, key) {
                        // SET DEFAULT VALUE 4 ITEM
                        item.PRICE = 0; 
                        item.TIME_SPENT = 0;
                        item.QUANTITY = 1;
                        // END SET DEFAULT VALUE 4 ITEM
                        item_id_list.push(item.ITEM_ID);
                    });
                });
                // ID LIST DEPT 
                
                angular.forEach($scope.apptItems, function(item){
                    var t_item = isInDeptItems(item.ITEM_ID);
			        if(!!t_item) {
                        // price, quantity, time_spent 
                        t_item.QUANTITY = item.QUANTITY;
                        t_item.TIME_SPENT = item.TIME_SPENT;
                        t_item.PRICE = item.PRICE;
                        t_item.checked = item.is_enable === 1 ? '1' : '0';
                        t_item.inserted = (t_item.checked === '1');
                    } else { // IN EXTRA ITEMS
                        $scope.extraItems.push(item);
                        item_id_list.push(item.ITEM_ID);
                        item.checked = item.is_enable === 1 ? '1' : '0';
                        item.inserted = (item.checked === '1');
                    }
                });
                return ReceptionistService.itemFeeAppt($scope.appointment.SERVICE_ID, item_id_list);
            }
        })
        // GET FEE OF ITEM 
        .then( function( response ){
	     if(!response || !response.list) return; 
	 		var list_fee = response.list;
	 		angular.forEach($scope.deptItems, function(cat, key) {
	 			angular.forEach(cat.items, function(item, key) {
	 				var t_item = arrGetBy(list_fee, 'CLN_ITEM_ID', item.ITEM_ID);
	 				if(t_item && t_item.SCHEDULE_FEE > 0) {
	 					item.PRICE = t_item.SCHEDULE_FEE;
	 					item.disable_fee = true;
	 				}
	 			});
			});
            angular.forEach($scope.extraItems, function(item, key) {
                var t_item = arrGetBy(list_fee, 'CLN_ITEM_ID', item.ITEM_ID);
	 				if(t_item && t_item.SCHEDULE_FEE > 0) {
	 					item.PRICE = t_item.SCHEDULE_FEE;
	 					item.disable_fee = true;
	 				}
            });

         });

        /*
        *   ITEM SEARCH
        */
        $scope.itemOptions = {
            click:function(item){
                if(item.type == 'dept_item' || item.type == 'extra_item')
                    return;
                
                $scope.extraItems.push(item);
                // SET DEFAULT VALUE 4 ITEM
                item.QUANTITY = 1;
                item.TIME_SPENT = 0;
                item.checked = '1';
                // END SET DEFAULT VALUE 4 ITEM
                ReceptionistService.itemFeeAppt($scope.appointment.SERVICE_ID,[item.ITEM_ID]).then(function(response){
                    if(response.list.length > 0) {
                        item.PRICE = response.list[0].SCHEDULE_FEE
                        item.disable_fee = true;
                    } else {
                         item.PRICE = 0;
                        item.disable_fee = false;
                    }
                });
            },
            class:function(item){
                // CHECK EXIST IN DEPT_ITEMS    
                
                if(!!isInDeptItems(item.ITEM_ID)) {
                    item.type = 'dept_item';
                    return 'danger';
                }
                
                // CHECK EXIST IN EXTRA_ITEMS
                
                var t_item = arrGetBy($scope.extraItems, 'ITEM_ID', item.ITEM_ID);
                if(t_item) {
                    item.type = 'extra_item';
                    return 'info';
                }       
            },
            options:{
                api:'api/erm/v2/items/search',
                method:'post',
                scope: $scope.items_search_panel,
                columns: [
                    {field: 'ITEM_ID', is_hide: true},
                    {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
                    {field: 'ITEM_NAME', label: 'Item Name'},    
            ],
                use_filters:true,
                filters:{
                    ITEM_CODE: {type: 'text'},
                    ITEM_NAME: {type: 'text'},
                }
            }
        }
        
        $scope.itemSearch = {
            is_show: false,
            open: function(){
                this.is_show=true;
            },
            close:function(){
                this.is_show = false;
            }
        }
        
        $scope.submitClick = function(){
        	for(var i=0 ; i< $scope.consultInfo.measurements.length ; i++)
			{
				$scope.consultInfo.measurements[i].patient_id = $scope.patient_id;
				$scope.consultInfo.measurements[i].cal_id = $scope.cal_id;
			}
        	ConsultationService.submitConsult($scope.consultInfo).then(function(res){
				if(res.status == 'success')
				{
				 	toastr.success('Submit Consultation Success!');
					var insertArr = []; 
            
		            var fnInsertArr = function(item) {
		                 var t = {
		                    CLN_ITEM_ID: item.ITEM_ID,
		                    Patient_id: $scope.appointment.Patient_id,
		                    cal_id: $scope.appointment.CAL_ID,
		                    PRICE: item.PRICE,
		                    TIME_SPENT: !item.TIME_SPENT ? 0: item.TIME_SPENT,
		                    QUANTITY: item.QUANTITY,
		                    is_enable: item.checked == '1' ? 1 : 0
		                }
		                insertArr.push(t);
		            }
		            
		            if($scope.deptItems)
		            {
	            		angular.forEach($scope.deptItems, function(cat, key) {
			                angular.forEach(cat.items, fnInsertArr);
			            });
		            }
		            
		            if($scope.extraItems)
		            {
		            	angular.forEach($scope.extraItems, fnInsertArr);
		            }
		            
		            PatientService.saveItemSheet(insertArr).then(function(response){
		                console.log(response);
		                if(response.status === 'success'){
		                   	toastr.success('Save Item Success!');
		                    PatientService.endInvoice($scope.appointment.Patient_id, $scope.appointment.CAL_ID);
		                    $scope.setListConsultationOfPatient();
		                }
		                else{
		                    toastr.error('Save Item Failed!');
		                }
		            });
				}
				else
					toastr.success("Submit Consultation Failed!");
			})

        }

        /**
         * tannv.dts@gmail.com
         * -----------------------------------------------------------
         * -----------------------------------------------------------
         * -----------------------------------------------------------
         * -----------------------------------------------------------
         * -----------------------------------------------------------
         */
        
        /**
		 * tannv.dts@gmail.com
		 * Lay thong tin appt patient
		 */
		$scope.apptPatient={};
		$scope.actual_doctor_id={}
		$scope.apptStatus=ptnConst.apptStatus;
		$scope.getApptPatient=function()
		{
			var postData={
        		patientId:$scope.patient_id,
        		calId:$scope.cal_id
        	}
			ConsultationService.getApptPatient(postData)
			.then(function(data){
				if(data.status=='success')
				{
					$scope.apptPatient=data.data;
					DoctorService.getById($scope.apptPatient.actual_doctor_id)
					.then(function(data){
						$scope.actual_doctor_id = data;
						console.log('-----------------',$scope.actual_doctor_id);
					})

					if($scope.apptPatient.SESSION_START_TIME  && $scope.apptPatient.SESSION_END_TIME)
					{
						var tempStart=moment(new Date($scope.apptPatient.SESSION_START_TIME));
						var tempEnd=moment(new Date($scope.apptPatient.SESSION_END_TIME));
						var x=tempEnd.diff(tempStart,'seconds');
						$scope.timerDisplay=kiss.msToTimer(x).display;
					}

					if($scope.apptPatient.appt_status==ptnConst.apptStatus.workInProgress.value)
					{
						$scope.startSessionTime=$scope.apptPatient.SESSION_START_TIME;
					}

				}
				else
				{
					exlog.log(data);
				}
			},function(err){
				exlog.logErr(err);
			});
		}
		$scope.getApptPatient();
		/**
		 * tannv.dts@gmail.com
		 * chuyen appt patient status thanh Work In Progress
		 */
		$scope.startSession=function()
        {
        	ConsultationService.beforeStartSession($scope.apptPatient.DOCTOR_ID)
        	.then(function(data){
        		if(data.status=='success')
        		{
        			if(data.data.length>0)
        			{
        				var modalInstance = $modal.open({
							templateUrl: 'notifyApptsWorkInProgress',
							controller: function($scope, $modalInstance)
							{
								$scope.listData=data.data;
								$scope.gotoAppointment=function(item){
									if(!item.CAL_ID || !item.Patient_id) {
										toastr.error('Cannot goto appointment.','Error!')
										return;
									}
									$state.go("loggedIn.patient.appointment", {patient_id: item.Patient_id, cal_id: item.CAL_ID});
								}
								$scope.ok = function(){
									$modalInstance.dismiss('cancel');
								}
							},
							// size: 'sm'
						});
        			}
        			else
        			{
        				executeStart();
        			}
        		}
        		else
        		{
        			toastr.error("Error when check data.");
        		}
        	},function(err){
        		toastr.error("Error when check data.");
        		exlog.logErr(err);
        	});

        	function executeStart()
        	{
        		var startSessionTime=new Date();
        		var postData={
	        		patientId:$scope.patient_id,
	        		calId:$scope.cal_id,
	        		startSessionTime:moment(startSessionTime).format('YYYY/MM/DD HH:mm:ss')
	        	}
	        	ConsultationService.startSession(postData)
	        	.then(function(data){
	        		if(data.status=='success')
	        		{
	        			$scope.apptPatient.appt_status=ptnConst.apptStatus.workInProgress.value;
	        			toastr.success("Start progress success.");
	        			$scope.startSessionTime=startSessionTime;
	        			$scope.apptPatient.SESSION_START_TIME=startSessionTime;
	        			socket.emit("notifyReceptionist");
	        		}
	        		else
	        		{
	        			exlog.logErr(data);
	        			toastr.error("Start progress error.");
	        		}
	        	},function(err){
	        		exlog.logErr(err);
	        		toastr.error("Start progress error.");
	        	});
        	}
        }

        $scope.beforeFinishSession=function()
        {
        	var postData={
        		patientId:$scope.patient_id,
        		calId:$scope.cal_id
        	}
        	ConsultationService.beforeFinishSession(postData)
        	.then(function(data){
        		if(data.status=='success')
        		{
        			if(data.data.length>0)
        			{
        				$scope.finishSession();
        			}
        			else
        			{
        				var modalInstance = $modal.open({
							templateUrl: 'notifyChooseItem',
							controller: function($scope, $modalInstance){
								$scope.ok = function(){
									$modalInstance.dismiss('cancel');
								}
							},
							size: 'sm'
						});
        			}
        		}
        		else
        		{
        			exlog.logErr(data);
        			toastr.error("Complete progress fail.");
        		}
        	},function(err){
        		exlog.logErr(err);
        		toastr.error("Complete progress fail.");
        	});
        }

        $scope.finishSession=function()
        {
        	var endSessionTime=new Date();
        	var postData={
        		patientId:$scope.patient_id,
        		calId:$scope.cal_id,
        		endSessionTime:moment(endSessionTime).format("YYYY/MM/DD HH:mm:ss")
        	}
        	ConsultationService.finishSession(postData)
        	.then(function(data){
        		if(data.status=='success')
        		{
        			$scope.apptPatient.appt_status=ptnConst.apptStatus.completed.value;
        			$scope.startSessionTime='close';
        			$scope.apptPatient.SESSION_END_TIME=endSessionTime;
        			toastr.success("Complete progress success.");
        			socket.emit("notifyReceptionist");
        		}
        		else
        		{
        			exlog.logErr(data);
        			toastr.error("Complete progress fail.");
        		}
        	},function(err){
        		exlog.logErr(err);
        		toastr.error("Complete progress fail.");
        	});
        }
        
	})

	.directive('dropzone', function () {
	  return function (scope, element, attrs) {
	    var config, dropzone;
	 
	    config = scope[attrs.dropzone];
	 
	    // create a Dropzone for the element with the given options
	    dropzone = new Dropzone(element[0], config.options);
	 
	    // bind the given event handlers
	    angular.forEach(config.eventHandlers, function (handler, event) {
	      dropzone.on(event, handler);
	    });
	  };
	})

