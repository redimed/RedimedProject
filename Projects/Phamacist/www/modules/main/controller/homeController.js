angular.module('starter.main.homeController',[])
.controller('homeController', function ($scope, $state, $q, localStorageService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $stateParams) 
{
    $scope.resultSearch = [];
    $scope.flag = false;
    $scope.userInfo = localStorageService.get('userInfo');
    $scope.search = {};

    $scope.getAllShopPost = function(){
        if ($scope.userInfo.user_type == "Company") {
            MainService.getCompanyId($scope.userInfo.user_id).then(function(result){
                if (result.status == "success") {
                    console.log(result.data);
                    MainService.getPostCompany(result.data.company_id).then(function(result){
                        $scope.resultSearch = result.data;
                    })
                };
            })
        }else{
        	MainService.getAllShopPost().then(function(result){
        		if (result.status == "success") {
                    for ( var i = 0; i < result.data.length; i++) {
                        // console.log(i, result.data[i]);
                            if (typeof result.data[i] === 'undefined') {
                                $scope.flag = "Error";
                            }else{$scope.resultSearch.push(result.data[i])};
                        }
            		}else{
        			var alertPopup = $ionicPopup.alert({
        				title: 'Alert',
        				template: 'Error'
        			});
        		}
        	})
        }
    }
    $scope.getAllShopPost();

    $scope.getDetailPost = function(dataPosts){
    	MainService.detailPosts.postHome = dataPosts;
    	$state.go('app.main.postDetail');
    }

    $scope.searchPost = function(dataPost){
        $scope.resultSearch = [];
        if (typeof dataPost === 'undefined' || JSON.stringify(dataPost) == '{}') {
            $scope.getAllShopPost();
        }else{
            if (dataPost.kilometer !== '' && typeof dataPost.job_title === 'undefined' && typeof dataPost.description === 'undefined') {
                MainService.getAllShopPost().then(function(result){
                    if (result.status == "success") {
                        for ( var i = 0; i < result.data.length; i++) {
                            if (typeof result.data[i] === 'undefined') {
                                $scope.flag = "Error";
                            }else{$scope.resultSearch.push(result.data[i])};
                        }
                        $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                    }else{
                        console.log(result);
                    }
                })
            }
            if(dataPost.job_title !== '' && typeof dataPost.description === 'undefined'){
                MainService.getJobTitle(dataPost.job_title).then(function(result){
                    if (result.status == "success") {
                        if (result.title.length > 0) {
                            $scope.resultSearch = result.title;
                            if (dataPost.kilometer === null || typeof dataPost.kilometer === 'undefined') {
                                console.log(dataPost.kilometer);
                            }else{
                                 $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                            };
                        };
                    };
                })
            }
            if (dataPost.description !== '' && typeof dataPost.job_title === 'undefined') {
                MainService.getJobDescription(dataPost.description).then(function(result){
                    if (result.status == "success") {
                        if (result.description.length > 0) {
                            $scope.resultSearch = result.description;
                            if (dataPost.kilometer === null || typeof dataPost.kilometer === 'undefined') {
                                console.log(dataPost.kilometer);
                            }else{
                                 $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                            };
                        };
                    };
                })
            }
            if (dataPost.job_title !== '' && dataPost.description !== '') {
                MainService.getSearch(dataPost.job_title, dataPost.description).then(function(result){
                    if (result.status == "success") {
                        console.log("data", result.data.length)
                        if (result.data.length > 0) {
                            $scope.resultSearch = result.data;
                            if (dataPost.kilometer === null || typeof dataPost.kilometer === 'undefined') {
                                console.log(dataPost.kilometer);
                            }else{
                                 $scope.getDistance(parseInt(dataPost.kilometer), $scope.resultSearch);
                            };
                        };
                    };
                })
            };
        }
    }

    $scope.currentPage = 1;
    $scope.currentRecord = 0;

    // $scope.loadMore = function(){
    //     $scope.currentPage++;
    //     $scope.pageSize = $scope.currentPage * 5;
    //     $scope.noMoreItemsAvailable = false;
    //     if ($scope.flag === "Error") {
    //       $scope.noMoreItemsAvailable = true;
    //     }
    //     //$scope.getAllShopPost($scope.currentRecord);
    //     $scope.currentRecord = $scope.currentRecord + 5;
    //     $timeout(function() {
    //         $scope.$broadcast('scroll.infiniteScrollComplete');
    //     }, 1000);
    // }

    $scope.getDistance = function(dis, dataSearch){
        console.log(dataSearch);
        $scope.resultSearch = [];
        $scope.distance = 0;
        $scope.unit = 0;
        $scope.result = [];
        MainService.getDistance($scope.userInfo).then(function(result){
            if (result.status == "success") {
                var start = {
                    lat: result.address.lat,
                    lng: result.address.lng
                }
                // console.log(start);
                // MainService.getAllShopPost().then(function(result){
                //     // console.log(result);
                //     if ($scope.userInfo.user_type == "Company") {
                //         if (result.status == "success") {
                //             $scope.resultSearch = result.data;
                //         }
                //         else{
                //             console.log(result);
                //         }
                //     }else{
                //         if (result.status == "success") {
                            // console.log(result.data);
                            angular.forEach(dataSearch, function(value, key) {
                                if (value.lat == null) {
                                    console.log(value);
                                }else{
                                    var end = {
                                        lat: value.lat,
                                        lng: value.lng
                                    }
                                    if(geolib.validate(start) && geolib.validate(end)) {               
                                        $scope.distance = geolib.getDistance(start, end);
                                        $scope.unit = geolib.convertUnit("km", $scope.distance);
                                        // console.log($scope.unit, "", end, "", value.address)
                                        if ($scope.unit <= dis) {
                                            $scope.resultSearch.push(value);
                                        };
                                    }
                                }
                            });
                            console.log($scope.resultSearch);
                            // if ($scope.flag) {
                            //     for (var i = 0; i < $scope.resultSearch.length; i++) {
                            //         console.log($scope.resultSearch[i].job_title,"--", $scope.resultSearch[i].job_description);
                            //         console.log($scope.search.job_title, "--", $scope.search.description);

                            //         if($scope.resultSearch[i].job_title == $scope.search.job_title && $scope.search.description == null)
                            //         {
                            //             $scope.result.push($scope.resultSearch[i]);
                            //             console.log(i);
                            //         }
                            //         if($scope.resultSearch[i].job_description == $scope.search.description && $scope.search.job_title == null){
                            //             $scope.result.push($scope.resultSearch[i]);
                            //             console.log(i);
                            //         }
                            //         if($scope.resultSearch[i].job_description == $scope.search.description && $scope.resultSearch[i].job_title == $scope.search.job_title){
                            //             $scope.result.push($scope.resultSearch[i]);
                            //             console.log(i);
                            //         }

                            //     };
                            //     if($scope.result == ''){
                            //         alert("No result");
                            //     }else{
                            //         $scope.resultSearch = $scope.result;
                            //     }
                            //     console.log($scope.resultSearch);
                            // };
                        }else{
                            console.log(result);
                        }
                    });
            // }
            // else{
            //     console.log(result);
            // }
        }
    // }

    // $scope.result = function(result){
    //     for (var i = 0; i < result.length; i++) {
    //         console.log($scope.result[i].job_title);
    //         //console.log(_.result(_.find($scope.resultJSON[i], { job_title: "dsd"})));  
    //     };
    // }

    // $scope.i = 0;
    // $scope.distance = 0;
    // $scope.countDistance = function(latlngOrigin, addressDestination) {
    //     var geocoder = new google.maps.Geocoder();
    //     var start = {
    //         lat: latlngOrigin.A,
    //         lng: latlngOrigin.F
    //     }
    //     angular.forEach(addressDestination, function(value, key) {
    //         console.log(value);
    //         geocoder.geocode({ 'address': value.address }, function (results, status) {
    //             if (status == google.maps.GeocoderStatus.OK) {
    //                 // var latitude = results[0].geometry.location.lat();
    //                 // var longitude = results[0].geometry.location.lng();
    //                 var end = {
    //                     lat: results[0].geometry.location.lat(),
    //                     lng: results[0].geometry.location.lng()
    //                 }
    //                 // console.log("Latitude: " + latitude + "\nLongitude: " + longitude);
    //                 if(geolib.validate(start) && geolib.validate(end)) {               
    //                     $scope.distance = geolib.getDistance(start, end);
    //                     console.log($scope.i++, "", geolib.convertUnit("km", $scope.distance));
    //                 }
    //             } else {
    //                 //alert("Request failed.")
    //             }
    //         });
    //     });
    // }
})