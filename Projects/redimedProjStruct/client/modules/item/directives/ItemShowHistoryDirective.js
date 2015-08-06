angular.module("app.loggedIn.item.showhistory.detail.directive", [])
.directive("itemShowhistory", function (ConfigService, toastr,ItemService) {
    return {
        restrict: "EA",
        scope: {
            id:"="
        },
        templateUrl: "modules/item/directives/templates/showhistory.html",
        link: function (scope, element, attrs) {
             var loadData = function (id) {
                    var postData ={
                        id :id
                    }
                    ItemService.showHistory(postData).then(function (response) {
                       var now = moment();
                        if(data.status=='success'){
                            var obj={};
                            var arr=data.data;
                            for(var i=0;i<arr.length;i++){
                                var item=arr[i];
                                if(!obj[item.FEE_TYPE_ID]){
                                    obj[item.FEE_TYPE_ID]={
                                        listFee:[],
                                        FEE_TYPE_NAME:item.FEE_TYPE_NAME,
                                        historyFee:''
                                    };
                                    obj[item.FEE_TYPE_ID].listFee.push({
                                        ITEM_FEE_ID:item.ITEM_FEE_ID,
                                        FEE_START_DATE:moment(item.FEE_START_DATE).format("DD-MM-YYYY"),
                                        FEE_STARTDATE:item.FEE_START_DATE,
                                        FEE:item.FEE,
                                        ISENABLE:item.ISENABLE
                                    });
                                }
                                else{
                                    obj[item.FEE_TYPE_ID].listFee.push({
                                        ITEM_FEE_ID:item.ITEM_FEE_ID,
                                        FEE_START_DATE:moment(item.FEE_START_DATE).format("DD-MM-YYYY"),
                                        FEE:item.FEE,
                                        FEE_STARTDATE:item.FEE_START_DATE,
                                        ISENABLE:item.ISENABLE
                                    });
                                }

                            }  
                            for(var key in obj){
                                var count = 0;
                                var countsame =0;
                                for (var i = 0; i < obj[key].listFee.length; i++) {//Check
                                    if (moment(obj[key].listFee[i].FEE_STARTDATE).isBefore(now) && count === 0) {
                                        obj[key].historyFee =  obj[key].listFee[i].FEE;
                                        count = 1;
                                    };
                                    if (moment(obj[key].listFee[i].FEE_STARTDATE).isSame(now) && countsame === 0) {
                                        obj[key].historyFee =  obj[key].listFee[i].FEE;
                                        countsame = 1;
                                    };
                                };
                            }     
                            scope.obj=obj;
                        }
                    });
                };
            loadData(scope.id);
            scope.colors=[{name:'white'},{name:'black'}];
            scope.myColor = 'white';
        }
    } // END RETURN
}) // END DIRECTIVE