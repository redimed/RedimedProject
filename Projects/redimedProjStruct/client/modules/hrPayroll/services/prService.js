/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.pr.service',[])
    .factory('prService',function(Restangular,$http,$q,$window){
        var prService = {};
        var api = Restangular.all('api');
        prService.taxList={
        	getAllTaxListHeader:function()
        	{
        		var result=api.one('pr/fornightly-tax/get-all-taxlist-header');
                return result.get();
        	},

            getTaxListDetail:function(taxHeaderId,startIndex,numberOfItems)
            {
                var result = api.all('pr/fornightly-tax/get-taxlist-detail');
                return result.post({taxHeaderId:taxHeaderId,startIndex:startIndex,numberOfItems:numberOfItems});
            }
        }
        return prService;
    })
