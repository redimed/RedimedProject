angular.module("app.loggedIn.pr.prImportTaxList.directive", [])
	.directive('prImportTaxList', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
               
            },
            templateUrl: 'modules/hrPayroll/directives/prImportTaxList.html',
            controller: function ($scope,prService,FileUploader)
            {
                var uploader = $scope.uploader = new FileUploader({
                    url: '/api/pr/fornightly-tax/import-tax-list'
                });

                
                // FILTERS
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < 10;
                    }
                });

                // CALLBACKS

                uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                };
                uploader.onAfterAddingFile = function(fileItem) {
                    uploader.queue.splice(0,uploader.queue.length-1);
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
                    //xu ly data khi upload thanh cong
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };
                uploader.onCompleteAll = function() {
                    console.info('onCompleteAll');
                };

                console.info('uploader', uploader);


                $scope.importTaxList=function()
                {
                	uploader.uploadAll();
                }
            }
        };
    })