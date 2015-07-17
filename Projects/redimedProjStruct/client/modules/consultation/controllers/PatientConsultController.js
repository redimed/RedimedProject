angular.module("app.loggedIn.patient.consult.controller",[])

	.controller("PatientConsultController",function(AlertModel,ConsultInfoService,InjuryManagementService,DoctorService,$filter,$rootScope,$interval,$window,$document,$cookieStore,$scope,$state,$modal,InsurerService,toastr,socket,OTSession,ReceptionistService,$stateParams,ConsultationService,PatientService,UserService,$interval,InvoiceService){

		$scope.templates = [];

		$scope.viewInjury = function(){

			InjuryManagementService.getInjuryById($scope.apptPatient.injury_id).then(function(rs){
	            if(rs.status == 'success')
	            {
	                $modal.open({
						templateUrl: 'modules/consultation/dialogs/dialog_injury_details.html',
						size: 'md',
						resolve: {
							injuryInfo:function(){
								return  rs.data;
							}
						},
						controller: function($scope,$modalInstance,$stateParams,injuryInfo,InjuryManagementService){
							$scope.info = injuryInfo;
							$scope.loadedImage = false;
							$scope.injuryImages = [];
							$scope.imgArr = [];

							$scope.info.injury_date = moment.utc($scope.info.injury_date).format('DD/MM/YYYY - hh:mm:ss');

							if(typeof injuryInfo.injuryImg !== 'undefined' && injuryInfo.injuryImg.length > 0)
			                {
			                    $scope.loadedImage = true;
			                    for(var i=0; i< injuryInfo.injuryImg.length; i++)
			                    {
			                        $scope.imgArr.push({url: location.origin+"/api/im/image/"+ injuryInfo.injuryImg[i].id, img: injuryInfo.injuryImg[i]});
			                    }
			                }

			                $scope.cancelClick = function(){
			                	$modalInstance.close();
			                }

					        $scope.viewImage = function(img){
					            var modalInstance = $modal.open({
					                templateUrl: "modules/injuryManagement/views/imageModal.html",
					                size: 'md',
					                resolve: {
					                    imgObj: function(){
					                        return img;
					                    }
					                },
					                controller: function($scope, $state,$modalInstance, UserService,socket,toastr,imgObj){
					                    $scope.img = {
					                    	image: location.origin+"/api/im/image/"+imgObj.id,
					                    	description: imgObj.desc
					                    }
					                }
					            })
					        }

						}
					})
	            }
	        })
			
		}

	
		/* VUONG */
		$scope.addTemplate = function(){
			$modal.open({
				templateUrl: 'listTemplateDialog',
				controller: function($scope, $modalInstance, $stateParams){
					$scope.patient_id = $stateParams.patient_id;
					$scope.cal_id = $stateParams.cal_id;
					$scope.success = null;

					$scope.$watch('success', function(success){
						if(success){
							$modalInstance.close(success);
						}
					})
				}
			})
			.result.then(function(success){
				console.log(success);

				$scope.templates.push(success);
			})
		}		
		/* END VUONG */
		/*chien star*/
		//buttom add make referral
    	$scope.loadDataAddMakeReferral = {};
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
                	$scope.loadDataAddMakeReferral.load();
                    $scope.referralAddForm.close();
            }
		};
		$scope.patient_id = $stateParams.patient_id;
		$scope.cal_id = $stateParams.cal_id;
		$scope.userInfo = $cookieStore.get('userInfo');
		$scope.patientInfo = {};
		$scope.companyInfo = {};
		$scope.problemArr = [];
		$scope.isConsult = true;
		$scope.tscripts = ConsultInfoService.getConsultInfoScripts();
		$scope.checkdata = ConsultInfoService.getCheckdata();
		if ($scope.checkdata.cal_id == $stateParams.cal_id && $scope.checkdata.patient_id == $stateParams.patient_id) {
			$scope.tscripts = ConsultInfoService.getConsultInfoScripts();
			$scope.checkdata = ConsultInfoService.getCheckdata();
		}else{
		    $scope.tscripts = [];
		    $scope.checkdata = [];
		};
		$scope.consultInfo = {
			patient_id: $scope.patient_id,
			cal_id: $scope.cal_id,
			problem_id: null,
			history: null,
			examination: null,
			treatment: null,
			diagnosis: null,
			investigation: null,
			specialist: null,
			progress_note: null,
			attendance_record: null,
			communication_record: null,
			measurements: [],
			scripts: $scope.tscripts,
			images: []
		}
		$scope.getlistMedication = function(){
			var postData = {
				patient_id :$scope.patient_id,
				cal_id:$scope.cal_id
			}
			AlertModel.getMedication(postData).then(function(response){
				console.log(response.data);
				$scope.consultInfo.scripts = response.data;
			})
		}
		$scope.getlistMedication();
		/*
		* phanquocchien.c1109g@gmail.com
		 */
		//load consultation info
		$scope.loadConsultationInfo = function(){
			ConsultationService.checkConsultation($scope.patient_id,$scope.cal_id).then(function(data){
				if (data.status == 'success') {
					$scope.consultInfo.problem_id = data.data.problem_id;					
					$scope.consultInfo.history = data.data.history;					
					$scope.consultInfo.examination = data.data.examination;					
					$scope.consultInfo.treatment = data.data.treatment_plan;					
					$scope.consultInfo.diagnosis = data.data.diagnosis;		
					$scope.consultInfo.investigation = data.data.investigation;		
					$scope.consultInfo.specialist = data.data.specialist;		
					$scope.consultInfo.progress_note = data.data.progress_note;		
					$scope.consultInfo.attendance_record = data.data.attendance_record;		
					$scope.consultInfo.communication_record = data.data.communication_record;		
					$scope.consultInfo.consult_id = data.data.consult_id;		
				}
			});
		}
		$scope.loadConsultationInfo();
		//end
		//set actionCenter popup consultation history
		$scope.actionCenter = {};
		$scope.setListConsultationOfPatient = function(){
			ConsultationService.getListConsultOfPatient($stateParams.patient_id).then(function(data){
				if (data.status == 'success') {
					$scope.actionCenter.listConsultOfPatient = data.data;
					console.log($scope.actionCenter.listConsultOfPatient);
				};
			});
		}
		$scope.setListConsultationOfPatient();
		$scope.actionCenter.showPopupHistory = function(data){
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
		$scope.actionCenter.showPopupHistoryPhysiotherapist = function(data){
			var modalInstance = $modal.open({
				templateUrl:'modules/consultation/dialogs/dialogs_consult_history_physiotherapist.html',
				controller: 'ConsultHistoryController',
				resolve: {
					consults:function(){
						return data;
					}
				}
			})
			
		}
		$scope.actionCenter.showPopupHistoryExercisePhysiologist = function(data){
			var modalInstance = $modal.open({
				templateUrl:'modules/consultation/dialogs/dialogs_consult_history_exercise_physiologist.html',
				controller: 'ConsultHistoryController',
				resolve: {
					consults:function(){
						return data;
					}
				}
			})
			
		}
		//end
		$scope.getImgDrawingHistory = function(){
			console.log($scope.cal_id)
			console.log($stateParams.patient_id)
			$scope.listImgDrawingHistory = {};
			ConsultationService.getImgDrawingHistory($stateParams.patient_id,$scope.cal_id).then(function(data){
				if (data.status == 'success') {
					$scope.listImgDrawingHistory = data.data;
					console.log('aaaa',$scope.listImgDrawingHistory);
				};
			})
		}
		$scope.getImgDrawingHistory();
		$scope.loadImgDrawing = function(){
			$scope.getImgDrawingHistory();
		}
		$scope.showPopupConsultationHistory = function(){
			angular.element('#popupConsultationHistory').modal('show');
		}
		$scope.popupNewDrawing = function(){
			angular.element('#popupNewDrawing').modal('show');
		}
		//set actionCenterDrawing 
		$scope.actionCenterDrawing = {
			runWhenFinish:function(){
				angular.element('#popupNewDrawing').modal('hide');
			}
		}
		//end
		//chien show patien bar
        // $scope.patientBarVer.version='zip';
        
		$scope.currDate = $filter('date')(new Date(),'dd/MM/yyyy hh:mm a');

		// $scope.consultInfo.scripts = ConsultInfoService.getConsultInfoScripts();
		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			$scope.checkdata = {
				cal_id:$stateParams.cal_id,
				patient_id:$stateParams.patient_id,
			}
			console.log($scope.checkdata);
		   ConsultInfoService.setConsultInfoScripts($scope.consultInfo.scripts);
		   ConsultInfoService.setCheckdata($scope.checkdata);
		})
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

		 	if ((window.calling_screen == null) || (window.calling_screen.closed))
			{
				window.calling_screen = window.open(url,'RedimedCallingWindow', params);
				window.calling_screen.focus();
			}

			if(window.calling_screen != null && !window.calling_screen.closed)
				window.calling_screen.open('','RedimedCallingWindow','');
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

	    function cancelListenerHandler(){
			console.log("Remove Success");
		}

	    refresh($scope.patient_id);

		socket.removeListener('online', cancelListenerHandler());

		socket.on('online',function(userList){
			refresh($scope.patient_id);
		})

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
						$scope.consultInfo.measurements[index] = data.value;
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
						},
						arrayscript:function(){
							return $scope.consultInfo.scripts;
						},
						doctor_id : function(){
							return $scope.getdoctor_id;
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
					{
						if (data.value.medication_name !== null) {
							var count = 0;
							for (var i = 0; i < $scope.consultInfo.scripts.length; i++) {
								if($scope.consultInfo.scripts[i].medication_name === data.value.medication_name)
								{
									count ++;
								}
							};
							$scope.consultInfo.scripts.push(data.value);
						};
						
						
					}
					 $scope.submitClick();
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
						},
						arrayscript:function(){
							return $scope.consultInfo.scripts;
						},
						doctor_id : function(){
							return $scope.getdoctor_id;
						}
						
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
					{
						$scope.consultInfo.scripts[index] = data.value;
					}
					 $scope.submitClick();
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
		
		$scope.makeCall = function(user){

		 	socket.removeListener('generateSessionSuccess', cancelListenerHandler());

			socket.emit("generateSession",$scope.userInfo.id);
			socket.on("generateSessionSuccess",function(opentokRoom){
				if(opentokRoom)
					popup($state.href('make_call',{apiKey:opentokRoom.apiKey,sessionId:opentokRoom.sessionId,token:opentokRoom.token,callUser: user.id, isCaller: 1, patientId:$scope.patient_id, calId:$scope.cal_id}));
			})

			// var apiKey = "5a17b6b777548c2feb4e8af4b6b6591b";
			// popup($state.href('test_call',{apiKey:apiKey, clientId: null,callUser: user.id, isCaller: 1, patientId:$scope.patient_id}));
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

        $scope.invoiceHeaderInfo=null;//tan.dts add
        // INIT INVOICE
        PatientService.initInvoice($scope.appointment.Patient_id, $scope.appointment.CAL_ID)
        .then(function(data){
        	//tannv.dts add
        	InvoiceService.selectInvoiceHeaderBySession($scope.appointment.Patient_id, $scope.appointment.CAL_ID)
        	.then(function(data){
        		if(data.status=='success')
        		{
        			$scope.invoiceHeaderInfo=data.data;
        		}
        		else
        		{
        			alert("Get Invoice Header Error.");
        			exlog.logErr(data);
        		}
        	},function(err){
        		alert("Get Invoice Header Error.");
        		exlog.logErr(err);
        	})
        },function(err){
        	alert("Init Invoice Error.");
        	exlog.logErr(err);
        });
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
				return InvoiceService.selectInvoiceLinesBySession($scope.appointment.Patient_id,$scope.appointment.CAL_ID);//tan add
                //return PatientService.getApptItems($scope.appointment.CAL_ID, $scope.appointment.Patient_id); //tan rem
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
                        t_item.checked = item.IS_ENABLE === 1 ? '1' : '0';
                        t_item.inserted = (t_item.checked === '1');
                    } else { // IN EXTRA ITEMS
                        $scope.extraItems.push(item);
                        item_id_list.push(item.ITEM_ID);
                        item.checked = item.IS_ENABLE === 1 ? '1' : '0';
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
                    {field: 'TAX_ID', label: 'Tax Id',is_hide:true},    
                    {field: 'TAX_CODE', label: 'Tax code'},    
                    {field: 'TAX_RATE', label: 'Tax rate'}
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
        $scope.deleteMedication = function(){
        	var postData = {
				patient_id :$scope.patient_id,
				cal_id:$scope.cal_id
			}
			AlertModel.insertMedication(postData).then(function(data){
				if (data.data.length !== 0) {
					var postDatam = {
							consult_id :data.data[0].consult_id
						}
					AlertModel.deleteMedication(postDatam)
					.then(function(response){
						console.log('delete');
					})
							
				}
			});
        }
        $scope.submitClick = function(){
        	 // $scope.deleteMedication();
        	//tannv.dts@gmail.com
        	if(!$scope.invoiceHeaderInfo)
        	{
        		alert("Error.Invoice Header Not Exist.");
        		return;
        	}

        	for(var i=0 ; i< $scope.consultInfo.measurements.length ; i++)
			{
				$scope.consultInfo.measurements[i].patient_id = $scope.patient_id;
				$scope.consultInfo.measurements[i].cal_id = $scope.cal_id;
			}

			var consultInfoTemp = angular.copy($scope.consultInfo);
			consultInfoTemp.templates = $scope.templates;
			ConsultationService.submitConsult(consultInfoTemp).then(function(res){
				if(res.status == 'success')
				{
					/*phanquocchien.c1109g@gmail.com
					* load data consultation info
                    */
					$scope.loadConsultationInfo();
					/*phanquocchien.c1109g@gmail.com
					* load data consultation history
                    */
                    $scope.setListConsultationOfPatient();
                    /*phanquocchien.c1109g@gmail.com
					* load data drawing history
                    */
					$scope.getImgDrawingHistory();
					var insertArr = []; 
            
		            var fnInsertArr = function(item) {
		                 var t = {
		                 	HEADER_ID:$scope.invoiceHeaderInfo.header_id,
		                    ITEM_ID: item.ITEM_ID,
		                    PRICE: item.PRICE,
		                    QUANTITY: item.QUANTITY,
		                    AMOUNT:item.PRICE*item.QUANTITY,
		                    TAX_ID:item.TAX_ID,
		                    TAX_CODE:item.TAX_CODE,
		                    TAX_RATE:item.TAX_RATE,
		                    TAX_AMOUNT:item.PRICE*item.QUANTITY*(item.TAX_RATE?item.TAX_RATE:0.0),
		                    TIME_SPENT: !item.TIME_SPENT ? 0: item.TIME_SPENT,
		                    IS_ENABLE: item.checked == '1' ? 1 : 0
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
		            
		            //tannv.dts
		            //add
		            //modify
		            var postData={
		            	invoiceHeaderId:$scope.invoiceHeaderInfo.header_id,
		            	listLine:insertArr
		            }
		            InvoiceService.saveInvoiceLineSheet(postData)
		            .then(function(data){
		            	if(data.status=='success')
		            	{
		            		toastr.success('Save invoice item success.');
		            		
		            	}
		            	else if(data.status='non-data')
		            	{
		            		toastr.warning('No invoice item.');
		            	}
		            	else
		            	{
		            		toastr.error('Save invoice item error.');
		            	}
		            },function(err){
		            	toastr.error('Save invoice item error.');
		            });
				 	toastr.success('Submit Consultation Success!');
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
		$scope.actual_doctor_id={};
		$scope.getdoctor_id=null;
		$scope.apptStatus=ptnConst.apptStatus;
		$scope.getdoctorid = function(){
			var postData = {
				patient_id : $stateParams.patient_id,
				cal_id : $stateParams.cal_id
			}
			AlertModel.getdoctorid(postData)
					.then(function(response){
						$scope.getdoctor_id = response.data[0].DOCTOR_ID;
						console.log(response.data[0].DOCTOR_ID);
					})
		}
		$scope.getdoctorid();
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
						if (data === undefined) {
							$scope.actual_doctor_id ={
								NAME:null
							}
						};
						$scope.actual_doctor_id = data;
					})

					if($scope.apptPatient.SESSION_START_TIME  && $scope.apptPatient.SESSION_END_TIME)
					{
						var tempStart=moment(new Date($scope.apptPatient.SESSION_START_TIME));
						var tempEnd=moment(new Date($scope.apptPatient.SESSION_END_TIME));
						var x=tempEnd.diff(tempStart,'seconds');
						$scope.timerDisplay=kiss.msToTimer(x).display;
					}

					if($scope.apptPatient.appt_status==ptnConst.apptStatus.inConsult.value)
					{
						$scope.startSessionTime=$scope.apptPatient.SESSION_START_TIME;
					}
				}
				else
				{
					$scope.actual_doctor_id={NAME :null};
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
        	var doctorData={};
        	doctorData.doctorId=$scope.apptPatient.DOCTOR_ID;
        	if($scope.apptPatient.actual_doctor_id)
    		{
    			doctorData.actualDoctorId=$scope.apptPatient.actual_doctor_id;
    		}

    		executeStart();

      //   	ConsultationService.beforeStartSession(doctorData)
      //   	.then(function(data){
      //   		if(data.status=='success')
      //   		{
      //   			if(data.data.length>0)
      //   			{
      //   				var modalInstance = $modal.open({
						// 	templateUrl: 'notifyApptsWorkInProgress',
						// 	controller: function($scope, $modalInstance)
						// 	{
						// 		$scope.listData=data.data;
						// 		$scope.gotoAppointment=function(item){
						// 			if(!item.CAL_ID || !item.Patient_id) {
						// 				toastr.error('Cannot goto appointment.','Error!')
						// 				return;
						// 			}
						// 			$state.go("loggedIn.patient.appointment", {patient_id: item.Patient_id, cal_id: item.CAL_ID});
						// 		}
						// 		$scope.close = function(){
						// 			$modalInstance.dismiss('cancel');
						// 		}

						// 		$scope.continue=function()
						// 		{
						// 			executeStart();
						// 			$modalInstance.dismiss('cancel');
						// 		}
						// 	},
						// 	// size: 'sm'
						// });
      //   			}
      //   			else
      //   			{
      //   				executeStart();
      //   			}
      //   		}
      //   		else
      //   		{
      //   			toastr.error("Error when check data.");
      //   		}
      //   	},function(err){
      //   		toastr.error("Error when check data.");
      //   		exlog.logErr(err);
      //   	});

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
	        			$scope.apptPatient.appt_status=ptnConst.apptStatus.inConsult.value;
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

