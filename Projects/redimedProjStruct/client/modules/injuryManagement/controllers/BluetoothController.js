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

		var sin = [], cos = [];

		var data1 = [
                    ['DEC', 300],
                    ['JAN', 600],
                    ['FEB', 1100],
                    ['MAR', 1200],
                    ['APR', 860],
                    ['MAY', 1200],
                    ['JUN', 1450],
                    ['JUL', 1800],
                    ['AUG', 1200],
                    ['SEP', 600]
                ];

        var data2 = [
                    ['DEC', 500],
                    ['JAN', 700],
                    ['FEB', 100],
                    ['MAR', 1000],
                    ['APR', 300],
                    ['MAY', 500],
                    ['JUN', 1000],
                    ['JUL', 1200],
                    ['AUG', 1800],
                    ['SEP', 1000]
                ];


		$scope.chartData = [
				{ 	
					data: data1, 
					label: "Pulse",
					lines: {
            			fill: 0.6,
            			lineWidth: 0
        				},
        			color: ['red']
        		},
				{ 	
					data: data2, 
					label: "SpO2",
					lines: {
            			fill: 0.6,
            			lineWidth: 0
        				},
        			color: ['blue']
        		},
			];
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