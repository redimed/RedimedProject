angular.module("app.loggedIn.fadefine",["app.loggedIn.fadefine.controller","app.loggedIn.fadefine.service"]).config(function($stateProvider){$stateProvider.state("loggedIn.fadefine",{"abstract":!0,templateUrl:"modules/fadefine/views/home.html",controller:"FaDefineController"}).state("loggedIn.fadefine.list",{url:"/fa/list",views:{"main-content":{templateUrl:"modules/fadefine/views/list.html",controller:"FaDefineListController"}}}).state("loggedIn.fadefine.detail",{url:"/fa/:action/:headerId",views:{"main-content":{templateUrl:"modules/fadefine/views/detail.html",controller:"FaDefineDetailController"}}})}),angular.module("app.loggedIn.fadefine.controller",["app.loggedIn.fadefine.list.controller","app.loggedIn.fadefine.detail.controller","app.loggedIn.fadefine.imageDialog.controller"]).controller("FaDefineController",function($scope){}),angular.module("app.loggedIn.fadefine.list.controller",[]).controller("FaDefineListController",function($scope,$state,FaDefineService,toastr){$scope.fa_panel={};$scope.clickRow=function(item){$state.go("loggedIn.fadefine.detail",{action:"edit",headerId:item.FA_ID})},$scope.fa={select:0,scope:$scope.fa_panel,options:{api:"api/erm/v2/fa/search",method:"post",scope:$scope.fa_panel,columns:[{field:"FA_ID",is_hide:!0},{field:"TYPE",label:"Type"},{field:"FA_NAME",label:"Name"},{label:"Status",type:"status",isEnable:function(item){return item.ISENABLE},disableFn:function($event,item){$event.stopPropagation(),console.log("run here 1"),FaDefineService.changeFaStt(0,item.FA_ID).then(function(res){"success"===res.status&&$scope.fa_panel.reload()})},enableFn:function($event,item){$event.stopPropagation(),console.log("run here 2"),FaDefineService.changeFaStt(1,item.FA_ID).then(function(res){"success"===res.status&&$scope.fa_panel.reload()})}},{type:"button",btnlabel:"Clone to new definition",btnclass:"fa fa-files-o",btnfn:function(item){$state.go("loggedIn.fadefine.detail",{action:"add",headerId:item.FA_ID})}}],use_filters:!0,filters:{TYPE:{type:"text"},FA_NAME:{type:"text"}}}},$scope.newDefine=function(){$state.go("loggedIn.fadefine.detail",{action:"add",headerId:0})}}),angular.module("app.loggedIn.fadefine.detail.controller",["ngDraggable"]).controller("FaDefineDetailController",function($scope,$stateParams,$state,$modal,ConfigService,FaHeaderModel,FaSectionModel,FaLineModel,FaLineDetailModel,FaCommentModel,FaDefineService,toastr,moment){$scope.isEdit="edit"===$stateParams.action?!0:!1,$scope.header=angular.copy(FaHeaderModel),$scope.header.ISENABLE=1,$scope.header.FA_NAME="Untitled Function Assessment Header",$scope.header.Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"),$scope.header.sections=[];var section_init=angular.copy(FaSectionModel);section_init.ISENABLE=1,section_init.lines=[];var line_init=angular.copy(FaLineModel);line_init.ISENABLE=1,line_init.details=[],line_init.comments=[];var line_detail_init=angular.copy(FaLineDetailModel);line_detail_init.ISENABLE=1;var line_comment_init=angular.copy(FaCommentModel);if(line_comment_init.ISENABLE=1,$scope.oneAtATime=!1,$scope.score_type_opt=ConfigService.score_type_option(),$scope.comment_type_opt=ConfigService.comment_type_option(),$scope.value_type_opt=ConfigService.value_type_option(),$scope.section_display_type_opt=ConfigService.section_display_type_option(),ConfigService.rank_type_option().then(function(result){$scope.rating_type_opt=result.list}),$scope.isSectionDropable=!0,"edit"===$stateParams.action&&$stateParams.headerId){var getHeaderId=$stateParams.headerId;FaDefineService.getHeaderAndSection(getHeaderId).then(function(headerAndSectionRes){"error"===headerAndSectionRes.status?toastr.error("Unexpected error","Error!"):($scope.header=headerAndSectionRes.data,$scope.header.action="edit",$scope.header.sections.forEach(function(section){section.action="edit",FaDefineService.getLines(section.SECTION_ID,getHeaderId).then(function(lineRes){"error"===lineRes.status?($scope.header={},toastr.error("Unexpected error","Error!")):(section.lines=lineRes.data,section.lines.forEach(function(line){if(null!==line.PICTURE){var strarr=line.PICTURE.split("\\"),fileName=strarr[strarr.length-1];line.previewPath="https://"+location.host+"/document/fa/images/"+fileName}line.action="edit",FaDefineService.getDetailsAndComments(line.LINE_ID).then(function(detailAndCommentRes){"error"===detailAndCommentRes.status?($scope.header={},toastr.error("Unexpected error","Error!")):(line.details=detailAndCommentRes.data.details,line.comments=detailAndCommentRes.data.comments,line.details.forEach(function(detail){if(detail.action="edit",null!==detail.PICTURE){var strarr=detail.PICTURE.split("\\"),fileName=strarr[strarr.length-1];detail.previewPath="https://"+location.host+"/document/fa/images/"+fileName}}),line.comments.forEach(function(comment){comment.action="edit"}))})}))})}))})}else if("add"===$stateParams.action&&0!==$stateParams.headerId){var getHeaderId=$stateParams.headerId;FaDefineService.getHeaderAndSection(getHeaderId).then(function(headerAndSectionRes){"error"===headerAndSectionRes.status?toastr.error("Unexpected error","Error!"):($scope.header=headerAndSectionRes.data,$scope.header.FA_ID=null,$scope.header.Created_by=null,$scope.header.Creation_date=null,$scope.header.Last_updated_by=null,$scope.header.Last_update_date=null,$scope.header.sections.forEach(function(section){var sectionId=angular.copy(section.SECTION_ID);section.SECTION_ID=null,section.FA_ID=null,section.Created_by=null,section.Creation_date=null,section.Last_updated_by=null,section.Last_update_date=null,FaDefineService.getLines(sectionId,getHeaderId).then(function(lineRes){"error"===lineRes.status?($scope.header={},toastr.error("Unexpected error","Error!")):(section.lines=lineRes.data,section.lines.forEach(function(line){var lineId=angular.copy(line.LINE_ID);if(line.LINE_ID=null,line.SECTION_ID=null,line.FA_ID=null,line.Created_by=null,line.Creation_date=null,line.Last_updated_by=null,line.Last_update_date=null,null!==line.PICTURE){var strarr=line.PICTURE.split("\\"),fileName=strarr[strarr.length-1];line.previewPath="https://"+location.host+"/document/fa/images/"+fileName}FaDefineService.getDetailsAndComments(lineId).then(function(detailAndCommentRes){"error"===detailAndCommentRes.status?($scope.header={},toastr.error("Unexpected error","Error!")):(line.details=detailAndCommentRes.data.details,line.comments=detailAndCommentRes.data.comments,line.details.forEach(function(detail){if(detail.DETAIL_ID=null,detail.LINE_ID=null,detail.Created_by=null,detail.Creation_date=null,detail.Last_updated_by=null,detail.Last_update_date=null,null!==detail.PICTURE){var strarr=detail.PICTURE.split("\\"),fileName=strarr[strarr.length-1];detail.previewPath="https://"+location.host+"/document/fa/images/"+fileName}}),line.comments.forEach(function(comment){comment.FA_COMMENT_ID=null,comment.LINE_ID=null,comment.Created_by=null,comment.Creation_date=null,comment.Last_updated_by=null,comment.Last_update_date=null}))})}))})}))})}$scope.addSection=function(){var newSection=angular.copy(section_init);$scope.isEdit===!0&&(newSection.action="add"),newSection.SECTION_NAME="Untitled Section",newSection.Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"),$scope.header.sections.push(newSection)},$scope.removeSection=function(section){var indexToRemove=$scope.header.sections.indexOf(section);if($scope.isEdit===!1)$scope.header.sections.splice(indexToRemove,1);else if("add"===section.action)$scope.header.sections.splice(indexToRemove,1);else{section.action="delete";for(var k=0;k<section.lines.length;k++)if("add"===section.lines[k].action)section.lines.splice(k,1);else{section.lines[k].action="delete";for(var i=0;i<section.lines[k].details.length;i++)"add"===section.lines[k].details[i].action?section.lines[k].details.splice(i,1):section.lines[k].details[i].action="delete";for(var j=0;j<section.lines[k].comments.length;j++)"add"===section.lines[k].comments[j].action?section.lines[k].comments.splice(j,1):section.lines[k].comments[j].action="delete"}}},$scope.addLine=function(section){var newLine=angular.copy(line_init);$scope.isEdit===!0&&(newLine.action="add"),newLine.QUESTION="Untitled line",newLine.Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"),section.lines.push(newLine)},$scope.removeLine=function(section,line){var indexToRemove=section.lines.indexOf(line);if($scope.isEdit===!1)section.lines.splice(indexToRemove,1);else if("add"===line.action)section.lines.splice(indexToRemove,1);else{line.action="delete";for(var i=0;i<line.details.length;i++)"add"===line.details[i].action?line.details.splice(i,1):line.details[i].action="delete";for(var j=0;j<line.comments.length;j++)"add"===line.comments[j].action?line.comments.splice(j,1):line.comments[j].action="delete"}},$scope.addDetail=function(line){var newDetail=angular.copy(line_detail_init);$scope.isEdit===!0&&(newDetail.action="add"),newDetail.QUESTION="Untitled detail",newDetail.Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"),line.details.push(newDetail)},$scope.removeDetail=function(detail,line){var indexToRemove=line.details.indexOf(detail);$scope.isEdit===!1?line.details.splice(indexToRemove,1):"add"===detail.action?line.details.splice(indexToRemove,1):detail.action="delete"},$scope.addComment=function(line){var newComment=angular.copy(line_comment_init);$scope.isEdit===!0&&(newComment.action="add"),newComment.NAME="Untitled comment",line.comments.push(newComment)},$scope.removeComment=function(comment,line){var indexToRemove=line.comments.indexOf(comment);$scope.isEdit===!1?line.comments.splice(indexToRemove,1):"add"===comment.action?line.comments.splice(indexToRemove,1):comment.action="delete"},$scope.value1TypeWatch=function(detail,val1_type){0===val1_type?(detail.VAL1_ISVALUE=1,detail.VAL1_ISCHECKBOX=null,detail.VAL1_CHECKBOX=null):-1===val1_type?(detail.VAL1_NAME=null,detail.VAL1_ISVALUE=null,detail.VAL1_VALUE=null,detail.VAL1_ISCHECKBOX=null,detail.VAL1_CHECKBOX=null,detail.VAL1_ISCOMMENT_WHEN_YES=null,detail.VAL1_ISCOMMENT_WHEN_NO=null,detail.VAL1_VALUE_IS_NUMBER=null):7===val1_type?(detail.VAL1_ISVALUE=val1_type,detail.VAL1_ISCHECKBOX=null,detail.VAL1_CHECKBOX=null,detail.VAL1_NAME="Weight",detail.VAL1_VALUE_IS_NUMBER=1):8===val1_type?(detail.VAL1_ISVALUE=val1_type,detail.VAL1_ISCHECKBOX=null,detail.VAL1_CHECKBOX=null,detail.VAL1_NAME="Distance",detail.VAL1_VALUE_IS_NUMBER=1):9===val1_type?(detail.VAL1_ISVALUE=val1_type,detail.VAL1_ISCHECKBOX=null,detail.VAL1_CHECKBOX=null,detail.VAL1_NAME="Height",detail.VAL1_VALUE_IS_NUMBER=1):10===val1_type?(detail.VAL1_ISVALUE=val1_type,detail.VAL1_ISCHECKBOX=null,detail.VAL1_CHECKBOX=null,detail.VAL1_NAME="Weight",detail.VAL1_VALUE_IS_NUMBER=1):(detail.VAL1_ISVALUE=null,detail.VAL1_VALUE_IS_NUMBER=null,detail.VAL1_ISCHECKBOX=val1_type),1!==val1_type&&(detail.VAL1_ISCOMMENT_WHEN_YES=null,detail.VAL1_ISCOMMENT_WHEN_NO=null),console.log($scope.header)},$scope.value2TypeWatch=function(detail,val2_type){0===val2_type?(detail.VAL2_ISVALUE=1,detail.VAL2_ISCHECKBOX=null,detail.VAL2_CHECKBOX=null):-1===val2_type?(detail.VAL2_NAME=null,detail.VAL2_ISVALUE=null,detail.VAL2_VALUE=null,detail.VAL2_ISCHECKBOX=null,detail.VAL2_CHECKBOX=null,detail.VAL2_ISCOMMENT_WHEN_YES=null,detail.VAL2_ISCOMMENT_WHEN_NO=null,detail.VAL2_VALUE_IS_NUMBER=null):7===val2_type?(detail.VAL2_ISVALUE=val2_type,detail.VAL2_ISCHECKBOX=null,detail.VAL2_CHECKBOX=null,detail.VAL2_NAME="Weight",detail.VAL2_VALUE_IS_NUMBER=1):8===val2_type?(detail.VAL2_ISVALUE=val2_type,detail.VAL2_ISCHECKBOX=null,detail.VAL2_CHECKBOX=null,detail.VAL2_NAME="Distance",detail.VAL2_VALUE_IS_NUMBER=1):9===val2_type?(detail.VAL2_ISVALUE=val2_type,detail.VAL2_ISCHECKBOX=null,detail.VAL2_CHECKBOX=null,detail.VAL2_NAME="Height",detail.VAL2_VALUE_IS_NUMBER=1):10===val2_type?(detail.VAL2_ISVALUE=val2_type,detail.VAL2_ISCHECKBOX=null,detail.VAL2_CHECKBOX=null,detail.VAL2_NAME="Weight",detail.VAL2_VALUE_IS_NUMBER=1):(detail.VAL2_ISVALUE=null,detail.VAL2_VALUE_IS_NUMBER=null,detail.VAL2_ISCHECKBOX=val2_type),1!==val2_type&&(detail.VAL2_ISCOMMENT_WHEN_YES=null,detail.VAL2_ISCOMMENT_WHEN_NO=null)},$scope.value1TypeInit=function(detail){return("add"!==$stateParams.action||"add"===$stateParams.action&&0!==$stateParams.headerId)&&(0!==detail.VAL1_ISVALUE&&null!==detail.VAL1_ISVALUE||0!==detail.VAL1_ISCHECKBOX&&null!==detail.VAL1_ISCHECKBOX)?7===detail.VAL1_ISVALUE?7:8===detail.VAL1_ISVALUE?8:9===detail.VAL1_ISVALUE?9:10===detail.VAL1_ISVALUE?10:1===detail.VAL1_ISVALUE?0:detail.VAL1_ISCHECKBOX:-1},$scope.value2TypeInit=function(detail){return("add"!==$stateParams.action||"add"===$stateParams.action&&0!==$stateParams.headerId)&&(0!==detail.VAL2_ISVALUE&&null!==detail.VAL2_ISVALUE||0!==detail.VAL2_ISCHECKBOX&&null!==detail.VAL2_ISCHECKBOX)?7===detail.VAL2_ISVALUE?7:8===detail.VAL2_ISVALUE?8:9===detail.VAL2_ISVALUE?9:10===detail.VAL2_ISVALUE?10:1===detail.VAL2_ISVALUE?0:detail.VAL2_ISCHECKBOX:-1},$scope.IsCommentTextWatch=function(detail,IsCommentTextValue){"0"===IsCommentTextValue&&(detail.VAL1_ISCOMMENT_WHEN_YES=null,detail.VAL1_ISCOMMENT_WHEN_NO=null,detail.VAL2_ISCOMMENT_WHEN_YES=null,detail.VAL2_ISCOMMENT_WHEN_NO=null)},$scope.moveDetailUp=function(detail,line){var index=line.details.indexOf(detail);line.details.splice(index,1),line.details.splice(index-1,0,detail)},$scope.moveDetailDown=function(detail,line){var index=line.details.indexOf(detail);line.details.splice(index,1),line.details.splice(index+1,0,detail)},$scope.moveCommentUp=function(comment,line){var index=line.comments.indexOf(comment);line.comments.splice(index,1),line.comments.splice(index-1,0,comment)},$scope.moveCommentDown=function(comment,line){var index=line.comments.indexOf(comment);line.comments.splice(index,1),line.comments.splice(index+1,0,comment)},$scope.moveLineUp=function(line,section){var index=section.lines.indexOf(line);section.lines.splice(index,1),section.lines.splice(index-1,0,line)},$scope.moveLineDown=function(line,section){var index=section.lines.indexOf(line);section.lines.splice(index,1),section.lines.splice(index+1,0,line)},$scope.onSectionDropComplete=function(index,movedSection,event,replacedSection,header){var movedSection=movedSection,replacedSection=replacedSection,oldIndex=header.sections.indexOf(movedSection),newIndex=index;header.sections[oldIndex]=replacedSection,header.sections[newIndex]=movedSection},$scope.addFaDefinition=function(){0===$scope.header.sections.length?toastr.error("Functional Assessment must have at least one section","Error!"):addOrder($scope.header).then(function(result){FaDefineService.insertFa($scope.header).then(function(res){"success"===res.status?(toastr.success("New functional assessment definition added","Success!"),$state.go("loggedIn.fadefine.list")):toastr.error("Failed to add new functional assessment definition","Error!")})},function(error){console.log(error)})},$scope.editDefinition=function(){0===$scope.header.sections.length?toastr.error("Functional Assessment must have at least one section","Error!"):addOrder($scope.header).then(function(result){console.log(result),FaDefineService.editFa(result).then(function(res){"success"===res.status?(toastr.success("Edit successfully!","Success!"),$state.go("loggedIn.fadefine.list")):toastr.error("Edit failed!","Error!")})})};var addOrder=function(header){return new Promise(function(resolve,reject){$scope.isEdit===!1?header.Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"):(header.Creation_date=""===header.Creation_date?moment().format("YYYY-MM-DD hh:mm:ss"):moment(header.Creation_date).format("YYYY-MM-DD hh:mm:ss"),header.Last_update_date=moment().format("YYYY-MM-DD hh:mm:ss"));for(var i=0;i<header.sections.length;i++)if(header.sections[i].ORD=i+1,$scope.isEdit===!1?header.sections[i].Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"):(header.sections[i].Creation_date=""===header.sections[i].Creation_date?moment().format("YYYY-MM-DD hh:mm:ss"):moment(header.sections[i].Creation_date).format("YYYY-MM-DD hh:mm:ss"),header.sections[i].Last_update_date=moment().format("YYYY-MM-DD hh:mm:ss")),0===header.sections[i].lines.length){if(i!==header.sections.length-1)continue;resolve(header)}else for(var j=0;j<header.sections[i].lines.length;j++)if(header.sections[i].lines[j].ORD=j+1,header.sections[i].lines[j].previewPath&&delete header.sections[i].lines[j].previewPath,$scope.isEdit===!1?header.sections[i].lines[j].Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"):(header.sections[i].lines[j].Creation_date=""===header.sections[i].lines[j].Creation_date?moment().format("YYYY-MM-DD hh:mm:ss"):moment(header.sections[i].lines[j].Creation_date).format("YYYY-MM-DD hh:mm:ss"),header.sections[i].lines[j].Last_update_date=moment().format("YYYY-MM-DD hh:mm:ss")),0===header.sections[i].lines[j].details.length){if(j!==header.sections[i].lines.length-1||i!==header.sections.length-1)continue;resolve(header)}else for(var k=0;k<header.sections[i].lines[j].details.length;k++)header.sections[i].lines[j].details[k].ORD=k+1,header.sections[i].lines[j].details[k].previewPath&&delete header.sections[i].lines[j].details[k].previewPath,$scope.isEdit===!1?header.sections[i].lines[j].details[k].Creation_date=moment().format("YYYY-MM-DD hh:mm:ss"):(header.sections[i].lines[j].details[k].Creation_date=""===header.sections[i].lines[j].details[k].Creation_date?moment().format("YYYY-MM-DD hh:mm:ss"):moment(header.sections[i].lines[j].details[k].Creation_date).format("YYYY-MM-DD hh:mm:ss"),header.sections[i].lines[j].details[k].Last_update_date=moment().format("YYYY-MM-DD hh:mm:ss")),k===header.sections[i].lines[j].details.length-1&&j===header.sections[i].lines.length-1&&i===header.sections.length-1&&resolve(header)})};$scope.openModal=function(data){var modalInstance=$modal.open({animation:!0,templateUrl:"modules/fadefine/views/imageModal.html",controller:"ImageDialogController",size:"lg"});modalInstance.result.then(function(selectedImg){data.PICTURE=selectedImg.realPath,selectedImg.previewPath&&null!==selectedImg.previewPath&&""!==selectedImg.previewPath?data.previewPath=selectedImg.previewPath:delete data.previewPath})}}),angular.module("app.loggedIn.fadefine.imageDialog.controller",[]).controller("ImageDialogController",function($scope,$timeout,$modalInstance,FileUploader,FaDefineService,toastr){var getImages=function(){FaDefineService.getImageFiles().then(function(result){(result.status="success")?($scope.images=[],result.files.forEach(function(file){var image={realPath:".\\download\\documentImage\\"+file,previewPath:"https://"+location.host+"/document/fa/images/"+file};$scope.images.push(image),console.log($scope.images)})):toastr.error("Unexpected error when getting images.","Error")})};getImages(),$scope.info_upload={total_size:0,progress_percent:0,pre_progress_percent:0};$scope.uploader=new FileUploader({url:"/api/erm/v2/fa/upload_image",autoUpload:!0,removeAfterUpload:!0,filters:[{name:"img_filter",fn:function(item){return"image/jpeg"===item.type||"image/png"===item.type?!0:(toastr.error("Only jpg, jpeg and png allowed!","Error!"),!1)}}],onSuccessItem:function(item,response,status,headers){var uploaded_percent=100*item.file.size/$scope.info_upload.total_size;$scope.info_upload.pre_progress_percent+=uploaded_percent,console.log($scope.info_upload.pre_progress_percent)},onProgressItem:function(item,progress){var uploaded_size=progress*item.file.size/100,uploaded_percent=100*uploaded_size/$scope.info_upload.total_size;$scope.info_upload.progress_percent=$scope.info_upload.pre_progress_percent+uploaded_percent},onCompleteAll:function(res){$scope.info_upload={total_size:0,progress_percent:0,pre_progress_percent:0},getImages()},onAfterAddingAll:function(items){angular.forEach(items,function(f){$scope.info_upload.total_size+=f.file.size}),$scope.info_upload.step_size=$scope.info_upload.total_size/100}});$scope.openUploader=function(){$timeout(function(){$("#image_upload").click()},100)},$scope.chooseImage=function(image){$modalInstance.close(image)},$scope.chooseNoImg=function(){var noImg={realPath:null,previewPath:null};$modalInstance.close(noImg)}}),angular.module("app.loggedIn.fadefine.service",[]).factory("FaDefineService",function(Restangular){var instanceService={},v2_api=Restangular.all("api/erm/v2");return instanceService.insertFa=function(postData){var faApi=v2_api.all("fa/insert");return faApi.post(postData)},instanceService.deleteFa=function(headerId){var deleteFaApi=v2_api.all("fa/delete");return deleteFaApi.post({id:headerId})},instanceService.getHeaderAndSection=function(headerId){var getHeaderAndSectionApi=v2_api.all("fa/get_header_and_sections");return getHeaderAndSectionApi.post({id:headerId})},instanceService.getLines=function(sectionId,headerId){var getLinesApi=v2_api.all("fa/get_lines");return getLinesApi.post({sectionId:sectionId,headerId:headerId})},instanceService.getDetailsAndComments=function(lineId){var getDetailsAndCommentsApi=v2_api.all("fa/get_details_and_comments");return getDetailsAndCommentsApi.post({lineId:lineId})},instanceService.editFa=function(postData){var editFaApi=v2_api.all("fa/edit");return editFaApi.post(postData)},instanceService.changeFaStt=function(status,headerId){var changeFaSttApi=v2_api.all("fa/change_header_stt");return changeFaSttApi.post({headerId:headerId,status:status})},instanceService.getImageFiles=function(){var getImagesApi=v2_api.all("fa/get_images");return getImagesApi.post()},instanceService});