angular.module('app.loggedIn.pr.prTaxList.controller',[])
    .controller("prTaxListController", function($scope,prService) {      
    	$scope.getAllTaxListHeader=function()
    	{
    		$scope.taxList=[];
    		prService.taxList.getAllTaxListHeader()
    		.then(function(data){
    			if(data.status=='success')
    			{
    				$scope.taxList=data.data;
    			}
    			else
    			{
    				$scope.taxList=[];
    			}
    		},function(err){
    			$scope.taxList=[];
    		});

    	}
    	$scope.getAllTaxListHeader();

        $scope.taxListDetail=[];
        $scope.getTaxListDetail=function(taxHeaderId)
        {
            prService.taxList.getTaxListDetail(taxHeaderId)
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.taxListDetail=data.data;
                }
                else
                {
                    $scope.taxListDetail=[];
                }
            },function(err){
                $scope.taxListDetail=[];
            })
        }

        $scope.selectedTaxList={};
        $scope.setSelectedTaxList=function(item)
        {
            $scope.selectedTaxList=item;
            //$scope.getTaxListDetail(item.id);
            $scope.taxListLoader=new TaxListDetailLoader(item.id,100);
            $scope.taxListLoader.loadMore();
        }

        var TaxListDetailLoader=function(taxHeaderId,numberOfItems)
        {
            this.taxListDetail=[];
            this.busy=false;
            this.after=-1;
            this.taxHeaderId=taxHeaderId;
            this.numberOfItems=numberOfItems;
        }

        TaxListDetailLoader.prototype.loadMore=function()
        {
            if(this.busy) 
            {
                return;
            }
                
            this.busy=true;
            prService.taxList.getTaxListDetail(this.taxHeaderId,this.after+1,this.numberOfItems)
            .then(function(data){
                if(data.status=='success')
                {
                    this.taxListDetail=this.taxListDetail.concat(data.data);
                    // exlog.alert(this.taxListDetail);
                    this.after=this.after+data.data.length;
                    this.busy=false;
                }
                else
                {

                }
            }.bind(this),function(err){

            })
        }

        
    })