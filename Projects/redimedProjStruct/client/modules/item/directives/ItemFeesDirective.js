angular.module("app.loggedIn.item.item_fees.directive", [])
.directive("itemFees", function (ItemService, ConfigService, toastr) {
	return  {
        restrict: "EA",
        scope: {
            item_id: "=id"
        },
        templateUrl: "modules/item/directives/templates/item_fees.html",
        controller: function ($scope,$modal) { 
            
            /**
             * tannv.dts@gmail.com
             * 27-07-2015
             * ----------------------------------------------------------------------------------
             * ----------------------------------------------------------------------------------
             * ----------------------------------------------------------------------------------
             */
            
            var currentFeeGroupId=$scope.currentFeeGroupId=null;
            $scope.setCurrentFeeGroupId=function(feeGroup)
            {
                currentFeeGroupId=feeGroup.FEE_GROUP_ID;
            }
            $scope.loadFeeArr=function()
            {
                //feeStruct: cau truc dang cay dung de danh dau xem item nao da duoc push
                var feeStruct=$scope.feeStruct={};
                //feeArr:duoc chuyen tu feeStruct
                /**
                 * Cau truc feeArr gom
                 * Mang feeGroup:[]
                 *     Trong 1 feeGroup co cac thong tin: 
                 *     + FEE_GROUP_ID,FEE_GROUP_NAME,FEE_GROUP_TYPE, FEE_TYPES []
                 * FEE_TYPES la mang []
                 *     Trong 1 feeType co cac thong tin:
                 *     + FEE_TYPE_ID, FEE_TYPE_NAME, LIST_FEE [], currentFee
                 *     + currentFee la fee hien tai duoc chon trong feeType
                 * LIST_FEE la mang []
                 *     Trong moi fee se co cac thong tin:
                 *     + ITEM_FEE_ID, CLN_ITEM_ID, FEE_START_DATE, FEE_START_DATE_DISPLAY,
                 *         FEE, PERCENT
                 *
                 * description by: tannv.dts@gmail.com
                 */
                var feeArr=$scope.feeArr=[];
                ItemService.getItemFeeList({itemId:$scope.item_id})
                .then(function(data){
                    if(data.status=='success')
                    {
                        for(var i=0;i<data.data.length;i++)
                        {
                            var item= data.data[i];
                            if(!feeStruct[item.FEE_GROUP_ID])
                            {
                                feeStruct[item.FEE_GROUP_ID]={
                                    FEE_GROUP_ID:item.FEE_GROUP_ID,
                                    FEE_GROUP_NAME:item.FEE_GROUP_NAME,
                                    FEE_GROUP_TYPE:item.FEE_GROUP_TYPE,
                                    FEE_TYPES:{}
                                }
                            }
                            
                            if(item.FEE_TYPE_ID && !feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID])
                            {
                                feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID]={
                                    FEE_TYPE_ID:item.FEE_TYPE_ID,
                                    FEE_TYPE_NAME:item.FEE_TYPE_NAME,
                                    LIST_FEE:[]
                                }
                            }
                            
                            if(item.ITEM_FEE_ID)
                            {
                                var fee={
                                    ITEM_FEE_ID:item.ITEM_FEE_ID,
                                    CLN_ITEM_ID:item.CLN_ITEM_ID,
                                    FEE_START_DATE:item.FEE_START_DATE,
                                    FEE_START_DATE_DISPLAY:moment(new Date(item.FEE_START_DATE)).format("DD-MM-YYYY"),
                                    FEE:item.FEE,
                                    PERCENT:item.PERCENT
                                }

                                feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID].LIST_FEE.push(fee);

                                var currentDate=moment();
                                var startDate= moment(new Date(item.FEE_START_DATE));
                                if(!feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID].currentFee
                                    && startDate.isBefore(currentDate))
                                {
                                    feeStruct[item.FEE_GROUP_ID].FEE_TYPES[item.FEE_TYPE_ID].currentFee=fee;
                                }
                            }
                        }

                        //chuyen feeStruct thanh feeArr (chuyen obj thanh arr)
                        //tannv.dts@gmail.com
                        angular.forEach(feeStruct,function(feeGroupItem,key){
                            var feeGroup={
                                FEE_GROUP_ID:feeGroupItem.FEE_GROUP_ID,
                                FEE_GROUP_NAME:feeGroupItem.FEE_GROUP_NAME,
                                FEE_GROUP_TYPE:feeGroupItem.FEE_GROUP_TYPE,
                                FEE_TYPES:[]
                            }
                            if(feeGroup.FEE_GROUP_ID==currentFeeGroupId)
                            {
                                feeGroup.isCurrent=true;
                            }
                                
                            feeArr.push(feeGroup);

                            angular.forEach(feeGroupItem.FEE_TYPES,function(feeTypeItem,key){
                                var feeType={
                                    FEE_TYPE_ID:feeTypeItem.FEE_TYPE_ID,
                                    FEE_TYPE_NAME:feeTypeItem.FEE_TYPE_NAME,
                                    LIST_FEE:feeTypeItem.LIST_FEE,
                                    currentFee:feeTypeItem.currentFee
                                }
                                feeGroup.FEE_TYPES.push(feeType);
                            });
                        });
                        if(currentFeeGroupId==null)
                            feeArr[0].isCurrent=true;
                        
                        

                        /**
                         * Cac ham xu ly sap xep
                         * neu tra ve -1: sap xep tang dan
                         * neu tra ve 1: sap xep giam dan
                         * neu tra ve 0: khong doi
                         * tannv.dts@gmail.com
                         */
                        var feeGroupSort=function(a,b)
                        {
                            var A = a.FEE_GROUP_TYPE.toLowerCase();
                            var B = b.FEE_GROUP_TYPE.toLowerCase();
                            if (A < B){
                                return -1;
                            }else if (A > B){
                                return  1;
                            }else{
                                var C=a.FEE_GROUP_NAME.toLowerCase();
                                var D=b.FEE_GROUP_NAME.toLowerCase();
                                if(C<D){
                                    return -1;
                                }else if(C>D){
                                    return 1;
                                }else{
                                    return 0;
                                }
                            }
                        }
                        var feeTypeSort=function(a,b)
                        {
                            var A=a.FEE_TYPE_NAME.toLowerCase();
                            var B=b.FEE_TYPE_NAME.toLowerCase();
                            if(A<B){
                                return -1;
                            }else if(A>B){
                                return 1;
                            }else{
                                return 0;
                            }
                        }
                        var feeListSort=function(a,b)
                        {
                            var A=moment(new Date(a.FEE_START_DATE));
                            var B=moment(new Date(b.FEE_START_DATE));
                            if(A.isBefore(B)){
                                return 1;
                            }else if(A.isAfter(B)){
                                return -1;
                            }else{
                                return 0;
                            }
                        }

                        feeArr.sort(feeGroupSort);

                        for(var i=0;i<feeArr.length;i++)
                        {
                            var feeTypes=feeArr[i].FEE_TYPES;
                            feeTypes.sort(feeTypeSort);
                            for(var j=0;j<feeTypes.length;j++)
                            {
                                feeTypes[j].LIST_FEE.sort(feeListSort);
                            }
                        }

                        /**
                         * Cau truc feeArr gom
                         * Mang feeGroup:[]
                         *     Trong 1 feeGroup co cac thong tin: 
                         *     + FEE_GROUP_ID,FEE_GROUP_NAME,FEE_GROUP_TYPE, FEE_TYPES []
                         * FEE_TYPES la mang []
                         *     Trong 1 feeType co cac thong tin:
                         *     + FEE_TYPE_ID, FEE_TYPE_NAME, LIST_FEE [], currentFee
                         *     + currentFee la fee hien tai duoc chon trong feeType
                         * LIST_FEE la mang []
                         *     Trong moi fee se co cac thong tin:
                         *     + ITEM_FEE_ID, CLN_ITEM_ID, FEE_START_DATE, FEE_START_DATE_DISPLAY,
                         *         FEE, PERCENT
                         *
                         * description by: tannv.dts@gmail.com
                         */
                    }
                    else
                    {
                        exlog.logErr('item->itemFeesDirective',data);
                    }
                },function(err){
                    exlog.logErr('item->itemFeesDirective',err);
                });
            }

            $scope.$watch('item_id',function(newValue,oldValue){
                if($scope.item_id)
                {
                    $scope.loadFeeArr();
                }
            });

            /**
             * them new feeItem vao feeType
             * tannv.dts@gmail.com
             * 29-07-2015
             */
            $scope.addNewFeeItem=function(feeType)
            {
                var modalInstance=$modal.open({
                    templateUrl:'addNewFeeItemTemplate',
                    controller:function($scope,$modalInstance,feeType,itemId){

                        var newFeeItem=$scope.newFeeItem={
                            CLN_ITEM_ID:itemId
                        };
                        $scope.add=function()
                        {
                            newFeeItem.FEE_START_DATE=moment(newFeeItem.FEE_START_DATE_DISPLAY,'DD/MM/YYYY').toDate();
                            newFeeItem.FEE_START_DATE_DISPLAY=moment(newFeeItem.FEE_START_DATE).format("DD-MM-YYYY");
                            for(var i=0;i<feeType.LIST_FEE.length;i++)
                            {
                                if(feeType.LIST_FEE[i].FEE_START_DATE_DISPLAY==newFeeItem.FEE_START_DATE_DISPLAY)
                                {
                                    toastr.warning("Duplicate Start Date.",'Warning');
                                    return;
                                }
                            }
                            feeType.LIST_FEE.push($scope.newFeeItem);
                            feeType.currentFee=newFeeItem;
                            $modalInstance.close('success');
                        }
                        $scope.cancel=function()
                        {
                            $modalInstance.dismiss('cancel');
                        }
                    },

                    resolve:{
                        feeType:function(){return feeType},
                        itemId:function(){return $scope.item_id}
                    }
                });
            }

            /**
             * Save all item fee in group fee
             * tannv.dts@gmail.com
             * 29-07-2015
             */
            $scope.saveAllItemFeeInGroupFee=function(groupFee)
            {
                ItemService.saveAllItemFeeInGroupFee(groupFee)
                .then(function(data){
                    if(data.status=='success')
                    {
                        toastr.success("Save success.", "Success");
                        $scope.loadFeeArr();
                    }
                    else if(data.status=='empty')
                    {
                        toastr.warning("Data empty.",'Warning');
                        exlog.logErr(data);
                    }
                    else
                    {
                        toastr.error("Save error.","Error");
                        exlog.logErr(data);
                    }
                },function(err){
                    toastr.error("Save error.","Error");
                    exlog.logErr(err);
                });
            }

            /**
             * remove item fee
             * tannv.dts@gmail.com
             * 30-07-2015
             */
            $scope.removeItemFee=function(itemFee)
            {
                if(itemFee)
                {
                    var modalInstance=$modal.open({
                        templateUrl:'notifyRemoveItemFeeTemplate',
                        controller:function($scope,$modalInstance){
                            $scope.ok=function(){
                                $modalInstance.close('ok');
                            };

                            $scope.cancel=function()
                            {
                                $modalInstance.dismiss('cancel');
                            }
                        },
                        size:'sm'
                    });
                    modalInstance.result.then(function(result){
                        if(result=='ok')
                        {
                            ItemService.removeItemFee(itemFee.ITEM_FEE_ID)
                            .then(function(data){
                                if(data.status=='success')
                                {
                                    toastr.success("Remove item fee success.", "Success");
                                    $scope.loadFeeArr();
                                }
                                else
                                {
                                    toastr.error('Remove item fee error.','Error');
                                    exlog.logErr(data);
                                }
                            },function(err){
                                toastr.error('Remove item fee error.','Error');
                                exlog.logErr(err);
                            });
                        }
                        else
                        {
                            //
                        }
                    },function(reason){
                        //
                    });
                }
                else
                {
                    toastr.warning("No Fee Exist.","Warning");
                }
                

            }
        }
    };
});
