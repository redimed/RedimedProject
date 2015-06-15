angular.module('starter.main.usercontroller',[])

    .controller('userController', function ($scope, $state, $q, localStorageService, SecurityService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $cordovaCamera, $cordovaFileTransfer, HOST_CONFIG) {
    	 
      $scope.userInfo = localStorageService.get('userInfo');
      var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/phUser/uploadAvatar";
      $scope.flag = false;
     
      //function update user info 
      $scope.UpdateUserInfo = function(){
        $ionicLoading.show({
            template:'<i class="fa fa-refresh fa-spin"></i>'+
            "<br />"+
            "<span>Waiting...</span>",
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
         });

        console.log($scope.userInfo.user_img);
        console.log($scope.image);

        SecurityService.updateUser($scope.userInfo, $scope.flag).then(function(result){
          if(result.status == "success"){
            $scope.userInfo.user_img = result.data;
            if ($scope.flag) {
              var params = {user_id:$scope.userInfo.user_id};
              $scope.uploadFile(serverUpload, $scope.image, params, result.data);
            }
            $ionicLoading.hide();
            localStorageService.set('userInfo',$scope.userInfo);
            $scope.flag = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Update User Success'
            });
            alertPopup.then(function(res) { 
                                    
            });
         }else{
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Update User Fail'
            });
            alertPopup.then(function(res) {

            });
          }
        })
      }

        //change pass modal
      $ionicModal.fromTemplateUrl('modules/main/views/changePass.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

       $scope.infoPass = {};
      //change password 
      $scope.changepass = function(){
        SecurityService.changepass($scope.infoPass,$scope.userInfo.user_id).then(function(result){
          if(result.status=="success"){
             var alertPopup = $ionicPopup.alert({
             title: 'Alert',
              template: 'Change Password Success'
              });
              alertPopup.then(function(res) { 
                $scope.infoPass = {};
                $scope.closeModal();
              });
          }
        })
      }
    
    //upload picture
    $scope.updatePicture = function(){
      var options = {
        quality: 70,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 250,
        targetHeight: 100
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        $scope.image = imageURI;
        // var image = document.getElementById('avatar');
        // image.src = imageURI;
        $scope.flag = true;
      }, function(err) {
          console.log("Error Camera: ", err);
      });
    }

    $scope.uploadFile = function(server, img, params, nameImg) {
      var filePath = img.split(/[?]/)[0];
      console.log(filePath);
      var options =  new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = nameImg;
          options.mimeType = "image/jpeg";
          options.chunkedMode = false;
          options.params = params;

      $cordovaFileTransfer.upload(server, filePath, options, true).then(function(result) {
            if (typeof params !== 'undefined') {
              console.log("Upload success ", result);
            }
      },  function(err) {
            console.log("Upload Failed ", err);
      }, function (progress) {
      });
    }
})
    