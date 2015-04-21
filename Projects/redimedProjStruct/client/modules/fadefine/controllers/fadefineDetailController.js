angular.module('app.loggedIn.fadefine.detail.controller',[])
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
		$scope.header.sections.push(newSection);
	}

	$scope.removeSection = function(section){
		var indexToRemove = $scope.header.sections.indexOf(section);
		$scope.header.sections.splice(indexToRemove,1);
	}

	$scope.addLine = function(section){
		var newLine = angular.copy(line_init);
		section.lines.push(newLine);
	}

	$scope.removeLine = function(section, line){
		var indexToRemove = section.lines.indexOf(line);
		section.lines.splice(indexToRemove,1);
	}

	$scope.addDetail = function(line){
		var newDetail = angular.copy(line_detail_init);
		line.details.push(newDetail);
	}

	$scope.removeDetail = function(detail, line){
		var indexToRemove = line.details.indexOf(detail);
		line.details.splice(indexToRemove,1);
	}

	$scope.addComment = function(line){
		var newComment = angular.copy(line_comment_init);
		line.comments.push(newComment);
	}

	$scope.removeComment = function(comment, line){
		var indexToRemove = line.comments.indexOf(comment);
		line.comments.splice(indexToRemove,1);
	}

	$scope.value1TypeWatch = function(detail, val1_type){
		console.log('run');
		if(val1_type===0){
			detail.VAL1_ISVALUE = 1;
			detail.VAL1_ISCHECKBOX = null;
			detail.VAL1_CHECKBOX = null;
		}
		else{
			detail.VAL1_ISVALUE = null;
			detail.VAL1_ISCHECKBOX = $scope.val1_type;
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
			detail.VAL2_ISCHECKBOX = $scope.val2_type;
		}
	}
});