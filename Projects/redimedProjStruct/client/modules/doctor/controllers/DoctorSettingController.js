angular.module('app.loggedIn.doctor.setting.controller',[

])
    .controller('DoctorSettingController',function($scope,toastr,mdtDoctorService,DoctorService,ReceptionistService,UserService,ConfigService){
    	$scope.doctor = {
    		selected: null
    	};
		$scope.doctors = [];
		$scope.userList = [];
		$scope.doctorInfo = null;

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

		$scope.changeDoctor = function(item){
			DoctorService.getById(item.doctor_id).then(function(rs){
				if(rs)
				{
					$scope.doctorInfo = rs;
					$scope.doctorInfo.isOnline = (rs.isOnline == 1) ? '1' : '0';
				}
				else
					$scope.doctorInfo = null;
			})
		}

		$scope.submitClick = function(){
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