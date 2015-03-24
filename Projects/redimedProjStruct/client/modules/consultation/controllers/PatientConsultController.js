angular.module("app.loggedIn.consult.patient.controller",[])
	.controller("PatientConsultController",function($scope,$state,$modal,toastr,socket,$stateParams,ConsultationService,PatientService){
		var patient_id = $stateParams.patient_id;
		var cal_id = $stateParams.cal_id;

		$scope.patientInfo = {};
		$scope.problemArr = [];

		$scope.consultInfo = {
			patient_id: patient_id,
			cal_id: cal_id,
			problem_id: null,
			history: null,
			examination: null,
			treatment: null,
			diagnosis: null,
			measurements: [],
			scripts: []
		}

		PatientService.get(patient_id).then(function(rs){
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

		ConsultationService.getPatientProblem(patient_id).then(function(rs){
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

		$scope.newMeasure = function(){
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
		};

		$scope.editMeasure = function(index){
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

		$scope.delMeasure = function(index){
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

	})

.directive('drawings', ['$window', function ($window) {
    return {
        restrict: 'E',
        templateUrl: "common/views/whiteboard.html",
        link: function (scope, element, attrs) {
            var canvas = element.context.querySelector("canvas");
            var ctx = canvas.getContext("2d");
            var drawing = false;
            var lastX;
      		var lastY;

            scope.colors = [{'color': 'blue-ebonyclay'},
            				{'color': 'green'},
                            {'color': 'blue'},
                            {'color': 'red'}];

            scope.color = 'black';
            scope.lineWidth = attrs.linewidth;

			canvas.width = attrs.width || element.width();
            canvas.height = attrs.height || element.height();
            
            var clearCanvas = function () {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            };

            scope.uploadImage = function(image){
                var reader = new FileReader();
                reader.onload = function(event){
                    var img = new Image();
                    img.onload = function(){
                        ctx.drawImage(img,0,0);
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(image[0]);
            };
            
            scope.changeColor = function (c) {
            	if(c == 'blue-ebonyclay')
	                scope.color = 'black';
	            else
	            	scope.color = c;

                scope.lineWidth = attrs.linewidth;
                scope.erasing = false;
            };
            
            scope.clear = function () {
                clearCanvas();
            };
            
            scope.erase = function () {
                scope.color = element.find('#myCanvas').css("background-color");
                scope.lineWidth = 50;
                scope.erasing = true;
            };
            
            scope.capture = function () {
                window.open(canvas.toDataURL('image/png'));
            };

            var draw = function(lX, lY, cX, cY)
            {
            	ctx.lineCap = "round";
            	ctx.fillStyle = "solid";
            	ctx.strokeStyle = scope.color;
		        ctx.lineWidth = scope.lineWidth;
		        ctx.moveTo(lX,lY);
		        ctx.lineTo(cX,cY);
		        ctx.stroke();
            }

            angular.element(canvas).on('mousedown mousemove mouseup mouseout touchstart touchmove touchend', 
              function (event) {
                if (event.type === 'mousemove' && !drawing) {
                    // Ignore mouse move Events if we're not dragging
                    return;
                }
                event.preventDefault();
                
                switch (event.type) {
                case 'mousedown':
                case 'touchstart':

                    if(event.offsetX!==undefined){
			          lastX = event.offsetX;
			          lastY = event.offsetY;
			        } else {
			          lastX = event.layerX - event.currentTarget.offsetLeft;
			          lastY = event.layerY - event.currentTarget.offsetTop;
			        }
			        
			        ctx.beginPath();
			        
			        drawing = true;

                    break;
                case 'mousemove':
                case 'touchmove':

                    if(drawing){
			          // get current mouse position
			          if(event.offsetX!==undefined){
			            currentX = event.offsetX;
			            currentY = event.offsetY;
			          } else {
			            currentX = event.layerX - event.currentTarget.offsetLeft;
			            currentY = event.layerY - event.currentTarget.offsetTop;
			          }
			          
			          draw(lastX, lastY, currentX, currentY);
			          
			          // set current coordinates to last one
			          lastX = currentX;
			          lastY = currentY;
			        }

                    break;
                case 'mouseup':
                case 'touchend':
                case 'mouseout':
                    drawing = false;
                }
            });
            
        }
    };
}])