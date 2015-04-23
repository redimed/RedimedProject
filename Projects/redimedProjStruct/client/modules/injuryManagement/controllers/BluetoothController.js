angular.module("app.loggedIn.im.bluetooth.controller",[])
    .controller("BluetoothController",function($scope,$filter,$state,InjuryManagementService,UserService,toastr,socket,$stateParams,$cookieStore,ngTableParams){
		$scope.patient_id = $stateParams.patient_id;
		$scope.deviceList = [];
		var colors = ["blue-soft","red-soft","purple-soft","green-soft"];
		var icons = ["fa fa-plus-square","fa fa-medkit","fa fa-heart","fa fa-stethoscope"];
		$scope.haveData = false;
		$scope.currDevice = null;
		$scope.chartData = [];

		socket.on('getMeasureData',function(rs){
			if(rs.info){
				var data = angular.copy(rs.info);
			    delete data['deviceType'];
			    delete data['rawData'];

				$scope.$apply(function(){
					$scope.onlineDevice = rs.info.deviceType;
					$scope.onlineData = data;
				})
			}
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

		$scope.changeHistory = function(dateRange){
			if($scope.data != null && $scope.currDevice != null)
			{
				getHistory($scope.currDevice.toLowerCase() , _.sortBy($scope.data, 'measure_date')  , moment(dateRange.start) , moment(dateRange.end));
			}
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

						var deviceType = null;

						for(var i=0; i<rs.data.length;i++){
							if(rs.data[i].measureData != null || rs.data[i].measureData != '')
							{
								deviceType = rs.data[0].device_name.toLowerCase()
								rs.data[i].jsonData = JSON.parse(rs.data[i].measureData);
							}
						}

						$scope.data = rs.data;

						$scope.historyDates = moment().range(moment().subtract(1, 'days'), moment());

						getHistory(deviceType ,_.sortBy($scope.data, 'measure_date')  , moment().subtract(1, 'days') , moment());
						
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
		};

		var getHistory = function(deviceType,data,from,to)
		{
			var fromDate = moment(from).format('YYYY-MM-DD');
			var toDate = moment(to).format('YYYY-MM-DD');

			var pulse = [], spO2 = [];
			var fev1 = [], fvc = [], pef = [];
			var sys = [], dia = [], bpm = [], mmHg = [];

			$scope.chartData = [];

			for(var i=0; i<data.length;i++)
			{
				var measureDate = $filter('date')(data[i].measure_date,'yyyy-MM-dd');
				var measureDateHrs = $filter('date')(data[i].measure_date,'dd/MM/yyyy-hh:mm a');

				switch (deviceType)
				{
					case "pulse oximeter":
					{
						if(moment(measureDate).isBefore(toDate) && moment(measureDate).isAfter(fromDate) || (moment(measureDate).isSame(fromDate) || moment(measureDate).isSame(toDate)))
						{
							pulse.push([measureDateHrs,data[i].jsonData.pulse]);
							spO2.push([measureDateHrs,data[i].jsonData.spO2])
						}
						break;
					}

					case "spirometer":
					{
						if(moment(measureDate).isBefore(toDate) && moment(measureDate).isAfter(fromDate) || (moment(measureDate).isSame(fromDate) || moment(measureDate).isSame(toDate)))
						{
							fev1.push([measureDateHrs,data[i].jsonData.FEV1]);
							fvc.push([measureDateHrs,data[i].jsonData.FVC]);
							pef.push([measureDateHrs,data[i].jsonData.PEF])
						}
						break;
					}

					case "blood pressure":
					{
						if(moment(measureDate).isBefore(toDate) && moment(measureDate).isAfter(fromDate) || (moment(measureDate).isSame(fromDate) || moment(measureDate).isSame(toDate)))
						{
							sys.push([measureDateHrs,data[i].jsonData.sys]);
							dia.push([measureDateHrs,data[i].jsonData.dia]);
							bpm.push([measureDateHrs,data[i].jsonData.bpm]);
							mmHg.push([measureDateHrs,data[i].jsonData.mmHg]);
						}
						break;
					}

				}
			}

			switch (deviceType)
			{
				case "pulse oximeter":
				{
					$scope.chartData.push({data: pulse, label: 'Pulse'});
					$scope.chartData.push({data: spO2, label: 'SpO2'});
					break;
				}

				case "spirometer":
				{
					$scope.chartData.push({data: fev1, label: 'FEV1'});
					$scope.chartData.push({data: fvc, label: 'FVC'});
					$scope.chartData.push({data: pef, label: 'PEF'});
					break;
				}

				case "blood pressure":
				{
					$scope.chartData.push({data: sys, label: 'SYS'});
					$scope.chartData.push({data: dia, label: 'DIA'});
					$scope.chartData.push({data: bpm, label: 'BPM'});
					$scope.chartData.push({data: mmHg, label: 'mmHg'});
					break;
				}

			}

		};



    })