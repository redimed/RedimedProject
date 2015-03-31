angular.module("app.loggedIn.consult.patient.controller",[])
	.controller("PatientConsultController",function($filter,$window,$document,$cookieStore,$scope,$state,$modal,toastr,socket,OTSession,$stateParams,ConsultationService,PatientService,UserService){
		$scope.patient_id = $stateParams.patient_id;
		$scope.cal_id = $stateParams.cal_id;
		$scope.userInfo = $cookieStore.get('userInfo');

		$scope.currDate = $filter('date')(new Date(),'dd/MM/yyyy hh:mm a');

		$scope.patientInfo = {};
		$scope.companyInfo = {};
		$scope.problemArr = [];

		$scope.isMeasure = false;
		$scope.isScript = false;

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

	    $scope.refreshList = function(){
	    	refresh($scope.patient_id);
	    }

	    refresh($scope.patient_id);

	    

	    function refresh(patientId){
	    	ConsultationService.getPatientCompany(patientId).then(function(rs){
				if(rs.status.toLowerCase() == 'success' && rs.info)
				{
					$scope.companyInfo = rs.info;
					console.log($scope.companyInfo.users);
				}
			})
	    }

		PatientService.get($scope.patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				var fName = [];
				fName.push(rs.data.First_name);
				fName.push(rs.data.Sur_name);
				fName.push(rs.data.Middle_name);

				$scope.patientInfo = rs.data;
				$scope.patientInfo.FullName = 
					(rs.data.Title != null || rs.data.Title != '') ? (rs.data.Title +" . " + fName.join(' ')) : fName.join(' ');
			}
		})

		ConsultationService.getPatientProblem($scope.patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				console.log(rs.data);
				$scope.problemList = rs.data;
			}
		})

		$scope.viewProblem = function(id){
			$scope.problemArr = [];
			if(id != null)
			{
				var index = _.findIndex($scope.problemList, { 'problem_id': id});
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
						$scope.consultInfo.scripts.push(data.value);
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
						$scope.consultInfo.scripts[index] = data.value;
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
		$scope.startCall = false;
		var apiKey = null;
        var sessionId = null;
        var token = null;

        $scope.callUserInfo = null;
        $scope.isCaller = true;
        $scope.callUser = null;

        $scope.isAudioMuted = false;
        $scope.isVideoMuted = false;

        $scope.session = null;

        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type === 'answer')
            {
                $scope.isAccept = true;
            }
            if(message.type === 'ignore')
            {
                toastr.error("Call Have Been Rejected!");
                disconnect();
                $scope.startCall = false;
                $scope.isAccept = false;
            }
            if(message.type === 'cancel')
            {
                toastr.error("Call Have Been Cancelled!");
                disconnect();
                $scope.startCall = false;
                $scope.isAccept = false;
            }

        })

        $scope.muteAudio = function(){
            $scope.isAudioMuted = !$scope.isAudioMuted;
        }

        $scope.muteVideo = function(){
            $scope.isVideoMuted = !$scope.isVideoMuted;
        }

        var disconnect = function() {
            if($scope.session != null)
            {
                $scope.session.disconnect();
            }
            $scope.session = null;
            $scope.callUser = null;
        }

        $scope.cancelCall = function(){
            socket.emit("sendMessage",$scope.userInfo.id,$scope.callUser,{type:'cancel'});
            disconnect();
            $scope.startCall = false;
            $scope.isAccept = false;
        }

         var publisherProperties =
        {
            insertMode: "append",
            resolution: '1280x720',
            width: window.outerWidth / 10,
            height: window.outerHeight / 10
        };

       

		$scope.makeCall = function(user){
			$scope.startCall = true;

	        UserService.getUserInfo(user.id).then(function(data){
	            if(!data.img)
	                data.img = "theme/assets/icon.png"

	            $scope.callUserInfo = data;
	            $scope.callUser = user.id;

	            // var modalInstance = $modal.open({
	            //     templateUrl: 'common/views/call.html',
	            //     controller: 'callController',
	            //     size: 'lg',
	            //     resolve:{
	            //         callUserInfo: function(){
	            //             return data;
	            //         },
	            //         callUser: function(){
	            //             return user.id;
	            //         },
	            //         isCaller: function(){
	            //             return true;
	            //         },
	            //         opentokInfo: function(){
	            //             return null;
	            //         }
	            //     },
	            //     backdrop: 'static',
	            //     keyboard: false
	            // })

				if(apiKey == null && sessionId == null)
				{
					socket.emit("generateSession",$scope.userInfo.id);

		            socket.on("generateSessionSuccess",function(opentokRoom){
		                if ($scope.session != null) {
		                    $scope.session.disconnect();
		                }

		                apiKey = opentokRoom.apiKey;
		                sessionId = opentokRoom.sessionId;
		                token = opentokRoom.token;

		                var publisher = OT.initPublisher('selfVideo', publisherProperties);

				        $scope.session = OT.initSession(apiKey, sessionId);
				        $scope.session.on({
				            'streamCreated': function (event) {
				                var subscriber = $scope.session.subscribe(event.stream, "callerVideo", {
				                    insertMode: "replace",
				                    resolution: "1280x720",
				                    width: '100%',
				                    height: '100%'
				                });
				            }
				        });
				        $scope.session.connect(token, function (error) {
				            if (error) {
				                console.log(error.message);
				            }
				            else {
				                $scope.session.publish(publisher);
				                socket.emit("sendMessage", $scope.userInfo.id,$scope.callUser, {
				                    type: 'call',
				                    sessionId: sessionId
				                });
				            }
				        });
		                               
		            })
				}
				else
				{
					var publisher = OT.initPublisher('selfVideo', publisherProperties);

			        $scope.session = OT.initSession(apiKey, sessionId);
			        $scope.session.on({
			            'streamCreated': function (event) {
			                var subscriber = $scope.session.subscribe(event.stream, "callerVideo", {
			                    insertMode: "replace",
			                    resolution: "1280x720",
			                    width: '100%',
			                    height: '100%'
			                });
			            }
			        });
			        $scope.session.connect(token, function (error) {
			            if (error) {
			                console.log(error.message);
			            }
			            else {
			                $scope.session.publish(publisher);
			                socket.emit("sendMessage", $scope.userInfo.id,$scope.callUser, {
			                    type: 'call',
			                    sessionId: sessionId
			                });
			            }
			        });
				}

	        })
	
	    }

	})

