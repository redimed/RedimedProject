angular.module("app.loggedIn.document.newFA.controllers",[])
.controller('newFAController', function($scope, $stateParams, $cookieStore, DocumentService, PatientService, toastr, moment){
	//Init params
	$scope.editMode = null;
	// var fa_id=11;
	var fa_id = $stateParams.fa_id*1;
	// var patient_id= 677;
	var patient_id = $stateParams.patient_id*1;
	var cal_id = $stateParams.cal_id*1;
	$scope.print_fa_id = fa_id;
	$scope.print_patient_id = patient_id;
	$scope.print_cal_id = cal_id;

	$scope.patient_age = null;
	$scope.header = {};
	$scope.header.Comments = "Met all manual handling requirements with good technique."
	$scope.header.ASSESSED_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
	$scope.patient_info = {};
	$scope.isSignatureShow = false;
	$scope.clickedValidation = false;

	//getNewFA(): get new functional assessment template for this appointment
	//
	//input: fa_id (the header id of the template)
	//result: the $scope.header variable will contain all the template
	var getNewFA = function(fa_id){
		var getHeaderId = fa_id;
		//get all header and section
		DocumentService.loadNewHeaderSections(getHeaderId).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
				$scope.header.PATIENT_ID = patient_id;
				$scope.header.CAL_ID = cal_id;
				$scope.header.ASSESSED_SIGN = '';
				$scope.header.ASSESSED_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
				$scope.header.Comments = "Met all manual handling requirements with good technique."
				getDoctorInfo(cal_id, patient_id);
				//get lines of section
				$scope.header.sections.forEach(function(section){
					section.PATIENT_ID = patient_id;
					section.CAL_ID = cal_id;
					DocumentService.loadNewLines(section.SECTION_ID, getHeaderId).then(function(lineRes){
						if(lineRes.status==='error') {
							$scope.header={};
							toastr.error('Unexpected error', 'Error!');
						}
						else{
							section.lines=lineRes.data;
							//get details and comment of lines
							section.lines.forEach(function(line){
								line.PATIENT_ID = patient_id;
								line.CAL_ID = cal_id;
								//check if the line have picture to config for preview on the GUI
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
											detail.PATIENT_ID = patient_id;
											detail.CAL_ID = cal_id;
											//check if the details have picture to config for preview on the GUI
											if(detail.PICTURE!==null){
												var strarr = detail.PICTURE.split("\\");
												var fileName = strarr[strarr.length-1];
												detail.previewPath = "https://"+location.host+"/document/fa/images/"+fileName;
											}
											if(line.SCORE_TYPE1===7 || line.SCORE_TYPE1===9){
												$scope.autoCalculationVal1(line, detail);
											}
										})
										line.comments.forEach(function(comment){
											comment.PATIENT_ID = patient_id;
											comment.CAL_ID = cal_id;
											console.log($scope.header);
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

	//getExistFA(): get the existed FA information of the appointment
	//
	//input: fa_id, patiet_id, cal_id
	//result: $scope.header variable will contain all the functional assessment information
	var getExistFA = function(fa_id, patient_id, cal_id){
		var getHeaderId = fa_id;
		DocumentService.loadExistHeaderSections(getHeaderId, patient_id, cal_id).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
				$scope.header.ASSESSED_DATE = moment($scope.header.ASSESSED_DATE).format("YYYY-MM-DD hh:mm:ss");
				//get lines of section
				$scope.header.sections.forEach(function(section){
					DocumentService.loadExistLines(section.SECTION_ID, getHeaderId, patient_id, cal_id).then(function(lineRes){
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
								DocumentService.loadExistCommentsAndDetails(line.LINE_ID, patient_id, cal_id).then(function(detailAndCommentRes){
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

	//getPatientInfo: get info of the patient that participated in the assessment
	//
	//input: id of patient
	var getPatientInfo = function(patient_id){
		PatientService.getById(patient_id).then(function(result){
			if(result!== null) {
				//fix for patient gender
				if(result.Sex==="0") result.Sex = "Male";
				else result.Sex = "Female";
				$scope.patient_info= result;
				//call the function to calculate the patient's age
				getPatientAge($scope.patient_info.DOB);
			}
		})
	}

	//getDoctorInfo: get info of the doctor that participated in this assessment
	//
	//input: cal_id and patient_id
	//result: the doctor name and signature
	var getDoctorInfo = function(cal_id, patient_id){
		//get currently logged user
		var userInfo = $cookieStore.get('userInfo');
		var apptInfo = {user_id: userInfo.id};
		//Find the doctor that have matching user_id
		DocumentService.getDoctor(apptInfo).then(function(result){
			if(result.status === "error") toastr.error("Unexpected error!","Error");
			else if(result.status === "no doctor") toastr.error("The account treating this assessment have no doctor link with it", "Error!");
			else {
				$scope.header.ASSESSED_NAME = result.data[0].Booking_Person;
				$scope.header.ASSESSED_SIGN = result.data[0].Signature;
			}
		})
	}

	//getPatientAge: calculate the age of the patient
	//
	//input: patient birthday.
	//result: $scope.patient age will store the result.
	var getPatientAge = function(dateString){
		var now = new Date();
        var birthDate = new Date(dateString);
        var age = now.getFullYear() - birthDate.getFullYear();
        //calculate the month differrent
        var m = now.getMonth() - birthDate.getMonth();
        //check the different month to correct the age.
        if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate()))
        {
            age--;
        }
        console.log('this is patient age', age);
        $scope.patient_age = age;
	}

	//checkExistFA: check if this assessment already have a FA record
	//
	//input: fa_id, patient_id, cal_id
	//result: this function will decide either getNewFA() or getExistFA() function will be called.
	var checkExistFA = function(fa_id, patient_id, cal_id){
		DocumentService.checkExistFA(fa_id, patient_id, cal_id).then(function(result){
			if(result.status==='error') toastr.error('Unexpected error!','Error!');
			else if(result.status==='not existed') {
				getNewFA(fa_id);
				$scope.editMode=false;
			}
			else {
				getExistFA(fa_id, patient_id, cal_id);
				$scope.editMode=true;
			}
		})
	}
	//End Functions for Init

	// Init function.
	var init = function(){
		checkExistFA(fa_id, patient_id,cal_id);
		getPatientInfo(patient_id);
	}

	init();

	//Auto calculate functions
	//
	//input: the line to calculate the result
	//result: will call the autoRating() function after completing calculate the result
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
			if(line.SCORE_TYPE1!==20){
				autoRatingVal1(line, line.SCORE1, 0);
			}
		},

		calMax: function(line){
			var max = line.details[0].VAL1_VALUE*1;
			for(var i = 1; i<line.details.length; i++){
				if(line.details[i].VAL1_VALUE !== null && line.details[i].VAL1_VALUE !== '' && line.details[i].VAL1_VALUE_IS_NUMBER === 1){
					if(line.details[i].VAL1_VALUE*1 > max) max = line.details[i].VAL1_VALUE*1
				}	
			}
			line.SCORE1 = max;
			autoRatingVal1(line, line.SCORE1, 0);
		},

		calMin: function(line){
			var min = line.details[0].VAL1_VALUE*1;
			for(var i = 1; i<line.details.length; i++){
				if(line.details[i].VAL1_VALUE !== null && line.details[i].VAL1_VALUE !== '' && line.details[i].VAL1_VALUE_IS_NUMBER === 1){
					if(line.details[i].VAL1_VALUE*1 < min) min = line.details[i].VAL1_VALUE*1
				}	
			}
			line.SCORE1 = min;
			autoRatingVal1(line, line.SCORE1, 0);
		},

		calSum: function(line){
			var sum = 0;
			for(var i = 0; i<line.details.length; i++){
				if(line.details[i].VAL1_VALUE !== null && line.details[i].VAL1_VALUE !== '' && line.details[i].VAL1_VALUE_IS_NUMBER === 1){
					sum = sum + line.details[i].VAL1_VALUE*1;
				}	
			}
			line.SCORE1 = sum;
			if(line.SCORE_TYPE1!==20){
				autoRatingVal1(line, line.SCORE1, 0);
			}
		}
	}

	//autoCalculationVal1: auto calculate the functions of the line when the line info changed on the GUI
	//
	// input: the changed detail and the line contain that detail
	// 
	$scope.autoCalculationVal1 = function(line,detail){
		//just understand that it check the detail type to take the correct calculation operation
		if(detail!==undefined){
			if(detail.VAL1_ISCHECKBOX === 4 || detail.VAL1_ISCHECKBOX === 5){
				line.RATING_VALUE1 = 0;
				for(var i = 0; i<line.details.length; i++){
					if(line.details[i].VAL1_ISCHECKBOX===4){
						switch(line.details[i].VAL1_CHECKBOX){
							default:
							case '0':
							case '1': line.RATING_VALUE1 += 0;
										break;
							case '2': line.RATING_VALUE1 += 1;
										break;
						}
					}
					else if(line.details[i].VAL1_ISCHECKBOX === 5){
						switch(line.details[i].VAL1_CHECKBOX){
							default:
							case '0': line.RATING_VALUE1 += 0;
										break;
							case '1': line.RATING_VALUE1 += 1;
										break;
							case '2': line.RATING_VALUE1 += 2;
										break;
						}
					}
				}
				switch(line.RATING_VALUE1){
					default:
					case 0: line.RATE1 = "";
							break;
					case 1: line.RATE1 = "Poor";
								break;
					case 2: line.RATE1 = "Fair";
								break;
					case 3: line.RATE1 = "Good";
								break;
					case 4: line.RATE1 = "Excellent";
								break;
				}
				autoSummary(line);
			}
			else if($scope.header.TYPE === "Crown" && detail.VAL1_ISCHECKBOX === 12){
				console.log('this is line details index',line.details.indexOf(detail));
				console.log('this is line details length',line.details.length);
				if(line.details.indexOf(detail) === line.details.length - 1){
					if(detail.VAL1_CHECKBOX==='1'){
						detail.VAL1_CHECKBOX = 1;
						line.RATE1 = "Satisfactory";
					}
					else {
						detail.VAL1_CHECKBOX = 0;
						line.RATE1 = "Unsatisfactory";
					}
					autoSummary(line);
				}
			}
		}
		//now it will check the score type of the line to take the correct calculation operation
		if((line.SCORE_TYPE1 === 9) && (detail.VAL1_ISVALUE===7 || detail.VAL1_ISVALUE===8 || detail.VAL1_ISVALUE===9 || detail.VAL1_ISVALUE===10)){
			var default_details_value = null;
			if(detail.VAL2_ISVALUE === 7 || detail.VAL2_ISVALUE === 8 || detail.VAL2_ISVALUE === 9 || detail.VAL2_ISVALUE === 10){
				if($scope.patient_info.Sex === "Male") default_details_value = line.details[0].VAL1_VALUE;
				else {
					line.details[0].VAL1_VALUE = line.details[0].VAL2_VALUE;
					default_details_value = line.details[0].VAL1_VALUE;
				}
			}
			else default_details_value = line.details[0].VAL1_VALUE;
			var start_value = 5;
			if(line.details === 2){
				line.details[1].VAL1_VALUE = angular.copy(default_details_value);
			}
			else{
				for(var i = 1; i<line.details.length; i++){
					line.details[i].VAL1_VALUE = angular.copy(start_value);
					if(start_value < default_details_value) start_value+=5;
				}
			}
		}
		else if(line.SCORE_TYPE1 === 7 && (detail.VAL1_ISVALUE===7 || detail.VAL1_ISVALUE===8 || detail.VAL1_ISVALUE===9 || detail.VAL1_ISVALUE===10)){
			var default_details_value = line.details[0].VAL1_VALUE;
			var start_value = 5;
			if((line.details[0].VAL1_ISVALUE===7 || line.details[0].VAL1_ISVALUE===8 || line.details[0].VAL1_ISVALUE===9 || line.details[0].VAL1_ISVALUE===10) && line.details.length === 2){
				line.details[1].VAL1_VALUE = angular.copy(default_details_value);
			}
		}
		//check the ISSCORE variable to continue operating
		if(line.ISSCORE1===1){
			//if ISSCORE=1 then take the correct operation based on the score type
			switch(line.SCORE_TYPE1){
				case 20:
				case 3: calculateFunctionsVal1.calAvg(line);
						break;
				case 30: calculateFunctionsVal1.calSum(line);
							break;
				case 9: line.SCORE1= line.details[line.details.length-1].VAL1_VALUE;
						break;
				case 10: calculateFunctionsVal1.calMax(line);
							break;
				case 11: calculateFunctionsVal1.calMin(line);
							break;
				case 8: autoRatingVal1(line, line.SCORE1*1, 0);
							break;
				case 23:
				case 29:
				case 12: 	break;
				default: line.SCORE1= line.details[line.details.length-1].VAL1_VALUE;
						autoRatingVal1(line, line.SCORE1, 0);
							break;
			}
		}

	}
	//Those value 2 logic is exactly the same of value 1
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
			if(line.SCORE_TYPE2 !== 20){
				autoRatingVal2(line, line.SCORE2);
			}
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
		},

		calSum: function(line){
			var sum = 0;
			for(var i = 0; i<line.details.length; i++){
				if(line.details[i].VAL2_VALUE !== null && line.details[i].VAL2_VALUE !== '' && line.details[i].VAL2_VALUE_IS_NUMBER === 1){
					sum = sum + line.details[i].VAL2_VALUE*1;
				}	
			}
			line.SCORE2 = sum;
			if(line.SCORE_TYPE2 !== 20){
				autoRatingVal2(line, line.SCORE2);
			}
		},
	} 

	//the same as val1
	$scope.autoCalculationVal2 = function(line){
		if(line.ISSCORE2===1){
			switch(line.SCORE_TYPE2){
				case 20:
				case 3: calculateFunctionsVal2.calAvg(line);
						break;
				case 30: calculateFunctionsVal2.calSum(line);
							break;
				case 9: line.SCORE2= line.details[line.details.length-1].VAL2_VALUE;
							break;
				case 10: calculateFunctionsVal2.calMax(line);
							break;
				case 11: calculateFunctionsVal2.calMin(line);
							break;
				case 8: autoRatingVal2(line, line.SCORE2);
							break;
				default: line.SCORE2 = line.details[line.details.length-1].VAL2_VALUE;
						autoRatingVal2(line, line.SCORE2*1);
							break;
			}
		}
	}

	//autoRatingVal1(): auto rating the line based on the test performed in the line.
	//
	//input: the line need to rating, the value need to be rated and a flag to check if the function call this is from the summary line type.
	//
	var autoRatingVal1 = function(line, valueToRate,totalMode){
		//check the rating ID to decide the rating operation: take from database of do rating locally
		if(line.RATING_ID1!==null && line.RATING_ID1!==''){
			var ratingData = {
				patient_age: $scope.patient_age,
				patient_gender: $scope.patient_info.Sex,
				valueToRate: valueToRate,
				rating_id: line.RATING_ID1
			}
			DocumentService.autoRating(ratingData).then(function(result){
				console.log('this is result', result);
				if(result.status==='error') toastr.error('Something wrong with auto rating function.','Error!');
				else{
					if(result.status === 'unrated'){
						line.RATE1= 'UNRATED';
						if(totalMode!==1) {
							line.RATING_VALUE1 = null;
							autoSummary(line);
						}
					}
					else{
						//check the rating result the get the correct data for the RATING_VALUE variable
						if(line.SCORE_TYPE1 === 3){
							console.log('rating result', result);
							line.RATE1 = result.data[0].RATE;
							if(line.SCORE1<result.data[0].FROM_VALUE) line.RATING_VALUE1=1;
							else if(line.SCORE1>result.data[0].TO_VALUE) line.RATING_VALUE1=3;
							else line.RATING_VALUE1 = 2;
						}
						else{
							line.RATE1 = result.data[0].RATE;
							//check the total mode to prevent a call loop.
							if(totalMode!==1){ 
								line.RATING_VALUE1 = result.data[0].VALUE;
								autoSummary(line);
							}
						}
					}
				}
			});
		}
		else if(line.SCORE_TYPE1===8){
			switch(valueToRate){
				case 4: line.RATE1= 'Excellent';
						line.RATING_VALUE1 = valueToRate;
						autoSummary(line);
						break;
				case 3: line.RATE1= 'Good';
						line.RATING_VALUE1 = valueToRate;
						autoSummary(line);
						break;
				case 2: line.RATE1= 'Fair';
						line.RATING_VALUE1 = valueToRate;
						autoSummary(line);
						break;
				case 1: line.RATE1= 'Poor';
						line.RATING_VALUE1 = valueToRate;
						autoSummary(line);
						break;
				default: break;
			}
		}
	
	}

	//The same as the autoRatingValue1 expect that there is no "totalMode" flag
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
						if(line.SCORE_TYPE1 === 3){
							console.log('rating result', result);
							line.RATE2 = result.data[0].RATE;
							if(line.SCORE2<result.data[0].FROM_VALUE) line.RATING_VALUE2 = 1;
							else if(line.SCORE2>result.data[0].TO_VALUE) line.RATING_VALUE2 = 3;
							else line.RATING_VALUE2 = 2;
						}
						else{
							line.RATE2 = result.data[0].RATE;
							line.RATING_VALUE2 = result.data[0].VALUE;
						}
						
					}
				}
			});
		}
		else if(line.SCORE_TYPE2===8){
			switch(valueToRate){
				case 4: line.RATE2= 'Excellent';
						line.RATING_VALUE2 = 4;
						break;
				case 3: line.RATE2= 'Good';
						line.RATING_VALUE2 = 3;
						break;
				case 2: line.RATE2= 'Fair';
						line.RATING_VALUE2 = 2;
						break;
				case 1: line.RATE2= 'Poor';
						line.RATING_VALUE2 = 1;
						break;
				default: break;
			}
		}				
	}
	//End Auto rating functions
	//

	//autoLineSummary(): special summary function to rate for the SCORE_TPE 9,17,18,19
	//
	//input: the line needed to summary.
	//
	$scope.autoLineSummary = function(line){
		if(line.SCORE_TYPE1 === 7 || line.SCORE_TYPE1 === 9 || line.SCORE_TYPE1 === 17 || line.SCORE_TYPE1 === 18 || line.SCORE_TYPE1 === 19){
			if(line.RATING_VALUE1 === '0'){
				line.RATE1 = "Unable";
			}
			else if(line.RATING_VALUE1 === '1'){
				line.RATE1 = "Partial";
			}
			else if(line.RATING_VALUE1 === '2'){
				line.RATE1 = "Able";
			}
			autoSummary(line);
		}
		
	}
	// autosummary(): auto fill data function for the summary line type
	//
	// input: the line that needed summary
	var autoSummary = function(line){
		console.log('this is line satis', line);
		var sectionId = line.SECTION_ID;
		var lineId = line.LINE_ID;
		var detailNeedChanged = {};  //store the specific detail refer to the input line
		var lineTotalInSummary = {}; //will store the summary line result total
		//loop through all the header to find the line that having the detail refer to the input line
		for(var i = 0; i<$scope.header.sections.length; i++){
			if($scope.header.sections[i].SECTION_ID === sectionId){
				for(var j=0; j<$scope.header.sections[i].lines.length; j++){
					if($scope.header.sections[i].lines[j].LineType===1){
						//store the result line
						lineTotalInSummary = $scope.header.sections[i].lines[j];
						for(var k=0; k<$scope.header.sections[i].lines[j].details.length; k++){
							if($scope.header.sections[i].lines[j].details[k].LineTestRefer===lineId){
								//store the detail refer to the input line
								detailNeedChanged = $scope.header.sections[i].lines[j].details[k];
								break;
							}
						}
						break;
					}
				}
				break;
			}
		}
		//update the detail info
		detailNeedChanged.VAL1_VALUE = line.RATING_VALUE1;
		detailNeedChanged.VAL2_VALUE = line.RATE1;

		//re-calculate the rsult of the summary line contain the just-changed detail
		var lineTotal = 0;
		for(var m=0; m<lineTotalInSummary.details.length; m++){
			if(lineTotalInSummary.details[m].VAL1_VALUE !== null && lineTotalInSummary.details[m].VAL1_VALUE !== ''){
				lineTotal += lineTotalInSummary.details[m].VAL1_VALUE*1;
			}
			else lineTotal+= 0;
		}

		//take that line total result, set totalMode and call the autoRating for the summary line.
		lineTotalInSummary.RATING_VALUE1 = lineTotal;
		var totalMode = 1;
		console.log('this is lineTotalInSummary',lineTotalInSummary);
		autoRatingVal1(lineTotalInSummary, lineTotalInSummary.RATING_VALUE1*1, totalMode);
	}
	// End auto summary functions

	//Validation functions
	//End Validation functions

	$scope.showSignature = function(){
		$scope.isSignatureShow = true;
	}
	$scope.okClick = function () {
        $scope.isSignatureShow = false;
    }
    $scope.cancelClick = function () {
        $scope.isSignatureShow = false;
    }
    $scope.clearClick = function () {
        $scope.header.PATIENT_SIGN = '';
    } 

    //newFASubmit(): submit new Functional Assessment Record to the system
    //
    //input: the whole $scope.header variable (contain all the record info)
    //result: success or not
    $scope.newFASubmit = function(){
    	//set validation process flag to true
    	$scope.clickedValidation = true;
    	if($scope.FAForm.$invalid){
    		toastr.error('Invalid fields!','Error!');
    	}
    	else{
    		//cal the function to populate the whole header to the correct format
    		var insertInfo = getInsertInformation($scope.header);
    		console.log('this is insert info', insertInfo);
    		//do the insert
	    	DocumentService.insertNewFA(insertInfo).then(function(result){
	    		if(result.status==='success') {
	    			$scope.editMode=true;
	    			toastr.success('Functional Assessment Submitted!','Success!');
	    			init();
	    		}
	    		else toastr.error('Failed to submit functional assessment!','Error!');
	    	})
    	}
    	
    }

    //faUpdate(): update the existed functional assessment record in the system
    //
    //input: the whole $scope.header contain the updated info.
    //result: success or not
    $scope.faUpdate = function(){
    	$scope.clickedValidation = true;
    	if($scope.FAForm.$invalid){
    		toastr.error('Invalid fields!','Error!');
    	}
    	else{
    		var updateInfo = getInsertInformation($scope.header);
	    	DocumentService.updateNewFA(updateInfo, patient_id, cal_id).then(function(result){
	    		if(result.status==='success') {
	    			toastr.success('Functional assessment updated!','Success!');

	    		}
	    		else toastr.error('Failed to update functional assessment!','Error!');
	    	})
    	}
	    	
    }


    //getInsertInformation(): take the whole header and populate it to the format for easier insert or update operating.
    //
    //input: the whole header.
    //output: the populated data that contain the header, the list of sections, lines, details, comments need to insert or update
    var getInsertInformation = function(header){
    	//create some variable to store the populated result
    	var insertHeader = {};
		var insertSections = [];
		var insertLines = [];
		var insertDetails = [];
		var insertComments = [];
		var dateFormatString = "YYYY-MM-DD hh:mm:ss";
    	//config and populate the header
    	var tmpHeader = angular.copy(header);
    	delete tmpHeader.sections;
    	if($scope.editMode===false){
    		tmpHeader.Creation_date = moment().format(dateFormatString);
    	}
    	else{
    		tmpHeader.Creation_date = moment(tmpHeader.Creation_date).format(dateFormatString);
    	}
    	tmpHeader.Last_update_date = moment().format(dateFormatString);
    	insertHeader = tmpHeader;
    	//config and populate sections
    	for(var i=0; i<header.sections.length; i++){
    		var tmpSection = angular.copy(header.sections[i]);
    		delete tmpSection.lines;
    		if($scope.editMode===false){
	    		tmpSection.Creation_date = moment().format(dateFormatString);
	    	}
	    	else{
	    		tmpSection.Creation_date = moment(tmpSection.Creation_date).format(dateFormatString);
	    	}
			tmpSection.Last_update_date = moment().format(dateFormatString);

    		insertSections.push(tmpSection);
    		//config and populate the lines
    		for(var j=0; j<header.sections[i].lines.length; j++){
    			var tmpLine = angular.copy(header.sections[i].lines[j]);
    			delete tmpLine.details;
    			delete tmpLine.comments;
    			delete tmpLine.previewPath;
    			if($scope.editMode===false){
		    		tmpLine.Creation_date = moment().format(dateFormatString);
		    	}
		    	else{
		    		tmpLine.Creation_date = moment(tmpLine.Creation_date).format(dateFormatString);
		    	}
		    	tmpLine.Last_update_date = moment().format(dateFormatString);
		    	insertLines.push(tmpLine);
		    	//config and populate the details
		    	for(var k=0; k<header.sections[i].lines[j].details.length; k++){
		    		var tmpDetail = angular.copy(header.sections[i].lines[j].details[k]);
		    		delete tmpDetail.previewPath;
		    		if($scope.editMode===false){
			    		tmpDetail.Creation_date = moment().format(dateFormatString);			    	}
			    	else{
			    		tmpDetail.Creation_date = moment(tmpDetail.Creation_date).format(dateFormatString);
			    	}
			    	tmpDetail.Last_update_date = moment().format(dateFormatString);
			    	insertDetails.push(tmpDetail);
		    	}
		    	//config and populate the comments
		    	for(var m=0; m<header.sections[i].lines[j].comments.length; m++){
		    		var tmpComment= angular.copy(header.sections[i].lines[j].comments[m]);
		    		if($scope.editMode===false){
			    		tmpComment.Creation_date = moment().format(dateFormatString);
			    	}
			    	else{
			    		tmpComment.Creation_date = moment(tmpComment.Creation_date).format(dateFormatString);
			    	}
			    	tmpComment.Last_update_date = moment().format(dateFormatString);
			    	insertComments.push(tmpComment);
		    	}
    		}

    	}
    	//get all the populated informations into a variable
    	var submitInformations = {
			infoHeader: insertHeader,
			infoSections: insertSections,
			infoLines: insertLines,
			infoDetails: insertDetails,
			infoComments: insertComments,
		}

		return submitInformations;
    }
	//End Process functions

});