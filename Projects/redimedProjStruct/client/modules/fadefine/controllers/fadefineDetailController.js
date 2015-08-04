angular.module('app.loggedIn.fadefine.detail.controller',['ngDraggable'])
.controller("FaDefineDetailController", function($scope, $stateParams, $state, $modal, ConfigService, FaHeaderModel, FaSectionModel, FaLineModel, FaLineDetailModel, FaCommentModel, FaDefineService, toastr, moment){
	//init action
	if($stateParams.action==='edit'){
		$scope.isEdit = true;
	}
	else{
		$scope.isEdit = false;
	}
	//init header definition
	$scope.header = angular.copy(FaHeaderModel);
	$scope.header.ISENABLE = 1;
	$scope.header.FA_NAME = "Untitled Function Assessment Header";
	$scope.header.Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
	$scope.header.sections = [];
	//init section definition
	var section_init = angular.copy(FaSectionModel);
	section_init.ISENABLE=1;
	section_init.lines = [];
	//init line definition
	var line_init = angular.copy(FaLineModel);
	line_init.ISENABLE = 1;
	line_init.details = [];
	line_init.comments = [];
	//init line detail
	var line_detail_init = angular.copy(FaLineDetailModel);
	line_detail_init.ISENABLE = 1;
	//init line comment
	var line_comment_init = angular.copy(FaCommentModel);
	line_comment_init.ISENABLE = 1;

	//form init
	$scope.oneAtATime = false;
	$scope.score_type_opt = ConfigService.score_type_option();
	$scope.comment_type_opt = ConfigService.comment_type_option();
	$scope.value_type_opt = ConfigService.value_type_option();
	$scope.section_display_type_opt = ConfigService.section_display_type_option();
	ConfigService.rank_type_option().then(function(result){
		$scope.rating_type_opt = result.list;
	});

	

	$scope.isSectionDropable = true;

	//get header if stateParams.action = edit
	if($stateParams.action === 'edit' && !!$stateParams.headerId){
		var getHeaderId = $stateParams.headerId;
		FaDefineService.getHeaderAndSection(getHeaderId).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
				$scope.header.action = 'edit';
				//get lines of section
				$scope.header.sections.forEach(function(section){
					section.action='edit';
					FaDefineService.getLines(section.SECTION_ID, getHeaderId).then(function(lineRes){
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
								line.action = 'edit';
								FaDefineService.getDetailsAndComments(line.LINE_ID).then(function(detailAndCommentRes){
									if(detailAndCommentRes.status === 'error'){
										$scope.header={};
										toastr.error('Unexpected error', 'Error!');
									}
									else{
										line.details = detailAndCommentRes.data.details;
										line.comments = detailAndCommentRes.data.comments;
										line.details.forEach(function(detail){
											detail.action = 'edit';
											if(detail.PICTURE!==null){
												var strarr = detail.PICTURE.split("\\");
												var fileName = strarr[strarr.length-1];
												detail.previewPath = "https://"+location.host+"/document/fa/images/"+fileName;
											} 
										})
										line.comments.forEach(function(comment){
											comment.action = 'edit'
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
	else if($stateParams.action==='add' && $stateParams.headerId!==0){
		var getHeaderId = $stateParams.headerId;
		FaDefineService.getHeaderAndSection(getHeaderId).then(function(headerAndSectionRes){
			if(headerAndSectionRes.status === 'error') toastr.error('Unexpected error', 'Error!');
			else{
				$scope.header = headerAndSectionRes.data;
				$scope.header.FA_ID = null;
				$scope.header.Created_by = null;
				$scope.header.Creation_date = null;
				$scope.header.Last_updated_by = null; 
				$scope.header.Last_update_date = null;
				$scope.header.sections.forEach(function(section){
					var sectionId = angular.copy(section.SECTION_ID);
					section.SECTION_ID = null;
					section.FA_ID = null;
					section.Created_by = null;
					section.Creation_date = null;
					section.Last_updated_by = null; 
					section.Last_update_date = null;
					FaDefineService.getLines(sectionId, getHeaderId).then(function(lineRes){
						if(lineRes.status==='error') {
							$scope.header={};
							toastr.error('Unexpected error', 'Error!');
						}
						else{
							section.lines=lineRes.data;
							section.lines.forEach(function(line){
								var lineId = angular.copy(line.LINE_ID);
								line.LINE_ID = null;
								line.SECTION_ID = null;
								line.FA_ID = null;
								line.Created_by = null;
								line.Creation_date = null;
								line.Last_updated_by = null; 
								line.Last_update_date = null;
								if(line.PICTURE!==null){
									var strarr = line.PICTURE.split("\\");
									var fileName = strarr[strarr.length-1];
									line.previewPath = "https://"+location.host+"/document/fa/images/"+fileName;
								} 
								FaDefineService.getDetailsAndComments(lineId).then(function(detailAndCommentRes){
									if(detailAndCommentRes.status === 'error'){
										$scope.header={};
										toastr.error('Unexpected error', 'Error!');
									}
									else{
										line.details = detailAndCommentRes.data.details;
										line.comments = detailAndCommentRes.data.comments;
										line.details.forEach(function(detail){
											detail.DETAIL_ID = null;
											detail.LINE_ID = null;
											detail.Created_by = null;
											detail.Creation_date = null;
											detail.Last_updated_by = null; 
											detail.Last_update_date = null;
											if(detail.PICTURE!==null){
												var strarr = detail.PICTURE.split("\\");
												var fileName = strarr[strarr.length-1];
												detail.previewPath = "https://"+location.host+"/document/fa/images/"+fileName;
											}
										})
										line.comments.forEach(function(comment){
											comment.FA_COMMENT_ID = null;
											comment.LINE_ID = null;
											comment.Created_by = null;
											comment.Creation_date = null;
											comment.Last_updated_by = null; 
											comment.Last_update_date = null;
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

	//functions
	$scope.addSection = function(){
		var newSection = angular.copy(section_init);
		if($scope.isEdit === true) newSection.action = 'add';
		newSection.SECTION_NAME = "Untitled Section";
		newSection.Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
		$scope.header.sections.push(newSection);
	}

	$scope.removeSection = function(section){
		var indexToRemove = $scope.header.sections.indexOf(section);
		if($scope.isEdit===false) {
			$scope.header.sections.splice(indexToRemove,1);
		}
		else{
			if(section.action === 'add') $scope.header.sections.splice(indexToRemove,1);
			else {
				section.action='delete';
				for(var k=0; k<section.lines.length; k++){
					if(section.lines[k].action==='add') section.lines.splice(k,1);
					else {
						section.lines[k].action='delete';
						for(var i=0; i<section.lines[k].details.length; i++){
							if(section.lines[k].details[i].action === 'add') section.lines[k].details.splice(i, 1);
							else section.lines[k].details[i].action='delete';
						}
						for(var j=0; j<section.lines[k].comments.length; j++){
							if(section.lines[k].comments[j].action==='add') section.lines[k].comments.splice(j, 1);
							else section.lines[k].comments[j].action='delete';
						}
					}
				}
			}
		}
	}

	$scope.addLine = function(section){
		var newLine = angular.copy(line_init);
		if($scope.isEdit === true) newLine.action = 'add';
		newLine.QUESTION = "Untitled line";
		newLine.Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
		section.lines.push(newLine);
	}

	$scope.removeLine = function(section, line){
		var indexToRemove = section.lines.indexOf(line);
		if($scope.isEdit===false) section.lines.splice(indexToRemove,1);
		else{
			if(line.action === 'add') section.lines.splice(indexToRemove,1);
			else {
				line.action='delete';
				for(var i=0; i<line.details.length; i++){
					if(line.details[i].action === 'add') line.details.splice(i, 1);
					else line.details[i].action='delete';
				}
				for(var j=0; j<line.comments.length; j++){
					if(line.comments[j].action==='add') line.comments.splice(j, 1);
					else line.comments[j].action='delete';
				}
			}
		}	
	}

	$scope.cloneToNewLine = function(section,line){
		var newCloneLine = angular.copy(line);
		newCloneLine.QUESTION = newCloneLine.QUESTION + " (copy)";
		if($scope.isEdit === true) newCloneLine.action = 'add';
		delete newCloneLine.LINE_ID;
		//set all details action to "add"
		for(var i = 0; i<newCloneLine.details.length; i++){
			newCloneLine.details[i].action = "add";
			delete newCloneLine.details[i].DETAIL_ID;
		}
		//set all comments action to "add";
		for(var j = 0; j<newCloneLine.comments.length; j++){
			newCloneLine.comments[j].action = "add";
			delete newCloneLine.comments[j].FA_COMMENT_ID;
		}
		section.lines.push(newCloneLine);
	}

	$scope.addDetail = function(line){
		var newDetail = angular.copy(line_detail_init);
		if($scope.isEdit === true) newDetail.action = 'add';
		newDetail.QUESTION = "Untitled detail";
		newDetail.Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
		line.details.push(newDetail);
	}

	$scope.removeDetail = function(detail, line){
		var indexToRemove = line.details.indexOf(detail);
		if($scope.isEdit===false) line.details.splice(indexToRemove,1);
		else{
			if(detail.action==='add') line.details.splice(indexToRemove,1);
			else detail.action = 'delete';
		}
	}

	$scope.addComment = function(line){
		var newComment = angular.copy(line_comment_init);
		if($scope.isEdit === true) newComment.action='add';
		newComment.NAME = "Untitled comment"
		line.comments.push(newComment);
	}

	$scope.removeComment = function(comment, line){
		var indexToRemove = line.comments.indexOf(comment);
		if($scope.isEdit === false) line.comments.splice(indexToRemove,1);
		else{
			if(comment.action==='add') line.comments.splice(indexToRemove,1);
			else comment.action='delete';
		}
	}

	$scope.value1TypeWatch = function(detail, val1_type){
		if(val1_type===0){
			detail.VAL1_ISVALUE = 1;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
		}
		else if(val1_type===-1){
			detail.VAL1_NAME=null;
			detail.VAL1_ISVALUE=null;
			detail.VAL1_VALUE=null;
			detail.VAL1_ISCHECKBOX=null;
			detail.VAL1_CHECKBOX=null;
			detail.VAL1_ISCOMMENT_WHEN_YES = null;
			detail.VAL1_ISCOMMENT_WHEN_NO = null;
			detail.VAL1_VALUE_IS_NUMBER = null;
		}
		else if(val1_type===7){
			detail.VAL1_ISVALUE = val1_type;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
			detail.VAL1_NAME = 'Weight';
			detail.VAL1_VALUE_IS_NUMBER = 1;
		}
		else if(val1_type===8){
			detail.VAL1_ISVALUE = val1_type;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
			detail.VAL1_NAME = 'Distance';
			detail.VAL1_VALUE_IS_NUMBER = 1;
		}
		else if(val1_type===9){
			detail.VAL1_ISVALUE = val1_type;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
			detail.VAL1_NAME = 'Height';
			detail.VAL1_VALUE_IS_NUMBER = 1;
		}
		else if(val1_type===10){
			detail.VAL1_ISVALUE = val1_type;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
			detail.VAL1_NAME = 'Weight';
			detail.VAL1_VALUE_IS_NUMBER = 1;
		}
		else{
			detail.VAL1_ISVALUE = null;
			detail.VAL1_VALUE_IS_NUMBER = null;
			detail.VAL1_ISCHECKBOX = val1_type;
		}

		if(val1_type!==1){
			detail.VAL1_ISCOMMENT_WHEN_YES = null;
			detail.VAL1_ISCOMMENT_WHEN_NO = null;
		}
		console.log($scope.header);
	}

	$scope.value2TypeWatch = function(detail, val2_type){
		if(val2_type===0){
			detail.VAL2_ISVALUE = 1;
			detail.VAL2_ISCHECKBOX = null;
			detail.VAL2_CHECKBOX = null;
		}
		else if(val2_type===-1){
			detail.VAL2_NAME=null;
			detail.VAL2_ISVALUE=null;
			detail.VAL2_VALUE=null;
			detail.VAL2_ISCHECKBOX=null;
			detail.VAL2_CHECKBOX=null;
			detail.VAL2_ISCOMMENT_WHEN_YES = null;
			detail.VAL2_ISCOMMENT_WHEN_NO = null;
			detail.VAL2_VALUE_IS_NUMBER = null;
		}
		else if(val2_type===7){
			detail.VAL2_ISVALUE = val2_type;
			detail.VAL2_ISCHECKBOX = null;
			detail.VAL2_CHECKBOX = null;
			detail.VAL2_NAME = 'Weight';
			detail.VAL2_VALUE_IS_NUMBER = 1;
		}
		else if(val2_type===8){
			detail.VAL2_ISVALUE = val2_type;
			detail.VAL2_ISCHECKBOX = null;
			detail.VAL2_CHECKBOX = null;
			detail.VAL2_NAME = 'Distance';
			detail.VAL2_VALUE_IS_NUMBER = 1;
		}
		else if(val2_type===9){
			detail.VAL2_ISVALUE = val2_type;
			detail.VAL2_ISCHECKBOX = null;
			detail.VAL2_CHECKBOX = null;
			detail.VAL2_NAME = 'Height';
			detail.VAL2_VALUE_IS_NUMBER = 1;
		}
		else if(val2_type===10){
			detail.VAL2_ISVALUE = val2_type;
			detail.VAL2_ISCHECKBOX = null;
			detail.VAL2_CHECKBOX = null;
			detail.VAL2_NAME = 'Weight';
			detail.VAL2_VALUE_IS_NUMBER = 1;
		}
		else{
			detail.VAL2_ISVALUE = null;
			detail.VAL2_VALUE_IS_NUMBER = null;
			detail.VAL2_ISCHECKBOX = val2_type;
		}

		if(val2_type!==1){
			detail.VAL2_ISCOMMENT_WHEN_YES = null;
			detail.VAL2_ISCOMMENT_WHEN_NO = null;
		}
	}

	$scope.value1TypeInit = function(detail){
		if($stateParams.action!=='add' || ($stateParams.action==='add' && $stateParams.headerId!==0)){
			if((detail.VAL1_ISVALUE===0 ||detail.VAL1_ISVALUE===null) && (detail.VAL1_ISCHECKBOX===0 || detail.VAL1_ISCHECKBOX===null)){
				return -1;
			}
			else if(detail.VAL1_ISVALUE===7){
				return 7;
			}
			else if(detail.VAL1_ISVALUE===8){
				return 8;
			}
			else if(detail.VAL1_ISVALUE===9){
				return 9;
			}
			else if(detail.VAL1_ISVALUE===10){
				return 10;
			}
			else{
				if(detail.VAL1_ISVALUE===1) return 0;
				else return detail.VAL1_ISCHECKBOX;
			}
		}
		else return -1;
	}

	$scope.value2TypeInit = function(detail){
		if($stateParams.action!=='add' || ($stateParams.action==='add' && $stateParams.headerId!==0)){
			if((detail.VAL2_ISVALUE===0 ||detail.VAL2_ISVALUE===null) && (detail.VAL2_ISCHECKBOX===0 || detail.VAL2_ISCHECKBOX===null)){
				return -1;
			}
			else if(detail.VAL2_ISVALUE===7){
				return 7;
			}
			else if(detail.VAL2_ISVALUE===8){
				return 8;
			}
			else if(detail.VAL2_ISVALUE===9){
				return 9;
			}
			else if(detail.VAL2_ISVALUE===10){
				return 10;
			}
			else{
				if(detail.VAL2_ISVALUE===1) return 0;
				else return detail.VAL2_ISCHECKBOX;
			}
		}
		else return -1;
	}

	$scope.IsCommentTextWatch = function(detail, IsCommentTextValue){
		if(IsCommentTextValue === '0'){
			detail.VAL1_ISCOMMENT_WHEN_YES = null;
			detail.VAL1_ISCOMMENT_WHEN_NO = null;
			detail.VAL2_ISCOMMENT_WHEN_YES = null;
			detail.VAL2_ISCOMMENT_WHEN_NO = null;
		}
	}

	$scope.moveDetailUp = function(detail, line){
		var index = line.details.indexOf(detail);
		line.details.splice(index, 1);
		line.details.splice(index-1, 0, detail);
	}

	$scope.moveDetailDown = function(detail, line){
		var index = line.details.indexOf(detail);
		line.details.splice(index, 1);
		line.details.splice(index+1, 0, detail);
	}

	$scope.moveCommentUp = function(comment, line){
		var index = line.comments.indexOf(comment);
		line.comments.splice(index, 1);
		line.comments.splice(index-1, 0, comment);
	}
	$scope.moveCommentDown = function(comment, line){
		var index = line.comments.indexOf(comment);
		line.comments.splice(index, 1);
		line.comments.splice(index+1, 0, comment);
	}
	$scope.moveLineUp = function(line, section){
		var index = section.lines.indexOf(line);
		section.lines.splice(index,1);
		section.lines.splice(index-1, 0, line);
	}
	$scope.moveLineDown = function(line, section){
		var index = section.lines.indexOf(line);
		section.lines.splice(index,1);
		section.lines.splice(index+1, 0, line);
	}

	//DRAG AND DROP FUNCTIONS
	$scope.onSectionDropComplete = function(index, movedSection, event, replacedSection, header){
		var movedSection = movedSection;
		var replacedSection = replacedSection;
		var oldIndex = header.sections.indexOf(movedSection);
		var newIndex = index;
		header.sections[oldIndex] = replacedSection;
		header.sections[newIndex] = movedSection;

	}

	//INSERT DEFINITION
	$scope.addFaDefinition = function(){
		if($scope.header.sections.length===0) toastr.error('Functional Assessment must have at least one section','Error!');
		else{
			addOrder($scope.header).then(function(result){
				FaDefineService.insertFa($scope.header).then(function(res){
					if(res.status==='success') {
						toastr.success('New functional assessment definition added','Success!');
						$state.go('loggedIn.fadefine.list');
					}
					else toastr.error('Failed to add new functional assessment definition', 'Error!');
				});
			}, function(error){
				console.log(error);
			});
		}
		
	}

	//EDIT DEFINITION
	$scope.editDefinition = function(){
		if($scope.header.sections.length===0) toastr.error('Functional Assessment must have at least one section','Error!');
		else{
			addOrder($scope.header).then(function(result){
				console.log(result);
				FaDefineService.editFa(result).then(function(res){
					if(res.status==='success') {
						toastr.success('Edit successfully!','Success!');
						$state.go('loggedIn.fadefine.list');
					}
					else toastr.error('Edit failed!', 'Error!');
				})
			})
		}
	}

	//GENERAL DEFINITION FUNCTION
	// var addOrder = function(header){
	// 	return new Promise(function(resolve, reject){
	// 		header.sections.forEach(function(section){
	// 			section.ORD = header.sections.indexOf(section) + 1;
	// 			section.lines.forEach(function(line){
	// 				line.ORD = section.lines.indexOf(line) + 1;
	// 				line.details.forEach(function(detail){
	// 					detail.ORD = line.details.indexOf(detail) + 1;
	// 					if(detail.ORD === line.details.length){
	// 						resolve(header);
	// 					}
	// 				})
	// 			})
	// 		})
	// 	})
	// }

	var addOrder = function(header){
		return new Promise(function(resolve, reject){
			if($scope.isEdit===false) header.Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
			else {
				if(header.Creation_date=== '') header.Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
				else header.Creation_date = moment(header.Creation_date).format('YYYY-MM-DD hh:mm:ss');
				header.Last_update_date = moment().format('YYYY-MM-DD hh:mm:ss');
			}
			for(var i = 0; i<header.sections.length; i++){
				header.sections[i].ORD = i+1;
				if($scope.isEdit===false) header.sections[i].Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
				else {
					if(header.sections[i].Creation_date=== '') header.sections[i].Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
					else header.sections[i].Creation_date = moment(header.sections[i].Creation_date).format('YYYY-MM-DD hh:mm:ss');
					header.sections[i].Last_update_date = moment().format('YYYY-MM-DD hh:mm:ss');
				}
				if(header.sections[i].lines.length===0){
					if(i===header.sections.length-1) resolve(header);
					else continue;
				}
				else{

					for(var j = 0; j < header.sections[i].lines.length; j++){
						header.sections[i].lines[j].ORD = j+1;
						if(header.sections[i].lines[j].previewPath) delete header.sections[i].lines[j].previewPath;
						if($scope.isEdit===false) header.sections[i].lines[j].Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
						else {
							if(header.sections[i].lines[j].Creation_date=== '') header.sections[i].lines[j].Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
							else header.sections[i].lines[j].Creation_date = moment(header.sections[i].lines[j].Creation_date).format('YYYY-MM-DD hh:mm:ss');
							header.sections[i].lines[j].Last_update_date = moment().format('YYYY-MM-DD hh:mm:ss');
						}
						if(header.sections[i].lines[j].details.length===0){
							if(j === header.sections[i].lines.length - 1 && i === header.sections.length-1) resolve(header);
							else continue;
						}

						else{
							for(var k = 0; k<header.sections[i].lines[j].details.length; k++){
								header.sections[i].lines[j].details[k].ORD = k+1;
								if(header.sections[i].lines[j].details[k].previewPath) delete header.sections[i].lines[j].details[k].previewPath;
								if($scope.isEdit===false) header.sections[i].lines[j].details[k].Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
								else {
									if(header.sections[i].lines[j].details[k].Creation_date=== '') header.sections[i].lines[j].details[k].Creation_date = moment().format('YYYY-MM-DD hh:mm:ss');
									else header.sections[i].lines[j].details[k].Creation_date = moment(header.sections[i].lines[j].details[k].Creation_date).format('YYYY-MM-DD hh:mm:ss'); 
									header.sections[i].lines[j].details[k].Last_update_date = moment().format('YYYY-MM-DD hh:mm:ss');
									
								}
								if(k === header.sections[i].lines[j].details.length-1 && j === header.sections[i].lines.length - 1 && i === header.sections.length-1) resolve(header);
								else continue;
							}
						}
					}
				}
			}
		})
	}

	$scope.openModal = function(data){
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'modules/fadefine/views/imageModal.html',
          controller: 'ImageDialogController',
          size: 'lg'
          // resolve: {
          //   items: function () {
          //     return $scope.items;
          //   }
          // }
        });

        modalInstance.result.then(function (selectedImg) {
	    	data.PICTURE = selectedImg.realPath;
	    	if(selectedImg.previewPath && selectedImg.previewPath!==null && selectedImg.previewPath!=="") data.previewPath = selectedImg.previewPath;
	    	else delete data.previewPath;
	    });
    }


});