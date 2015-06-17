angular.module("app.loggedIn.document.newFA.controllers",[])
.controller('newFAController', function($scope, $stateParams, DocumentService, PatientService, toastr, moment){
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
	$scope.patient_info = {};
	$scope.isSignatureShow = false;
	$scope.clickedValidation = false;

	
	//End Init params

	//Functions for Init
	var getNewFA = function(fa_id){
		var getHeaderId = fa_id;
		DocumentService.loadNewHeaderSections(getHeaderId).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
				$scope.header.PATIENT_ID = patient_id;
				$scope.header.CAL_ID = cal_id;
				$scope.header.ASSESSED_SIGN = '';
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

	var getExistFA = function(fa_id, patient_id, cal_id){
		var getHeaderId = fa_id;
		DocumentService.loadExistHeaderSections(getHeaderId, patient_id, cal_id).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
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

	// Init function
	var init = function(){
		checkExistFA(fa_id, patient_id,cal_id);
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
			autoRatingVal1(line, line.SCORE1, 0);
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
		}
	}

	$scope.autoCalculationVal1 = function(line,detail){
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
		}	
		if(line.SCORE_TYPE1 === 9 && detail.QUESTION.toLowerCase() === 'job demand (kgs)'){
			var default_details_value = line.details[0].VAL1_VALUE;
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
		else if(line.SCORE_TYPE1 === 7 && detail.QUESTION.toLowerCase() === 'job demand'){
			var default_details_value = line.details[0].VAL1_VALUE;
			var start_value = 5;
			if(line.details[0].QUESTION.toLowerCase() === "job demand" && line.details.length === 2){
				line.details[1].VAL1_VALUE = angular.copy(default_details_value);
			}
		}
		if(line.ISSCORE1===1){
			switch(line.SCORE_TYPE1){
				case 3: calculateFunctionsVal1.calAvg(line);
						break;
				case 9: line.SCORE1= line.details[line.details.length-1].VAL1_VALUE;
						break;
				case 10: calculateFunctionsVal1.calMax(line);
							break;
				case 11: calculateFunctionsVal1.calMin(line);
							break;
				case 8: autoRatingVal1(line, line.SCORE1*1, 0);
							break;
				default: line.SCORE1= line.details[line.details.length-1].VAL1_VALUE;
						autoRatingVal1(line, line.SCORE1, 0);
							break;
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
	//End Auto calculate functions

	//Auto rating functions
	var autoRatingVal1 = function(line, valueToRate,totalMode){
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
						if(line.SCORE_TYPE1 === 3){
							console.log('rating result', result);
							line.RATE1 = result.data[0].RATE;
							if(line.details[0].VAL1_VALUE==="L"){
								if(line.SCORE1<result.data[0].FROM_VALUE) line.comments[0].VALUE = 1;
								else if(line.SCORE1>result.data[0].TO_VALUE) line.comments[0].VALUE = 3;
								else line.comments[0].VALUE = 2;
							}
							else {
								if(line.SCORE2<result.data[0].FROM_VALUE) line.comments[0].VALUE = 1;
								else if(line.SCORE2>result.data[0].TO_VALUE) line.comments[0].VALUE = 3;
								else line.comments[0].VALUE = 2;
							}
						}
						else{
							line.RATE1 = result.data[0].RATE;
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
							if(line.details[0].VAL1_VALUE==="L"){
								if(line.SCORE1<result.data[0].FROM_VALUE) line.comments[0].VALUE = 1;
								else if(line.SCORE1>result.data[0].TO_VALUE) line.comments[0].VALUE = 3;
								else line.comments[0].VALUE = 2;
							}
							else {
								if(line.SCORE2<result.data[0].FROM_VALUE) line.comments[0].VALUE = 1;
								else if(line.SCORE2>result.data[0].TO_VALUE) line.comments[0].VALUE = 3;
								else line.comments[0].VALUE = 2;
							}
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

	// Auto summary functions
	var autoSummary = function(line){
		var sectionId = line.SECTION_ID;
		var lineId = line.LINE_ID;
		var detailNeedChanged = {};
		var lineTotalInSummary = {};
		for(var i = 0; i<$scope.header.sections.length; i++){
			if($scope.header.sections[i].SECTION_ID === sectionId){
				for(var j=0; j<$scope.header.sections[i].lines.length; j++){
					if($scope.header.sections[i].lines[j].LineType===1){
						lineTotalInSummary = $scope.header.sections[i].lines[j];
						for(var k=0; k<$scope.header.sections[i].lines[j].details.length; k++){
							if($scope.header.sections[i].lines[j].details[k].LineTestRefer===lineId){
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
		detailNeedChanged.VAL1_VALUE = line.RATING_VALUE1;
		detailNeedChanged.VAL2_VALUE = line.RATE1;

		var lineTotal = 0;
		for(var m=0; m<lineTotalInSummary.details.length; m++){
			if(lineTotalInSummary.details[m].VAL1_VALUE !== null && lineTotalInSummary.details[m].VAL1_VALUE !== ''){
				lineTotal += lineTotalInSummary.details[m].VAL1_VALUE*1;
			}
			else lineTotal+= 0;
		}

		lineTotalInSummary.RATING_VALUE1 = lineTotal;
		var totalMode = 1;
		console.log('this is lineTotalInSummary',lineTotalInSummary);
		autoRatingVal1(lineTotalInSummary, lineTotalInSummary.RATING_VALUE1*1, totalMode);
	}
	// End auto summary functions

	//Validation functions
	//End Validation functions

	//Process functions
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
        $scope.header.ASSESSED_SIGN = '';
    }
    $scope.newFASubmit = function(){
    	$scope.clickedValidation = true;
    	if($scope.FAForm.$invalid){
    		toastr.error('Invalid fields!','Error!');
    	}
    	else{
    		var insertInfo = getInsertInformation($scope.header);
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

    var getInsertInformation = function(header){
    	var insertHeader = {};
		var insertSections = [];
		var insertLines = [];
		var insertDetails = [];
		var insertComments = [];
		var dateFormatString = "YYYY-MM-DD hh:mm:ss";
    	//get submit header
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
    	//get submit sections
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
    		//get submit lines
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
		    	//get submit details
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
		    	//get submit comments
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
    	var submitInformations = {
			insertHeader: insertHeader,
			insertSections: insertSections,
			insertLines: insertLines,
			insertDetails: insertDetails,
			insertComments: insertComments,
		}

		return submitInformations;
    }
	//End Process functions

});