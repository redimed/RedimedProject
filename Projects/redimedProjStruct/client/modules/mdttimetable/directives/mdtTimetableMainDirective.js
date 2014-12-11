angular.module("app.loggedIn.timetable.main.directive", [])

.directive("timetableGenerate", function(mdtTimetableService, mdtDoctorService, sysServiceService, mdtRedimedsitesService, ConfigService, toastr, $timeout){
	return {
		restrict: "EA",
		scope: {
			options: "=",
			doctorId: "="
		},
		templateUrl: "modules/mdttimetable/directives/templates/timetable.html",
		link: function(scope, element, attrs){
			scope.selectedDoctor = {};

			mdtDoctorService.byId(scope.doctorId).then(function(response){
				scope.selectedDoctor = response.data;
				sysServiceService.byClinicalDepartment(response.data.CLINICAL_DEPT_ID).then(function(response){
					scope.options.clinical_depts = response.data;
				})
			})

			var init = function(){
				scope.timetable_list = [];
				scope.selectedCalHeader = [];
				scope.selectedCalHeaderId = 0;

				mdtTimetableService.byDoctor(scope.doctorId).then(function(response){
					for(var i = 0; i < scope.options.timetable_dow.length; i++){
						scope.timetable_list.push({'dow': scope.options.timetable_dow[i].code, 'data': []});
						if(typeof response.data[i] !== 'undefined'){
							scope.timetable_list[i].doctor_id = response.data[i].doctor_id;
						}
						for(var j = 0; j < response.data.length; j++){
							if(response.data[j].day_of_Week === scope.options.timetable_dow[i].code){
								scope.timetable_list[i].data.push(response.data[j]);
								scope.timetable_list[i].cal_header_df_id = response.data[j].cal_header_df_id;
							}
						}//end for 2
					}//end for 1

					for(var i = 0; i < scope.timetable_list.length; i++){
						if(scope.timetable_list[i].data.length == 0){
							scope.timetable_list[i].data.push({from_time_display: '00:00', to_time_display: '00:00', isexists: false});
						}else{
							for(var j = 0; j < scope.timetable_list[i].data.length; j++){
								scope.timetable_list[i].data[j].from_time_display = ConfigService.convertToTimeString(scope.timetable_list[i].data[j].from_time);
								scope.timetable_list[i].data[j].to_time_display = ConfigService.convertToTimeString(scope.timetable_list[i].data[j].to_time);
								scope.timetable_list[i].data[j].isexists = true;
							}//end for 2
						}
					}//end for 1
				})
			}

			init();

			scope.clickInput = function(option){
				if(option.type === 'add'){
					scope.timetable_list[option.pindex].data.push({from_time_display: '00:00', to_time_display: '00:00', isexists: false});
				}else if(option.type === 'remove'){
					scope.timetable_list[option.pindex].data.splice(option.index, 1);
				}
			}//end clickInput

			scope.clickInputCalHeader = function(option){
				if(option.type === 'add'){
					scope.selectedCalHeader.push({week_ord_of_month: '2', site_id: '0', isexists: false});
				}else if(option.type === 'remove'){
					scope.selectedCalHeader.splice(option.index, 1);
				}
			}//end clickInput

			scope.saveCalHeader = function(){
				mdtTimetableService.addSite(scope.doctorId, scope.selectedCalHeaderId, scope.selectedCalHeader).then(function(response){
					toastr.success("Saving State Successful");
					init();
				})
			}

			scope.saveTimetable = function(option){
				mdtTimetableService.add(scope.timetable_list[option.pindex], scope.doctorId).then(function(response){
					toastr.success("Saving Timetable Successful");
					init();	
				});
			}

			scope.showState = function(data){
				if(data.cal_header_df_id){
					scope.selectedCalHeaderId = data.cal_header_df_id;
					scope.selectedCalHeader = [];
					mdtTimetableService.showWeek(scope.doctorId, data.cal_header_df_id).then(function(response){
						if(response.data.length > 0){
							scope.selectedCalHeader = response.data;
							for(var i = 0; i < scope.selectedCalHeader.length; i++){
								scope.selectedCalHeader[i].isexists = true;
							}
						}else{
							scope.selectedCalHeader.push({week_ord_of_month: 0, site_id: 0, isexists: false});
						}
					})
				}else{
					scope.selectedCalHeader = [];
					scope.selectedCalHeader.push({week_ord_of_month: 0, site_id: 0, isexists: false});
				}
			}

			scope.generate = function(){
				mdtTimetableService.generate(scope.selectedDoctor.doctor_id, scope.selectedDoctor.Appt_interval, scope.selectedDoctor.CLINICAL_DEPT_ID).then(function(response){
					toastr.success("Generate Timetable Successfully");
				})
			}
		}
	}//end return
})