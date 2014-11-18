angular.module('starter.injury.add.controller', ['ngCordova'])

    .controller('InjuryAddController', function($scope, $state, InjuryServices, $cordovaCamera, $ionicPopup, $ionicSideMenuDelegate, localStorageService, $cordovaFile){
        $scope.isSubmit = false;
        $scope.isShow = false;
        $scope.imgURI = [];
        var i = 0;
        $scope.list = [];
        $scope.isShowImg = true;
        $scope.isFailMobile = false;
        $scope.isFailEmail = false;
        var serverUpload = "http://192.168.133.190:3000/api/im/upload"
        var userInfoLS = localStorageService.get("userInfo");
        $ionicSideMenuDelegate.canDragContent(false)
        $scope.nextform = function(info) {
            $state.go('app.injury.desinjury');
            //$scope.isSubmit = true;
            //if(info.$invalid) {
            //    var alertValid = $ionicPopup.alert({
            //        title: "Can't next form",
            //        template: 'Please Check Your Information!'
            //    });
            //}
            //else {
            //
            //}
        }

        $scope.worker = {
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Address1: '',
            DOB: '',
            Sex: '',
            Home_phone: '',
            Work_phone: '',
            Mobile: ''
        }

        $scope.selectWorker = function (id) {
            $scope.isShow = !$scope.isShow;
            InjuryServices.getPatientID(id).then(function (data){
                $scope.worker = data;
            })
        }

        var initFormWorker = function() {
            InjuryServices.searchWorker(userInfoLS.company_id).then(function (data) {
                if (data.status != 'success') {
                    alert('error');
                    return;
                }
                else{
                    $scope.list = data.rs;
                }
            });
        }

        initFormWorker();

        $scope.selectImage = function (image) {
            $scope.imageDetail = image;
        }

        $scope.takePicture = function() {
            var options = {
                quality : 100,
                destinationType : Camera.DestinationType.FILE_URI,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imgURI.push({
                    id: i++,
                    image: imageData
                })
            }, function(err) {
                alert(err);
            });
        };

        $scope.changeisShowimg = function() {
            $scope.isShowImg = !$scope.isShowImg;
        }

        $scope.uploadimage = function() {
            var params = {
                a : "aasdfasdfasfasdf"
            };
            for(var i = 0 ; i <= $scope.imgURI.length; i++)
            {
             uploadFile($scope.imgURI[i].image,serverUpload,params);
            }
        }

        function uploadFile(img, server, params) {

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(img, server, function(r) {
                console.log(r);
            }, function(error) {
                console.log(error);
            }, options);
        }

        $scope.Checkfield = function (valueMobile, valueEmail) {
            if(valueMobile != '')
            {
                WorkerServices.checkMobile($scope.worker.Mobile).then(function(data){
                    if(data.status == 'success')
                    {
                        if(data.count == 0)
                        {
                            $scope.isFailMobile = false;
                        }
                        else
                        {
                            $scope.isFailMobile = true;
                        }
                    }

                })
            }
            if(valueEmail != '')
            {
                WorkerServices.checkEmail($scope.worker.Email).then(function (data) {
                    if (data.status == 'success') {
                        if (data.count == 0) {
                            console.log("pass")
                            $scope.isFailEmail = false;
                        }
                        else {
                            $scope.isFailEmail = true;
                        }
                    }

                })
            }
        }
    })
