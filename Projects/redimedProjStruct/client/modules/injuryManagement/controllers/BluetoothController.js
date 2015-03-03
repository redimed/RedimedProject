angular.module("app.loggedIn.im.bluetooth.controller",[])
    .controller("BluetoothController",function($scope,$filter,$state,InjuryManagementService,UserService,toastr,socket,$stateParams,$cookieStore,ngTableParams){
		$scope.patient_id = $stateParams.patient_id;
		$scope.deviceList = [];
		var colors = ["blue-soft","red-soft","purple-soft","green-soft"];
		var icons = ["fa fa-plus-square","fa fa-medkit","fa fa-heart","fa fa-stethoscope"];
		$scope.haveData = false;

		$scope.pulseData = {
			pulse: null,
			spO2 : null
		}

		socket.on('getMeasureData',function(data){
			$scope.$apply(function(){
				$scope.pulseData.pulse = data.pulse;
				$scope.pulseData.spO2 = data.spO2;
			})
		})

		InjuryManagementService.getMedicalDevices().then(function(rs){
			if(rs.status == "success")
			{
				for(var i=0; i<rs.data.length;i++){
					rs.data[i].color = colors[Math.floor(Math.random() * colors.length)];
					rs.data[i].icon = icons[Math.floor(Math.random() *  icons.length)];
				}
				$scope.deviceList = rs.data;
			}
		})

		var sin = [], cos = [];

		for (var i = 0; i < 14; i += 0.5) {
			sin.push([i, Math.sin(i)]);
			cos.push([i, Math.cos(i)]);
		}

		$scope.myData = [
				{ data: sin, label: "Pulse"},
				{ data: cos, label: "Sp02"}
			];
		$scope.myChartOptions = {
			series: {
				lines: {
					show: true
				},
				points: {
					show: true
				}
			},
			grid: {
				hoverable: true,
				clickable: true
			},
			yaxis: {
				min: -1.2,
				max: 1.2
			}
		};

		$scope.updateMeasure = function(measure){
			var m = {};
			m.notes = measure.notes;

			InjuryManagementService.editDeviceMeasure(m,measure.measure_id).then(function(rs){
				if(rs.status == 'success')
					toastr.success("Edit Success!");
				else
					toastr.error("Edit Failed!");
			})
		}

		$scope.showHistory = function(device){
			$scope.data = null;
			$scope.haveData = false;
			$scope.currDevice = device.device_name;
			InjuryManagementService.getDeviceDataByPatient(device.id,$scope.patient_id).then(function(rs){
				if(rs.status == "success")
				{
					if(rs.data.length > 0){
						$scope.haveData = true;

						for(var i=0; i<rs.data.length;i++){
							if(rs.data[i].measureData != null || rs.data[i].measureData != '')
							{
								rs.data[i].jsonData = JSON.parse(rs.data[i].measureData);
							}
						}

						$scope.data = rs.data;

						if($scope.data != null)
						{
							$scope.tableParams = new ngTableParams({
					            page: 1,            // show first page
					            count: 10           // count per page
					        }, {
					            total: rs.data.length, // length of data
					            getData: function($defer, params) {
					                var filteredData = params.filter() ?
					                    $filter('filter')($scope.data, params.filter()) :
					                    $scope.data;

					                var orderedData = params.sorting() ?
					                    $filter('orderBy')(filteredData, params.orderBy()) :
					                    $scope.data;

					                params.total(orderedData.length);
					                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					            }
					        });
						}
					}
					else
	                {
	                    $scope.haveData = false;
	                }
				}
				else
	            {
	                $scope.haveData = false;
	            }
			})
		}



    })