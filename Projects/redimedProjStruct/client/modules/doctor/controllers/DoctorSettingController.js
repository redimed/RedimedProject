angular.module('app.loggedIn.doctor.setting.controller',[

])
    .controller('DoctorSettingController',function($scope,toastr,OnlineBookingAdminService,mdtDoctorService,DoctorService,ReceptionistService,UserService,ConfigService){
		$scope.userList = [];
		$scope.roomList = [];
		$scope.doctorInfo = null;
		$scope.room = {
			selectedRooms: null
		}

		$scope.doctorList = {
            class:function(doctor){
                return {
                    selected: (doctor.doco == $scope.doctors.select)
                };
            },
            scope: $scope.doctor_panel,
            options:{
                api:'api/erm/v2/doctor/search',
                method:'post',
                scope: $scope.doctor_panel,
                columns: [
                    {field: 'doctor_id', is_hide: true},
                    {field: 'NAME', label: 'Full name'},    
                    {field: 'Email', label: 'Email'},
                    {field: 'Phone', label: 'Phone'},     
                    {field: 'Specialties', label: 'Specialties', not_submit:true, 
                     type: 'custom', 
                     fn: function(item){
                        if(!item.specialties || item.specialties.length == 0) 
                            return '';
                         
                        var specialties = [];
                        angular.forEach(item.specialties, function(value, key){
                            specialties.push(value.Specialties_name);
                        })
                         
                        return  specialties.join(', ');
                     }
                    },     
                ],
                use_filters: true,
                filters: {
                    NAME: {type: 'text'},
                    Email: {type: 'text'},
                    Phone: {type: 'text'},
                }
            }
        };

		DoctorService.all().then(function(rs){
			$scope.doctors = rs;
		})

		UserService.doctorAssistant().then(function(rs){
			$scope.userList = rs;
		})

		ReceptionistService.getSite().then(function(rs){
			if(rs.status == 'success')
				$scope.siteList = rs.data;
		})

		$scope.siteChange = function(siteId){
			$scope.roomList = [];
			$scope.room.selectedRooms = null;
			OnlineBookingAdminService.getAvailableRoom(siteId,$scope.doctorInfo.doctor_id).then(function(rs){
				if(rs.status == 'success')
				{
					$scope.roomList = rs.data;
					$scope.room.selectedRooms = $scope.doctorInfo.rooms != null ? $scope.doctorInfo.rooms : null;
				}
				
			})
		}

		$scope.changeDoctor = function(item){
			$scope.roomList = [];
			$scope.room.selectedRooms = null;
			DoctorService.getById(item.doctor_id).then(function(rs){
				if(rs)
				{
					$scope.doctorInfo = rs;
					$scope.doctorInfo.isOnline = (rs.isOnline == 1) ? '1' : '0';

					OnlineBookingAdminService.getAvailableRoom($scope.doctorInfo.currentSite,item.doctor_id).then(function(rs){
						if(rs.status == 'success')
						{
							$scope.roomList = rs.data;
							if($scope.doctorInfo.rooms != null && $scope.doctorInfo.rooms.length > 0)
							{
								$scope.doctorInfo.rooms = JSON.parse("[" + $scope.doctorInfo.rooms + "]");
								$scope.room.selectedRooms = $scope.doctorInfo.rooms;
							}
						}
					})
				}
				else
					$scope.doctorInfo = null;
			})
		}

		$scope.submitClick = function(){
			if($scope.room.selectedRooms.length > 0)
			{
				$scope.doctorInfo.rooms = [];
				$scope.doctorInfo.rooms = $scope.room.selectedRooms;
				$scope.doctorInfo.numsOfRoom = $scope.doctorInfo.rooms.length;
			}
			else
				$scope.doctorInfo.rooms = [];
			
			var postData = angular.copy($scope.doctorInfo);
			for(var key in postData){
				if(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
			}
			postData.Last_update_date = ConfigService.getCommonDatetime(new Date());
			if(postData.numsOfRoom == null || postData.numsOfRoom == '')
				postData.numsOfRoom = 0;

			mdtDoctorService.edit($scope.doctorInfo.doctor_id, postData).then(function(response){
				if(response.status == 'error') toastr.error('Error Get Detail', 'Error')
				toastr.success('Edit Successfully !!!', 'Success');
			})
		}
    })
    .filter('propsFilter', function() {
		  return function(items, props) {
		    var out = [];

		    if (angular.isArray(items)) {
		      items.forEach(function(item) {
		        var itemMatches = false;

		        var keys = Object.keys(props);
		        for (var i = 0; i < keys.length; i++) {
		          var prop = keys[i];
		          var text = props[prop].toLowerCase();
		          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
		            itemMatches = true;
		            break;
		          }
		        }

		        if (itemMatches) {
		          out.push(item);
		        }
		      });
		    } else {
		      // Let the output be the input untouched
		      out = items;
		    }

		    return out;
		  }
	})