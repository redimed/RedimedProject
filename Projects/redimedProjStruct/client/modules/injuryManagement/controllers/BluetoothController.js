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

		socket.on('getMeasureData',function(rs){
			var data = angular.copy(rs.info);
		    delete data['deviceType'];
		    delete data['rawData'];

			$scope.$apply(function(){
				$scope.onlineDevice = rs.info.deviceType;
				$scope.onlineData = data;
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

		$scope.chartOptions = {
			series: {
				lines: {
					show: true
				},
				points: {
					show: true
				}
			},
			xaxis: {
                tickLength: 0,
                tickDecimals: 0,
                mode: "categories",
                min: 0,
                font: {
                    lineHeight: 14,
                    style: "normal",
                    variant: "small-caps",
                    color: "#6F7B8A"
                }
            },
            yaxis: {
                ticks: 5,
                tickDecimals: 0,
                tickColor: "#eee",
                font: {
                    lineHeight: 14,
                    style: "normal",
                    variant: "small-caps",
                    color: "#6F7B8A"
                }
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#eee",
                borderColor: "#eee",
                borderWidth: 1
            }
		};

		$scope.showHistory = function(device){
			$scope.data = null;
			$scope.haveData = false;
			$scope.currDevice = device.device_name;
			InjuryManagementService.getDeviceDataByPatient(device.id,$scope.patient_id).then(function(rs){
				if(rs.status == "success")
				{
					if(rs.data.length > 0){
						$scope.haveData = true;

						var deviceType = null;

						for(var i=0; i<rs.data.length;i++){
							if(rs.data[i].measureData != null || rs.data[i].measureData != '')
							{
								deviceType = rs.data[0].device_name.toLowerCase()
								rs.data[i].jsonData = JSON.parse(rs.data[i].measureData);
							}
						}

						$scope.data = rs.data;

						var date = new Date();
						var currDate = $filter('date')(date,'dd/MM/yyyy');
						var previousDate = $filter('date')(date.setDate(date.getDate() - 1),'dd/MM/yyyy');

						$scope.chartTitle = "Measure data from "+previousDate+" to "+currDate;

						switch (deviceType)
						{
							case "pulse oximeter":
							{
								var pulse = [], spO2 = [];
								
								for(var i=0; i<$scope.data.length;i++)
								{
									var measureDate = $filter('date')($scope.data[i].measure_date,'dd/MM/yyyy');
									if(measureDate == currDate || measureDate == previousDate)
									{
										pulse.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.pulse]);
										spO2.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.spO2])
									}
								}

								$scope.chartData = [
									{ 	
										data: pulse, 
										label: "Pulse",
					        		},
									{ 	
										data: spO2, 
										label: "SpO2",
					        		},
								];

								break;
							}

							case "spirometer":
							{

								var fev1 = [], fvc = [], pef = [];
								
								for(var i=0; i<$scope.data.length;i++)
								{
									var measureDate = $filter('date')($scope.data[i].measure_date,'dd/MM/yyyy');
									if(measureDate == currDate || measureDate == previousDate)
									{
										fev1.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.FEV1]);
										fvc.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.FVC]);
										pef.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.PEF])
									}
								}

								$scope.chartData = [
									{ 	
										data: fev1, 
										label: "FEV1",
					        		},
									{ 	
										data: fvc, 
										label: "FVC",
					        		},
					        		{ 	
										data: pef, 
										label: "PEF",
					        		},
								];

								break;
							}

							case "blood pressure":
							{
								var sys = [], dia = [], bpm = [], mmHg = [];
								
								for(var i=0; i<$scope.data.length;i++)
								{
									var measureDate = $filter('date')($scope.data[i].measure_date,'dd/MM/yyyy');
									if(measureDate == currDate || measureDate == previousDate)
									{
										sys.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.sys]);
										dia.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.dia]);
										bpm.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.bpm]);
										mmHg.push([$filter('date')($scope.data[i].measure_date,'dd/MM/yyyy-hh:mm a'),$scope.data[i].jsonData.mmHg]);
									}
								}

								$scope.chartData = [
									{ 	
										data: sys, 
										label: "SYS",
					        		},
									{ 	
										data: dia, 
										label: "DIA",
					        		},
					        		{ 	
										data: bpm, 
										label: "BPM",
					        		},
					        		{ 	
										data: mmHg, 
										label: "mmHg",
					        		},
								];

								break;
							}

						}

						
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