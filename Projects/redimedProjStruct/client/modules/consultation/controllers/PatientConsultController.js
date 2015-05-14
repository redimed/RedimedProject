angular.module("app.loggedIn.consult.patient.controller",[])
	.controller("PatientConsultController",function($filter,$rootScope,$interval,$window,$document,callModal,$cookieStore,$scope,$state,$modal,toastr,socket,OTSession,$stateParams,ConsultationService,PatientService,UserService){
		$scope.patient_id = $stateParams.patient_id;
		$scope.cal_id = $stateParams.cal_id;
		$scope.userInfo = $cookieStore.get('userInfo');

		$scope.currDate = $filter('date')(new Date(),'dd/MM/yyyy hh:mm a');

		$scope.patientInfo = {};
		$scope.companyInfo = {};
		$scope.problemArr = [];

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

		var checkCallInfo = null;

		$interval.cancel(checkCallInfo);

		checkCallInfo = $interval(function(){
			refresh($scope.patient_id);

			if(callModal.active())
			{
				if(typeof $cookieStore.get('callInfo') !== 'undefined')
					$scope.callInfo = $cookieStore.get('callInfo');
			}
			else
			{
				if(typeof $cookieStore.get('callInfo') !== 'undefined')
				{
					$scope.callInfo = {
						isCalling: null,
						callUser: null
					};
					$cookieStore.remove("callInfo");
					
				}
			}
			
		},1 * 1000);

	    $scope.refreshList = function(){
	    	refresh($scope.patient_id);
	    }

	    refresh($scope.patient_id);

	    function refresh(patientId){
	    	ConsultationService.getPatientCompany(patientId).then(function(rs){
				if(rs.status.toLowerCase() == 'success' && rs.info)
				{
					$scope.companyInfo = rs.info;
				}
			})
	    }

		PatientService.get($scope.patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				var fName = [];
				fName.push(rs.data.First_name,rs.data.Sur_name,rs.data.Middle_name);

				$scope.patientInfo = rs.data;
				$scope.patientInfo.FullName = 
					(rs.data.Title != null || rs.data.Title != '') ? (rs.data.Title +" . " + fName.join(' ')) : fName.join(' ');
			}
		})

		ConsultationService.getPatientProblem($scope.patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				$scope.problemList = rs.data;
			}
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
					windowClass: "consult-modal-window",
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
					windowClass: "consult-modal-window",
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
						script: function(){
							return null;
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
					{
						$scope.consultInfo.scripts.push(data.value);
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

		$scope.submitClick = function(){
			for(var i=0 ; i< $scope.consultInfo.measurements.length ; i++)
			{
				$scope.consultInfo.measurements[i].patient_id = $scope.patient_id;
				$scope.consultInfo.measurements[i].cal_id = $scope.cal_id;
			}

			ConsultationService.submitConsult($scope.consultInfo).then(function(res){
				if(res.status == 'success')
					toastr.success("Submit Consultation Success!");
				else
					toastr.success("Submit Consultation Failed!");
			})
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

