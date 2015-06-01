angular.module("app.loggedIn.document.newFA.controllers",[])
.controller('newFAController', function($scope, DocumentService, PatientService, toastr){
	//Init params
	var fa_id=11;
	var patient_id= 677;
	$scope.patient_age = null;
	$scope.header = {};
	$scope.patient_info = {};
	//End Init params

	//Functions for Init
	var getNewFA = function(fa_id){
		var getHeaderId = fa_id;
		DocumentService.loadNewHeaderSections(getHeaderId).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
				//get lines of section
				$scope.header.sections.forEach(function(section){
					DocumentService.loadNewLines(section.SECTION_ID, getHeaderId).then(function(lineRes){
						if(lineRes.status==='error') {
							$scope.header={};
							toastr.error('Unexpected error', 'Error!');
						}
						else{
							section.lines=lineRes.data;
							//get details and comment of lines
							section.lines.forEach(function(line){
								if(line.PICTURE!==null){
									var strarr = line.PICTURE.split("\\");
									var fileName = strarr[strarr.length-1];
									line.previewPath = "https://"+location.host+"/document/fa/images/"+fileName;
								} 
								DocumentService.loadNewCommentsAndDetails(line.LINE_ID).then(function(detailAndCommentRes){
									if(detailAndCommentRes.status === 'error'){
										$scope.header={};
										toastr.error('Unexpected error', 'Error!');
									}
									else{
										line.details = detailAndCommentRes.data.details;
										line.comments = detailAndCommentRes.data.comments;
										line.details.forEach(function(detail){
											if(detail.PICTURE!==null){
												var strarr = detail.PICTURE.split("\\");
												var fileName = strarr[strarr.length-1];
												detail.previewPath = "https://"+location.host+"/document/fa/images/"+fileName;
											}
											console.log('this is data',$scope.header);
										})
									}
								})
							})
						}
					})
				})
			}
		})
	}

	var getPatientInfo = function(patient_id){
		PatientService.getById(patient_id).then(function(result){
			if(result!== null) {
				//tmp fix for patient gender
				if(result.Sex !=="Female" && result.Sex !=="Male") result.Sex="Male";
				$scope.patient_info= result;
				getPatientAge($scope.patient_info.DOB);
			}
		})
	}

	var getPatientAge = function(dateString){
		var now = new Date();
        var birthDate = new Date(dateString);
        var age = now.getFullYear() - birthDate.getFullYear();
        var m = now.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate()))
        {
            age--;
        }
        $scope.patient_age = age;
	}
	//End Functions for Init

	// Init function
	var init = function(){
		getNewFA(fa_id);
		getPatientInfo(patient_id);
	}

	init(); //Call init function
	// End Init function31

	//Auto calculate functions
	//For VAL1
	var calculateFunctionsVal1 = {
		calAvg: function(line){
			var sum = 0;
			var numberOfValue = 0;
			for(var i = 0; i<line.details.length; i++){
				if(line.details[i].VAL1_VALUE !== null && line.details[i].VAL1_VALUE !== '' && line.details[i].VAL1_VALUE_IS_NUMBER === 1){
					sum = sum + line.details[i].VAL1_VALUE*1;
					numberOfValue ++;
				}	
			}
			line.SCORE1 = sum/numberOfValue;
			autoRatingVal1(line, line.SCORE1);
		},

		calMax: function(line){
			var max = line.details[0].VAL1_VALUE*1;
			for(var i = 1; i<line.details.length; i++){
				if(line.details[i].VAL1_VALUE !== null && line.details[i].VAL1_VALUE !== '' && line.details[i].VAL1_VALUE_IS_NUMBER === 1){
					if(line.details[i].VAL1_VALUE*1 > max) max = line.details[i].VAL1_VALUE*1
				}	
			}
			line.SCORE1 = max;
			autoRatingVal1(line, line.SCORE1);
		},

		calMin: function(line){
			var min = line.details[0].VAL1_VALUE*1;
			for(var i = 1; i<line.details.length; i++){
				if(line.details[i].VAL1_VALUE !== null && line.details[i].VAL1_VALUE !== '' && line.details[i].VAL1_VALUE_IS_NUMBER === 1){
					if(line.details[i].VAL1_VALUE*1 < min) min = line.details[i].VAL1_VALUE*1
				}	
			}
			line.SCORE1 = min;
			autoRatingVal1(line, line.SCORE1);
		}
	}

	$scope.autoCalculationVal1 = function(line){
		if(line.ISSCORE1===1){
			switch(line.SCORE_TYPE1){
				case 3: calculateFunctionsVal1.calAvg(line);
						break;
				case 9:
				case 10: calculateFunctionsVal1.calMax(line);
							break;
				case 11: calculateFunctionsVal1.calMin(line);
							break;
				default: break;
			}
		}
	}
	//For VAL2
	var calculateFunctionsVal2 = {
		calAvg: function(line){
			var sum = 0;
			var numberOfValue = 0;
			for(var i = 0; i<line.details.length; i++){
				if(line.details[i].VAL2_VALUE !== null && line.details[i].VAL2_VALUE !== '' && line.details[i].VAL2_VALUE_IS_NUMBER === 1){
					sum = sum + line.details[i].VAL2_VALUE*1;
					numberOfValue ++;
				}	
			}
			line.SCORE2 = sum/numberOfValue;
			autoRatingVal2(line, line.SCORE2);
		},

		calMax: function(line){
			var max = line.details[0].VAL2_VALUE*1;
			for(var i = 1; i<line.details.length; i++){
				if(line.details[i].VAL2_VALUE !== null && line.details[i].VAL2_VALUE !== '' && line.details[i].VAL2_VALUE_IS_NUMBER === 1){
					if(line.details[i].VAL2_VALUE*1 > max) max = line.details[i].VAL2_VALUE*1
				}	
			}
			line.SCORE2 = max;
			autoRatingVal2(line, line.SCORE2);
		},

		calMin: function(line){
			var min = line.details[0].VAL2_VALUE*1;
			for(var i = 1; i<line.details.length; i++){
				if(line.details[i].VAL2_VALUE !== null && line.details[i].VAL2_VALUE !== '' && line.details[i].VAL2_VALUE_IS_NUMBER === 1){
					if(line.details[i].VAL2_VALUE*1 < min) min = line.details[i].VAL2_VALUE*1
				}	
			}
			line.SCORE2 = min;
			autoRatingVal2(line, line.SCORE2);
		}
	}

	$scope.autoCalculationVal2 = function(line){
		if(line.ISSCORE2===1){
			switch(line.SCORE_TYPE1){
				case 3: calculateFunctionsVal2.calAvg(line);
						break;
				case 9:
				case 10: calculateFunctionsVal2.calMax(line);
							break;
				case 11: calculateFunctionsVal2.calMin(line);
							break;
				default: break;
			}
		}
	}
	//End Auto calculate functions

	//Auto rating functions
	var autoRatingVal1 = function(line, valueToRate){
		if(line.RATING_ID1!==null && line.RATING_ID1!==''){
			var ratingData = {
				patient_age: $scope.patient_age,
				patient_gender: $scope.patient_info.Sex,
				valueToRate: line.SCORE1,
				rating_id: line.RATING_ID1
			}
			DocumentService.autoRating(ratingData).then(function(result){
				console.log('this is result', result);
				if(result.status==='error') toastr.error('Something wrong with auto rating function.','Error!');
				else{
					if(result.status === 'unrated'){
						line.RATE1= 'UNRATED';
						line.RATING_VALUE1 = null;
					}
					else{
						line.RATE1 = result.data[0].RATE;
						line.RATING_VALUE1 = result.data[0].VALUE;
					}
				}
			});
		}		
	}

	var autoRatingVal2 = function(line, valueToRate){
		if(line.RATING_ID2!==null && line.RATING_ID2!==''){
			var ratingData = {
				patient_age: $scope.patient_age,
				patient_gender: $scope.patient_info.Sex,
				valueToRate: line.SCORE2,
				rating_id: line.RATING_ID2
			}
			DocumentService.autoRating(ratingData).then(function(result){
				if(result.status==='error') toastr.error('Something wrong with auto rating function.','Error!');
				else{
					if(result.status === 'unrated'){
						line.RATE2= 'UNRATED';
						line.RATING_VALUE2 = null;
					}
					else{
						line.RATE2 = result.data[0].RATE;
						line.RATING_VALUE2 = result.data[0].VALUE;
					}
				}
			});
		}		
	}
	//End Auto rating functions

	//Validation functions
	//End Validation functions

	//Process functions
	//End Process functions

});