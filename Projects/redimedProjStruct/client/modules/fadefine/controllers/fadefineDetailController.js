angular.module('app.loggedIn.fadefine.detail.controller',['ngDraggable'])
.controller("FaDefineDetailController", function($scope, ConfigService, FaHeaderModel, FaSectionModel, FaLineModel, FaLineDetailModel, FaCommentModel){

	//init header definition
	$scope.header = angular.copy(FaHeaderModel);
	$scope.header.sections = [];
	//init section definition
	var section_init = angular.copy(FaSectionModel);
	section_init.lines = [];
	//init line definition
	var line_init = angular.copy(FaLineModel);
	line_init.details = [];
	line_init.comments = [];
	//init line detail
	var line_detail_init = angular.copy(FaLineDetailModel);
	//init line comment
	var line_comment_init = angular.copy(FaCommentModel);

	//form init
	$scope.oneAtATime = false;
	$scope.score_type_opt = ConfigService.score_type_option();
	$scope.comment_type_opt = ConfigService.comment_type_option();
	$scope.value_type_opt = ConfigService.value_type_option();
	ConfigService.rank_type_option().then(function(result){
		$scope.rating_type_opt = result.list;
	});

	//functions
	$scope.addSection = function(){
		var newSection = angular.copy(section_init);
		newSection.SECTION_NAME = "Untitled Section";
		$scope.header.sections.push(newSection);
	}

	$scope.removeSection = function(section){
		var indexToRemove = $scope.header.sections.indexOf(section);
		$scope.header.sections.splice(indexToRemove,1);
	}

	$scope.addLine = function(section){
		var newLine = angular.copy(line_init);
		newLine.QUESTION = "Untitled line";
		section.lines.push(newLine);
	}

	$scope.removeLine = function(section, line){
		var indexToRemove = section.lines.indexOf(line);
		section.lines.splice(indexToRemove,1);
	}

	$scope.addDetail = function(line){
		var newDetail = angular.copy(line_detail_init);
		newDetail.QUESTION = "Untitled detail";
		line.details.push(newDetail);
	}

	$scope.removeDetail = function(detail, line){
		var indexToRemove = line.details.indexOf(detail);
		line.details.splice(indexToRemove,1);
	}

	$scope.addComment = function(line){
		var newComment = angular.copy(line_comment_init);
		newComment.NAME = "Untitled comment"
		line.comments.push(newComment);
	}

	$scope.removeComment = function(comment, line){
		var indexToRemove = line.comments.indexOf(comment);
		line.comments.splice(indexToRemove,1);
	}

	$scope.value1TypeWatch = function(detail, val1_type){
		if(val1_type===0){
			detail.VAL1_ISVALUE = 1;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
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
	}

	$scope.value2TypeWatch = function(detail, val2_type){
		if(val2_type===0){
			detail.VAL2_ISVALUE = 1;
			detail.VAL2_ISCHECKBOX = null;
			detail.VAL2_CHECKBOX = null;
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

	//DRAG AND DROP FUNCTIONS
	$scope.onDropComplete = function(index, movedSection, event, replacedSection, header){
		var movedSection = movedSection;
		var replacedSection = replacedSection;
		var oldIndex = header.sections.indexOf(movedSection);
		var newIndex = index;
		header.sections[oldIndex] = replacedSection;
		header.sections[newIndex] = movedSection;

	}


	//INSERT DEFINITION
	$scope.addFaDefinition = function(){
		console.log($scope.header);
	}
});