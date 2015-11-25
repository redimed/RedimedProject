angular.module('starter.main.homeController',[])
.controller('homeController', function ($location, $scope, $state, $q, localStorageService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $stateParams) 
{
    $scope.flag = "";
    //$scope.userInfo = localStorageService.get('userInfo');
    $scope.search = {};
    $scope.currentPage = 1;
    $scope.currentRecord = 0;
    $scope.resultDataApply = [];
    $scope.resultSearch = [];

    $scope.getAllShopPost = function(currentRecord){
        if ($scope.userInfo.user_type == "Company") {
            MainService.getCompanyId($scope.userInfo.user_id).then(function(result){
                if (result.status == "success") {
                    MainService.getPostCompany(result.data.company_id, currentRecord).then(function(result){
                        if (result.data.length <= 0) {
                            $scope.flag = "Stop";
                        };
                        angular.forEach(result.data, function(value,key){
                            $scope.resultSearch.push(value);
                        });
                    })
                };
            })
        }else{
            //console.log($scope.userInfo);
        	MainService.getAllShopPost(currentRecord).then(function(result){
        		if (result.status == "success") {
                    MainService.postIsSelect($scope.userInfo.user_id).then(function(result){
                        if (result.status == "success") {
                            $scope.resultDataApply = result.dataApply;
                        };
                    });
                    if (result.data.length <= 0) {
                        $scope.flag = "Stop";
                    };
                    angular.forEach(result.data, function(value,key){
                        $scope.resultSearch.push(value);
                    });
        		}
        	})
        }
    }

    $scope.getDetailPost = function(dataPosts){
    	MainService.detailPosts.postHome = dataPosts;
    	$state.go('app.main.postDetail');
    }

    $scope.getPostForShopId = function(post){
        MainService.getPostForShopId(post.shop_id).then(function(result){
            if (result.status == "success") {
                MainService.detailPosts.postShop = result.data[0];
                $state.go('app.main.postDetailPost');
            };
        })
    }

    $scope.compareData = function(arr1, arr2){
        // console.log(arr1);
        // console.log(arr2);
        $scope.resultSearch = _.filter(arr1, function(obj){ return !_.findWhere(arr2, obj); });

        // angular.forEach(arr1,function(res,key){
        // for(var i=0 ; i < arr2.length ; i++ ){
        //    if(res.post_id == arr2[i].post_id &&  res.shop_id == arr2[i].shop_id)
        //     {
        //       // console.log(res);
        //       // console.log(key);
        //       arr1.splice(key,1);
        //       console.log("---result", arr1);
        //     }
        // }
        // });
    }

    $scope.searchPost = function(dataPost){
        $scope.flag = "Stop";
        $scope.resultSearch = [];
        // console.log(dataPost);
        // console.log(dataPost.kilometer, "---", dataPost.job_title, "---", dataPost.description);
        if (typeof dataPost.kilometer === 'undefined' && typeof dataPost.job_title === 'undefined' && typeof dataPost.description === 'undefined') {
            // $scope.getAllShopPost(0);
            // //console.log(dataPost);
            $state.go('app.main.home', {}, {reload: true});
        }else{
        //getdistance
            if (typeof dataPost.kilometer !== 'undefined' && typeof dataPost.job_title === 'undefined' && typeof dataPost.description === 'undefined') {
                console.log("1", dataPost);
                MainService.getAllShopPostDistance().then(function(result){
                    if (result.status == "success") {
                        // angular.forEach(result.data, function(value,key){
                        //     if (typeof value === 'undefined') {
                        //         $scope.flag = "Stop";
                        //     }else{
                        //         $scope.resultSearch.push(value);
                        //     };
                        // });
                        $scope.resultSearch = result.data;
                        $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                    }else{
                        console.log(result);
                    }
                })
            }
            //title
            if(typeof dataPost.job_title !== 'undefined' && typeof dataPost.description === 'undefined'){
                console.log("2", dataPost);
                MainService.getJobTitle(dataPost.job_title).then(function(result){
                    if (result.status == "success") {
                        if (result.title.length > 0) {
                            //$scope.resultSearch = result.title;
                            $scope.compareData(result.title, $scope.resultDataApply);
                            $scope.flag = "Stop";
                            if (dataPost.kilometer === null || typeof dataPost.kilometer === 'undefined') {
                                console.log("km", dataPost.kilometer);
                            }else{
                                 $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                            };
                        }
                    };
                })
            }
            //description
            if (typeof dataPost.description !== 'undefined' && typeof dataPost.job_title === 'undefined') {
                console.log("3", dataPost);
                MainService.getJobDescription(dataPost.description).then(function(result){
                    if (result.status == "success") {
                        if (result.description.length > 0) {
                            //$scope.resultSearch = result.description;
                            $scope.compareData(result.description, $scope.resultDataApply);
                            $scope.flag = "Stop";
                            console.log($scope.resultSearch);
                            if (dataPost.kilometer === null || typeof dataPost.kilometer === 'undefined') {
                                console.log("km", dataPost.kilometer);
                            }else{
                                 $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                            };
                        }
                    };
                })
            }
            //getSearch
            if (typeof dataPost.job_title !== 'undefined' && typeof dataPost.description !== 'undefined') {
                console.log("4", dataPost);
                MainService.getSearch(dataPost.job_title, dataPost.description).then(function(result){
                    if (result.status == "success") {
                        console.log("data", result.data.length)
                        if (result.data.length > 0) {
                            //$scope.resultSearch = result.data;
                            $scope.compareData(result.data, $scope.resultDataApply);
                            $scope.flag = "Stop";
                            if (dataPost.kilometer === null || typeof dataPost.kilometer === 'undefined') {
                                console.log("km", dataPost.kilometer);
                            }else{
                                 $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                            };
                        }
                    };
                })
            };
        }
    }

    $scope.loadMore = function(){
        if ($scope.flag !== "Stop") {
            $scope.currentPage++;
            $scope.pageSize = $scope.currentPage * 5;
            $scope.noMoreItemsAvailable = false;
            // if ($scope.flag === "Stop") {
            //     $scope.noMoreItemsAvailable = true;
            // }
            $scope.getAllShopPost($scope.currentRecord);
            $scope.currentRecord = $scope.currentRecord + 5;
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
        }else{
            $scope.noMoreItemsAvailable = true;
        }
    }

    $scope.getDistance = function(dis, dataSearch){
        //console.log(dataSearch);
        $scope.resultSearch = [];
        $scope.distance = 0;
        $scope.unit = 0;
        $scope.result = [];
        MainService.getDistanceData($scope.userInfo).then(function(result){
            if (result.status == "success") {
                var start = {
                    lat: result.address.lat,
                    lng: result.address.lng
                }
                angular.forEach(dataSearch, function(value, key) {
                    if (value.lat == null) {
                        // console.log(value);
                    }else{
                        var end = {
                            lat: value.lat,
                            lng: value.lng
                        }
                        if(geolib.validate(start) && geolib.validate(end)) {               
                            $scope.distance = geolib.getDistance(start, end);
                            $scope.unit = geolib.convertUnit("km", $scope.distance);
                            //console.log($scope.unit, "---", value.address)
                            if ($scope.unit <= dis) {
                                console.log("ok");
                                $scope.resultSearch.push(value);
                                };
                            }
                        }
                    });
                    $scope.flag = "Stop";
                    $scope.compareData($scope.resultSearch, $scope.resultDataApply);
            }else{
                console.log(result);
            }
        });
    }
})

    