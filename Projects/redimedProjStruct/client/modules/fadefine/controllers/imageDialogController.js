angular.module('app.loggedIn.fadefine.imageDialog.controller',[])
.controller('ImageDialogController', function($scope, $timeout, FileUploader, FaDefineService, toastr){
	

	var getImages = function(){
		FaDefineService.getImageFiles().then(function(result){
			if(result.status = 'success'){
				$scope.images = [];
				result.files.forEach(function(file){
					var image = {
						realPath : './document/fa/images/'+file,
						previewPath : 'https://'+location.host+'/document/fa/images/'+file
					}
					$scope.images.push(image);
					console.log($scope.images);
				})
			}
			else toastr.error('Unexpected error when getting images.','Error')
		});
	}

	getImages();

	$scope.info_upload = {
        total_size: 0,
        progress_percent: 0,
        pre_progress_percent: 0,
    }

	var uploader = $scope.uploader = new FileUploader({
		url: '/api/erm/v2/fa/upload_image',
        autoUpload: true,
        removeAfterUpload: true,
        filters:[{
        	name:'img_filter',
        	fn: function(item){
        		if(item.type === 'image/jpeg' || item.type === 'image/png') return true;
        		else {
        			toastr.error('Only jpg, jpeg and png allowed!','Error!');
        			return false;
        		}
        	}
        }],
        onSuccessItem: function(item, response, status, headers){
            var uploaded_percent =  item.file.size   * 100 / $scope.info_upload.total_size ;
            $scope.info_upload.pre_progress_percent += uploaded_percent;

            console.log($scope.info_upload.pre_progress_percent)
        },
        onProgressItem: function(item, progress) {
            var uploaded_size = progress * item.file.size / 100;
            var uploaded_percent =  uploaded_size  * 100 / $scope.info_upload.total_size ;
            $scope.info_upload.progress_percent =  $scope.info_upload.pre_progress_percent + uploaded_percent;
        },
        onCompleteAll: function(res){
            $scope.info_upload = {
                total_size: 0,
                progress_percent: 0,
                pre_progress_percent: 0,
            }
            getImages();

        },
        onAfterAddingAll :function(items){
            angular.forEach(items, function(f){
                 $scope.info_upload.total_size += f.file.size;
            });

            $scope.info_upload.step_size = $scope.info_upload.total_size / 100;
        }
	})

	$scope.openUploader = function(){
         $timeout(function () {
            $('#image_upload').click();
        }, 100);
    };
})