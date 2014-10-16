angular.module('app.loggedIn.PmProperties.NewEdit.controller',[])
.controller('NewEditPmPropertiesController',function($scope,$state,$stateParams,$filter,ngTableParams,PmPropertiesService,FileUploader){

    $scope.info = {
             Suburb : ''
             ,Zipcode : ''
             ,State : ''
             ,Country : ''
             ,Price : ''
             ,purchase_date : ''
             ,note : ''
             ,Cancellation_reason : ''
             ,isCancellation : ''
             ,isInsurance : ''
             ,Avatar_Pic_path : ''
             ,Created_by : ''
             ,Creation_date : ''
             ,Last_update_date : ''
             ,Last_updated_by : ''
             ,property_id : ''
             ,Address : ''
        
    };

    var id = $stateParams.id;

        var uploader = $scope.uploader = new FileUploader({
            url: '/api/PmProperties/uploadFile'
        });


    $scope.upLoadFile = function(){

        $("#lob-upload-file-dialog").modal({show:true,backdrop:'static'});
    }


        //HANDLE UPLOAD FILES
        //Upload File
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            fileItem.formData.push({property_id:$scope.info.property_id});
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            /*
            var fileInfo=response.fileInfo;
            var refId=angular.copy(fileInfo.property_id);

            fileInfo.DISPLAY=fileInfo.FILE_NAME;
            fileInfo.style_class='lob_admin_booking_file_node';
            fileInfo.PARENT_ID=angular.copy(fileInfo.BOOKING_ID)
            fileInfo.BOOKING_ID=null;
            fileInfo.ASS_ID=$scope.currentNode.ASS_ID;
            $scope.currentNode.nodes.push(fileInfo);
            console.info('onSuccessItem', fileItem, response, status, headers);
            //Put notification
            if(fileInfo.isClientDownLoad==1)
            {
                $scope.rlob_add_notification(fileInfo.ASS_ID,refId,$scope.sourceName,$scope.rlobNotificationType.result,$scope.notificationType.letter,'');
            }
            */


        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);
        //HANDLE UPLOAD FILES

    $scope.backToList = function(){
        $state.go('loggedIn.PmProperties');
    }

    if(typeof id != 'undefined') {
       PmPropertiesService.getDataById(id).then(function(data){
           $scope.info = data[0];
           $scope.info.isCancellation = data[0].isCancellation == 1 ? '1':'0';
           $scope.info.isInsurance = data[0].isInsurance == 1 ? '1':'0';
       })
    }

    $scope.save = function(){

        console.log($scope.info);

        if(typeof id === 'undefined'){
            PmPropertiesService.insertFunction($scope.info).then(function(data){
                console.log(data);
            });
        }else{
            PmPropertiesService.saveFunction($scope.info,id).then(function(data){
                console.log(data);
            });
        }

       
    }

})