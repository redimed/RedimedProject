angular.module("app.loggedIn.doctor.timetable.detail.casual.controller",[])

.controller("DoctorTimetableDetailCasualController", function($scope, $stateParams, 
	DoctorService, ConfigService, mdtDoctorService, mdtTimetableService, sysServiceService, REAL_DAY_OF_WEEK, toastr, TimetableModel,$modal){

	var doctor_id = $stateParams.doctorId;
	var from_time = null;

	$scope.objectMap = {};
	$scope.objectMap.from_time = moment(new Date()).toDate();
	$scope.objectMap.to_time = moment(new Date()).add(30, 'days').toDate();


	// console.log($scope.options)

	$scope.timetable = {
		add: function(item){

			if(item.list[0] && item.list[0].CAL_ID === null) {
				return;
			}

			var object = {
				CAL_ID: null,
				SITE_ID: 1,
				DOCTOR_ID: doctor_id,
				FROM_TIME: "00:00",
				TO_TIME: "00:00",
				SERVICE_ID: 1
			};

			// item.list.unshift(object);
			item.list.push(object);
		},
		addRowData: function(item, cal){
			// tan add
			var from_time_part=moment(cal.FROM_TIME,"HHmm").format("HH:mm");
			var to_time_part=moment(cal.TO_TIME,"HHmm").format("HH:mm");
			// var from_time = moment(item.DATE).format('YYYY-MM-DD')+" "+ cal.FROM_TIME +":00";
			// var to_time = moment(item.DATE).format('YYYY-MM-DD')+ " "+ cal.TO_TIME+":00";
			var from_time = moment(item.DATE).format('YYYY-MM-DD')+" "+ from_time_part +":00";
			var to_time = moment(item.DATE).format('YYYY-MM-DD')+ " "+ to_time_part+":00";

			var options = {
				FROM_TIME: from_time,
				TO_TIME: to_time,
				SITE_ID: cal.SITE_ID,
				DOCTOR_ID: $stateParams.doctorId,
				CLINICAL_DEPT_ID: $scope.doctor.CLINICAL_DEPT_ID,
				SERVICE_ID: cal.SERVICE_ID
			}
			DoctorService.addCalendar(options).then(function(response){
				toastr.success('Add successfully !!!');
				cal.CAL_ID = response.data;
			},function(err){

			})
		},
		updateRow: function(item, cal) {
			// tan add
			var from_time_part=moment(cal.FROM_TIME,"HHmm").format("HH:mm");
			var to_time_part=moment(cal.TO_TIME,"HHmm").format("HH:mm");
			// var from_time = moment(item.DATE).format('YYYY-MM-DD')+" "+ cal.FROM_TIME +":00";
			// var to_time = moment(item.DATE).format('YYYY-MM-DD')+ " "+ cal.TO_TIME+":00";
			var from_time = moment(item.DATE).format('YYYY-MM-DD')+" "+ from_time_part +":00";
			var to_time = moment(item.DATE).format('YYYY-MM-DD')+ " "+ to_time_part+":00";
			var options = {
				FROM_TIME: from_time,
				TO_TIME: to_time,
				SITE_ID: cal.SITE_ID,
				SERVICE_ID: cal.SERVICE_ID,
				CAL_ID:cal.CAL_ID
			}

			DoctorService.editCalendar(options).then(function(response){
				console.log(response);
				if (response.status == 'success') {
					toastr.success('Edit successfully !!!');
				}else{
					toastr.error('Edit fail !!!');
				};
			});
		},

		/**
		 * Xoa calendar duoc chon
		 * modify by tannv.dts@gmail.com
		 */
		remove: function(options){

			// Modify by tannv.dts@gmail.com
			if(options.cal.CAL_ID === null){
				$scope.data[options.parentIndex].list.splice(options.index, 1);
			}else{
				//tan add
				TimetableModel.beforeDeleteSelectedCalendar(options.cal.CAL_ID)
				.then(function(data){
					if(data.status=='success')
					{
						var bookedList=data.data;
						var modalInstance = $modal.open({
							templateUrl: 'notifyToDeleteSelectedCalendar',
							controller: function($scope,bookedList, $modalInstance){
								$scope.bookedList=bookedList;
								$scope.ok = function(){
									$modalInstance.close(bookedList);
								}

								$scope.cancel = function(){
									$modalInstance.dismiss('cancel');
								}
							},
							// size: 'sm',
							resolve: {
								bookedList: function(){
									return bookedList;
								}
							}
						});

						modalInstance.result.then(function(bookedList){
							if(bookedList){
								executeDelete();
							}
						})
					}
					else
					{
						toastr.error('Delete fail.');
					}
				},function(err){
					toastr.error('Delete fail.');
				});
				
				//thuc thi lenh xoa selected calendar
				//tannv.dts@gmail.com
				var executeDelete=function()
				{
					TimetableModel.deleteSelectedCalendar(options.cal.CAL_ID)
					.then(function(data){
						if(data.status=='success')
						{
							toastr.success('Delete success.');
							$scope.data[options.parentIndex].list.splice(options.index, 1);
						}
						else
						{
							toastr.error('Delete fail.');
						}
					},function(err){
						toastr.error('Delete fail.');
					});
				}
			}
		},

		/**
		 * xoa tat ca cac calendar trong ngay
		 * modify by tannv.dts@gmail.com
		 */
		removeAllDay : function(item)
		{
			//tan change begin------------------------------------
			var postData={
				doctorId:doctor_id,
				date:item.DATE
			}
			var modalInstance = $modal.open({
				templateUrl: 'notifyToDeleteAllCalendarInDate',
				controller: function($scope, item, $modalInstance){
					
					TimetableModel.beforeDeleteAllCalendarInDate(postData)
					.then(function(data){
						if(data.status=='success'){
							$scope.bookedList=data.data;
						}
						else
						{
							toastr.error('Delete fail.');
						}
					},function(err){
						toastr.error('Delete fail.');
					});

					$scope.ok = function(){
						$modalInstance.close(item);
					}

					$scope.cancel = function(){
						$modalInstance.dismiss('cancel');
					}
				},
				// size: 'sm',
				resolve: {
					item: function(){
						return item;
					}
				}
			});

			modalInstance.result.then(function(item){
				if(item){
					TimetableModel.deleteAllCalendarInDate(postData)
					.then(function(data){
						if(data.status=='success')
						{
							item.list = [];
							toastr.success('Delete success.');
						}
						else
						{
							toastr.error('Delete fail.');
						}
					},function(err){
						toastr.error('Delete fail.');
					});
				}
			})

			//tan change end--------------------------------------------------
			
			//tan frame
			/*var str_date = ConfigService.getCommonDateDatabase(item.DATE);

			var conf = confirm('Delete all calendar on this day : ' + item.DATE);

			if(!conf) return;
			DoctorService.deleteDateCalendar(doctor_id, str_date).then(function(response){
				console.log(response)
				item.list = [];
			});*/
		},

		/**
		 * Lay thong tin tat ca cac calendar trong ngay de doi service
		 * tannv.dts@gmail.com
		 * @return {[type]} [description]
		 */
		getAllCalendarInDate:function(item)
		{
			//tan change begin------------------------------------
			var postData={
				doctorId:doctor_id,
				date:item.DATE
			}
			var updateData={
				DOCTOR_ID:doctor_id
			};
			var modalInstance = $modal.open({
				templateUrl: 'changeServiceOfCalendarsInDate',
				controller: function($scope, $modalInstance,$stateParams){
					$scope.updateData=updateData;
					$scope.doctor = {};
					mdtDoctorService.byId($stateParams.doctorId).then(function(response){
						$scope.doctor = response.data;
						sysServiceService.byClinicalDepartment(response.data.CLINICAL_DEPT_ID).then(function(response){
							$scope.services = response.data;
						})
					})
					
					TimetableModel.getAllCalendarInDate(postData)
					.then(function(data){
						if(data.status=='success'){
							$scope.calendarsInDate=data.data;
						}
						else
						{
							toastr.error('Error when get data.');
						}
					},function(err){
						toastr.error('Error when get data.');
					});

					$scope.ok = function(){
						$modalInstance.close(updateData);
					}

					$scope.cancel = function(){
						$modalInstance.dismiss('cancel');
					}
				},
				// size: 'sm',
				resolve: {
					updateData: function(){
						return updateData;
					}
				}
			});

			modalInstance.result.then(function(updateData){
				if(updateData){
					TimetableModel.updateServiceInDate(updateData)
					.then(function(data){
						if(data.status=='success')
						{
							$scope.getAppointments();
							toastr.success('Update success.');
						}
						else
						{
							toastr.error('Update fail.');
						}
					},function(err){
						toastr.error('Update fail.');
					});
				}
			})
		}
	}


	$scope.getAppointments  = function() {	
		toastr.info('Loading data from server');
		var str_from_time = moment($scope.objectMap.from_time).format('YYYY-MM-DD') ;
		var str_to_time = moment($scope.objectMap.to_time).format('YYYY-MM-DD');
		var get_date = new Date(str_from_time);
		var get_to_date = new Date(str_to_time);
		
		var timeDiff = Math.abs(get_to_date.getTime() - get_date.getTime());
		var num_date = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;  // 30
		console.log(num_date)
		console.log(timeDiff);
		if(num_date < 1) {
			alert('To time must be greater then from time');
			return;
		}
		
		// init 
		var cal_list = [];
		for(var i = 0; cal_list.length < num_date; ++i) {
			var run_date = new Date(get_date);
			run_date.setDate(get_date.getDate() + i);
			var str_date = run_date;
			cal_list.push({DATE: str_date, list: []});
			// console.log(cal_list);
		}
		$scope.data = cal_list;

		// console.log('LOAD TIME ', Date.now())
		DoctorService.overviewCalendar(doctor_id, str_from_time, str_to_time)
		.then(function(response){
			var cal_list = response.data;
			for(var i = 0; i < cal_list.length; ++i) {
				var cal = cal_list[i];
				var pos = _.findIndex($scope.data, function(item) { 
					return moment(item.DATE).format('DD/MM/YYYY') == cal.DATE
				});
				if(pos !== -1) {
					$scope.data[pos].list = cal.list;
				}
			}
		
		

		});
	}
	
	$scope.getAppointments();
		

	$scope.doctor = {};
	mdtDoctorService.byId($stateParams.doctorId).then(function(response){
		$scope.doctor = response.data;
		sysServiceService.byClinicalDepartment(response.data.CLINICAL_DEPT_ID).then(function(response){
			$scope.options.clinical_depts = response.data;
		})
	})
});	

