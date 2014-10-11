/**
 * Created by meditech on 9/15/2014.
 */
app.controller("lob_uploadController",function($scope,$http,FileUploader,bookingService,loginService) {
    //Get rl_booking_file id
    $scope.bookingInfo=bookingService.getBookingInfo();
    $scope.loginInfo=loginService.getUserInfo();

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/rlob/rl_booking_files/upload'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    uploader.formData.push({booking_id:$scope.bookingInfo.BOOKING_ID,company_id:$scope.loginInfo.company_id,worker_name:$scope.bookingInfo.WRK_SURNAME});
//    worker_name:$scope.bookingInfo.WRK_SURNAME,
//    $scope.file_id=-1;
//    $http({
//        method:"GET",
//        url:"/api/rlob/rl_booking_files/get-new-key"
//    })
//    .success(function(data) {
//        $scope.file_id=data.key;
//            alert($scope.bookingInfo.BOOKING_ID);
//
//    })
//    .error(function (data) {
//        alert("insert fail");
//    })
//    .finally(function() {
//    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
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
        console.info('onSuccessItem', fileItem, response, status, headers);
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
});