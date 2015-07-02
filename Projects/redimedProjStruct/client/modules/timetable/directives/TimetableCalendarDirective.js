angular.module('app.loggedIn.timetable')

.directive('timetableCalendar', function(TimetableModel, $modal, $stateParams, mdtDoctorService, sysServiceService, toastr){
	return {
		restrict: 'EA',
		templateUrl: 'modules/timetable/directives/templates/calendar.html',
		link: function(scope, elem, attrs){
			scope.weekDisplay={
				0:'Weekly',
				1:'Week 1',
				2:'Week 2',
				3:'Week 3',
				4:'Week 4'
			}
			var load = function(){
				TimetableModel.list({doctor_id: $stateParams.doctorId}).then(function(response){
					scope.timetable.list = response.data;
					/**
					 * Tao group data
					 * tannv.dts@gmail.com
					 */
					scope.displayInRow={};
					for(var i=0;i<scope.timetable.list.length;i++)
					{
						var item=scope.timetable.list[i];
						if(!scope.displayInRow[item.day_of_week_value])
						{
							scope.displayInRow[item.day_of_week_value]={
								value:item.cal_header_df_id,
								services:{}
							}

						}
						if(!scope.displayInRow[item.day_of_week_value].services[item.service_id])
						{
							scope.displayInRow[item.day_of_week_value].services[item.service_id]=item.cal_header_df_id;
						}
						
					}

					/*temp={DAYOFWEEK_ITEMS:[]};

					for(var i=0;i<scope.timetable.list.length;i++)
					{
						var item=scope.timetable.list[i];
						if(!temp[item.day_of_week_value])
						{
							temp[item.day_of_week_value]={SERVICE_ITEMS:[]};
							temp.DAYOFWEEK_ITEMS.push({
								day_of_week_value:item.day_of_week_value,
								day_of_Week:item.day_of_Week
							});
						
						}
						if(!temp[item.day_of_week_value][item.service_id])
						{
							temp[item.day_of_week_value][item.service_id]={DEFINE_ITEMS:[]};
							temp[item.day_of_week_value].SERVICE_ITEMS.push({
								service_id:item.service_id,
								SERVICE_NAME:item.SERVICE_NAME
							});
						}

						if(!temp[item.day_of_week_value][item.service_id][item.cal_header_df_id])
						{
							temp[item.day_of_week_value][item.service_id][item.cal_header_df_id]={};
							temp[item.day_of_week_value][item.service_id].DEFINE_ITEMS.push({
								cal_header_df_id:item.cal_header_df_id,
								doctor_id:item.doctor_id,
								service_id:item.service_id,
								day_of_Week:item.day_of_Week,
								from_time:item.from_time,
								to_time:item.to_time,
								from_date:item.from_date,
								to_date:item.to_date,
								appt_interval:item.appt_interval,
								isenable:item.isenable,
								Creation_date:item.Creation_date,
								SERVICE_NAME:item.SERVICE_NAME
							});
						}
					}
					var timeTableData=[]
					for(var i=0;i<temp.DAYOFWEEK_ITEMS.length;i++)
					{
						var dayOfWeekItem=temp.DAYOFWEEK_ITEMS[i];
						dayOfWeekItem.SERVICE_ITEMS=[];
						for(var j=0;j<temp[dayOfWeekItem.day_of_week_value].SERVICE_ITEMS.length;j++)
						{
							var serviceItem=temp[dayOfWeekItem.day_of_week_value].SERVICE_ITEMS[j];
							serviceItem.DEFINE_ITEMS=[];
							dayOfWeekItem.SERVICE_ITEMS.push(serviceItem);
							for(var k=0;k<temp[dayOfWeekItem.day_of_week_value][serviceItem.service_id].DEFINE_ITEMS.length;k++)
							{
								var defineItem=temp[dayOfWeekItem.day_of_week_value][serviceItem.service_id].DEFINE_ITEMS[k];
								serviceItem.DEFINE_ITEMS.push(defineItem);
							}
						}
						timeTableData.push(dayOfWeekItem);
					}
					scope.timeTableData=timeTableData;*/
					//-----------------------------------------------
					/* LOAD SITE */
					scope.site.load();
					/* END LOAD SITE */
				}, function(error){
					
				})
			}

			var siteLoad = function(){
				TimetableModel.siteList({doctor_id: $stateParams.doctorId})
				.then(function(response){
					var i = 0;
					_.forEach(scope.timetable.list, function(timetable_row){
						scope.timetable.list[i].site = [];
						_.forEach(response.data, function(site_row){
							if(site_row.cal_header_df_id === timetable_row.cal_header_df_id)
								scope.timetable.list[i].site.push(site_row);
						})
						i++;
					})
				}, function(error){})
			}

			var addDay = function(){
				var modalInstance = $modal.open({
					templateUrl: 'modules/timetable/dialogs/templates/addDay.html',
					controller: 'TimetableCalendarAddDayDialog',
					size: 'lg',
					resolve: {
						services: function(){
							return scope.service.list;
						},
						doctor: function(){
							return scope.doctor.item;
						}
					}
				});

				modalInstance.result.then(function(status){
					if(status === 'add')
						scope.timetable.load();
				})
			}

			var doctorLoad = function(){
				mdtDoctorService.byId($stateParams.doctorId)
				.then(function(response){
					scope.doctor.item = response.data;
					serviceLoad(response.data.CLINICAL_DEPT_ID);
				}, function(error){

				})
			}

			var serviceLoad = function(clinical_dept_id){
				sysServiceService.byClinicalDepartment(clinical_dept_id).then(function(response){
  					scope.service.list = response.data;
		  		})
			}


			var addSite = function(row){
				var modalInstance = $modal.open({
					templateUrl: 'modules/timetable/dialogs/templates/addSite.html',
					controller: 'TimetableCalendarAddSiteDialog',
					size: 'lg',
					resolve: {
						row: function(){
							return row;
						},
						doctor: function(){
							return scope.doctor.item;
						}
					}
				});

				modalInstance.result.then(function(status){
					if(status === 'add')
						scope.timetable.load();
				})
			}

			var saveTimetable = function(row){
				var postData = angular.copy(row);

				postData.day_of_Week_code = null;

				switch(postData.day_of_Week){
					case 'Monday':
						postData.day_of_Week_code = 1;
						break;
					case 'Tuesday':
						postData.day_of_Week_code = 2;
						break;
					case 'Wednesday':
						postData.day_of_Week_code = 3;
						break;
					case 'Thursday':
						postData.day_of_Week_code = 4;
						break;
					case 'Friday':
						postData.day_of_Week_code = 5;
						break;
					case 'Saturday':
						postData.day_of_Week_code = 6;
						break;
				}

				postData.clinical_dept_id = scope.doctor.item.CLINICAL_DEPT_ID;
				postData.appt_interval = row.appt_interval;

				TimetableModel.createTimetable(postData)
				.then(function(response){
					if(response.status=="success")
					{
						toastr.success('Timetable is created');
					}
					else
					{
						toastr.success('Create timetable fail.');
					}
					
				}, function(error){
					toastr.error('Create timetable fail.');
				})
			}//end create Timetable

			var editTimetable = function(row){
				$modal.open({
					templateUrl: 'modules/timetable/dialogs/templates/editDay.html',
					controller: 'TimetableCalendarEditDayDialog',
					size: 'lg',
					resolve: {
						row: function(){
							return row;
						},
						services: function(){
							return scope.service.list;
						},
						doctor: function(){
							return scope.doctor.item;
						}
					}
				})
				.result.then(function(response){
					if(response === 'success')
						scope.timetable.load();
				})
			}

			var openTimetable = function(row){
				
				row.clinical_dept_id = scope.doctor.item.CLINICAL_DEPT_ID;
				var modalInstance = $modal.open({
					templateUrl: 'notifyToSaveTimetable',
					controller: function($scope, row, $modalInstance){
						//tan add
						//-----------------------------------------------------
						$scope.bookedList=[];
						TimetableModel.beforeGenerateCalendar(row)
						.then(function(data){
							
							if(data.status=='success')
							{

								$scope.bookedList=data.data;
							}
							else
							{
								toastr.error('Error when check data.');
							}
						},function(err){
							toastr.error('Error when check data.');
						})
						//------------------------------------------------------

						$scope.ok = function(){
							$modalInstance.close(row);
						}

						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						}
					},
					// size: 'sm',
					resolve: {
						row: function(){
							return row;
						}
					}
				});

				modalInstance.result.then(function(row){
					if(row)
						scope.timetable.saveTimetable(row);
				})
				//---------------------------------------------------------------
				

			}

			var removeDay = function(row){
				var modalInstance = $modal.open({
					templateUrl: 'notifyToRemoveDay',
					controller: function($scope, row, $modalInstance){
						$scope.ok = function(){
							$modalInstance.close(row);
						}

						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'sm',
					resolve: {
						row: function(){
							return row;
						}
					}
				});

				modalInstance.result.then(function(row){
					if(row){
						TimetableModel.remove(row)
						.then(function(response){
							toastr.success('Remove Day Successfully');
							scope.timetable.load();
						}, function(error){

						})
					}
				})
			}

			var removeSite = function(id){
				var modalInstance = $modal.open({
					templateUrl: 'notifyToRemoveSite',
					controller: function($scope, id, $modalInstance){
						$scope.ok = function(){
							$modalInstance.close(id);
						}

						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'sm',
					resolve: {
						id: function(){
							return id;
						}
					}
				});

				modalInstance.result.then(function(id){
					if(id){
						TimetableModel.siteRemove({id: id})
						.then(function(response){
							if(response.status=='success')
							{
								toastr.success('Remove Successfully.');
								scope.timetable.load();
							}
							else
							{
								toastr.error("Remove fail.")
							}
						}, function(error){
							toastr.error('Remove fail.');
						})
					}
				})
			}

			scope.timetable = {
				load: function() {load();},
				dialog: {
					removeDay: function(row){removeDay(row);},
					openTimetable: function(row){ openTimetable(row); },
					editTimetable: function(row){ editTimetable(row); },
					addDay: function() { addDay(); }
				},
				list: [],
				form: {
					day_of_Week: '',
					SERVICE_ID: null,
					from_time: '',
					to_time: '',
					from_date: null,
					to_date: null,
					description: ''
				},
				saveTimetable: function(row){ saveTimetable(row); }
			}

			scope.site = {
				load: function(){siteLoad();},
				dialog: {
					addSite: function(row){ addSite(row); },
					removeSite: function(id){ removeSite(id); }
				}
			}

			scope.doctor = {
				load: function(){doctorLoad();},
				item: {}
			}

			scope.service = {
				list: [],
				load: function(){serviceLoad();}
			}

			scope.timetable.load();
			scope.doctor.load();
			scope.service.load();
		}		
	}//end return
})

