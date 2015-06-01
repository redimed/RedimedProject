angular.module("app.loggedIn.document.newFA.controllers",[])
.controller('newFAController', function($scope, DocumentService, toastr){
	//Init params
	var fa_id=11;
	$scope.header = {};
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
	//End Functions for Init

	// Init function
	var init = function(){
		getNewFA(fa_id);
	}

	init(); //Call init function
	// End Init function

	//Auto calculate functions
	//End Auto calculate functions

	//Auto rating functions
	//End Auto rating functions

	//Validation functions
	//End Validation functions

	//Process functions
	//End Process functions

});